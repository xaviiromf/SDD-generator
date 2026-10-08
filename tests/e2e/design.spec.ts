import { test, expect } from '@playwright/test';
for (const width of [320, 375, 767, 768, 1279, 1280, 1440]) test(`diseño avanzado accesible a ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('./');
    await page.getByRole('button', { name: 'Estética y tokens' }).click();
    await page.getByText('Ajustes Avanzados de Diseño', { exact: true }).click();
    await page.getByLabel('Fuente de títulos', { exact: true }).selectOption('Cinzel');
    await page.getByLabel('Fuente de cuerpo', { exact: true }).selectOption('Manrope');
    await page.getByLabel('Fuente de código', { exact: true }).selectOption('Fira Code');
    await page.getByLabel('HEX de texto', { exact: true }).fill('#FFFFFF');
    await page.getByLabel('Textura', { exact: true }).selectOption('mesh');
    await expect(page.getByTestId('design-sandbox')).toBeVisible();
    await page.getByRole('button', { name: 'Probar interacción' }).click(); await expect(page.getByText('Pruebas: 1')).toBeVisible();
    await page.getByLabel('HEX de texto', { exact: true }).fill('#111215');
    await expect(page.getByText('Esta combinación no cumple AA', { exact: false })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const dimensions = await page.locator('.design-controls button:visible,.sdd-boton:visible,.carousel-controls button:visible').evaluateAll(elements => elements.map(e => ({ w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height })));
    expect(dimensions.every(d => d.w >= 44 && d.h >= 44)).toBe(true);
    await page.screenshot({ path: `test-results/diseno-${width}.png`, fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await page.getByTestId('design-sandbox').evaluate(e => parseFloat(getComputedStyle(e).getPropertyValue('--motion-duration')))).toBe(0);
});
test('HEX parcial no se guarda y las seis texturas son reproducibles', async ({ page }) => {
    await page.goto('./'); await page.getByRole('button', { name: 'Estética y tokens' }).click(); await page.getByText('Ajustes Avanzados de Diseño', { exact: true }).click();
    const hex = page.getByLabel('HEX de texto', { exact: true }); await hex.fill('#ABC'); await expect(hex).toHaveAttribute('aria-invalid', 'true');
    await hex.fill('#AABBCC80'); await expect(hex).toHaveAttribute('aria-invalid', 'false');
    for (const texture of ['grain', 'scanlines', 'paper', 'frosted', 'matte', 'mesh']) { await page.getByLabel('Textura', { exact: true }).selectOption(texture); await expect(page.getByTestId('design-sandbox')).toBeVisible(); }
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sdd-studio:borrador:v1') ?? '{}').designOverrides?.colors?.text)).toBe('#AABBCC80');
});
