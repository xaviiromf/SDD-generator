import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { goTo } from './navigation';
import { emptyConfiguration } from '../../src/domain/models';
import { compile } from '../../src/engine/compiler';
import { documentSections } from '../../src/domain/manualSections';
// biblioteca, perfiles, aportaciones y MCP fuera del flujo, sin perder datos.
const draftKey = 'sdd-studio:borrador:v1',
  libraryKey = 'sdd-studio:biblioteca:v1';
async function seed(page: Page, values: Record<string, string>) {
  await page.addInitScript(values => {
    for (const [key, value] of Object.entries(values)) localStorage.setItem(key, value);
  }, values);
  await page.goto('./');
}
async function editIdea(page: Page, text: string) {
  await goTo(page, 'Idea');
  await page.getByLabel('Tu idea, en tus palabras', { exact: true }).fill(text);
  await expect
    .poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? '{}').idea, draftKey))
    .toBe(text);
  // La biblioteca guardaba a los 800 ms; se espera más para comprobar que ya no escribe.
  await page.waitForTimeout(1200);
}
async function exportLibrary(page: Page) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Exportar biblioteca', exact: true }).click(),
  ]);
  return {
    name: download.suggestedFilename(),
    text: await readFile((await download.path())!, 'utf8'),
  };
}
test('un borrador nuevo no ofrece funciones aplazadas ni crea biblioteca', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('button', { name: 'Exportar biblioteca', exact: true })).toHaveCount(
    0,
  );
  await editIdea(page, 'Reservas del taller sin conexión');
  expect(await page.evaluate(key => localStorage.getItem(key), libraryKey)).toBeNull();
  await expect(page.getByText('Ajustes de MCP')).toHaveCount(0);
  await goTo(page, 'Configuración');
  await expect(page.getByText('Perfiles y componentes', { exact: true })).toHaveCount(0);
  await goTo(page, 'Documentos');
  await expect(page.getByText('Aportaciones manuales por sección', { exact: true })).toHaveCount(0);
});
test('la biblioteca guardada se exporta sin cambios y las aportaciones existentes siguen visibles', async ({
  page,
}) => {
  const c = emptyConfiguration();
  const spec = compile(c).documents.find(d => d.id === 'spec')!;
  const section = documentSections(spec.content)[0];
  c.manualSections = [
    {
      id: 'MAN-1',
      documentId: 'spec',
      sectionKey: section.key,
      title: 'Decisión humana',
      text: 'Conservar este acuerdo.',
      baseContent: section.content,
    },
  ];
  const date = '2026-10-08T12:00:00.000Z';
  const library = JSON.stringify({
    schemaVersion: 1,
    revision: 1,
    activeId: 'P-0',
    projects: [{ id: 'P-0', createdAt: date, updatedAt: date, draft: c, versions: [] }],
  });
  await seed(page, { [draftKey]: JSON.stringify(c), [libraryKey]: library });
  const exported = await exportLibrary(page);
  expect(exported.name).toBe('biblioteca-sdd.json');
  const backup = JSON.parse(exported.text);
  expect(backup.format).toBe('sdd-studio-backup');
  expect(backup.projects.map((p: { id: string }) => p.id)).toEqual(['P-0']);
  await editIdea(page, 'Idea editada después de ocultar la biblioteca');
  expect(await page.evaluate(key => localStorage.getItem(key), libraryKey)).toBe(library);
  await goTo(page, 'Documentos');
  await expect(page.getByText('Aportaciones manuales por sección', { exact: true })).toBeVisible();
});
test('una biblioteca dañada se descarga tal cual', async ({ page }) => {
  const raw = '{"schemaVersion": 1, "projects": [';
  await seed(page, { [libraryKey]: raw });
  const exported = await exportLibrary(page);
  expect(exported.name).toBe('biblioteca-sdd-original.json');
  expect(exported.text).toBe(raw);
  await expect(page.locator('.notice')).toContainText('se descarga el registro original');
  expect(await page.evaluate(key => localStorage.getItem(key), libraryKey)).toBe(raw);
});
