import { expect, it } from 'vitest';
import { documentHeadings } from '../../src/components/documents/DocumentOutline';
it('extrae encabezados de nivel 1 a 3 fuera de bloques de código y sin marcas', () => {
  const content = [
    '# Especificación — `Reservas`',
    'texto',
    '## Requisitos [funcionales](spec.md)',
    '```md',
    '## No es un encabezado',
    '```',
    '#### Nivel cuatro ignorado',
    '### **Criterios** ##',
    '~~~',
    '# tampoco',
    '~~~',
  ].join('\n');
  expect(documentHeadings(content)).toEqual([
    { level: 1, text: 'Especificación — Reservas' },
    { level: 2, text: 'Requisitos funcionales' },
    { level: 3, text: 'Criterios' },
  ]);
});
