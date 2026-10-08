import { it, expect } from 'vitest';
import { McpClient, consumeSse, validMcpEndpoint } from '../../src/services/mcpClient';
it('negocia HTTP, sesión y herramienta sin enviar la idea durante la conexión', async () => {
    const requests: Record<string, unknown>[] = [];
    const fake: typeof fetch = async (_url, init) => {
        const request = JSON.parse(String(init?.body)); requests.push(request);
        const result = request.method === 'initialize' ? { protocolVersion: '2025-11-25', capabilities: { tools: {} } } : request.method === 'tools/list' ? { tools: [{ name: 'match_technologies', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } }] } : { structuredContent: { matches: [], missingScopes: [] } };
        return request.id ? new Response(JSON.stringify({ jsonrpc: '2.0', id: request.id, result }), { headers: { 'Content-Type': 'application/json', 'Mcp-Session-Id': 'prueba' } }) : new Response(null, { status: 202 });
    };
    const c = new McpClient({ enabled: true, endpoint: 'http://localhost:3000/mcp', transport: 'streamable-http' }, '', fake);
    await c.connect(new AbortController().signal);
    expect(JSON.stringify(requests)).not.toContain('Idea privada');
    expect(await c.infer('Idea privada', '', new AbortController().signal)).toEqual({ matches: [], missingScopes: [] });
    expect(requests.map(r => r.method)).toEqual(['initialize', 'notifications/initialized', 'tools/list', 'tools/call']);
});
it('valida destinos y limita respuestas', async () => {
    expect(validMcpEndpoint('http://sitio.example/mcp')).toBe(false);
    expect(validMcpEndpoint('https://sitio.example/mcp?token=secreto')).toBe(false);
    expect(validMcpEndpoint('http://127.0.0.1:3000/sse')).toBe(true);
    await expect(consumeSse(new Response('x'.repeat(128 * 1024 + 1)), () => {})).rejects.toThrow('límite');
});
it('interpreta SSE fragmentado con UTF-8 y líneas múltiples', async () => {
    const encoder = new TextEncoder();
    const bytes = encoder.encode('event: message\r\ndata: {"texto":\r\ndata: "acción"}\r\n\r\n');
    const values: unknown[] = [];
    await consumeSse(new Response(new ReadableStream({ start(controller) { for (const b of bytes) controller.enqueue(new Uint8Array([b])); controller.close(); } })), (_event, data) => { values.push(JSON.parse(data)); });
    expect(values).toEqual([{ texto: 'acción' }]);
});
it('conecta SSE heredado tras 405 y correlaciona respuestas', async () => {
    let stream!: ReadableStreamDefaultController<Uint8Array>;
    const emit = (text: string) => stream.enqueue(new TextEncoder().encode(text));
    const fake: typeof fetch = async (url, init) => {
        if (init?.method === 'GET') return new Response(new ReadableStream({ start(controller) { stream = controller; emit('event: endpoint\ndata: /mensajes\n\n'); }, cancel() {} }), { headers: { 'Content-Type': 'text/event-stream' } });
        if (String(url).endsWith('/sse')) return new Response(null, { status: 405 });
        const r = JSON.parse(String(init?.body));
        if (r.id) emit(`event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id: r.id, result: r.method === 'initialize' ? { protocolVersion: '2024-11-05', capabilities: { tools: {} } } : { tools: [{ name: 'infer_intent', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } }] } })}\n\n`);
        return new Response(null, { status: 202 });
    };
    const c = new McpClient({ enabled: true, endpoint: 'http://localhost:3000/sse', transport: 'auto' }, '', fake);
    await c.connect(new AbortController().signal); await c.close();
});
import { readMcpPreferences } from '../../src/store/mcpStore';
it('recupera preferencias sanitizadas sin token ni idea', () => {
    const p = readMcpPreferences({ getItem: () => JSON.stringify({ enabled: true, endpoint: 'http://localhost:3000/sse', transport: 'auto', token: 'privado', idea: 'privada' }) });
    expect(p).toEqual({ enabled: true, endpoint: 'http://localhost:3000/sse', transport: 'auto' });
    expect(readMcpPreferences({ getItem: () => '{' }).enabled).toBe(false);
});
import { vi } from 'vitest';
for (const status of [401, 403, 500]) it(`no reintenta ni envía herramientas tras HTTP ${status}`, async () => {
    const fake = vi.fn(async () => new Response(null, { status }));
    const c = new McpClient({ enabled: true, endpoint: 'http://localhost:3000/mcp', transport: 'auto' }, '', fake);
    await expect(c.connect(new AbortController().signal)).rejects.toThrow(); expect(fake).toHaveBeenCalledOnce();
});
it('rechaza versiones, IDs RPC y esquema de herramientas ajenos', async () => {
    const preferences = { enabled: true, endpoint: 'http://localhost:3000/mcp', transport: 'streamable-http' as const };
    for (const result of [{ protocolVersion: '2099-01-01', capabilities: { tools: {} } }, { protocolVersion: '2025-11-25', capabilities: {} }]) {
        const c = new McpClient(preferences, '', async (_url, init) => new Response(JSON.stringify({ jsonrpc: '2.0', id: JSON.parse(String(init?.body)).id, result }), { headers: { 'Content-Type': 'application/json' } }));
        await expect(c.connect(new AbortController().signal)).rejects.toThrow('compatibles');
    }
    const c = new McpClient(preferences, '', async () => new Response(JSON.stringify({ jsonrpc: '2.0', id: 999, result: {} }), { headers: { 'Content-Type': 'application/json' } }));
    await expect(c.connect(new AbortController().signal)).rejects.toThrow('RPC');
});
