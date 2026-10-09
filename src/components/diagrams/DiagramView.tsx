import { lazy, memo, Suspense, useEffect, useRef, useState } from 'react';
import type { MermaidBlockProps } from './MermaidBlock';
function SourceFallback({ source }: MermaidBlockProps) { return <div className="mermaid-block"><p>No se pudo cargar la vista. El Código sigue disponible.</p><pre className="mermaid-source"><code>{source}</code></pre></div>; }
const Block = lazy(() => import('./MermaidBlock').then(m => ({ default: memo(m.MermaidBlock) })).catch(() => ({ default: memo(SourceFallback) })));
export function DiagramView({ active = true, ...props }: MermaidBlockProps & { active?: boolean }) {
    const retained = useRef(props);
    const ref = useRef<HTMLDivElement>(null), [visible, setVisible] = useState(false);
    if (active) retained.current = props;
    useEffect(() => {
        const observer = new IntersectionObserver(entries => { if (active && entries.some(e => e.isIntersecting)) { setVisible(true); observer.disconnect(); } }, { rootMargin: '80px' });
        if (ref.current) observer.observe(ref.current); return () => observer.disconnect();
    }, [active]);
    return <div ref={ref} className="diagram-lazy" data-diagram-title={props.title}>{visible ? <Suspense fallback={<p role="status">Preparando visor del diagrama…</p>}><Block {...retained.current}/></Suspense> : <p>{props.title} — diagrama disponible al desplazar.</p>}</div>;
}
