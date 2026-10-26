import { it, expect } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { evaluateCheckpoints, readyForReview } from '../../src/engine/checkpoints';
import { compile } from '../../src/engine/compiler';
import { useEditorStore } from '../../src/store/editorStore';
const find = (c: ReturnType<typeof emptyConfiguration>, id: string) =>
  evaluateCheckpoints(c, [], [])!.find(cp => cp.id === id)!;
it('un proyecto vacío no supera P1 ni P2, y P5 y P6 nunca se superan en el estudio', () => {
  const result = compile(emptyConfiguration()).checkpoints!;
  expect(result.map(cp => cp.id)).toEqual(['P1', 'P2', 'P3', 'P4', 'P5', 'P6']);
  expect(result.find(cp => cp.id === 'P1')!.met).toBe(false);
  expect(result.find(cp => cp.id === 'P2')!.met).toBe(false);
  for (const id of ['P5', 'P6']) {
    const cp = result.find(c => c.id === id)!;
    expect(cp.place).toBe('repositorio');
    expect(cp.met).toBe(false);
  }
  expect(readyForReview(result)).toBe(false);
});
it('P1 exige alcance y exclusiones; «Sin exclusiones» necesita motivo', () => {
  const c = emptyConfiguration();
  Object.assign(c, { name: 'Reservas', slug: 'reservas', idea: 'Gestionar reservas' });
  c.positive = 'Crear reservas';
  c.negative = 'Sin exclusiones';
  expect(find(c, 'P1').missing).toEqual(['«Sin exclusiones» necesita un motivo.']);
  c.negative = 'Sin exclusiones: el alcance es una sola pantalla';
  expect(find(c, 'P1').met).toBe(true);
  c.negative = 'No incluir pagos';
  expect(find(c, 'P1').met).toBe(true);
});
it('P2 solo cuenta requisitos confirmados con título, comportamiento y criterio', () => {
  const c = emptyConfiguration();
  const r = createRequirement('RF-1');
  c.project!.requirements = [r];
  expect(find(c, 'P2').missing).toEqual(['Al menos un requisito confirmado.']);
  Object.assign(r, { status: 'confirmado', title: 'Crear reserva', behavior: '' });
  expect(find(c, 'P2').missing).toEqual(['RF-1: comportamiento.', 'RF-1: un criterio observable.']);
  Object.assign(r, {
    behavior: 'Registra la reserva',
    criteria: [{ id: 'CA-1', text: 'Aparece' }],
  });
  expect(find(c, 'P2').met).toBe(true);
});
it('P3 pide aceptar las elecciones de conjunto o inferencia, y aceptar las vuelve manuales', () => {
  const c = emptyConfiguration();
  c.selections = { language: ['typescript'], testing: ['vitest'] };
  c.origins = { language: 'preset', testing: 'inference' };
  expect(find(c, 'P3').missing).toEqual([
    expect.stringContaining('viene de un conjunto'),
    expect.stringContaining('viene de una inferencia'),
  ]);
  useEditorStore.getState().restore(c);
  useEditorStore.getState().acceptSelection('language');
  expect(useEditorStore.getState().config.origins.language).toBe('manual');
  expect(find(useEditorStore.getState().config, 'P3').missing).toEqual([
    expect.stringContaining('viene de una inferencia'),
  ]);
});
it('P4 refleja los diagnósticos bloqueantes del kit', () => {
  const c = emptyConfiguration();
  expect(
    evaluateCheckpoints(c, [{ message: 'Bloqueo', blocking: true }], []).find(cp => cp.id === 'P4')!
      .missing,
  ).toEqual(['Bloqueo']);
});
