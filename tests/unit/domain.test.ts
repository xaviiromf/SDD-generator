import { describe, it, expect } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import {
  isConfiguration,
  safeDocumentPath,
  validateConfiguration,
  validateText,
} from '../../src/domain/validation';
import { knownIds, technologies } from '../../src/catalog/technologies';
describe('Contratos y catálogo', () => {
  it('acepta un borrador válido y rechaza fronteras inválidas', () => {
    const c = emptyConfiguration();
    expect(isConfiguration(c)).toBe(true);
    expect(validateConfiguration(c, knownIds)).toEqual([]);
    expect(isConfiguration({ ...c, version: 9 })).toBe(false);
    expect(
      validateConfiguration({ ...c, selections: { platform: ['cli', 'web-spa'] } }, knownIds),
    ).toHaveLength(1);
    expect(
      validateConfiguration({ ...c, selections: { platform: ['react'] } }, knownIds),
    ).toHaveLength(1);
    expect(isConfiguration({ ...c, selections: { platform: 7 } })).toBe(false);
    expect(
      validateConfiguration(
        {
          ...c,
          slug: '../otro',
          idea: 'a'.repeat(1024 * 1024),
          selections: { platform: ['desconocido'] },
        },
        knownIds,
      ),
    ).toHaveLength(3);
  });
  it('protege rutas, emojis y secretos sintéticos', () => {
    expect(safeDocumentPath('specs/001-mi-proyecto/spec.md')).toBe(true);
    expect(safeDocumentPath('../spec.md')).toBe(false);
    // Emojis: aviso de estilo, no bloqueo.
    expect(validateText(String.fromCodePoint(0x1f600))).toEqual([
      expect.objectContaining({ kind: 'style', blocking: false }),
    ]);
    expect(validateText('token=' + 'a1'.repeat(13))).toEqual([
      expect.objectContaining({ blocking: true }),
    ]);
  });
  it('el detector de secretos acota el patrón genérico «clave: valor»', () => {
    const blocked = (text: string) => validateText(text).some(d => d.blocking);
    for (const secret of [
      'sk-' + 'A1b2'.repeat(6),
      'ghp_' + 'a1B2'.repeat(6),
      'AKIA' + 'ABCD1234EFGH5678',
      '-----BEGIN PRIVATE KEY-----',
      'api_key: 9f8a7b6c5d4e3f2a1b0c',
      'password="Xk29fLq81mZp03Rt"',
    ])
      expect(blocked(secret), secret).toBe(true);
    for (const text of [
      'token: identificadorinterno',
      'El password = contraseñadelusuario se pide al entrar',
      'secret: configuracion-del-servicio',
      'Token de sesión con caducidad de 30 minutos',
    ])
      expect(blocked(text), text).toBe(false);
  });
  it('tiene al menos 201 opciones distintas y siete fases', () => {
    expect(technologies.length).toBeGreaterThanOrEqual(201);
    expect(knownIds.size).toBe(technologies.length);
    expect(new Set(technologies.map(t => t.phase)).size).toBe(7);
    expect(technologies.filter(t => t.field === 'archetype')).toHaveLength(21);
    for (const id of [
      'esp32',
      'tauri',
      'next',
      'litestar',
      'pglite',
      'mqtt',
      'dry-run',
      'playwright',
      'cloudflare-workers',
    ])
      expect(knownIds.has(id)).toBe(true);
  });
});
