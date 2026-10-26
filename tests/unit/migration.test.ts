import { it, expect } from 'vitest';
import { emptyConfiguration, type Configuration } from '../../src/domain/models';
import { migrateConfiguration } from '../../src/domain/migration';
import { createRequirement } from '../../src/domain/projectDefinition';
import { readDraft } from '../../src/services/draftStorage';
const old = (): Configuration => {
  const c = emptyConfiguration();
  delete c.modelVersion;
  c.positive = '- Crear reservas\nConsultar la agenda del día\n\n- Crear reservas';
  return c;
};
it('convierte el alcance de un borrador sin modelo en requisitos pendientes con texto literal', () => {
  const { config, converted } = migrateConfiguration(old());
  expect(converted).toBe(2);
  expect(config.modelVersion).toBe(2);
  expect(config.positive).toBe(old().positive);
  expect(config.project!.requirements.map(r => [r.title, r.status])).toEqual([
    ['Crear reservas', 'pendiente'],
    ['Consultar la agenda del día', 'pendiente'],
  ]);
  expect(migrateConfiguration(config)).toEqual({ config, converted: 0 });
});
it('no toca borradores con modelo estructurado, perfiles ni aportaciones', () => {
  const c = old();
  c.project!.requirements = [{ ...createRequirement('RF-1'), title: 'Ya estructurado' }];
  c.manualSections = [];
  const { config, converted } = migrateConfiguration(c);
  expect(converted).toBe(0);
  expect(config).toEqual({ ...c, modelVersion: 2 });
});
it('la lectura del borrador aplica la migración y lo avisa', () => {
  const storage = { getItem: () => JSON.stringify(old()) };
  const draft = readDraft(storage);
  expect(draft.config?.project?.requirements).toHaveLength(2);
  expect(draft.message).toContain('2 líneas del alcance son ahora requisitos pendientes');
});
