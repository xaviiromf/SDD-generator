import { test, expect } from '@playwright/test';
import { goTo } from './navigation';
// Un texto que bloquea el guardado (posible credencial) no borra el borrador ya guardado ni la
// edición en memoria. Los emojis solo avisan: la preferencia «cero emojis» no bloquea.
const guardada = (page: import('@playwright/test').Page) =>
  page.evaluate(
    () => JSON.parse(localStorage.getItem('sdd-studio:borrador:v1') ?? 'null')?.idea ?? null,
  );
test('una credencial falsa no borra el borrador guardado ni la edición', async ({ page }) => {
  const valida = 'Gestionar reservas del taller sin conexión',
    bloqueante = 'token=' + 'a1'.repeat(13);
  await page.goto('./');
  const idea = page.getByLabel('Tu idea, en tus palabras');
  await idea.fill(valida);
  await expect.poll(() => guardada(page)).toBe(valida);
  await idea.fill(bloqueante);
  await expect(page.locator('.save-indicator')).toHaveText('Sin guardar');
  await expect(idea).toHaveValue(bloqueante);
  expect(await guardada(page)).toBe(valida);
  await page.reload();
  await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue(valida);
});
test('un emoji se guarda y se avisa al exportar sin bloquear', async ({ page }) => {
  // El emoji va como secuencia de escape.
  const conEmoji = 'Reservas del taller \u{1F600}';
  await page.goto('./');
  await page.getByLabel('Tu idea, en tus palabras').fill(conEmoji);
  await expect.poll(() => guardada(page)).toBe(conEmoji);
  await goTo(page, 'Documentos');
  await expect(page.locator('.export-warnings')).toContainText('cero emojis');
  await expect(page.locator('.export-blocked')).toHaveCount(0);
});
