import type { Configuration } from '../domain/models';
import type { DiagramDefinition, DiagramIssue, DiagramKind, DiagramProjection, Cardinality } from '../domain/diagrams';
import { diagramLimits } from '../domain/diagrams';
import type { Coverage } from './coverage';
import type { KitTask } from './taskGraph';
import { createProjectDefinition, createRequirement, type ProjectDefinition } from '../domain/projectDefinition';

export const diagramText = (text: string): string => text.replace(/[&"<>#;:`\\\r\n[\]{}|()]/g, c => c === '\r' || c === '\n' ? ' ' : `#${c.codePointAt(0)};`);
const nodeId = (kind: string, id: string) => `n_${kind}_${id.replace(/[^A-Za-z0-9]/g, c => `_${c.codePointAt(0)!.toString(16)}_`)}`;
const ordered = <T extends { id: string }>(items: T[]): T[] => [...items].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
const issue = (id: string, message: string, sourceIds: string[] = []): DiagramIssue => ({ id, message, sourceIds });
const label = (text: string) => diagramText(text.length > 160 ? `${text.slice(0, 157)}...` : text);
const bytes = (text: string) => new TextEncoder().encode(text).length;
interface Node { id: string; label: string; sourceId?: string }
interface Edge { from: string; to: string; label: string; connector?: string; sourceId?: string; description?: string }
function definition(id: string, kind: DiagramKind, documentIds: string[], title: string, description: string, source: string, sourceIds: string[], issues: DiagramIssue[]): DiagramDefinition {
    return { id, kind, documentIds, title, description, source, sourceIds: [...new Set(sourceIds)].sort(), issues, part: { index: 1, total: 1 } };
}
function flowParts(id: string, kind: DiagramKind, documents: string[], header: string, title: string, nodes: Node[], edges: Edge[], issues: DiagramIssue[]): DiagramDefinition[] {
    const lookup = new Map(nodes.map(n => [n.id, n]));
    const used = new Set<string>();
    const groups: { nodes: Map<string, Node>; edges: Edge[] }[] = [];
    let group = { nodes: new Map<string, Node>(), edges: [] as Edge[] };
    const source = (g: typeof group) => `${header}\n  accTitle: ${diagramText(title)}\n  accDescr: Relaciones declaradas y pendientes del proyecto. Validaciones previstas, no ejecutadas.\n${[...g.nodes.values()].sort((a, b) => a.id.localeCompare(b.id, 'en')).map(n => `  ${n.id}["${label(n.label)}"]`).join('\n')}\n${g.edges.map(e => kind === 'entities' ? `  ${e.from} ${e.connector} ${e.to} : "${label(e.label)}"` : `  ${e.from} -->|"${label(e.label)}"| ${e.to}`).join('\n')}\n`;
    const add = (ns: Node[], e?: Edge) => {
        const candidate = { nodes: new Map(group.nodes), edges: e ? [...group.edges, e] : [...group.edges] };
        ns.forEach(n => candidate.nodes.set(n.id, n));
        if (candidate.nodes.size > (kind === 'architecture' ? 6 : diagramLimits.nodes) || candidate.edges.length > (kind === 'architecture' ? 20 : diagramLimits.edges) || bytes(source(candidate)) > diagramLimits.sourceBytes) {
            if (group.nodes.size) groups.push(group);
            group = { nodes: new Map(ns.map(n => [n.id, n])), edges: e ? [e] : [] };
        } else group = candidate;
        ns.forEach(n => used.add(n.id));
    };
    [...edges].sort((a, b) => `${a.from}|${a.to}|${a.label}` < `${b.from}|${b.to}|${b.label}` ? -1 : `${a.from}|${a.to}|${a.label}` > `${b.from}|${b.to}|${b.label}` ? 1 : 0).forEach(e => add([lookup.get(e.from)!, lookup.get(e.to)!], e));
    nodes.filter(n => !used.has(n.id)).sort((a, b) => a.id.localeCompare(b.id, 'en')).forEach(n => add([n]));
    if (group.nodes.size) groups.push(group);
    return groups.map((g, i) => ({ ...definition(`${id}${groups.length > 1 ? `-parte-${i + 1}` : ''}`, kind, documents, title, `${title}. ${[...g.nodes.values()].map(n => n.label).join('; ')}. ${g.edges.map(e => `${g.nodes.get(e.from)!.label}: ${e.label} hacia ${g.nodes.get(e.to)!.label}${e.description ? ` (${e.description})` : ''}`).join('; ')}. ${issues.map(i => i.message).join(' ')}`, source(g), [...[...g.nodes.values()].flatMap(n => n.sourceId ? [n.sourceId] : []), ...g.edges.flatMap(e => e.sourceId ? [e.sourceId] : [])], issues), part: { index: i + 1, total: groups.length } }));
}
export function projectArchitecture(c: Configuration): DiagramDefinition[] {
    const nodes: Node[] = [], edges: Edge[] = [], issues: DiagramIssue[] = [];
    const components = ordered(c.profile?.components ?? []);
    if (components.length) {
        const technologies = new Map(c.profile!.technologies.map(t => [t.id, t]));
        for (const component of components) {
            const id = nodeId('componente', component.id);
            nodes.push({ id, label: `${component.name} (${component.id})`, sourceId: component.id });
            if (!component.technologyIds.length) issues.push(issue(`tecnologia-${component.id}`, `${component.name}: tecnologías por definir.`, [component.id]));
            for (const tid of [...component.technologyIds].sort()) {
                const t = technologies.get(tid);
                if (!t) { issues.push(issue(`referencia-${component.id}-${tid}`, `${component.name}: tecnología pendiente ${tid}.`, [component.id])); continue; }
                const to = nodeId('tecnologia', tid);
                if (!nodes.some(n => n.id === to)) nodes.push({ id: to, label: `${t.name} (${tid})`, sourceId: tid });
                edges.push({ from: id, to, label: 'Utiliza tecnología' });
            }
            for (const dep of [...component.dependsOn].sort()) {
                if (components.some(n => n.id === dep)) edges.push({ from: id, to: nodeId('componente', dep), label: 'Depende de' });
                else issues.push(issue(`dependencia-${component.id}-${dep}`, `${component.name}: dependencia pendiente ${dep}.`, [component.id]));
            }
        }
        for (const t of ordered(c.profile!.technologies)) if (!nodes.some(n => n.sourceId === t.id)) nodes.push({ id: nodeId('tecnologia', t.id), label: `${t.name} (${t.id}; sin asignar)`, sourceId: t.id });
    } else {
        for (const item of ordered(c.project?.context.components.filter(i => i.status !== 'descartado') ?? [])) {
            nodes.push({ id: nodeId('componente', item.id), label: `${item.id}: ${item.text || 'Componente por definir'}`, sourceId: item.id });
        }
        const ids = new Set(nodes.map(n => n.sourceId));
        for (const item of c.project?.context.components ?? []) for (const dep of [...item.references].sort()) if (ids.has(item.id) && ids.has(dep)) edges.push({ from: nodeId('componente', item.id), to: nodeId('componente', dep), label: 'Depende de' });
        const global = [...new Set(Object.values(c.selections).flat())].sort();
        for (const tid of global) nodes.push({ id: nodeId('global', tid), label: `${tid} (selección global)`, sourceId: tid });
        issues.push(issue('composicion-pendiente', 'Asignación de tecnologías a componentes por definir.'));
    }
    if (!nodes.length) nodes.push({ id: 'n_pendiente_arquitectura', label: 'Arquitectura por definir (pendiente)' });
    return flowParts('arquitectura', 'architecture', ['docs/BASE_ARCHITECTURE.md'], 'flowchart TD', 'Arquitectura del proyecto', nodes, edges, issues);
}
export function diagramsMarkdown(diagrams: DiagramDefinition[]): string {
    return diagrams.map(d => `### ${d.title}${d.part.total > 1 ? ` — Parte ${d.part.index} de ${d.part.total}` : ''}\n\n\`\`\`mermaid\n${d.source}\`\`\`\n\n${d.issues.map(i => `- Pendiente: ${i.message}`).join('\n')}`).join('\n\n');
}
export function projectDiagrams(c: Configuration, coverage?: Coverage, fallback: { id: string; text: string }[] = [], tasks: KitTask[] = []): DiagramProjection {
    const p = c.project ?? createProjectDefinition(c.slug);
    const effective = p.requirements.length ? p : { ...p, requirements: fallback.map(r => ({ ...createRequirement(r.id), title: r.text, behavior: r.text })) };
    const diagrams = [...projectArchitecture(c), ...projectEntities(effective), ...projectSequences(effective, c.name), ...projectTraceability(effective, coverage, tasks)];
    return { schemaVersion: 1, projectId: c.project?.projectId ?? c.slug, revision: c.revision, diagrams, issues: [...new Map(diagrams.flatMap(d => d.issues).map(i => [i.id, i])).values()] };
}

export function projectTraceability(p: ProjectDefinition, coverage?: Coverage, tasks: KitTask[] = []): DiagramDefinition[] {
    const nodes = new Map<string, Node>(), edges: Edge[] = [], issues: DiagramIssue[] = [];
    const add = (kind: string, id: string, text: string, canonical = true) => {
        const nid = nodeId(kind, id); nodes.set(nid, { id: nid, label: text, ...(canonical ? { sourceId: id } : {}) }); return nid;
    };
    for (const r of ordered(p.requirements.filter(r => r.status !== 'descartado'))) {
        const rf = add('requisito', r.id, `${r.id}: ${r.title || 'Requisito por definir'}`);
        const link = coverage?.links.find(l => l.requirementId === r.id);
        const decisions = ordered(p.context.decisions.filter(d => r.decisionIds.includes(d.id) && d.status !== 'descartado'));
        const ds = decisions.map(d => add('decision', d.id, `${d.id}: ${d.text || 'Decisión pendiente'}`));
        if (!ds.length) { ds.push(add('pendiente', `decision-${r.id}`, 'Decisión por definir', false)); issues.push(issue(`decision-${r.id}`, `${r.id}: decisión por vincular.`, [r.id])); }
        ds.forEach(to => edges.push({ from: rf, to, label: decisions.length ? 'Decisión declarada' : 'Pendiente' }));
        const actual = tasks.filter(t => t.rf.split(/[\s,]+/).includes(r.id) && t.id !== link?.validationTaskId && !t.id.startsWith('T-VALIDACION'));
        const ts = actual.map(t => add('tarea', t.id, `${t.id}: ${t.title}`));
        if (!ts.length) { ts.push(add('pendiente', `tarea-${r.id}`, 'Tarea por vincular', false)); issues.push(issue(`tarea-${r.id}`, `${r.id}: tarea por vincular.`, [r.id])); }
        ds.forEach(from => ts.forEach(to => edges.push({ from, to, label: 'Trabajo asociado al requisito' })));
        const validation = tasks.find(t => t.id === link?.validationTaskId);
        const v = validation ? add('validacion', validation.id, `${validation.id}: Validación prevista; no ejecutada`) : add('pendiente', `validacion-${r.id}`, 'Validación prevista por definir; no ejecutada', false);
        ts.forEach(from => edges.push({ from, to: v, label: 'Validación prevista' }));
        if (!validation) issues.push(issue(`validacion-${r.id}`, `${r.id}: tarea de validación por vincular.`, [r.id]));
        if (!r.criteria.length) issues.push(issue(`criterio-${r.id}`, `${r.id}: criterios por definir.`, [r.id]));
        for (const criterion of ordered(r.criteria)) edges.push({ from: v, to: add('criterio', criterion.id, `${criterion.id}: ${criterion.text || 'Criterio pendiente'}; no ejecutado`), label: 'Criterio previsto' });
    }
    if (!nodes.size) { add('pendiente', 'requisitos', 'Requisitos y trazabilidad por definir', false); issues.push(issue('trazabilidad-pendiente', 'Requisitos y trazabilidad por definir.')); }
    return flowParts('trazabilidad', 'traceability', ['tasks'], 'graph LR', 'Trazabilidad del proyecto', [...nodes.values()], edges, issues);
}

export function projectEntities(p: ProjectDefinition): DiagramDefinition[] {
    const entities = ordered(p.context.entities.filter(e => e.status !== 'descartado'));
    const nodes: Node[] = entities.map(e => ({ id: nodeId('entidad', e.id), label: `${e.text || 'Entidad por definir'} (${e.id})`, sourceId: e.id }));
    const edges: Edge[] = [], issues: DiagramIssue[] = [];
    const left: Record<Exclude<Cardinality, ''>, string> = { 'cero-uno': '|o', 'uno': '||', 'cero-muchos': '}o', 'uno-muchos': '}|' };
    const right: Record<Exclude<Cardinality, ''>, string> = { 'cero-uno': 'o|', 'uno': '||', 'cero-muchos': 'o{', 'uno-muchos': '|{' };
    for (const r of ordered(p.diagramFacts?.entityRelations ?? []).filter(r => r.status !== 'descartado')) {
        if (!r.fromCardinality || !r.toCardinality || r.identifying === null || !r.label.trim() || !entities.some(e => e.id === r.fromEntityId) || !entities.some(e => e.id === r.toEntityId)) {
            issues.push(issue(`relacion-${r.id}`, `${r.id}: extremos, cardinalidades o identificación por definir.`, [r.id])); continue;
        }
        edges.push({ from: nodeId('entidad', r.fromEntityId), to: nodeId('entidad', r.toEntityId), label: r.label, sourceId: r.id, description: `Cardinalidad ${r.fromCardinality} a ${r.toCardinality}; relación ${r.identifying ? 'identificadora' : 'no identificadora'}`, connector: `${left[r.fromCardinality]}${r.identifying ? '--' : '..'}${right[r.toCardinality]}` });
    }
    if (!nodes.length) { nodes.push({ id: 'n_entidades_pendientes', label: 'Entidades por definir (marcador pendiente)' }); issues.push(issue('entidades-pendientes', 'Entidades por definir.')); }
    else if (!(p.diagramFacts?.entityRelations.length)) issues.push(issue('relaciones-pendientes', 'Relaciones y cardinalidades por definir o justificar su no aplicabilidad.'));
    return flowParts('entidades', 'entities', ['spec', 'plan'], 'erDiagram', 'Entidades y relaciones declaradas', nodes, edges, issues);
}
export function projectSequences(p: ProjectDefinition, name: string): DiagramDefinition[] {
    return ordered(p.requirements.filter(r => r.status !== 'descartado' && r.kind === 'functional')).map(r => {
        const issues: DiagramIssue[] = [];
        const actor = p.context.actors.find(a => a.id === r.actorId && a.status !== 'descartado');
        if (!actor?.text.trim()) issues.push(issue(`actor-${r.id}`, `${r.id}: actor por definir.`, [r.id]));
        if (!r.behavior.trim()) issues.push(issue(`flujo-${r.id}`, `${r.id}: comportamiento por definir.`, [r.id]));
        if (!r.exceptions.length || r.exceptions.some(e => !e.trim())) issues.push(issue(`excepciones-${r.id}`, `${r.id}: excepciones por definir o justificar.`, [r.id]));
        const title = `${r.id} — ${r.title || 'Requisito por definir'}`;
        const responsible = ordered(p.context.components.filter(item => r.componentIds.includes(item.id) && item.status !== 'descartado')).map(i => `${i.id}: ${i.text}`).join('; ');
        const source = `sequenceDiagram\n  accTitle: ${diagramText(title)}\n  accDescr: Flujo abstracto declarado, alternativas y pendientes.\n  actor A as ${label(actor?.text || 'Actor por definir')}\n  participant P as ${label(name || 'Proyecto')}\n${responsible ? `  Note over P: Componentes responsables ${diagramText(responsible)}\n` : ''}  alt Flujo esperado\n    A->>P: ${diagramText(r.context || 'Solicitud del requisito')}\n    P-->>A: ${diagramText(r.behavior || 'Comportamiento por definir')}\n${(r.exceptions.length ? r.exceptions : ['Excepciones por definir']).map(e => `  else ${diagramText(e || 'Excepción por definir')}\n    P-->>A: ${diagramText(e || 'Rechazo por definir')}`).join('\n')}\n  end\n`;
        if (bytes(source) > diagramLimits.sourceBytes) issues.push(issue(`limite-${r.id}`, `${r.id}: fuente de secuencia excede el límite de render, conservada para revisión.`, [r.id]));
        return definition(`secuencia-${r.id}`, 'sequence', ['spec', 'plan'], title, `Flujo abstracto de ${r.id}: ${r.behavior || 'pendiente'}. ${issues.map(i => i.message).join(' ')}`, source, [r.id, ...r.componentIds, ...(actor ? [actor.id] : [])], issues);
    });
}
