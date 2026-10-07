import { safeDocumentPath, validateText } from '../domain/validation';
import { documentPaths, type GeneratedDocument } from '../domain/models';
export async function packageKit(documents: GeneratedDocument[]): Promise<Uint8Array> {
    if (documents.length !== documentPaths.length || new Set(documents.map(d => d.path)).size !== documentPaths.length || new Set(documents.map(d => d.revision)).size !== 1 || documents.some(d => !safeDocumentPath(d.path) || validateText(d.content).length))
        throw new Error('El kit contiene rutas, revisiones o contenidos no válidos.');
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    documents.forEach(d => zip.file(d.path, d.content, { date: new Date('2026-01-01T00:00:00Z') }));
    const start = performance.now();
    const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'STORE' });
    performance.measure('sdd:empaquetado-zip', { start, end: performance.now() });
    return bytes;
}
export async function saveDownload(content: Blob, filename: string) { const { saveAs } = await import('file-saver'); saveAs(content, filename); }
