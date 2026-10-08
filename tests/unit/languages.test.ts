import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
import { presets, resolvePreset } from '../../src/catalog/presets';
import { archetypes } from '../../src/catalog/archetypes';
import { brokenReferences } from '../../src/engine/references';
import { packageKit } from '../../src/services/zipExport';
import { exportTokens } from '../../src/services/tokenExport';
import { readDraft } from '../../src/services/draftStorage';
import { migrateUiLanguage, useUIStore } from '../../src/store/uiStore';
import { useEditorStore } from '../../src/store/editorStore';
import { setupCommands } from '../../src/services/setupCommands';
describe('español integral y migración', () => {
    it('mantiene los 34 contenidos en español aunque un cliente antiguo indique inglés', () => {
        for (const p of presets) {
            const selections = resolvePreset(p, Object.fromEntries((p.variants ?? []).map(v => [v.field, v.options[0]])));
            const c = { ...emptyConfiguration(), selections: { ...selections, archetype: ['a04'] } };
            const es = compile(c), migrated = compile({ ...c, sddLanguage: 'en' });
            expect(migrated.documents).toEqual(es.documents); expect(migrated.sddLanguage).toBe('es'); expect(migrated.documents).toHaveLength(34);
            expect(brokenReferences(migrated.documents)).toEqual([]);
            expect(migrated.documents.find(d => d.id === 'validation')!.content).toContain('No ejecutado');
        }
    });
    it('preserva textos, selecciones y ajustes de borradores anteriores', () => {
        const c = { ...emptyConfiguration(), sddLanguage: 'en' as const, name: 'My idea', idea: 'Book appointments', positive: 'Keep my text', selections: { archetype: ['a10'] }, designOverrides: { colors: { text: '#AABBCC' } } };
        const restored = readDraft({ getItem: () => JSON.stringify(c) });
        expect(restored.config).toEqual({ ...c, sddLanguage: 'es' }); expect(restored.message).toContain('tus textos');
        useEditorStore.getState().restore(c); expect(useEditorStore.getState().config.idea).toBe(c.idea); expect(useEditorStore.getState().config.sddLanguage).toBe('es');
        expect(compile(c).documents.find(d => d.id === 'spec')!.content).toContain('Book appointments');
        const remove = { getItem: () => 'en', removeItem: (key: string) => { expect(key).toBe('sdd-studio:ui-language:v1'); } };
        expect(migrateUiLanguage(remove)).toContain('español'); useUIStore.getState().setLocale('en'); expect(useUIStore.getState().locale).toBe('es');
    });
    it('ZIP, tokens y preparación mantienen español', async () => {
        const c = { ...emptyConfiguration(), sddLanguage: 'en' as const, selections: { language: ['python'], backend: ['django'] } };
        const result = compile(c); const zip = await JSZip.loadAsync(await packageKit(result.documents, { slug: result.slug }));
        for (const d of result.documents) expect(await zip.file(d.path)!.async('string')).toBe(d.content);
        expect(JSON.parse(exportTokens(archetypes[3], 'json', 'en').content).tipografia.cuerpo).toBe('Inter');
        expect(setupCommands(c)).not.toContain('# Activate');
    });
});
