import { contextKinds, type ContextKind } from '../domain/projectDefinition';
import type { Configuration, GeneratedDocument } from '../domain/models';
import type { DiagramProjection } from '../domain/diagrams';
import type { Readiness } from '../domain/readiness';
import type { DocumentPending, DocumentStatus, ProjectOverview } from '../domain/projectOverview';
import { technologyById } from '../catalog/technologies';
type Group = 'guide' | 'project' | 'technical' | 'architecture' | 'observations' | 'decisions' | 'trace' | 'specification' | 'status' | 'evidence';
/** Las identidades de proyecto son estables aunque cambie su carpeta por slug. */
export const documentApplicability: Record<string, Group> = {
    'README.md': 'project', 'AGENTS.md': 'guide', constitution: 'guide',
    'TECHNICAL_CONTEXT.md': 'technical', 'SDD_MANUAL.md': 'guide', 'MANUAL-PARA-USUARIO.txt': 'guide', PROJECT: 'project',
    'docs/BASE_ARCHITECTURE.md': 'architecture', 'docs/BASE_OBSERVATIONS.md': 'observations', 'docs/DECISIONS.md': 'decisions',
    'docs/ENVIRONMENT_AND_VERIFICATION.md': 'evidence', 'docs/PROJECT_STATUS.md': 'status', 'docs/ROADMAP.md': 'trace',
    'docs/TRACEABILITY.md': 'trace', 'docs/SDD_VALIDATION.md': 'evidence', 'docs/VERIFICATION.md': 'evidence',
    'prompts/README.md': 'guide', orchestrator: 'guide', 'prompts/01-specify.md': 'guide', 'prompts/02-plan.md': 'guide',
    'prompts/03-tasks.md': 'guide', 'prompts/04-implement.md': 'guide', 'prompts/05-validate.md': 'guide',
    'prompts/06-changes.md': 'guide', 'prompts/07-resume-pause.md': 'guide', 'specs/README.md': 'guide',
    'specs/_templates/spec.md': 'guide', 'specs/_templates/plan.md': 'guide', 'specs/_templates/tasks.md': 'guide',
    'specs/_templates/validation.md': 'guide', spec: 'specification', plan: 'specification', tasks: 'trace', validation: 'evidence',
};
const applicability: Record<Group, string> = {
    guide: 'Guía o plantilla reutilizable; los campos del proyecto objetivo no aplican a su estructura.',
    project: 'Ficha y requisitos declarados del proyecto.', technical: 'Configuración y contratos aplicables al modo del proyecto.',
    architecture: 'Componentes, tecnologías y relaciones declaradas.', observations: 'Preguntas y supuestos de contexto.',
    decisions: 'Decisiones declaradas.', trace: 'Requisitos y enlaces de trabajo y validación previstos.',
    specification: 'Preparación y diagramas del alcance declarado.', status: 'Preparación y autorización del proyecto objetivo.',
    evidence: 'Evidencia del proyecto objetivo; generar este documento no ejecuta sus verificaciones.',
};
export function deriveDocumentStatuses(c: Configuration, documents: GeneratedDocument[], readiness: Readiness, diagrams: DiagramProjection): DocumentStatus[] {
    const p = c.project, active = p?.requirements.filter(r => r.status !== 'descartado') ?? [];
    return documents.map(document => {
        const group = documentApplicability[document.id];
        const reasons = new Map<string, DocumentPending>();
        const add = (id: string, message: string) => reasons.set(id, { id, message });
        const context = (kind: ContextKind) => {
            for (const item of p?.context[kind].filter(i => i.status !== 'descartado') ?? [])
                if (!item.text.trim() || item.status !== 'confirmado' || kind === 'questions') add(`contexto-${item.id}`, `${item.id}: ${kind === 'questions' ? 'pregunta por resolver' : 'declaración pendiente de completar o confirmar'}.`);
        };
        if (!group) add('aplicabilidad-pendiente', 'La aplicabilidad de este documento está por definir.');
        if (group === 'project') {
            if (!c.name.trim()) add('nombre-pendiente', 'Nombre del proyecto por definir.');
            if (!c.idea.trim()) add('descripcion-pendiente', 'Descripción del proyecto por definir.');
            if (!active.length) add('requisitos-ausentes', 'Requisitos canónicos por declarar.');
        }
        if (['project', 'specification', 'status'].includes(group)) for (const issue of readiness.issues) add(issue.id, `${issue.source}: ${issue.message}`);
        if (group === 'specification') {
            for (const kind of contextKinds) context(kind);
            for (const relation of p?.diagramFacts?.entityRelations.filter(r => r.status !== 'descartado' && r.status !== 'confirmado') ?? []) add(`confirmacion-${relation.id}`, `${relation.id}: relación por confirmar.`);
        }
        if (['technical', 'architecture'].includes(group)) {
            for (const issue of readiness.issues.filter(i => i.source === 'Configuración' || i.source === 'Perfiles y componentes' || i.source === 'Datos' || i.source === 'Referencias')) add(issue.id, issue.message);
            context('components'); if (group === 'technical') context('contracts');
        }
        if (group === 'observations') { context('questions'); context('assumptions'); }
        if (group === 'decisions') {
            context('decisions');
            if (!p?.context.decisions.some(i => i.status !== 'descartado')) add('decisiones-ausentes', 'Decisiones del proyecto por declarar.');
        }
        if (group === 'trace') {
            if (!active.length) add('requisitos-ausentes', 'Requisitos canónicos por declarar.');
            for (const r of active) {
                if (!r.criteria.length || r.criteria.some(cr => !cr.text.trim())) add(`criterios-${r.id}`, `${r.id}: criterios observables por completar.`);
                if (!r.decisionIds.length) add(`decision-${r.id}`, `${r.id}: decisión por vincular.`);
                if (r.status !== 'confirmado') add(`confirmacion-${r.id}`, `${r.id}: requisito por confirmar.`);
            }
            context('decisions');
        }
        if (group === 'status') add('autorizacion-pendiente', 'Revisión semántica y autorización del proyecto objetivo pendientes.');
        if (group === 'evidence') add(`evidencia-${document.id}`, 'Verificaciones previstas: no ejecutadas; falta registrar evidencia del proyecto objetivo.');
        for (const diagram of diagrams.diagrams.filter(d => d.documentIds.includes(document.id))) for (const issue of diagram.issues) add(issue.id, issue.message);
        const list = [...reasons.values()].sort((a, b) => a.id.localeCompare(b.id));
        return { documentId: document.id, revision: c.revision, state: list.length ? 'borrador' : 'completo', pendingCount: list.length, reasons: list, applicability: group ? applicability[group] : 'Aplicabilidad pendiente.' };
    });
}
export function deriveProjectOverview(c: Configuration, readiness: Readiness, diagrams: DiagramProjection, statuses: DocumentStatus[]): ProjectOverview {
    const p = c.project, requirements = p?.requirements.filter(r => r.status !== 'descartado') ?? [];
    const discarded = new Set(p?.context.components.filter(i => i.status === 'descartado').map(i => i.id));
    const components = new Set([...(p?.context.components.filter(i => i.status !== 'descartado').map(i => i.id) ?? []), ...(c.profile?.components.map(i => i.id) ?? [])].filter(id => !discarded.has(id)));
    const technologies = new Map<string, { id: string; name: string }>();
    for (const id of Object.values(c.selections).flat()) { const item = technologyById.get(id); if (item) technologies.set(id, { id, name: item.label }); }
    for (const item of c.profile?.technologies ?? []) technologies.set(item.id, { id: item.id, name: item.name });
    const architectureDiagramIds = diagrams.diagrams.filter(d => d.kind === 'architecture').map(d => d.id);
    const pending = new Set([...readiness.issues.map(i => i.id), ...statuses.flatMap(s => s.reasons.map(r => r.id))]);
    return {
        projectId: p?.projectId ?? c.slug, revision: c.revision, name: c.name, description: c.idea, mode: p?.mode ?? 'nuevo',
        profiles: c.profile?.profiles.map(i => ({ id: i.id, name: i.name })) ?? [], technologies: [...technologies.values()],
        counts: { rf: requirements.filter(r => r.kind === 'functional').length, rnf: requirements.filter(r => r.kind === 'nonfunctional').length,
            components: components.size, entities: p?.context.entities.filter(i => i.status !== 'descartado').length ?? 0, technologies: technologies.size,
            pending: pending.size, documentDrafts: statuses.filter(s => s.state === 'borrador').length, documentComplete: statuses.filter(s => s.state === 'completo').length },
        readiness, architectureDiagramId: architectureDiagramIds[0], architectureDiagramIds,
        navigationTargets: [{ id: 'idea', label: 'Editar idea y requisitos', panel: 'idea' }, { id: 'configuration', label: 'Configurar perfiles y componentes', panel: 'configuration' },
            { id: 'architecture', label: 'Abrir arquitectura', documentId: 'docs/BASE_ARCHITECTURE.md' }, { id: 'specification', label: 'Abrir especificación', documentId: 'spec' },
            { id: 'tasks', label: 'Abrir tareas', documentId: 'tasks' }, { id: 'validation', label: 'Abrir validación prevista', documentId: 'validation' }],
    };
}
