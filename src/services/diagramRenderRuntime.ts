import { diagramLimits } from '../domain/diagrams';
import { DiagramError, sanitizeDiagramSvg, validateDiagramSource } from './diagramSvgPolicy';
export interface RenderRequest { instanceId: string; source: string; revision: number; token: number; theme: 'claro' | 'oscuro'; title: string; description: string }
export interface RenderedDiagram { sanitizedSvg: string; width: number; height: number; title: string; description: string }
let library: Promise<typeof import('mermaid')['default']> | undefined;
let queue: Promise<unknown> = Promise.resolve();
let sequence = 0, cacheBytes = 0;
const current = new Map<string, number>();
const cache = new Map<string, RenderedDiagram>();
function load() {
    library ??= import('mermaid').then(module => module.default).catch(() => { library = undefined; throw new DiagramError('carga', 'No se pudo cargar el renderizador local. Puedes reintentar o consultar Código.'); });
    return library;
}
export function cancelDiagram(instanceId: string): void { current.delete(instanceId); }
export function renderDiagram(request: RenderRequest): Promise<RenderedDiagram> {
    validateDiagramSource(request.source);
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(request.instanceId)) return Promise.reject(new DiagramError('seguridad', 'La identidad del bloque no es válida.'));
    current.set(request.instanceId, request.token);
    const key = `${request.instanceId}|${request.theme}|12.1.0|${request.title}|${request.description}|${request.source}`;
    const active = () => current.get(request.instanceId) === request.token;
    const run = async (): Promise<RenderedDiagram> => {
        if (!active()) throw new DiagramError('obsoleto', 'La vista se actualizó antes de terminar el diagrama.');
        const cached = cache.get(key);
        if (cached) { cache.delete(key); cache.set(key, cached); return cached; }
        const mermaid = await load();
        if (!active()) throw new DiagramError('obsoleto', 'La vista del diagrama cambió.');
        mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', htmlLabels: false, markdownAutoWrap: false, flowchart: { useMaxWidth: false }, layout: 'dagre', theme: request.theme === 'oscuro' ? 'dark' : 'default', fontFamily: 'Arial, sans-serif', maxTextSize: diagramLimits.sourceBytes, maxEdges: diagramLimits.edges, suppressErrorRendering: true, secure: ['secure', 'securityLevel', 'startOnLoad', 'maxTextSize', 'maxEdges', 'htmlLabels', 'layout'] });
        const container = document.createElement('div');
        container.style.cssText = 'position:absolute;left:-100000px;top:0;pointer-events:none'; container.setAttribute('aria-hidden', 'true'); document.body.append(container);
        try {
            await mermaid.parse(request.source);
            if (!active()) throw new DiagramError('obsoleto', 'La vista del diagrama cambió.');
            const { svg } = await mermaid.render(`${request.instanceId}_svg_${++sequence}`, request.source, container);
            const result = { ...sanitizeDiagramSvg(svg, { title: request.title, description: request.description }), title: request.title, description: request.description };
            if (!active()) throw new DiagramError('obsoleto', 'La vista del diagrama cambió.');
            const size = new TextEncoder().encode(result.sanitizedSvg).length;
            if (size <= diagramLimits.cacheBytes) {
                cache.set(key, result); cacheBytes += size;
                while (cache.size > diagramLimits.cacheEntries || cacheBytes > diagramLimits.cacheBytes) {
                    const first = cache.keys().next().value!; cacheBytes -= new TextEncoder().encode(cache.get(first)!.sanitizedSvg).length; cache.delete(first);
                }
            }
            return result;
        } catch (error) {
            if (error instanceof DiagramError) throw error;
            throw new DiagramError('sintaxis', 'No se pudo interpretar el bloque Mermaid. Revisa su vista Código.');
        } finally { container.remove(); }
    };
    const result = queue.then(run); queue = result.catch(() => undefined); return result;
}
