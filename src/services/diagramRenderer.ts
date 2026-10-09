import { DiagramError, validateDiagramSource, type DiagramErrorKind } from './diagramSvgPolicy';
import type { RenderRequest, RenderedDiagram } from './diagramRenderRuntime';
export type { RenderRequest, RenderedDiagram } from './diagramRenderRuntime';
let frame: HTMLIFrameElement | undefined;
let ready: Promise<HTMLIFrameElement> | undefined;
let sequence = 0;
const current = new Map<string, number>();
const pending = new Map<number, { resolve: (result: RenderedDiagram) => void; reject: (error: DiagramError) => void; timer: ReturnType<typeof setTimeout> }>();
function load(): Promise<HTMLIFrameElement> {
    if (ready) return ready;
    ready = new Promise((resolve, reject) => {
        const element = document.createElement('iframe'); frame = element;
        element.title = 'Renderizador local de diagramas'; element.tabIndex = -1; element.setAttribute('aria-hidden', 'true');
        element.style.cssText = 'position:absolute;left:-100000px;top:0;width:12000px;height:1000px;border:0;pointer-events:none';
        const failure = () => { clearTimeout(timer); window.removeEventListener('message', listener); element.remove(); frame = undefined; ready = undefined; reject(new DiagramError('carga', 'No se pudo cargar el renderizador local. Puedes reintentar o consultar Código.')); };
        const listener = (event: MessageEvent) => {
            if (event.source !== element.contentWindow || event.origin !== location.origin || !event.data) return;
            if (event.data.type === 'diagrama-listo') { clearTimeout(timer); resolve(element); return; }
            if (event.data.type !== 'diagrama-resultado') return;
            const job = pending.get(event.data.id); if (!job) return;
            clearTimeout(job.timer); pending.delete(event.data.id);
            if (event.data.error) job.reject(new DiagramError(event.data.error.kind as DiagramErrorKind, event.data.error.message));
            else job.resolve(event.data.result as RenderedDiagram);
        };
        const timer = setTimeout(failure, 25000); element.onerror = failure;
        window.addEventListener('message', listener);
        element.src = new URL('diagram-renderer.html', new URL(import.meta.env.BASE_URL, location.href)).href;
        document.body.append(element);
    });
    return ready;
}
export function cancelDiagram(instanceId: string): void {
    current.delete(instanceId); frame?.contentWindow?.postMessage({ type: 'diagrama-cancelar', instanceId }, location.origin);
}
export async function renderDiagram(request: RenderRequest): Promise<RenderedDiagram> {
    validateDiagramSource(request.source);
    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(request.instanceId)) throw new DiagramError('seguridad', 'La identidad del bloque no es válida.');
    current.set(request.instanceId, request.token);
    const renderer = await load();
    if (current.get(request.instanceId) !== request.token) throw new DiagramError('obsoleto', 'La vista se actualizó antes de terminar el diagrama.');
    const id = ++sequence;
    const result = await new Promise<RenderedDiagram>((resolve, reject) => {
        const timer = setTimeout(() => { pending.delete(id); reject(new DiagramError('carga', 'El renderizador no respondió. Puedes reintentar; el documento se conserva.')); }, 25000);
        pending.set(id, { resolve, reject, timer }); renderer.contentWindow!.postMessage({ type: 'diagrama-renderizar', id, request }, location.origin);
    });
    if (current.get(request.instanceId) !== request.token) throw new DiagramError('obsoleto', 'La vista se actualizó antes de terminar el diagrama.');
    return result;
}
