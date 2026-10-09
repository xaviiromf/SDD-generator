import { expect, it } from 'vitest';
import { useEditorStore } from '../../src/store/editorStore';
import { emptyConfiguration } from '../../src/domain/models';
it('edita relaciones en una revisión y rechaza borrar una entidad enlazada', () => {
    useEditorStore.setState({ config: emptyConfiguration(), projectError: '' });
    useEditorStore.getState().addProjectItem('entities'); useEditorStore.getState().addProjectItem('entities');
    useEditorStore.getState().addDiagramRelation();
    const before = useEditorStore.getState().config; const relation = before.project!.diagramFacts!.entityRelations[0];
    useEditorStore.getState().updateDiagramRelation(relation.id, { label: 'contiene', fromCardinality: 'uno' });
    const after = useEditorStore.getState().config; expect(after.revision).toBe(before.revision + 1);
    expect(after.project!.diagramFacts!.entityRelations[0].label).toBe('contiene');
    useEditorStore.getState().removeProjectItem('entities', relation.fromEntityId);
    expect(useEditorStore.getState().config).toBe(after); expect(useEditorStore.getState().projectError).toContain('relación');
    useEditorStore.getState().removeDiagramRelation(relation.id); useEditorStore.getState().removeProjectItem('entities', relation.fromEntityId);
    expect(useEditorStore.getState().config.project!.context.entities).toHaveLength(1);
});
