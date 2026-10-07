import { it, expect, vi } from 'vitest';
import { GeneratorClient } from '../../src/workers/generatorClient';
import { emptyConfiguration } from '../../src/domain/models';
it('agrupa solicitudes y reemplaza la pendiente durante compilación', () => {
    vi.useFakeTimers();
    const worker = { postMessage: vi.fn(), terminate: vi.fn(), onmessage: null as null | ((event: {
            data: unknown;
        }) => void), onerror: null };
    const receive = vi.fn();
    const client = new GeneratorClient(worker as unknown as Worker, receive, vi.fn());
    client.request(emptyConfiguration());
    vi.advanceTimersByTime(16);
    expect(worker.postMessage).toHaveBeenCalledTimes(1);
    client.request({ ...emptyConfiguration(), revision: 1 });
    client.request({ ...emptyConfiguration(), revision: 2 });
    vi.advanceTimersByTime(16);
    expect(worker.postMessage).toHaveBeenCalledTimes(1);
    worker.onmessage!({ data: { result: { revision: 0 } } });
    expect(worker.postMessage).toHaveBeenCalledTimes(2);
    expect(worker.postMessage.mock.calls[1][0].revision).toBe(2);
    client.dispose();
    vi.useRealTimers();
});
