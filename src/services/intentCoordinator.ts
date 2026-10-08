import type { Configuration } from '../domain/models';
import { intentFingerprint, normalizeIntent, type IntentSnapshot } from '../domain/intent';
import { validateConfiguration } from '../domain/validation';
import { McpClient, type McpPreferences } from './mcpClient';
export const MCP_DEADLINE = 1500;
export const MCP_DEBOUNCE = 300;
export function semanticSignature(c: Configuration): string {
    return JSON.stringify({ ...c, revision: 0, selections: Object.fromEntries(Object.entries(c.selections).filter(([key]) => c.origins[key as keyof typeof c.origins] !== 'inference')), origins: Object.fromEntries(Object.entries(c.origins).filter(([, origin]) => origin !== 'inference')) });
}
export class IntentCoordinator {
    private timer?: ReturnType<typeof setTimeout>;
    private controller?: AbortController;
    private client?: McpClient;
    private generation = 0;
    private signature = '';
    private cooldown = 0;
    private disposed = false;
    constructor(private getConfig: () => Configuration, private getPreferences: () => McpPreferences & { token?: string }, private publish: (snapshot: IntentSnapshot | undefined, connected: boolean) => void, private createClient = (p: McpPreferences, token: string) => new McpClient(p, token)) {}
    observe(force = false): void {
        if (this.disposed) return;
        if (force) this.cooldown = 0;
        const config = this.getConfig(), preferences = this.getPreferences();
        const signature = semanticSignature(config) + JSON.stringify(preferences);
        if (!force && signature === this.signature) return;
        this.signature = signature; this.cancel(); this.publish(undefined, false);
        if (typeof navigator !== 'undefined' && navigator.onLine === false || !preferences.enabled || !preferences.endpoint || !config.idea.trim() || validateConfiguration(config).some(d => d.blocking)) return;
        const generation = this.generation;
        this.timer = setTimeout(() => { this.timer = undefined; if (Date.now() >= this.cooldown) void this.run(generation); }, MCP_DEBOUNCE);
    }
    private async run(generation: number): Promise<void> {
        const config = this.getConfig(); const preferences = this.getPreferences();
        const controller = new AbortController(); this.controller = controller;
        const timeout = setTimeout(() => controller.abort(), MCP_DEADLINE);
        let client: McpClient | undefined; let succeeded = false;
        try {
            client = this.createClient(preferences, preferences.token ?? ''); this.client = client;
            const aborted = new Promise<never>((_,reject) => controller.signal.addEventListener('abort', () => reject(new Error('Plazo MCP agotado o solicitud cancelada.')), { once: true }));
            const result = normalizeIntent(await Promise.race([client.infer(config.idea, config.negative, controller.signal), aborted]));
            if (controller.signal.aborted || generation !== this.generation || config.revision !== this.getConfig().revision || intentFingerprint(config) !== intentFingerprint(this.getConfig())) return;
            succeeded = true;
            this.publish({ fingerprint: intentFingerprint(config), result }, true);
        } catch {
            if (generation === this.generation) { this.cooldown = Date.now() + 5000; this.publish(undefined, false); }
        } finally { clearTimeout(timeout); if (!succeeded) { await client?.close(); if (this.controller === controller) this.controller = undefined; if (this.client === client) this.client = undefined; } }
    }
    private cancel(): void { this.generation++; clearTimeout(this.timer); this.controller?.abort(); void this.client?.close(); }
    dispose(): void { this.disposed = true; this.cancel(); this.publish(undefined, false); }
}
