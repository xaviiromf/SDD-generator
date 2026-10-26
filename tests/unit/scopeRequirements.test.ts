import { beforeEach, describe, expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { scopeLinesWithoutRequirement } from '../../src/domain/projectDefinition';
import { useEditorStore } from '../../src/store/editorStore';
import { compile } from '../../src/engine/compiler';
describe('requisitos rápidos desde el alcance', () => {
  beforeEach(() => useEditorStore.getState().restore(emptyConfiguration()));
  it('omite vacías, viñetas, duplicados y títulos existentes sin alterar el texto', () => {
    expect(
      scopeLinesWithoutRequirement(
        '- Crear reservas\n\n  Cancelar  reservas\ncrear RESERVAS\n* Ver agenda',
        [{ title: 'Ver  Agénda' }],
      ),
    ).toEqual(['Crear reservas', 'Cancelar  reservas']);
  });
  it('crea requisitos pendientes una sola vez y el kit no repite las líneas como RF libres', () => {
    const store = useEditorStore.getState();
    store.setText('positive', 'Crear reservas\nCancelar reservas');
    expect(useEditorStore.getState().addRequirementsFromScope()).toBe(2);
    expect(useEditorStore.getState().addRequirementsFromScope()).toBe(0);
    const requirements = useEditorStore.getState().config.project!.requirements;
    expect(requirements.map(r => [r.title, r.status, r.origin])).toEqual([
      ['Crear reservas', 'pendiente', 'user'],
      ['Cancelar reservas', 'pendiente', 'user'],
    ]);
    const spec = compile(useEditorStore.getState().config).documents.find(d => d.id === 'spec')!;
    expect(spec.content.match(/Crear reservas/g)?.length).toBeGreaterThan(0);
    expect(spec.content).not.toContain('RF-001-05');
  });
  it('convierte todas las líneas del alcance, sin tope de cantidad', () => {
    const store = useEditorStore.getState();
    store.setText('positive', Array.from({ length: 120 }, (_, i) => `Necesidad ${i}`).join('\n'));
    expect(useEditorStore.getState().addRequirementsFromScope()).toBe(120);
    expect(useEditorStore.getState().config.project!.requirements).toHaveLength(120);
  });
});
