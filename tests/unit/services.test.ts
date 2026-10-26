import { it, expect } from 'vitest';
import JSZip from 'jszip';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
import { packageChange, packageKit } from '../../src/services/zipExport';
import { exportTokens } from '../../src/services/tokenExport';
import { archetypes } from '../../src/catalog/archetypes';
import { setupCommands } from '../../src/services/setupCommands';
import { readDraft, saveDraft } from '../../src/services/draftStorage';
it('empaqueta rutas y contenido de la misma revisión y rechaza traversal', async () => {
  const documents = compile(emptyConfiguration()).documents;
  const bytes = await packageKit(documents);
  const zip = await JSZip.loadAsync(bytes);
  for (const { path } of documents)
    expect(await zip.file(path)!.async('string')).toBe(
      documents.find(d => d.path === path)!.content,
    );
  await expect(packageKit([...documents, { ...documents[0], path: '../secreto' }])).rejects.toThrow(
    'no válidos',
  );
  await expect(
    packageKit(documents.map((d, i) => (i ? d : { ...d, revision: 99 }))),
  ).rejects.toThrow();
});
it('exporta valores exactos y prepara órdenes con identificadores seguros', () => {
  expect(exportTokens(archetypes[0], 'css').content).toContain('#C2593F');
  expect(JSON.parse(exportTokens(archetypes[19], 'json').content).tipografia.cuerpo).toBe('Inter');
  expect(exportTokens(archetypes[0], 'tailwind').content).toContain('Tailwind CSS 3');
  expect(() => setupCommands({ ...emptyConfiguration(), slug: 'a;touch x' })).toThrow(
    'identificador',
  );
  expect(setupCommands({ ...emptyConfiguration(), selections: { language: ['rust'] } })).toContain(
    'cargo new',
  );
});
it('recupera borradores y gestiona cuota y corrupción sin guardar secretos', () => {
  const map = new Map<string, string>();
  const storage = {
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
    getItem: (k: string) => map.get(k) ?? null,
  };
  const c = emptyConfiguration();
  expect(saveDraft(c, storage)).toContain('guardado');
  expect(readDraft(storage).config).toEqual(c);
  expect(saveDraft({ ...c, idea: 'token=' + 'a1'.repeat(13) }, storage)).toContain('Corrige');
  expect(
    saveDraft(c, {
      setItem: () => {
        throw new Error();
      },
    }),
  ).toContain('memoria');
  expect(readDraft({ getItem: () => '{' }).config).toBeNull();
  expect(readDraft({ getItem: () => JSON.stringify({ ...c, version: 9 }) }).config).toBeNull();
});
it('el kit contiene siete archivos y un cambio solo trae su carpeta y dos fragmentos', async () => {
  const documents = compile({ ...emptyConfiguration(), slug: 'taller' }).documents;
  const names = async (bytes: Uint8Array) =>
    Object.values((await JSZip.loadAsync(bytes)).files)
      .filter(f => !f.dir)
      .map(f => f.name)
      .sort();
  expect(await names(await packageKit(documents, { slug: 'taller' }))).toEqual([
    'AGENTS.md',
    'docs/DECISIONS.md',
    'docs/PROJECT_STATUS.md',
    'specs/001-taller/plan.md',
    'specs/001-taller/spec.md',
    'specs/001-taller/tasks.md',
    'specs/001-taller/validation.md',
  ]);
  await expect(packageKit(documents.slice(1), { slug: 'taller' })).rejects.toThrow();
  const change = await packageChange(documents, 'taller', 2);
  expect(await names(change)).toEqual([
    'AGENTS-fragmento-002.md',
    'DECISIONS-fragmento-002.md',
    'specs/002-taller/plan.md',
    'specs/002-taller/spec.md',
    'specs/002-taller/tasks.md',
    'specs/002-taller/validation.md',
  ]);
  const spec = await (
    await JSZip.loadAsync(change)
  )
    .file('specs/002-taller/tasks.md')!
    .async('string');
  expect(spec).not.toContain('specs/001-taller');
  await expect(packageChange(documents, 'taller', 1)).rejects.toThrow();
});
