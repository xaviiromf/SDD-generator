import { expect, it, vi } from 'vitest';
import { ArchitecturePreviewClient } from '../../src/workers/architecturePreviewClient';
import { emptyProfiles } from '../../src/domain/profiles';
it('agrupa cambios y descarta resultados antiguos de proyecto o revisión', () => {
    vi.useFakeTimers(); const postMessage = vi.fn(), receive = vi.fn(), terminate = vi.fn();
    const worker = { postMessage, terminate, onmessage: null as unknown, onerror: null as unknown };
    const client = new ArchitecturePreviewClient(worker as unknown as Worker, receive, vi.fn());
    const request = { projectId: 'proyecto-a', baseRevision: 4, previewToken: 1, candidateProfile: emptyProfiles() };
    client.request(request); client.request({ ...request, previewToken: 2 }); vi.advanceTimersByTime(100);
    expect(postMessage).toHaveBeenCalledTimes(1);
    client.request({ ...request, projectId: 'proyecto-b', previewToken: 3 }); vi.advanceTimersByTime(100);
    (worker.onmessage as (event: unknown) => void)({ data: { type: 'architecture-preview', result: { ...request, previewToken: 2 } } });
    expect(receive).not.toHaveBeenCalled(); expect(postMessage).toHaveBeenCalledTimes(2);
    (worker.onmessage as (event: unknown) => void)({ data: { type: 'architecture-preview', result: { ...request, projectId: 'proyecto-b', previewToken: 3 } } });
    expect(receive).toHaveBeenCalledTimes(1); client.dispose(); expect(terminate).toHaveBeenCalled(); vi.useRealTimers();
});
