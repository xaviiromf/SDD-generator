import { create } from 'zustand';
import { McpClient, validMcpEndpoint, type McpPreferences } from '../services/mcpClient';
export const mcpPreferencesKey = 'sdd-studio:mcp:v1';
const defaults: McpPreferences = { enabled: false, endpoint: '', transport: 'auto' };
export function readMcpPreferences(storage?: Pick<Storage, 'getItem'>): McpPreferences {
    try { const raw = (storage ?? localStorage).getItem(mcpPreferencesKey); const p = raw ? JSON.parse(raw) : defaults;
        return typeof p.enabled === 'boolean' && (p.endpoint === '' || validMcpEndpoint(p.endpoint)) && ['auto', 'streamable-http', 'sse'].includes(p.transport) ? { enabled: p.enabled, endpoint: p.endpoint, transport: p.transport } : defaults;
    } catch { return defaults; }
}
let testClient: McpClient | undefined; let testController: AbortController | undefined; let testGeneration = 0;
interface McpState {
    preferences: McpPreferences; token: string; connected: boolean; testing: boolean; testMessage: string;
    configure: (preferences: McpPreferences, token: string) => void;
    testConnection: (preferences: McpPreferences, token: string) => Promise<void>;
}
export const useMcpStore = create<McpState>((set) => ({
    preferences: readMcpPreferences(), token: '', connected: false, testing: false, testMessage: '',
    configure: (preferences, token) => {
        if (preferences.endpoint && !validMcpEndpoint(preferences.endpoint) || /[\r\n]/.test(token)) { set({ testMessage: 'URL o credencial de sesión no válida.' }); return; }
        testGeneration++; testController?.abort(); void testClient?.close();
        set({ preferences: { ...preferences }, token: preferences.enabled ? token : '', connected: false, testing: false, testMessage: '' });
        try { localStorage.setItem(mcpPreferencesKey, JSON.stringify({ enabled: preferences.enabled, endpoint: preferences.endpoint, transport: preferences.transport })); } catch { set({ testMessage: 'Los ajustes se mantienen en memoria; no se pudieron guardar.' }); }
    },
    testConnection: async (preferences, token) => {
        const generation = ++testGeneration; testController?.abort(); void testClient?.close();
        const controller = new AbortController(); testController = controller; const timer = setTimeout(() => controller.abort(), 1500);
        set({ testing: true, testMessage: '' });
        try { const client = new McpClient(preferences, token); testClient = client; await client.connect(controller.signal);
            if (generation === testGeneration) set({ testMessage: 'Conexión verificada. Herramienta compatible disponible; no se envió tu idea.' });
        } catch { if (generation === testGeneration) set({ testMessage: 'No se pudo conectar. Revisa URL, CORS, permisos y credencial de sesión. El motor local sigue disponible.' }); void testClient?.close(); }
        finally { clearTimeout(timer); if (generation === testGeneration) set({ testing: false }); }
    },
}));
