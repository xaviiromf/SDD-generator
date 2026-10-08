import { technologyById } from '../catalog/technologies';
import { optionCompatible } from './compatibility';
import { singleFields, type Configuration, type Inference, type Suggestion } from './models';
export interface IntentMatch { id: string; confidence: number; reason: string }
export interface IntentResult { matches: IntentMatch[]; missingScopes: Suggestion[] }
export interface IntentSnapshot { fingerprint: string; result: IntentResult }
export const intentFingerprint = (c: Pick<Configuration, 'idea' | 'negative'>) => JSON.stringify([c.idea, c.negative]);
export function normalizeIntent(value: unknown): IntentResult {
    if (!value || typeof value !== 'object') throw new Error('Respuesta MCP no válida.');
    const v = value as Record<string, unknown>;
    if (!Array.isArray(v.matches) || v.matches.length > technologyById.size || !Array.isArray(v.missingScopes) || v.missingScopes.length > 24) throw new Error('Límites de respuesta MCP no válidos.');
    const seen = new Set<string>();
    const matches = v.matches.map(m => {
        if (!m || typeof m !== 'object') throw new Error('Coincidencia no válida.');
        const { id, confidence, reason } = m as Record<string, unknown>;
        if (typeof id !== 'string' || !technologyById.has(id) || seen.has(id) || typeof confidence !== 'number' || !Number.isFinite(confidence) || confidence < 0 || confidence > 1 || typeof reason !== 'string' || reason.length > 500) throw new Error('Coincidencia MCP no válida.');
        seen.add(id);
        return { id, confidence, reason: `Se propuso ${technologyById.get(id)!.label} mediante inferencia semántica.` };
    });
    const scopeIds = new Set<string>();
    const missingScopes = v.missingScopes.map(s => {
        if (!s || typeof s !== 'object') throw new Error('Alcance no válido.');
        const { id, message, options } = s as Record<string, unknown>;
        if (typeof id !== 'string' || !/^[a-z0-9-]{1,64}$/.test(id) || scopeIds.has(id) || typeof message !== 'string' || message.length > 500 || !Array.isArray(options) || options.length > technologyById.size || new Set(options).size !== options.length || options.some(o => typeof o !== 'string' || !technologyById.has(o))) throw new Error('Alcance MCP no válido.');
        scopeIds.add(id);
        return { id: `mcp-${id}`, message: 'Revisa este alcance arquitectónico sugerido por MCP.', options: options as string[] };
    });
    return { matches, missingScopes };
}
export function intentInferences(result: IntentResult, c: Configuration): Inference[] {
    const excluded = c.negative.toLocaleLowerCase();
    const candidates = result.matches.filter(m => m.confidence >= .85);
    const counts = new Map<string, number>();
    for (const m of candidates) { const field = technologyById.get(m.id)!.field; counts.set(field, (counts.get(field) ?? 0) + 1); }
    return result.matches.filter(m => m.confidence >= .85).map(m => ({ ...m, entry: technologyById.get(m.id)! })).filter(({ entry }) => ![entry.id, entry.label, ...entry.aliases].some(term => new RegExp(`(?:^|[^a-z0-9áéíóúñ])${term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:$|[^a-z0-9áéíóúñ])`).test(excluded)) && optionCompatible(entry, c) && (!singleFields.has(entry.field) || counts.get(entry.field) === 1) && ![entry.id, entry.label, ...entry.aliases].some(term => { const words = c.idea.toLocaleLowerCase().split(/[^a-záéíóúñ0-9-]+/); const index = words.indexOf(term.toLocaleLowerCase()); return index >= 0 && words.slice(Math.max(0,index-3),index).some(w => ['sin','no','evitar','excluir','without','avoid','not'].includes(w)); }) && (!c.origins[entry.field] || c.origins[entry.field] === 'inference')).sort((a, b) => Number(b.entry.field === 'language') - Number(a.entry.field === 'language')).map(({ entry, reason }) => ({ id: entry.id, field: entry.field, explanation: reason }));
}
export function intentSuggestions(result: IntentResult, c: Configuration): Suggestion[] {
    return [...result.missingScopes, ...result.matches.filter(m => m.confidence < .85 || singleFields.has(technologyById.get(m.id)!.field) && result.matches.filter(other => technologyById.get(other.id)!.field === technologyById.get(m.id)!.field && other.confidence >= .85).length > 1).map(m => ({ id: `mcp-proposal-${m.id}`, message: `Confirma si necesitas ${technologyById.get(m.id)!.label}.`, options: [m.id] }))].map(s => ({ ...s, options: s.options.filter(id => optionCompatible(technologyById.get(id)!, c)) })).filter(s => s.options.length);
}
