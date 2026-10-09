import { expect, it } from 'vitest';
import { createProjectDefinition, createRequirement } from '../../src/domain/projectDefinition';
import { projectEntities, projectSequences } from '../../src/engine/diagramProjection';
it('no inventa relaciones y proyecta las cardinalidades expresas', () => {
    const p = createProjectDefinition();
    expect(projectEntities(p)[0].source).toContain('Entidades por definir');
    p.context.entities = ['E-1', 'E-2'].map(id => ({ id, text: id, status: 'confirmado' as const, origin: 'user' as const, references: [] }));
    expect(projectEntities(p)[0].source).not.toContain('||');
    p.diagramFacts = { schemaVersion: 1, entityRelations: [{ id: 'REL-1', fromEntityId: 'E-1', toEntityId: 'E-2', label: 'contiene', fromCardinality: 'uno', toCardinality: 'cero-muchos', identifying: false, status: 'confirmado' }] };
    expect(projectEntities(p)[0].source).toContain('||..o{');
    p.diagramFacts.entityRelations[0].identifying = null;
    expect(projectEntities(p)[0].source).not.toContain('||'); expect(projectEntities(p)[0].issues[0].sourceIds).toEqual(['REL-1']);
});
it('proyecta una secuencia abstracta por RF con alternativas y sin RNF', () => {
    const p = createProjectDefinition(); const rf = createRequirement('RF-1');
    rf.title = 'Reservar'; rf.context = 'Solicitud'; rf.behavior = 'Reserva registrada'; rf.exceptions = ['Sin cupo', 'Datos inválidos'];
    const nf = createRequirement('RNF-1'); nf.kind = 'nonfunctional'; p.requirements = [rf, nf];
    const sources = projectSequences(p, 'Reservas'); expect(sources).toHaveLength(1);
    expect(sources[0].source).toContain('alt Flujo esperado'); expect(sources[0].source).toContain('else Sin cupo'); expect(sources[0].source).toContain('else Datos inválidos');
    rf.exceptions = []; expect(projectSequences(p, 'Reservas')[0].source).toContain('Excepciones por definir');
});
