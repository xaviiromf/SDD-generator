import { describe, expect, it } from 'vitest';
import { createProjectDefinition } from '../../src/domain/projectDefinition';
import { isProjectDefinition, projectValidationErrors } from '../../src/domain/projectValidation';
import { validLibraryConfiguration } from '../../src/domain/projectLibrary';
import { emptyConfiguration } from '../../src/domain/models';
import type { EntityRelation } from '../../src/domain/diagrams';
function fixture() {
    const project = createProjectDefinition();
    project.context.entities = ['E-1', 'E-2'].map(id => ({ id, text: id, status: 'confirmado' as const, origin: 'user' as const, references: [] }));
    const relation: EntityRelation = { id: 'REL-1', fromEntityId: 'E-1', toEntityId: 'E-2', label: 'contiene', fromCardinality: 'uno', toCardinality: 'cero-muchos', identifying: false, status: 'confirmado' };
    project.diagramFacts = { schemaVersion: 1, entityRelations: [relation] };
    return project;
}
describe('contrato local de diagramas', () => {
    it('conserva modelos antiguos y relaciones opcionales en respaldo', () => {
        expect(isProjectDefinition(createProjectDefinition())).toBe(true);
        const c = emptyConfiguration(); c.project = fixture();
        expect(validLibraryConfiguration(JSON.parse(JSON.stringify(c)))).toBe(true);
    });
    it('permite una relación pendiente sin inventar cardinalidades', () => {
        const p = fixture(); const r = p.diagramFacts!.entityRelations[0];
        r.fromCardinality = ''; r.identifying = null; r.status = 'pendiente';
        expect(isProjectDefinition(p)).toBe(true);
    });
    it('rechaza eliminar entidades enlazadas e IDs duplicados', () => {
        const p = fixture(); p.context.entities.pop();
        expect(projectValidationErrors(p).length).toBeGreaterThan(0);
        const duplicate = fixture(); duplicate.diagramFacts!.entityRelations[0].id = 'E-1';
        expect(isProjectDefinition(duplicate)).toBe(false);
    });
    it('rechaza claves no conocidas, cardinalidades libres y exceso de relaciones', () => {
        const p = fixture(); const r = p.diagramFacts!.entityRelations[0];
        expect(isProjectDefinition({ ...p, diagramFacts: { ...p.diagramFacts, execute: 'valor' } })).toBe(false);
        expect(isProjectDefinition({ ...p, diagramFacts: { schemaVersion: 1, entityRelations: [{ ...r, fromCardinality: 'muchas' }] } })).toBe(false);
        p.diagramFacts!.entityRelations = Array.from({ length: 101 }, (_, i) => ({ ...r, id: `REL-${i}` }));
        expect(isProjectDefinition(p)).toBe(false);
    });
});
