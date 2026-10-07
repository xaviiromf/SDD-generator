import { describe, it, expect } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { compatibilityDiagnostics, effectiveConfiguration, optionCompatible } from '../../src/domain/compatibility';
import { technologyById } from '../../src/catalog/technologies';
import { presets, resolvePreset } from '../../src/catalog/presets';
import { calculateMaturity } from '../../src/domain/maturity';
import { useEditorStore } from '../../src/store/editorStore';
describe('Decisiones arquitectónicas', () => {
    it('excluye estilo de CLI y diagnostica combinaciones incompatibles', () => {
        const c = { ...emptyConfiguration(), selections: { platform: ['cli'], styling: ['tailwind'], archetype: ['a04'], language: ['rust'], backend: ['fastapi'] } };
        expect(effectiveConfiguration(c).selections.archetype).toEqual([]);
        expect(optionCompatible(technologyById.get('tailwind')!, c)).toBe(false);
        expect(compatibilityDiagnostics(c).some(d => d.field === 'backend')).toBe(true);
    });
    it('ofrece ocho conjuntos coherentes y variantes obligatorias', () => {
        expect(presets).toHaveLength(8);
        for (const preset of presets) {
            const choices = Object.fromEntries((preset.variants ?? []).map(v => [v.field, v.options[0]]));
            expect(compatibilityDiagnostics({ ...emptyConfiguration(), selections: resolvePreset(preset, choices) })).toEqual([]);
        }
        expect(() => resolvePreset(presets[4], {})).toThrow('Elige');
    });
    it('calcula seis pilares y disminuye ante conflictos', () => {
        const c = { ...emptyConfiguration(), selections: { ...presets[1].selections, archetype: ['a04'] } };
        expect(calculateMaturity(c).score).toBe(100);
        expect(calculateMaturity({ ...c, selections: { ...c.selections, storage: ['postgres'] } }).score).toBeLessThan(100);
    });
    it('preserva decisiones manuales y aplica conjuntos atómicamente', () => {
        const store = useEditorStore.getState();
        store.restore(emptyConfiguration());
        store.setText('idea', 'Reservas');
        store.select('language', 'rust');
        store.applyInferences([{ field: 'language', id: 'python', explanation: 'Python' }]);
        expect(useEditorStore.getState().config.selections.language).toEqual(['rust']);
        store.select('archetype','a04');
        store.applyPreset(presets[1].selections);
        store.applyInferences([{field:'archetype',id:'a01',explanation:'Arquetipo'}]);
        expect(useEditorStore.getState().config.selections.archetype).toEqual(['a04']);
        expect(useEditorStore.getState().config.idea).toBe('Reservas');
    });
});
