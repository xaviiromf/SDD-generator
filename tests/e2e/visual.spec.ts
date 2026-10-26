import { test, expect } from '@playwright/test';
import { goTo, type Step } from './navigation';
// Regresión visual. El renderizado de fuentes cambia entre sistemas, así que solo se
// compara con SDD_VISUAL=1 en la máquina de referencia. Actualizar: SDD_VISUAL=1 npx playwright
// test tests/e2e/visual.spec.ts --project=chromium --update-snapshots
test.skip(!process.env.SDD_VISUAL, 'Regresión visual solo con SDD_VISUAL=1.');
test.use({ trace: 'off' });
const screens: Step[] = ['Idea', 'Documentos', 'Portada'];
for (const theme of ['dark', 'light'] as const)
  for (const [width, height] of [
    [1440, 900],
    [1024, 800],
    [390, 844],
  ])
    test(`pantallas clave a ${width}px en tema ${theme}`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'chromium', 'Referencia visual en Chromium.');
      await page.setViewportSize({ width, height });
      await page.addInitScript(value => localStorage.setItem('sdd-studio:tema:v1', value), theme);
      await page.goto('./');
      await page.getByRole('button', { name: 'Cargar proyecto de ejemplo' }).click();
      await page.addStyleTag({
        content: '.notice{display:none!important} *{caret-color:transparent!important}',
      });
      for (const screen of screens) {
        await goTo(page, screen);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1200);
        await expect(page).toHaveScreenshot(`${screen.toLowerCase()}-${width}-${theme}.png`, {
          mask: [page.locator('.save-indicator')],
          maxDiffPixelRatio: 0.002,
          animations: 'disabled',
        });
      }
    });
