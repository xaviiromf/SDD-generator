import { it, expect } from 'vitest';
import JSZip from 'jszip';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
import { packageKit } from '../../src/services/zipExport';
import { exportTokens } from '../../src/services/tokenExport';
import { archetypes } from '../../src/catalog/archetypes';
import { setupCommands } from '../../src/services/setupCommands';
import { readDraft, saveDraft } from '../../src/services/draftStorage';
it('empaqueta rutas y contenido de la misma revisión y rechaza traversal', async () => {
    const documents = compile(emptyConfiguration()).documents;
    const bytes = await packageKit(documents);
    const zip = await JSZip.loadAsync(bytes);
    for (const {path} of documents)
        expect(await zip.file(path)!.async('string')).toBe(documents.find(d => d.path === path)!.content);
    await expect(packageKit([...documents, { ...documents[0], path: '../secreto' }])).rejects.toThrow('no válidos');
    await expect(packageKit(documents.map((d, i) => i ? d : { ...d, revision: 99 }))).rejects.toThrow();
});
it('exporta valores exactos y prepara órdenes con identificadores seguros', () => {
    expect(exportTokens(archetypes[0], 'css').content).toContain('#C2593F');
    expect(JSON.parse(exportTokens(archetypes[19], 'json').content).tipografia.cuerpo).toBe('Inter');
    expect(exportTokens(archetypes[0], 'tailwind').content).toContain('Tailwind CSS 3');
    expect(() => setupCommands({ ...emptyConfiguration(), slug: 'a;touch x' })).toThrow('identificador');
    expect(setupCommands({ ...emptyConfiguration(), selections: { language: ['rust'] } })).toContain('cargo new');
});
it('recupera borradores y gestiona cuota y corrupción sin guardar secretos', () => {
    const map = new Map<string, string>();
    const storage = { setItem: (k: string, v: string) => { map.set(k, v); }, getItem: (k: string) => map.get(k) ?? null };
    const c = emptyConfiguration();
    expect(saveDraft(c, storage)).toContain('guardado');
    expect(readDraft(storage).config).toEqual(c);
    expect(saveDraft({ ...c, idea: 'token=' + 'a'.repeat(25) }, storage)).toContain('Corrige');
    expect(saveDraft(c, { setItem: () => { throw new Error(); } })).toContain('memoria');
    expect(readDraft({ getItem: () => '{' }).config).toBeNull();
    expect(readDraft({ getItem: () => JSON.stringify({ ...c, version: 9 }) }).config).toBeNull();
});
