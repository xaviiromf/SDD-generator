import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { MermaidBlockProps } from './MermaidBlock';
function SourceFallback({ source }: MermaidBlockProps) { return <div className="mermaid-block"><p>No se pudo cargar la vista. El Código sigue disponible.</p><pre className="mermaid-source"><code>{source}</code></pre></div>; }
const Block = lazy(() => import('./MermaidBlock').then(m => ({ default: m.MermaidBlock })).catch(() => ({ default: SourceFallback })));
export function DiagramView(props: MermaidBlockProps) {
    const ref = useRef<HTMLDivElement>(null), [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) { setVisible(true); observer.disconnect(); } }, { rootMargin: '80px' });
        if (ref.current) observer.observe(ref.current); return () => observer.disconnect();
    }, []);
    return <div ref={ref} className="diagram-lazy" data-diagram-title={props.title}>{visible ? <Suspense fallback={<p role="status">Preparando visor del diagrama…</p>}><Block {...props}/></Suspense> : <p>{props.title} — diagrama disponible al desplazar.</p>}</div>;
}
