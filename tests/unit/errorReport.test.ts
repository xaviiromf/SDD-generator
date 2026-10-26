import { expect, it } from 'vitest';
import { errorReport } from '../../src/services/errorReport';
import { exampleProject } from '../../src/catalog/exampleProject';
it('el informe de error describe el estado sin incluir textos del usuario', () => {
  const c = {
    ...exampleProject(),
    idea: 'Idea confidencial del cliente',
    name: 'Proyecto privado',
  };
  const report = errorReport('Motor de generación', 'El motor se detuvo.', c);
  expect(report).toContain('Área: Motor de generación');
  expect(report).toContain('Mensaje: El motor se detuvo.');
  expect(report).toContain(`Revisión: ${c.revision}`);
  expect(report).toContain('Requisitos: 3');
  expect(report).toMatch(/SDD-Studio \d+\.\d+\.\d+/);
  for (const secret of [c.idea, c.name, c.positive, 'Recepción del taller'])
    expect(report).not.toContain(secret);
});
