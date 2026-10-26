import { it, expect } from 'vitest';
import { technologies, technologyById } from '../../src/catalog/technologies';
import { isVisibleTechnology, presets, visibleTechnologyIds } from '../../src/catalog/presets';
it('el catálogo visible contiene los conjuntos, sus variantes y lo que requieren', () => {
  for (const preset of presets) {
    for (const ids of Object.values(preset.selections))
      for (const id of ids ?? []) expect(visibleTechnologyIds.has(id), id).toBe(true);
    for (const variant of preset.variants ?? [])
      for (const id of variant.options) expect(visibleTechnologyIds.has(id), id).toBe(true);
  }
  for (const id of visibleTechnologyIds)
    for (const required of Object.values(technologyById.get(id)!.requires ?? {}))
      for (const r of required ?? [])
        expect(visibleTechnologyIds.has(r), `${id} requiere ${r}`).toBe(true);
  expect(visibleTechnologyIds.size).toBeLessThan(technologies.length);
});
it('una opción oculta solo aparece si ya está elegida; los arquetipos siempre', () => {
  const hidden = technologies.find(
    t => t.field !== 'archetype' && !visibleTechnologyIds.has(t.id),
  )!;
  expect(isVisibleTechnology(hidden)).toBe(false);
  expect(isVisibleTechnology(hidden, [hidden.id])).toBe(true);
  expect(technologies.filter(t => t.field === 'archetype').every(t => isVisibleTechnology(t))).toBe(
    true,
  );
});
