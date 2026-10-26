import { expect, it } from 'vitest';
import { exampleProject } from '../../src/catalog/exampleProject';
import { compile } from '../../src/engine/compiler';
import { isConfiguration, validateConfiguration } from '../../src/domain/validation';
import { projectValidationErrors } from '../../src/domain/projectValidation';
import { knownIds } from '../../src/catalog/technologies';
it('el proyecto de ejemplo es válido, trazable y exportable', () => {
  const c = exampleProject();
  expect(isConfiguration(c)).toBe(true);
  expect(projectValidationErrors(c.project!)).toEqual([]);
  expect(validateConfiguration(c, knownIds).filter(d => d.blocking)).toEqual([]);
  const result = compile(c);
  expect(result.documents).toHaveLength(7);
  expect(result.diagnostics.filter(d => d.blocking)).toEqual([]);
  expect(result.coverage?.links).toHaveLength(3);
  expect(result.overview?.counts.rf).toBe(3);
});
