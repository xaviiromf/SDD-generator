import type { DiagramFacts } from './diagrams';
/** Modelo canónico local: no contiene sesiones, credenciales ni resultados ejecutados. */
export const contextKinds = ['components', 'actors', 'capabilities', 'processes', 'entities', 'rules', 'decisions', 'assumptions', 'questions', 'exclusions', 'contracts'] as const;
export type ContextKind = typeof contextKinds[number];
export type ProjectStatus = 'propuesto' | 'confirmado' | 'pendiente' | 'descartado';
export type ProjectOrigin = 'user' | 'preset' | 'local' | 'mcp-accepted';
export interface ProjectItem { id: string; text: string; status: ProjectStatus; origin: ProjectOrigin; references: string[] }
export interface AcceptanceCriterion { id: string; text: string }
export interface StructuredRequirement {
    id: string; title: string; kind: 'functional' | 'nonfunctional'; status: ProjectStatus; origin: ProjectOrigin;
    actorId: string; context: string; behavior: string; priority: 'alta' | 'media' | 'baja';
    exceptions: string[]; criteria: AcceptanceCriterion[]; ruleIds: string[]; componentIds: string[]; decisionIds: string[]; contractIds: string[];
}
export interface ProjectDefinition {
    schemaVersion: 1; projectId: string; revision: number; nextId: number;
    mode: 'nuevo' | 'ampliacion' | 'migracion' | 'documentacion'; implementationRequired: boolean;
    diagramFacts?: DiagramFacts;
    requirements: StructuredRequirement[]; context: Record<ContextKind, ProjectItem[]>;
}
export const projectLimits = { bytes: 256 * 1024, items: 100, requirements: 100, criteria: 10, exceptions: 10, id: 64, title: 500, text: 2000, references: 100 } as const;
export function createProjectDefinition(slug = 'mi-proyecto', revision = 0): ProjectDefinition {
    return { schemaVersion: 1, projectId: slug, revision, nextId: 1, mode: 'nuevo', implementationRequired: true, requirements: [], context: { components: [], actors: [], capabilities: [], processes: [], entities: [], rules: [], decisions: [], assumptions: [], questions: [], exclusions: [], contracts: [] } };
}
export function createRequirement(id: string): StructuredRequirement {
    return { id, title: '', kind: 'functional', status: 'pendiente', origin: 'user', actorId: '', context: '', behavior: '', priority: 'media', exceptions: [], criteria: [], ruleIds: [], componentIds: [], decisionIds: [], contractIds: [] };
}
export function hasProjectContent(project?: ProjectDefinition): boolean {
    return !!project && (project.requirements.length > 0 || !!project.diagramFacts?.entityRelations.length || contextKinds.some(kind=>project.context[kind].length>0) || project.mode !== 'nuevo' || !project.implementationRequired);
}
