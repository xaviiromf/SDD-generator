import { it, expect } from 'vitest';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
import { createKitManifest } from '../../src/engine/kitManifest';
import { presets, resolvePreset } from '../../src/catalog/presets';
import { assertTaskGraph } from '../../src/engine/taskGraph';
import { contrastRatio, buttonText } from '../../src/domain/contrast';
import { archetypes } from '../../src/catalog/archetypes';
it('genera los siete documentos deterministas para destinos distintos', () => {
  for (const preset of presets) {
    const c = {
      ...emptyConfiguration(),
      idea: 'Gestión de reservas',
      revision: 12,
      selections: resolvePreset(
        preset,
        Object.fromEntries((preset.variants ?? []).map(v => [v.field, v.options[0]])),
      ),
    };
    const a = compile(c);
    expect(a).toEqual(compile(c));
    expect(a.documents.map(d => d.path)).toEqual(createKitManifest(c).map(d => d.path));
    expect(a.documents.every(d => d.revision === 12)).toBe(true);
    expect(a.documents.find(d => d.id === 'AGENTS.md')!.content).toContain(
      'Nunca escribas ni modifiques',
    );
    expect(a.documents.find(d => d.id === 'spec')!.content).toContain('Pendiente');
    expect(a.documents.find(d => d.id === 'tasks')!.content).toContain('Sin tareas');
  }
});
it('no confunde árbol de kit y árbol propuesto, ni ejecuta HTML', () => {
  const result = compile({
    ...emptyConfiguration(),
    idea: '<script>alert(1)</script>',
    selections: presets[2].selections,
  });
  expect(result.targetTree).toContain('Cargo.toml');
  expect(result.documents.find(d => d.id === 'spec')!.content).not.toContain('<script>');
  expect(result.documents.find(d => d.id === 'plan')!.content).toContain(
    'Propuesta del generador (no verificada)',
  );
});
it('el alcance libre no genera requisitos en el kit: solo los requisitos estructurados', () => {
  const result = compile({
    ...emptyConfiguration(),
    positive: 'Crear reservas\nCancelar reservas',
  });
  const spec = result.documents.find(d => d.id === 'spec')!.content;
  expect(spec).toContain('Crear reservas');
  expect(spec).not.toMatch(/RF-001-0\d/);
  expect(result.documents.find(d => d.id === 'tasks')!.content).toContain('Sin tareas');
});
it('rechaza ciclos y calcula contraste compuesto sin etiquetas falsas', () => {
  expect(() =>
    assertTaskGraph([{ id: 'T1', title: '', rf: '', depends: ['T1'], files: [], done: '' }]),
  ).toThrow('ciclo');
  expect(contrastRatio('#FFFFFF', '#000000')).toBe(21);
  expect(contrastRatio('#FFFFFF', 'rgba(255,255,255,0.04)', '#0A0B12')).toBeGreaterThan(15);
  expect(archetypes).toHaveLength(21);
  expect(archetypes[19].body).toBe('Inter');
  for (const a of archetypes)
    expect(contrastRatio(buttonText(a.accent), a.accent)).toBeGreaterThanOrEqual(4.5);
});
