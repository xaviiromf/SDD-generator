import { it, expect } from 'vitest';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration, documentPaths } from '../../src/domain/models';
import { presets, resolvePreset } from '../../src/catalog/presets';
import { assertTaskGraph } from '../../src/engine/taskGraph';
import { contrastRatio, buttonText } from '../../src/domain/contrast';
import { archetypes } from '../../src/catalog/archetypes';
it('genera seis documentos deterministas para destinos distintos', () => {
    for (const preset of presets) {
        const c = { ...emptyConfiguration(), idea: 'Gestión de reservas', revision: 12, selections: resolvePreset(preset, Object.fromEntries((preset.variants ?? []).map(v => [v.field, v.options[0]]))) };
        const a = compile(c);
        expect(a).toEqual(compile(c));
        expect(a.documents.map(d => d.path)).toEqual([...documentPaths]);
        expect(a.documents.every(d => d.revision === 12)).toBe(true);
        expect(a.documents[5].content).toContain('Detente al terminar');
        expect(a.documents[0].content).toContain('Pendiente');
        expect(a.documents[2].content).toContain('[T6]');
    }
});
it('no confunde árbol de kit y árbol propuesto, ni ejecuta HTML', () => {
    const result = compile({ ...emptyConfiguration(), idea: '<script>alert(1)</script>', selections: presets[2].selections });
    expect(result.targetTree).toContain('Cargo.toml');
    expect(result.documents[0].content).not.toContain('<script>');
    expect(result.documents[1].content).toContain('no archivos de código incluidos');
});
it('transforma cada línea de alcance explícito en un RF y una tarea trazable', () => {
    const result = compile({ ...emptyConfiguration(), positive: 'Crear reservas\nCancelar reservas' });
    expect(result.documents[0].content).toContain('RF-05: Crear reservas');
    expect(result.documents[0].content).toContain('RF-06: Cancelar reservas');
    expect(result.documents[2].content).toContain('[T4] Crear reservas');
    expect(result.documents[2].content).toContain('RF: RF-06');
    expect(result.documents[2].content).toContain('[T8] Validar');
});
it('rechaza ciclos y calcula contraste compuesto sin etiquetas falsas', () => {
    expect(() => assertTaskGraph([{ id: 'T1', title: '', rf: '', depends: ['T1'], files: [], done: '' }])).toThrow('ciclo');
    expect(contrastRatio('#FFFFFF', '#000000')).toBe(21);
    expect(contrastRatio('#FFFFFF', 'rgba(255,255,255,0.04)', '#0A0B12')).toBeGreaterThan(15);
    expect(archetypes).toHaveLength(21);
    expect(archetypes[19].body).toBe('Inter');
    for (const a of archetypes)
        expect(contrastRatio(buttonText(a.accent), a.accent)).toBeGreaterThanOrEqual(4.5);
});
