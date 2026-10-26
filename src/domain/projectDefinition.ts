import type { DiagramFacts } from './diagrams';
/** Modelo canónico local: no contiene sesiones, credenciales ni resultados ejecutados. */
export const contextKinds = [
  'components',
  'actors',
  'capabilities',
  'processes',
  'entities',
  'rules',
  'decisions',
  'assumptions',
  'questions',
  'exclusions',
  'contracts',
] as const;
export type ContextKind = (typeof contextKinds)[number];
export type ProjectStatus = 'propuesto' | 'confirmado' | 'pendiente' | 'descartado';
export type ProjectOrigin = 'user' | 'preset' | 'local' | 'mcp-accepted' | 'assistant-accepted';
export interface ProjectItem {
  id: string;
  text: string;
  status: ProjectStatus;
  origin: ProjectOrigin;
  references: string[];
}
export interface AcceptanceCriterion {
  id: string;
  text: string;
}
export interface StructuredRequirement {
  id: string;
  title: string;
  kind: 'functional' | 'nonfunctional';
  status: ProjectStatus;
  origin: ProjectOrigin;
  actorId: string;
  context: string;
  behavior: string;
  priority: 'alta' | 'media' | 'baja';
  exceptions: string[];
  criteria: AcceptanceCriterion[];
  ruleIds: string[];
  componentIds: string[];
  decisionIds: string[];
  contractIds: string[];
}
export interface ProjectDefinition {
  schemaVersion: 1;
  projectId: string;
  revision: number;
  nextId: number;
  mode: 'nuevo' | 'ampliacion' | 'migracion' | 'documentacion';
  implementationRequired: boolean;
  diagramFacts?: DiagramFacts;
  requirements: StructuredRequirement[];
  context: Record<ContextKind, ProjectItem[]>;
}
/** Solo se limita el tamaño total y el patrón de los IDs, que son anclas del kit (tabla de riesgo). */
export const projectLimits = { bytes: 256 * 1024, id: 64 } as const;
export function createProjectDefinition(slug = 'mi-proyecto', revision = 0): ProjectDefinition {
  return {
    schemaVersion: 1,
    projectId: slug,
    revision,
    nextId: 1,
    mode: 'nuevo',
    implementationRequired: true,
    requirements: [],
    context: {
      components: [],
      actors: [],
      capabilities: [],
      processes: [],
      entities: [],
      rules: [],
      decisions: [],
      assumptions: [],
      questions: [],
      exclusions: [],
      contracts: [],
    },
  };
}
/** Siguiente ID libre con el prefijo dado; nunca reutiliza uno existente. */
export function allocateId(project: ProjectDefinition, prefix: string): string {
  const ids = new Set([
    ...contextKinds.flatMap(k => project.context[k].map(i => i.id)),
    ...project.requirements.flatMap(r => [r.id, ...r.criteria.map(c => c.id)]),
    ...(project.diagramFacts?.entityRelations.map(r => r.id) ?? []),
  ]);
  let id: string;
  do {
    id = `${prefix}-${project.nextId++}`;
  } while (ids.has(id));
  return id;
}
export function createRequirement(id: string): StructuredRequirement {
  return {
    id,
    title: '',
    kind: 'functional',
    status: 'pendiente',
    origin: 'user',
    actorId: '',
    context: '',
    behavior: '',
    priority: 'media',
    exceptions: [],
    criteria: [],
    ruleIds: [],
    componentIds: [],
    decisionIds: [],
    contractIds: [],
  };
}
/**
 * Líneas del alcance positivo que aún no son título de un requisito estructurado. La comparación
 * ignora mayúsculas, tildes, espacios repetidos y viñetas; el texto se conserva tal como se escribió.
 */
export function scopeLinesWithoutRequirement(
  positive: string,
  existing: Pick<StructuredRequirement, 'title'>[],
): string[] {
  const key = (text: string) =>
    text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();
  const seen = new Set(existing.map(r => key(r.title)));
  const lines: string[] = [];
  for (const line of positive.split('\n')) {
    const text = line.trim().replace(/^[-*+]\s+/, '');
    const normalized = key(text);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    lines.push(text);
  }
  return lines;
}
export function hasProjectContent(project?: ProjectDefinition): boolean {
  return (
    !!project &&
    (project.requirements.length > 0 ||
      !!project.diagramFacts?.entityRelations.length ||
      contextKinds.some(kind => project.context[kind].length > 0) ||
      project.mode !== 'nuevo' ||
      !project.implementationRequired)
  );
}
