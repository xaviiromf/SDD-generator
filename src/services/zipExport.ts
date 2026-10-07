import { safeDocumentPath, validateText } from '../domain/validation';
import type { Configuration, GeneratedDocument } from '../domain/models';
import { createKitManifest, validSlug } from '../engine/kitManifest';
export async function packageKit(documents: GeneratedDocument[], config: Pick<Configuration, 'slug'> = { slug: 'mi-proyecto' }): Promise<Uint8Array> {
    if (!validSlug(config.slug)) throw new Error('El kit contiene rutas, revisiones o contenidos no válidos.');
    const expected = createKitManifest(config);
    const byId = new Map(expected.map(d => [d.id, d]));
    if (documents.length !== expected.length || new Set(documents.map(d => d.id)).size !== expected.length || new Set(documents.map(d => d.path)).size !== expected.length || new Set(documents.map(d => d.revision)).size !== 1 || documents.some(d => {
        const entry = byId.get(d.id);
        return !entry || entry.path !== d.path || entry.format !== d.format || !safeDocumentPath(d.path, config.slug) || validateText(d.content).length;
    }) || new TextEncoder().encode(documents.map(d => d.content).join('')).length > 1048576)
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
