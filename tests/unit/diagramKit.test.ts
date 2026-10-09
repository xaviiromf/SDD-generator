import { expect, it } from 'vitest';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { diagramLimits } from '../../src/domain/diagrams';
it('publica diagramas en cuatro documentos existentes y comparte spec/plan', () => {
    const c = emptyConfiguration(); c.positive = 'Crear reservas';
    const a = compile(c); expect(a.documents).toHaveLength(34); expect(compile(c)).toEqual(a);
    for (const id of ['spec', 'plan', 'tasks', 'docs/BASE_ARCHITECTURE.md']) expect(a.documents.find(d => d.id === id)!.content).toContain('```mermaid');
    const seq = a.diagrams!.diagrams.filter(d => d.kind === 'sequence'); expect(seq.length).toBeGreaterThan(0);
    for (const d of seq) for (const id of ['spec', 'plan']) expect(a.documents.find(x => x.id === id)!.content).toContain(d.source);
});
it('divide trazabilidad grande sin omitir requisitos y mantiene evidencia pendiente', () => {
    const c = emptyConfiguration();
    c.project!.requirements = Array.from({ length: 100 }, (_, i) => ({ ...createRequirement(`RF-${i + 1}`), title: `Requisito ${i + 1}`, behavior: 'Resultado observable' }));
    const result = compile(c); const trace = result.diagrams!.diagrams.filter(d => d.kind === 'traceability');
    expect(trace.length).toBeGreaterThan(1);
    const covered = new Set(trace.flatMap(d => d.sourceIds));
    expect(c.project!.requirements.every(r => covered.has(r.id))).toBe(true);
    expect(trace.every(d => new TextEncoder().encode(d.source).length <= diagramLimits.sourceBytes)).toBe(true);
    expect(trace.every(d => d.source.includes('no ejecutada'))).toBe(true);
    expect(result.documents).toHaveLength(34);
});
it('100 RF y 100 relaciones conservan el kit dentro de un MiB sin perder fuentes', () => {
    const c = emptyConfiguration(); c.name = 'Volumen máximo';
    c.project!.requirements = Array.from({ length: 100 }, (_, i) => ({ ...createRequirement(`RF-${i + 1}`), title: `Requisito ${i + 1}`, behavior: 'Resultado observable', exceptions: ['No disponible', 'Datos inválidos'], criteria: [{ id: `CA-${i + 1}`, text: 'Resultado comprobable' }] }));
    c.project!.context.entities = Array.from({ length: 20 }, (_, i) => ({ id: `E-${i}`, text: `Entidad ${i}`, references: [], origin: 'user', status: 'confirmado' }));
    c.project!.diagramFacts = { schemaVersion: 1, entityRelations: Array.from({ length: 100 }, (_, i) => ({ id: `REL-${i}`, fromEntityId: `E-${i % 20}`, toEntityId: `E-${(i + 1) % 20}`, label: `Relación ${i}`, fromCardinality: 'uno', toCardinality: 'cero-muchos', identifying: false, status: 'confirmado' })) };
    const result = compile(c), size = result.documents.reduce((sum, d) => sum + new TextEncoder().encode(d.content).length, 0);
    expect(result.documents).toHaveLength(34); expect(size).toBeLessThanOrEqual(1024 * 1024);
    expect(result.diagrams!.diagrams.filter(d => d.kind === 'sequence')).toHaveLength(100);
    expect(result.diagrams!.diagrams.filter(d => d.kind === 'entities').flatMap(d => d.sourceIds)).toEqual(expect.arrayContaining(c.project!.diagramFacts.entityRelations.map(r => r.id)));
    console.info('Volumen del kit H1:', JSON.stringify({ bytes: size, requirements: 100, relations: 100, diagrams: result.diagrams!.diagrams.length }));
});
it('conserva RNF en trazabilidad y no genera una secuencia funcional para ellos', () => {
    const c = emptyConfiguration(), functional = createRequirement('RF-1'), quality = createRequirement('RNF-1');
    functional.title = 'Reservar'; quality.kind = 'nonfunctional'; quality.title = 'Conservar disponibilidad';
    c.project!.requirements = [functional, quality];
    const diagrams = compile(c).diagrams!.diagrams;
    expect(diagrams.filter(d => d.kind === 'traceability').flatMap(d => d.sourceIds)).toContain('RNF-1');
    expect(diagrams.filter(d => d.kind === 'sequence').flatMap(d => d.sourceIds)).not.toContain('RNF-1');
});
