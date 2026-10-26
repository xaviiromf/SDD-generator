import { test, expect } from '@playwright/test';
import { goTo } from './navigation';
test('recupera un trabajador que no puede iniciarse sin perder la idea', async ({ page }) => {
  await page.addInitScript(() => {
    const Original = window.Worker;
    Object.defineProperty(window, 'Worker', {
      configurable: true,
      value: class {
        constructor() {
          throw new Error('No disponible');
        }
      },
    });
    (window as unknown as { restoreWorker: () => void }).restoreWorker = () =>
      Object.defineProperty(window, 'Worker', { configurable: true, value: Original });
  });
  await page.goto('./');
  await expect(page.getByRole('alert')).toContainText('No se pudo iniciar');
  await page.getByLabel('Tu idea, en tus palabras').fill('Conservar la idea');
  await page.evaluate(() => (window as unknown as { restoreWorker: () => void }).restoreWorker());
  await page.getByRole('button', { name: 'Reintentar', exact: false }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue('Conservar la idea');
  await expect(
    page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true }),
  ).toBeEnabled();
});
test('paleta, foco, árbol y movimiento reducido', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const trigger = page.getByRole('button', { name: 'Buscar', exact: false });
  await trigger.click();
  const input = page.getByLabel('Buscar tecnologías y conjuntos');
  await expect(input).toBeFocused();
  await input.fill('pyton');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await goTo(page, 'Documentos');
  const tree = page.getByRole('tree');
  await expect(tree).toBeVisible();
  const first = tree.getByRole('treeitem').first();
  await first.focus();
  await page.keyboard.press('ArrowDown');
  await expect(tree.getByRole('treeitem').nth(1)).toBeFocused();
  const snapshot = await page.locator('main').ariaSnapshot();
  expect(snapshot).toContain('Revisa el contrato');
  expect(snapshot).toContain('Archivos del kit');
  await page.setViewportSize({ width: 720, height: 500 });
  await goTo(page, 'Idea');
  await page.getByLabel('Tu idea, en tus palabras').fill('Texto largo '.repeat(1500));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('los arquetipos usan fuentes locales incluso sin conexión', async ({ page, context }) => {
  await page.goto('./');
  await expect(page.locator('.notice')).toContainText('Preparación sin conexión completa');
  await page.reload();
  await context.setOffline(true);
  await goTo(page, 'Configuración');
  await page.getByRole('button', { name: 'Estética y tokens' }).click();
  await page.getByText('Ajustes Avanzados de Diseño', { exact: true }).click();
  const families = await page
    .getByLabel('Fuente de títulos', { exact: true })
    .locator('option')
    .evaluateAll(elements => elements.map(e => (e as HTMLOptionElement).value));
  expect(families).toHaveLength(30);
  const results = await page.evaluate(async names => {
    const result = [];
    for (const name of names) {
      try {
        const loaded = await document.fonts.load(
          `16px "${name}"`,
          'Una idea con carácter y decisión',
        );
        result.push({ name, loaded: loaded.length > 0 });
      } catch {
        result.push({ name, loaded: false });
      }
    }
    return result;
  }, families);
  expect(results.filter(r => !r.loaded)).toEqual([]);
  await expect(page.locator('.archetype')).toHaveCount(1);
});
test('portapapeles denegado muestra copia manual; borrar borrador requiere confirmación', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.reject(new Error('Denegado')) },
    });
  });
  await page.goto('./');
  await page.getByRole('button', { name: 'Copiar primer mensaje', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Contenido para copiar')).toContainText('Lee AGENTS.md');
  await page.keyboard.press('Escape');
  await page.getByLabel('Tu idea, en tus palabras').fill('Conservar idea');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('button', { name: 'Borrar borrador', exact: true }).click();
  await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue('Conservar idea');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Borrar borrador', exact: true }).click();
  await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue('');
});
test('el fallo del motor ofrece un informe copiable sin la idea', async ({
  page,
  context,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'Permisos de portapapeles solo en Chromium.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.addInitScript(() => {
    localStorage.setItem(
      'sdd-studio:borrador:v1',
      JSON.stringify({
        version: 1,
        revision: 3,
        name: 'Proyecto privado',
        slug: 'privado',
        idea: 'Idea confidencial',
        positive: '',
        negative: '',
        selections: {},
        origins: {},
      }),
    );
    Object.defineProperty(window, 'Worker', {
      configurable: true,
      value: class {
        constructor() {
          throw new Error('No disponible');
        }
      },
    });
  });
  await page.goto('./');
  await goTo(page, 'Documentos');
  await page.getByRole('button', { name: 'Copiar informe' }).click();
  const report = await page.evaluate(() => navigator.clipboard.readText());
  expect(report).toContain('Área: Motor de generación');
  expect(report).toContain('No se pudo iniciar el motor local');
  expect(report).not.toContain('Idea confidencial');
  expect(report).not.toContain('Proyecto privado');
});
