import { DiagramError, sanitizeDiagramSvg } from './diagramSvgPolicy';
export interface DiagramDownload { sanitizedSvg: string; format: 'svg' | 'png'; basename: string; revision: number; scale?: number }
export function diagramBasename(name: string, revision: number): string {
    const normalized = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
    return `${normalized || 'diagrama'}-r${Number.isSafeInteger(revision) && revision >= 0 ? revision : 0}`;
}
export async function exportDiagram(request: DiagramDownload): Promise<{ blob: Blob; filename: string; reduced: boolean }> {
    const { sanitizedSvg, width, height } = sanitizeDiagramSvg(request.sanitizedSvg);
    const filename = `${diagramBasename(request.basename, request.revision)}.${request.format}`;
    const svgBlob = new Blob([sanitizedSvg], { type: 'image/svg+xml;charset=utf-8' });
    if (request.format === 'svg') return { blob: svgBlob, filename, reduced: false };
    const desired = Math.max(0.25, Math.min(4, request.scale ?? 2));
    const scale = Math.min(desired, 4096 / width, 4096 / height, Math.sqrt(16000000 / (width * height)));
    const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.floor(width * scale)); canvas.height = Math.max(1, Math.floor(height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new DiagramError('carga', 'No se pudo preparar la descarga PNG. Puedes descargar SVG.');
    const url = URL.createObjectURL(svgBlob);
    try {
        await document.fonts.ready;
        const image = new Image(); image.src = url; await image.decode();
        context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new DiagramError('carga', 'No se pudo crear el PNG. Puedes descargar SVG.')), 'image/png'));
        return { blob, filename, reduced: scale < desired };
    } catch (error) {
        if (error instanceof DiagramError) throw error;
        throw new DiagramError('carga', 'No se pudo convertir el diagrama a PNG. Puedes descargar SVG.');
    } finally { URL.revokeObjectURL(url); canvas.width = 0; canvas.height = 0; }
}
export async function downloadDiagram(request: DiagramDownload): Promise<boolean> {
    const { blob, filename, reduced } = await exportDiagram(request);
    const url = URL.createObjectURL(blob), anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
    document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000); return reduced;
}
