import { cancelDiagram, renderDiagram, type RenderRequest } from './diagramRenderRuntime';
import { DiagramError } from './diagramSvgPolicy';
window.addEventListener('message', (event: MessageEvent) => {
    if (event.source !== window.parent || event.origin !== location.origin || !event.data) return;
    if (event.data.type === 'diagrama-cancelar' && typeof event.data.instanceId === 'string') { cancelDiagram(event.data.instanceId); return; }
    if (event.data.type !== 'diagrama-renderizar' || !Number.isSafeInteger(event.data.id)) return;
    const { id } = event.data, request = event.data.request as RenderRequest;
    void Promise.resolve().then(() => renderDiagram(request)).then(result => window.parent.postMessage({ type: 'diagrama-resultado', id, result }, location.origin)).catch((error: unknown) => {
        const known = error instanceof DiagramError ? error : new DiagramError('sintaxis', 'No se pudo interpretar este diagrama. Revisa Código.');
        window.parent.postMessage({ type: 'diagrama-resultado', id, error: { kind: known.kind, message: known.message } }, location.origin);
    });
});
window.parent.postMessage({ type: 'diagrama-listo' }, location.origin);
