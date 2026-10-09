import type { ArchitecturePreviewRequest, ArchitecturePreviewResult } from '../domain/diagrams';
export class ArchitecturePreviewClient {
    private pending: ArchitecturePreviewRequest | null = null;
    private latest: ArchitecturePreviewRequest | null = null;
    private busy = false;
    private timer: ReturnType<typeof setTimeout> | null = null;
    constructor(private worker: Worker, receive: (result: ArchitecturePreviewResult) => void, fail: (message: string) => void) {
        worker.onmessage = event => {
            this.busy = false;
            const result = event.data.result as ArchitecturePreviewResult | undefined;
            if (event.data.type === 'architecture-preview' && result && result.projectId === this.latest?.projectId && result.baseRevision === this.latest.baseRevision && result.previewToken === this.latest.previewToken) receive(result);
            if (!this.timer) this.send();
        };
        worker.onerror = () => { this.busy = false; fail('No se pudo actualizar el mapa local. Tu edición se conserva.'); };
    }
    request(request: ArchitecturePreviewRequest): void {
        this.latest = request; this.pending = request;
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => { this.timer = null; this.send(); }, 100);
    }
    private send(): void {
        if (this.busy || !this.pending) return;
        const request = this.pending; this.pending = null; this.busy = true;
        this.worker.postMessage({ type: 'architecture-preview', request });
    }
    dispose(): void { if (this.timer) clearTimeout(this.timer); this.latest = null; this.pending = null; this.worker.terminate(); }
}
export function startArchitecturePreview(receive: (result: ArchitecturePreviewResult) => void, fail: (message: string) => void): ArchitecturePreviewClient {
    return new ArchitecturePreviewClient(new Worker(new URL('./generator.worker.ts', import.meta.url), { type: 'module' }), receive, fail);
}
