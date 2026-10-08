import { contextKinds, projectLimits, type ProjectDefinition } from './projectDefinition';
const states = new Set(['propuesto', 'confirmado', 'pendiente', 'descartado']);
const origins = new Set(['user', 'preset', 'local', 'mcp-accepted']);
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const text = (v: unknown, max: number = projectLimits.text): v is string => typeof v === 'string' && v.length <= max;
const id = (v: unknown): v is string => text(v, projectLimits.id) && /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(v);
const list = (v: unknown, max: number): v is unknown[] => Array.isArray(v) && v.length <= max;
const refs = (v: unknown) => list(v, projectLimits.references) && v.every(id) && new Set(v).size === v.length;
const base = (v: Record<string, unknown>) => id(v.id) && states.has(String(v.status)) && origins.has(String(v.origin));
export function projectValidationErrors(value: unknown): string[] {
    if (!record(value)) return ['El modelo del proyecto no es un objeto válido.'];
    let encoded: string;
    try { encoded = JSON.stringify(value); } catch { return ['El modelo no puede serializarse.']; }
    if (new TextEncoder().encode(encoded).length > projectLimits.bytes) return ['El modelo del proyecto supera 256 KiB.'];
    if (value.schemaVersion !== 1 || !id(value.projectId) || !Number.isSafeInteger(value.revision) || Number(value.revision) < 0 || !Number.isSafeInteger(value.nextId) || Number(value.nextId) < 1 || !['nuevo','ampliacion','migracion','documentacion'].includes(String(value.mode)) || typeof value.implementationRequired !== 'boolean') return ['Versión, identidad o metadatos del proyecto inválidos.'];
    if (!record(value.context) || Object.keys(value.context).length !== contextKinds.length || !contextKinds.every(kind => list(value.context && (value.context as Record<string,unknown>)[kind], projectLimits.items)) || !list(value.requirements, projectLimits.requirements)) return ['Colecciones del proyecto inválidas o demasiado extensas.'];
    const keys = new Set<string>();
    const add = (key: string) => { if (keys.has(key)) return false; keys.add(key); return true; };
    for (const kind of contextKinds) {
        for (const item of value.context[kind] as unknown[]) {
            if (!record(item) || !base(item) || !text(item.text) || !refs(item.references) || !add(String(item.id))) return ['Elemento de contexto inválido o ID duplicado.'];
        }
    }
    for (const item of value.requirements) {
        if (!record(item) || !base(item) || !text(item.title, projectLimits.title) || !text(item.context) || !text(item.behavior) || !text(item.actorId, projectLimits.id) || !['functional','nonfunctional'].includes(String(item.kind)) || !['alta','media','baja'].includes(String(item.priority)) || !list(item.exceptions, projectLimits.exceptions) || !item.exceptions.every(v => text(v)) || !list(item.criteria, projectLimits.criteria) || !['ruleIds','componentIds','decisionIds','contractIds'].every(k => refs(item[k])) || !add(String(item.id))) return ['Requisito inválido o ID duplicado.'];
        for (const criterion of item.criteria) if (!record(criterion) || !id(criterion.id) || !text(criterion.text) || !add(criterion.id)) return ['Criterio inválido o ID duplicado.'];
    }
    const project = value as unknown as ProjectDefinition;
    const errors: string[] = [];
    for (const kind of contextKinds) for (const item of project.context[kind]) for (const ref of item.references) if (!keys.has(ref)) errors.push(`${item.id}: referencia inexistente ${ref}.`);
    for (const requirement of project.requirements) {
        const groups = [['actors',requirement.actorId ? [requirement.actorId] : []],['rules',requirement.ruleIds],['components',requirement.componentIds],['decisions',requirement.decisionIds],['contracts',requirement.contractIds]] as const;
        for (const [kind, links] of groups) for (const ref of links) if (!project.context[kind].some(item=>item.id===ref && item.status!=='descartado')) errors.push(`${requirement.id}: referencia inválida a ${ref}.`);
    }
    return errors;
}
export function isProjectDefinition(value: unknown): value is ProjectDefinition { return projectValidationErrors(value).length === 0; }
