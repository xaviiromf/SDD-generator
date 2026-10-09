import type { ProjectStatus } from './projectDefinition';
import type { ProfileConfiguration } from './profiles';

export const cardinalities = ['cero-uno', 'uno', 'cero-muchos', 'uno-muchos'] as const;
export type Cardinality = typeof cardinalities[number] | '';
export interface EntityRelation {
    id: string; fromEntityId: string; toEntityId: string; label: string;
    fromCardinality: Cardinality; toCardinality: Cardinality;
    identifying: boolean | null; status: ProjectStatus;
}
export interface DiagramFacts { schemaVersion: 1; entityRelations: EntityRelation[] }
export type DiagramKind = 'architecture' | 'entities' | 'sequence' | 'traceability';
export interface DiagramIssue { id: string; message: string; sourceIds: string[] }
export interface DiagramDefinition {
    id: string; kind: DiagramKind; documentIds: string[]; source: string;
    title: string; description: string; sourceIds: string[]; issues: DiagramIssue[];
    part: { index: number; total: number };
}
export interface DiagramProjection {
    schemaVersion: 1; projectId: string; revision: number;
    diagrams: DiagramDefinition[]; issues: DiagramIssue[];
}
export interface ArchitecturePreviewRequest {
    projectId: string; baseRevision: number; previewToken: number; candidateProfile: ProfileConfiguration;
}
export interface ArchitecturePreviewResult {
    projectId: string; baseRevision: number; previewToken: number;
    diagrams: DiagramDefinition[]; issues: DiagramIssue[]; state: 'valido' | 'incompleto' | 'invalido';
}
export const diagramLimits = {
    relations: 100, factsBytes: 64 * 1024, sourceBytes: 32 * 1024,
    nodes: 200, edges: 250, cacheEntries: 20, cacheBytes: 2 * 1024 * 1024,
} as const;
const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const safeId = (v: unknown): v is string => typeof v === 'string' && /^[A-Za-z0-9][A-Za-z0-9-]{0,63}$/.test(v);
export function diagramFactsErrors(value: unknown, entityIds: ReadonlySet<string>, occupied: ReadonlySet<string>): string[] {
    if (!object(value) || value.schemaVersion !== 1 || Object.keys(value).some(k => !['schemaVersion', 'entityRelations'].includes(k)) || !Array.isArray(value.entityRelations) || value.entityRelations.length > diagramLimits.relations)
        return ['Los hechos de diagramas tienen formato o límites inválidos.'];
    try { if (new TextEncoder().encode(JSON.stringify(value)).length > diagramLimits.factsBytes) return ['Los hechos de diagramas superan 64 KiB.']; }
    catch { return ['Los hechos de diagramas no pueden serializarse.']; }
    const ids = new Set(occupied);
    const fields = ['id', 'fromEntityId', 'toEntityId', 'label', 'fromCardinality', 'toCardinality', 'identifying', 'status'];
    for (const r of value.entityRelations) {
        if (!object(r) || Object.keys(r).length !== fields.length || Object.keys(r).some(k => !fields.includes(k)) || !safeId(r.id) || ids.has(r.id) || !safeId(r.fromEntityId) || !safeId(r.toEntityId) || !entityIds.has(r.fromEntityId) || !entityIds.has(r.toEntityId) || typeof r.label !== 'string' || r.label.length > 500 || !['', ...cardinalities].includes(String(r.fromCardinality)) || !['', ...cardinalities].includes(String(r.toCardinality)) || (r.identifying !== null && typeof r.identifying !== 'boolean') || !['propuesto', 'confirmado', 'pendiente', 'descartado'].includes(String(r.status)))
            return ['Una relación ER tiene campos, referencias o identidad inválidos.'];
        ids.add(r.id);
    }
    return [];
}
