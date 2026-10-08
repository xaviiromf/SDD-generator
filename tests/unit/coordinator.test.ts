import { it, expect, vi } from 'vitest';
import { IntentCoordinator } from '../../src/services/intentCoordinator';
import { emptyConfiguration } from '../../src/domain/models';
import type { McpClient } from '../../src/services/mcpClient';
it('aplica 300 ms de espera y fallback total al alcanzar 1500 ms', async () => {
    vi.useFakeTimers();
    const publish = vi.fn(); const infer = vi.fn(() => new Promise(() => {}));
    const coordinator = new IntentCoordinator(() => ({ ...emptyConfiguration(), idea: 'Reservas' }), () => ({ enabled: true, endpoint: 'http://localhost:3000/mcp', transport: 'auto' }), publish, () => ({ infer, close: async () => {} }) as unknown as McpClient);
    coordinator.observe(); await vi.advanceTimersByTimeAsync(299); expect(infer).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1); expect(infer).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync(1499); expect(publish).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(1); expect(publish).toHaveBeenLastCalledWith(undefined, false);
    coordinator.dispose(); vi.useRealTimers();
});
it('descarta respuestas viejas y no envía credenciales de la idea', async () => {
    vi.useFakeTimers(); let config = { ...emptyConfiguration(), idea: 'Reservas' };
    let resolve!: (value: unknown) => void;
    const infer = vi.fn(() => new Promise(r => { resolve = r; })); const publish = vi.fn();
    const c = new IntentCoordinator(() => config, () => ({ enabled: true, endpoint: 'http://localhost:3000/mcp', transport: 'auto' }), publish, () => ({ infer, close: async () => {} }) as unknown as McpClient);
    c.observe(); await vi.advanceTimersByTimeAsync(300);
    config = { ...config, revision: 1, idea: 'token=' + 'a'.repeat(25) }; c.observe(); resolve({ matches: [], missingScopes: [] });
    await vi.advanceTimersByTimeAsync(300); expect(infer).toHaveBeenCalledOnce(); expect(publish.mock.calls.every(([,connected]) => !connected)).toBe(true);
    c.dispose(); vi.useRealTimers();
});
it('el apagado y cambio de configuración cancelan la solicitud y evitan bucles de inferencia', async () => {
    vi.useFakeTimers(); let config = { ...emptyConfiguration(), idea: 'Reservas' };
    let enabled = true; const infer = vi.fn(async () => ({ matches: [], missingScopes: [] })); const publish = vi.fn();
    const c = new IntentCoordinator(() => config, () => ({ enabled, endpoint: 'http://localhost:3000/mcp', transport: 'auto' }), publish, () => ({ infer, close: async () => {} }) as unknown as McpClient);
    c.observe(); await vi.advanceTimersByTimeAsync(300); expect(publish).toHaveBeenLastCalledWith(expect.any(Object), true);
    config = { ...config, revision: 1, selections: { language: ['python'] }, origins: { language: 'inference' } }; c.observe(); await vi.advanceTimersByTimeAsync(300); expect(infer).toHaveBeenCalledOnce();
    enabled = false; c.observe(true); await vi.advanceTimersByTimeAsync(300); expect(publish).toHaveBeenLastCalledWith(undefined, false); expect(infer).toHaveBeenCalledOnce();
    c.dispose(); vi.useRealTimers();
});
