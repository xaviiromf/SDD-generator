export type McpTransport = 'auto' | 'streamable-http' | 'sse';
export interface McpPreferences { enabled: boolean; endpoint: string; transport: McpTransport }
type Rpc = { jsonrpc: string; id?: number; result?: unknown; error?: unknown; method?: string };
type Tool = { name: string; inputSchema: { type?: string; properties?: Record<string, { type?: string }>; required?: string[] } };
const versions = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const limit = 128 * 1024;
export function validMcpEndpoint(value: string): boolean {
    try {
        if (!value || value.length > 2048) return false;
        const u = new URL(value);
        return !u.username && !u.password && !u.hash && ![...u.searchParams.keys()].some(k => /token|secret|key|password|auth/i.test(k)) && (u.protocol === 'https:' || u.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname));
    } catch { return false; }
}
async function readLimited(response: Response): Promise<string> {
    if (!response.body) throw new Error('Respuesta MCP vacía.');
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let text = ''; let bytes = 0;
    try { while (true) { const { value, done } = await reader.read(); if (done) break; bytes += value.length; if (bytes > limit) throw new Error('La respuesta MCP supera el límite.'); text += decoder.decode(value, { stream: true }); } return text + decoder.decode(); } finally { await reader.cancel().catch(() => {}); }
}
export async function consumeSse(response: Response, receive: (event: string, data: string) => boolean | void): Promise<void> {
    if (!response.body) throw new Error('Flujo MCP vacío.');
    const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = ''; let bytes = 0; let event = 'message'; let lines: string[] = [];
    try { while (true) {
        const { value, done } = await reader.read();
        if (value) { bytes += value.length; if (bytes > limit) throw new Error('El flujo MCP supera el límite.'); buffer += decoder.decode(value, { stream: true }); }
        if (done) buffer += decoder.decode();
        let index: number;
        while ((index = buffer.indexOf('\n')) >= 0) {
            const line = buffer.slice(0, index).replace(/\r$/, ''); buffer = buffer.slice(index + 1);
            if (!line) { if (lines.length && receive(event, lines.join('\n')) === true) return; lines = []; event = 'message'; }
            else if (line.startsWith('event:')) event = line.slice(6).trim();
            else if (line.startsWith('data:')) lines.push(line.slice(5).replace(/^ /, ''));
        }
        if (done) break;
    } } finally { await reader.cancel().catch(() => {}); }
}
class HttpFailure extends Error { constructor(public status: number) { super('El servidor MCP rechazó la solicitud.'); } }
export class McpClient {
    private legacyEndpoint = '';
    private legacyAbort?: AbortController;
    private waiting = new Map<number, { resolve: (value: Rpc) => void; reject: (error: unknown) => void }>();
    private serial = 0;
    private session = '';
    private version = '';
    private tool?: Tool;
    constructor(private preferences: McpPreferences, private token = '', private fetcher: typeof fetch = (input, init) => fetch(input, init)) {
        if (!validMcpEndpoint(preferences.endpoint)) throw new Error('URL MCP no válida.');
        if (/[\r\n]/.test(token)) throw new Error('Credencial de sesión no válida.');
    }
    private headers(): Record<string, string> {
        return { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', ...(this.session ? { 'Mcp-Session-Id': this.session } : {}), ...(this.version ? { 'MCP-Protocol-Version': this.version } : {}), ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}) };
    }
    private async httpRpc(method: string, params: unknown, signal: AbortSignal, notification = false): Promise<unknown> {
        const id = notification ? undefined : ++this.serial;
        const response = await this.fetcher(this.preferences.endpoint, { method: 'POST', headers: this.headers(), credentials: 'omit', cache: 'no-store', redirect: 'error', signal, body: JSON.stringify({ jsonrpc: '2.0', ...(id === undefined ? {} : { id }), method, params }) });
        if (!response.ok) { await response.body?.cancel(); throw new HttpFailure(response.status); }
        const session = response.headers.get('Mcp-Session-Id');
        if (method === 'initialize' && session) { if (!/^[\x21-\x7e]{1,1024}$/.test(session)) throw new Error('Sesión MCP no válida.'); this.session = session; }
        if (notification) { await response.body?.cancel(); return undefined; }
        let message: Rpc | undefined;
        if (response.headers.get('Content-Type')?.includes('text/event-stream')) await consumeSse(response, (_event, data) => { if (!data) return; const m = JSON.parse(data) as Rpc; if (m.id === id) { message = m; return true; } });
        else if (response.headers.get('Content-Type')?.includes('application/json')) message = JSON.parse(await readLimited(response)) as Rpc;
        else { await response.body?.cancel(); throw new Error('Formato MCP no compatible.'); }
        if (!message || message.jsonrpc !== '2.0' || message.id !== id || message.error || !Object.hasOwn(message, 'result')) throw new Error('Respuesta RPC MCP no válida.');
        return message.result;
    }
    private async openLegacy(signal: AbortSignal): Promise<void> {
        const controller = new AbortController(); this.legacyAbort = controller;
        const abort = () => controller.abort(); signal.addEventListener('abort', abort, { once: true });
        if (signal.aborted) controller.abort();
        const response = await this.fetcher(this.preferences.endpoint, { method: 'GET', headers: { ...this.headers(), Accept: 'text/event-stream' }, credentials: 'omit', cache: 'no-store', redirect: 'error', signal: controller.signal });
        if (!response.ok || !response.headers.get('Content-Type')?.includes('text/event-stream')) { await response.body?.cancel(); throw new Error('El servidor no ofrece SSE compatible.'); }
        let resolveEndpoint!: () => void; let rejectEndpoint!: (error: unknown) => void;
        const endpoint = new Promise<void>((resolve,reject) => { resolveEndpoint = resolve; rejectEndpoint = reject; });
        const rejectAll = (error: unknown) => { rejectEndpoint(error); for (const p of this.waiting.values()) p.reject(error); this.waiting.clear(); };
        controller.signal.addEventListener('abort', () => rejectAll(new Error('Solicitud MCP cancelada.')), { once: true });
        void consumeSse(response, (event,data) => {
            if (event === 'endpoint' && !this.legacyEndpoint) {
                const url = new URL(data, this.preferences.endpoint);
                if (url.origin !== new URL(this.preferences.endpoint).origin || !validMcpEndpoint(url.href)) throw new Error('Destino SSE no permitido.');
                this.legacyEndpoint = url.href; resolveEndpoint();
            } else if (event === 'message') {
                const message = JSON.parse(data) as Rpc;
                if (typeof message.id === 'number') { this.waiting.get(message.id)?.resolve(message); this.waiting.delete(message.id); }
            }
        }).then(() => rejectAll(new Error('Flujo SSE cerrado.')), rejectAll).finally(() => signal.removeEventListener('abort',abort));
        await endpoint;
    }
    private async rpc(method: string, params: unknown, signal: AbortSignal, notification = false): Promise<unknown> {
        if (!this.legacyEndpoint) return this.httpRpc(method, params, signal, notification);
        const id = notification ? undefined : ++this.serial;
        const responsePromise = id === undefined ? undefined : new Promise<Rpc>((resolve,reject) => this.waiting.set(id, { resolve, reject }));
        void responsePromise?.catch(() => {});
        // Registrar la espera antes del POST: algunos servidores responden por SSE inmediatamente.
        const abort = () => { if (id !== undefined) { this.waiting.get(id)?.reject(new Error('Solicitud MCP cancelada.')); this.waiting.delete(id); } };
        signal.addEventListener('abort', abort, { once: true });
        try {
            const response = await this.fetcher(this.legacyEndpoint, { method: 'POST', headers: this.headers(), credentials: 'omit', cache: 'no-store', redirect: 'error', signal, body: JSON.stringify({ jsonrpc: '2.0', ...(id === undefined ? {} : { id }), method, params }) });
            await response.body?.cancel();
            if (!response.ok) throw new HttpFailure(response.status);
            if (!responsePromise) return;
            const message = await responsePromise;
            if (message.jsonrpc !== '2.0' || message.error || !Object.hasOwn(message, 'result')) throw new Error('Respuesta SSE MCP no válida.');
            return message.result;
        } finally { signal.removeEventListener('abort',abort); if (id !== undefined) this.waiting.delete(id); }
    }
    async connect(signal: AbortSignal): Promise<void> {
        const params = { protocolVersion: versions[0], capabilities: {}, clientInfo: { name: 'SDD-Studio', version: '1.0.0' } };
        if (this.preferences.transport === 'sse') { await this.openLegacy(signal); params.protocolVersion = '2024-11-05'; }
        let init: { protocolVersion?: string; capabilities?: { tools?: unknown } };
        try { init = await this.rpc('initialize', params, signal) as typeof init; }
        catch (error) {
            if (this.preferences.transport !== 'auto' || !(error instanceof HttpFailure) || ![400,404,405].includes(error.status)) throw error;
            await this.openLegacy(signal); params.protocolVersion = '2024-11-05';
            init = await this.rpc('initialize', params, signal) as typeof init;
        }
        if (!init || !versions.includes(init.protocolVersion ?? '') || !init.capabilities?.tools) throw new Error('El servidor MCP no ofrece herramientas compatibles.');
        this.version = init.protocolVersion!;
        await this.rpc('notifications/initialized', {}, signal, true);
        const result = await this.rpc('tools/list', {}, signal) as { tools?: Tool[] };
        if (!Array.isArray(result?.tools) || result.tools.length > 256) throw new Error('Catálogo de herramientas MCP no válido.');
        this.tool = ['match_technologies', 'infer_intent'].map(name => result.tools!.find(t => t.name === name && t.inputSchema?.type === 'object' && t.inputSchema.properties?.text?.type === 'string' && (t.inputSchema.required ?? []).every(k => k === 'text' || k === 'exclusions' && ['string', 'array'].includes(t.inputSchema.properties?.exclusions?.type ?? '')))).find(Boolean);
        if (!this.tool) throw new Error('Falta match_technologies o infer_intent con un esquema compatible.');
    }
    async infer(text: string, exclusions: string, signal: AbortSignal): Promise<unknown> {
        if (!this.tool) await this.connect(signal);
        const argumentsValue: Record<string, unknown> = { text };
        if (this.tool!.inputSchema.properties?.exclusions) argumentsValue.exclusions = this.tool!.inputSchema.properties.exclusions.type === 'array' ? exclusions.split('\n').filter(Boolean) : exclusions;
        const activeId = this.serial + 1;
        const cancel = () => { void this.rpc('notifications/cancelled', { requestId: activeId, reason: 'La solicitud ya no está vigente.' }, AbortSignal.timeout(300), true).catch(() => {}); };
        signal.addEventListener('abort',cancel,{once:true});
        let result: { isError?: boolean; structuredContent?: unknown; content?: { type: string; text?: string }[] };
        try { result = await this.rpc('tools/call', { name: this.tool!.name, arguments: argumentsValue }, signal) as { isError?: boolean; structuredContent?: unknown; content?: { type: string; text?: string }[] }; } finally { signal.removeEventListener('abort',cancel); }
        if (result?.isError) throw new Error('La herramienta MCP no pudo inferir la intención.');
        if (result?.structuredContent !== undefined) return result.structuredContent;
        if (result?.content?.length === 1 && result.content[0].type === 'text' && typeof result.content[0].text === 'string') return JSON.parse(result.content[0].text);
        throw new Error('La herramienta MCP no devolvió datos estructurados.');
    }
    async close(): Promise<void> {
        this.legacyAbort?.abort(); this.legacyEndpoint = "";
        if (this.session) await this.fetcher(this.preferences.endpoint, { method: 'DELETE', headers: this.headers(), credentials: 'omit', cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(300) }).catch(() => {});
        this.tool = undefined; this.session = ''; this.version = ''; this.token = '';
    }
}
