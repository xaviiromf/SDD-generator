import { describe, expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { compile } from '../../src/engine/compiler';
import { documentApplicability } from '../../src/engine/documentStatus';
describe('portada y estados documentales públicos', () => {
    it('clasifica exactamente 34 rutas, plantillas aplicables y evidencia pendiente', () => {
        const result = compile(emptyConfiguration());
        expect(result.documentStatuses).toHaveLength(34);
        expect(Object.keys(documentApplicability)).toHaveLength(34);
        expect(result.documents.every(d => documentApplicability[d.id])).toBe(true);
        expect(result.documentStatuses?.find(d => d.documentId === 'specs/_templates/validation.md')?.state).toBe('completo');
        for (const id of ['validation', 'docs/VERIFICATION.md', 'docs/SDD_VALIDATION.md', 'docs/ENVIRONMENT_AND_VERIFICATION.md']) expect(result.documentStatuses?.find(d => d.documentId === id)?.reasons[0].message).toContain('no ejecutadas');
        expect(result.overview?.counts.rf).toBe(0);
        expect((result.overview?.counts.documentComplete ?? 0) + (result.overview?.counts.documentDrafts ?? 0)).toBe(34);
    });
    it('cuenta declaraciones activas sin marcadores, distingue RF/RNF y conserva revisión', () => {
        const c = emptyConfiguration(); c.revision = 9;
        c.project!.requirements = [{ ...createRequirement('RF-1'), kind: 'functional' }, { ...createRequirement('RNF-2'), kind: 'nonfunctional' }, { ...createRequirement('RF-3'), status: 'descartado' }];
        c.project!.context.entities = [{ id: 'ENT-1', text: 'Reserva', status: 'confirmado', origin: 'user', references: [] }];
        const result = compile(c);
        expect(result.overview?.counts).toMatchObject({ rf: 1, rnf: 1, components: 0, entities: 1 });
        expect(result.overview?.revision).toBe(9);
        expect(result.documentStatuses?.every(d => d.revision === 9 && d.pendingCount === new Set(d.reasons.map(r => r.id)).size)).toBe(true);
        expect(result.overview?.architectureDiagramIds).toEqual(result.diagrams?.diagrams.filter(d => d.kind === 'architecture').map(d => d.id));
    });
    it('modo documental explica no aplicabilidad sin certificar validación', () => {
        const c = emptyConfiguration(); c.project!.mode = 'documentacion'; c.project!.implementationRequired = false;
        const result = compile(c);
        expect(result.overview?.readiness.configuration.applicable).toBe(0);
        expect(result.documentStatuses?.find(d => d.documentId === 'validation')?.state).toBe('borrador');
        expect(result.documentStatuses?.find(d => d.documentId === 'AGENTS.md')?.state).toBe('completo');
    });
});

it('revisión pendiente, conflicto y error fuerzan borrador sin mutar el estado confirmado', async () => {
    const { presentDocumentStatus } = await import('../../src/store/documentStore');
    const base = compile(emptyConfiguration()).documentStatuses!.find(s => s.documentId === 'AGENTS.md')!;
    const pending = presentDocumentStatus(base, { revision: base.revision + 1, pending: true, conflict: true, error: 'Error local recuperable.' });
    expect(pending.state).toBe('borrador'); expect(pending.pendingCount).toBe(3);
    expect(pending.reasons.map(r => r.id)).toEqual(['revision-pendiente', 'conflicto-manual', 'generacion-error']); expect(base.state).toBe('completo');
});


it('ficha y especificación conservan pendientes aplicables de pila, contexto y relaciones', async () => {
    const { visualProject } = await import('../fixtures/visualProject');
    const c = visualProject(); c.project!.context.entities[0].status = 'propuesto'; c.project!.diagramFacts!.entityRelations[0].status = 'pendiente';
    const result = compile(c);
    expect(result.documentStatuses!.find(s => s.documentId === 'README.md')?.state).toBe('borrador');
    expect(result.documentStatuses!.find(s => s.documentId === 'spec')?.reasons.map(r => r.id)).toEqual(expect.arrayContaining(['contexto-E-1', 'confirmacion-REL-1']));
    expect(result.documentStatuses!.find(s => s.documentId === 'specs/_templates/spec.md')?.state).toBe('completo');
});
