import { describe, it, expect } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { isConfiguration, safeDocumentPath, validateConfiguration, validateText } from '../../src/domain/validation';
import { knownIds, technologies } from '../../src/catalog/technologies';
describe('Contratos y catálogo', () => {
  it('acepta un borrador válido y rechaza fronteras inválidas', () => {
    const c = emptyConfiguration();
    expect(isConfiguration(c)).toBe(true); expect(validateConfiguration(c, knownIds)).toEqual([]);
    expect(isConfiguration({ ...c, version: 9 })).toBe(false);
    expect(isConfiguration({ ...c, selections: { platform: 7 } })).toBe(false);
    expect(validateConfiguration({ ...c, slug: '../otro', idea: 'a'.repeat(20_001), selections: { platform: ['desconocido'] } }, knownIds)).toHaveLength(3);
  });
  it('protege rutas, emojis y secretos sintéticos', () => {
    expect(safeDocumentPath('specs/spec.md')).toBe(true); expect(safeDocumentPath('../spec.md')).toBe(false);
    expect(validateText(String.fromCodePoint(0x1f600))).toHaveLength(1);
    expect(validateText('token=' + 'a'.repeat(25))).toHaveLength(1);
  });
  it('tiene al menos 201 opciones distintas y siete fases', () => {
    expect(technologies.length).toBeGreaterThanOrEqual(201); expect(knownIds.size).toBe(technologies.length);
    expect(new Set(technologies.map(t => t.phase)).size).toBe(7);
    expect(technologies.filter(t => t.field === 'archetype')).toHaveLength(21);
    for (const id of ['esp32','tauri','next','litestar','pglite','mqtt','dry-run','playwright','cloudflare-workers']) expect(knownIds.has(id)).toBe(true);
  });
});
