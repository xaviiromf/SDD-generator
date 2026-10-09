import { memo, useEffect, useId, useRef, useState } from 'react';
import { Copy, Download, Maximize2, Minus, Plus, RefreshCw } from 'lucide-react';
import { cancelDiagram, renderDiagram, type RenderedDiagram } from '../../services/diagramRenderer';
import { downloadDiagram } from '../../services/diagramExport';
export interface MermaidBlockProps { source: string; revision: number; title: string; description: string }
const SvgStage = memo(function SvgStage({ svg, width, height, transform }: { svg: string; width: number; height: number; transform: string }) {
    const host = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!host.current) return;
        const root = host.current.shadowRoot ?? host.current.attachShadow({ mode: 'open' });
        root.innerHTML = `<style>svg{display:block;max-width:none}</style>${svg}`;
        host.current.setAttribute('data-svg-ready', root.querySelector('svg')?.id ?? 'listo');
    }, [svg]);
    return <div ref={host} className="diagram-stage" style={{ width, height, transform }}/>;
});
export function MermaidBlock({ source, revision, title, description }: MermaidBlockProps) {
    const id = `diagrama-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`;
    const token = useRef(0), viewport = useRef<HTMLDivElement>(null);
    const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
    const [mode, setMode] = useState<'diagrama' | 'codigo'>('diagrama');
    const [result, setResult] = useState<RenderedDiagram | null>(null), [error, setError] = useState('');
    const [retry, setRetry] = useState(0), [busy, setBusy] = useState(false), [notice, setNotice] = useState('');
    const rendered = useRef<{ source: string; title: string; description: string; retry: number } | null>(null);
    const [zoom, setZoom] = useState(1), [fit, setFit] = useState(1), [pan, setPan] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (mode === 'codigo') { setBusy(false); return; }
        const previous = rendered.current;
        if (previous && previous.source === source && previous.title === title && previous.description === description && previous.retry === retry) { setBusy(false); setError(''); return; }
        let alive = true; const next = ++token.current;
        setBusy(true); setError('');
        const timer = setTimeout(() => {
            Promise.resolve().then(() => renderDiagram({ instanceId: id, source, revision, token: next, theme: 'claro', title, description })).then(value => { if (alive) { rendered.current = { source, title, description, retry }; setResult(value); setBusy(false); setZoom(1); setPan({ x: 0, y: 0 }); } }).catch(() => { if (alive) { rendered.current = null; setResult(null); setError('No se pudo mostrar este diagrama. Revisa Código o reintenta; tu documento se conserva.'); setBusy(false); } });
        }, 0);
        return () => { alive = false; clearTimeout(timer); cancelDiagram(id); };
    }, [id, source, revision, mode, retry, title, description]);
    useEffect(() => {
        if (!result || !viewport.current) return;
        const observer = new ResizeObserver(entries => { const width = entries[0]?.contentRect.width ?? 0; if (width > 0) setFit(Math.min(1, Math.max(1, width - 16) / result.width, 280 / result.height)); });
        observer.observe(viewport.current); return () => observer.disconnect();
    }, [result]);
    const changeZoom = (value: number) => setZoom(z => Math.max(0.25, Math.min(4, z + value)));
    const download = async (format: 'svg' | 'png') => {
        if (!result) return; setNotice('Preparando descarga…');
        try { const reduced = await downloadDiagram({ sanitizedSvg: result.sanitizedSvg, format, basename: title, revision }); setNotice(reduced ? 'Descarga preparada con escala reducida para respetar el límite de imagen.' : 'Descarga preparada.'); }
        catch { setNotice('No se pudo descargar el diagrama. Puedes copiar su Código.'); }
    };
    return <article className="mermaid-block" aria-busy={busy} data-view-state={busy ? 'anterior' : 'vigente'} aria-label={title} data-revision={revision}>
        <div className="diagram-heading"><strong>{title}</strong><div className="diagram-modes" role="group" aria-label="Vista del bloque Mermaid"><button aria-pressed={mode === 'diagrama'} onClick={() => setMode('diagrama')}>Diagrama</button><button aria-pressed={mode === 'codigo'} onClick={() => setMode('codigo')}>Código</button></div></div>
        {mode === 'codigo' && <><pre className="mermaid-source"><code>{source}</code></pre><button onClick={() => { navigator.clipboard.writeText(source).then(() => setNotice('Código copiado.')).catch(() => setNotice('Selecciona el código para copiarlo.')); }}><Copy size={16} aria-hidden="true"/>Copiar código</button></>}<div className="diagram-rendered" hidden={mode === 'codigo'}>
            <p className="diagram-loading" role="status">{busy ? result ? 'Actualizando diagrama; se muestra la vista anterior.' : 'Cargando diagrama local…' : ''}</p>
            {error && <div className="diagram-error"><p role="status">{error}</p><button onClick={() => setRetry(r => r + 1)}><RefreshCw size={16} aria-hidden="true"/>Reintentar diagrama</button><pre className="mermaid-source"><code>{source}</code></pre></div>}
            {result && <><div className="diagram-tools" role="group" aria-label="Controles del diagrama"><button aria-label="Acercar diagrama" onClick={() => changeZoom(0.25)}><Plus size={16} aria-hidden="true"/></button><button aria-label="Alejar diagrama" onClick={() => changeZoom(-0.25)}><Minus size={16} aria-hidden="true"/></button><button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}><Maximize2 size={16} aria-hidden="true"/>Ajustar a vista</button><span>{Math.round(zoom * 100)} %</span><button disabled={busy} onClick={() => void download('svg')}><Download size={16} aria-hidden="true"/>Descargar SVG</button><button disabled={busy} onClick={() => void download('png')}><Download size={16} aria-hidden="true"/>Descargar PNG</button></div>
                <p className="diagram-help">Enfoca el diagrama: flechas para mover, + y - para zoom, Inicio para ajustar.</p>
                <div ref={viewport} className="diagram-viewport" role="region" aria-label={`Vista interactiva: ${title}`} tabIndex={0} onKeyDown={event => {
                    if (event.target !== event.currentTarget) return;
                    const deltas: Record<string, [number, number]> = { ArrowLeft: [-24, 0], ArrowRight: [24, 0], ArrowUp: [0, -24], ArrowDown: [0, 24] };
                    if (deltas[event.key]) { event.preventDefault(); const [x, y] = deltas[event.key]; setPan(p => ({ x: p.x + x, y: p.y + y })); }
                    else if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(0.25); }
                    else if (event.key === '-') { event.preventDefault(); changeZoom(-0.25); }
                    else if (event.key === 'Home') { event.preventDefault(); setZoom(1); setPan({ x: 0, y: 0 }); }
                }} onPointerDown={event => { if (event.button !== 0) return; drag.current = { x: event.clientX, y: event.clientY, ox: pan.x, oy: pan.y }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={event => { if (drag.current) setPan({ x: drag.current.ox + event.clientX - drag.current.x, y: drag.current.oy + event.clientY - drag.current.y }); }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
                    <SvgStage svg={result.sanitizedSvg} width={result.width} height={result.height} transform={`translate(${pan.x}px, ${pan.y}px) scale(${fit * zoom})`}/>
                </div><details className="diagram-summary"><summary>Resumen textual del diagrama</summary><p>{result.description}</p></details></>}
        </div>{notice && <p className="diagram-notice" role="status">{notice}</p>}
    </article>;
}
