import { describe, expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { hasDesignOverrides, isDesignOverrides, resolveDesign } from '../../src/domain/design';
import { contrastRatio } from '../../src/domain/contrast';
describe('contratos de diseño', () => {
    it('mantiene el estado pendiente y resuelve base, valores neutros y ajustes en orden', () => {
        const c = emptyConfiguration();
        expect(resolveDesign(c)).toBeUndefined();
        c.designOverrides = { colors: { text: '#12345678' } };
        expect(resolveDesign(c)?.typography.bodyFont).toBe('Inter');
        c.selections.archetype = ['a10'];
        expect(resolveDesign(c)?.baseTexture).toContain('24');
        expect(resolveDesign(c)?.buttons.radius).toBe(16);
        expect(resolveDesign(c)?.colors.text).toBe('#12345678');
        c.designOverrides.finish = { texture: 'paper' };
        expect(resolveDesign(c)?.baseTexture).toBeUndefined();
    });
    it('rechaza valores y claves desconocidas, fuentes no locales y falsas monoespaciadas', () => {
        expect(isDesignOverrides({ typography: { monoFont: 'Inter' } })).toBe(false);
        expect(isDesignOverrides({ colors: { text: 'url(https://otro.test)' } })).toBe(false);
        expect(isDesignOverrides({ buttons: { radius: 8 } })).toBe(false);
        expect(isDesignOverrides({ muted: {} })).toBe(false);
        expect(isDesignOverrides({ colors: { secondaryAccent: '' }, icons: { size: 24 } })).toBe(true);
        expect(hasDesignOverrides({ colors: {} })).toBe(false);
    });
    it('compone transparencia sin redondear el contraste', () => {
        expect(contrastRatio('#00000080', '#FFFFFF')).toBeLessThan(4.5);
        expect(contrastRatio('#000000', '#FFFFFF')).toBe(21);
    });
});

import { useEditorStore } from '../../src/store/editorStore';
it('acciones atómicas conservan ajustes al seleccionar, desactivar y aplicar conjuntos', () => {
    useEditorStore.getState().restore(emptyConfiguration());
    const before = useEditorStore.getState().config.revision;
    useEditorStore.getState().setDesignOverride('colors', 'text', 'incorrecto');
    expect(useEditorStore.getState().config.revision).toBe(before);
    useEditorStore.getState().setDesignOverride('colors', 'text', '#123456');
    useEditorStore.getState().selectArchetype('a01', true);
    useEditorStore.getState().detachArchetype();
    useEditorStore.getState().applyPreset({ language: ['python'] });
    expect(useEditorStore.getState().config.designOverrides?.colors?.text).toBe('#123456');
    useEditorStore.getState().selectArchetype('a02', false);
    expect(useEditorStore.getState().config.designOverrides).toBeUndefined();
});
import { compile } from '../../src/engine/compiler';
import { exportTokens } from '../../src/services/tokenExport';
import { designCss } from '../../src/domain/designRecipes';
it('mantiene equivalencia entre plan, constitución y tokens sin ampliar las 34 rutas', () => {
    const c = { ...emptyConfiguration(), selections: { platform: ['web-spa'], styling: ['tailwind'] }, designOverrides: { colors: { background: '#112233', surface: '#22334480', text: '#FFFFFF' }, typography: { monoFont: 'Fira Code' }, buttons: { radius: 24 as const, variant: 'outline' as const }, cards: { density: 'compact' as const }, finish: { texture: 'mesh' as const }, motion: { preset: 'spring' as const } } };
    const design = resolveDesign(c)!; const kit = compile(c);
    expect(kit.documents).toHaveLength(34);
    expect(kit.documents.find(d => d.id === 'plan')!.content).toContain(designCss(design));
    expect(kit.documents.find(d => d.id === 'constitution')!.content).toContain(designCss(design));
    expect(exportTokens(design, 'css').content).toBe(designCss(design));
    expect(exportTokens(design, 'tailwind', 'es', 4).filename).toBe('tokens.css');
    expect(exportTokens(design, 'tailwind').content).toContain('Fira Code');
    expect(kit.maturity.pillars.find(p => p.label === 'Estilo')!.complete).toBe(true);
    const nonvisual = compile({ ...c, selections: { platform: ['cli'] } });
    expect(nonvisual.documents.find(d => d.id === 'plan')!.content).not.toContain('#112233');
    expect(nonvisual.documents.find(d => d.id === 'constitution')!.content).not.toContain('Parámetros visuales obligatorios');
});

import { buttonText } from '../../src/domain/contrast';
it('calcula el texto de botones alfa sobre la tarjeta y su fondo reales', () => {
    const color = '#FFFFFF10';
    expect(buttonText(color, '#000000', '#000000')).toBe('#FFFFFF');
    expect(contrastRatio('#FFFFFF', color, '#000000', '#000000')).toBeGreaterThan(7);
});
