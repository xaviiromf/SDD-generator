import { expect, it } from 'vitest';
import { diagramBasename } from '../../src/services/diagramExport';
it('forma nombres locales sin rutas ni símbolos del título', () => {
    expect(diagramBasename('../Arquitectura: Reservas', 7)).toBe('arquitectura-reservas-r7');
    expect(diagramBasename('', -1)).toBe('diagrama-r0');
    expect(diagramBasename('a'.repeat(300), 12).length).toBe(84);
});
