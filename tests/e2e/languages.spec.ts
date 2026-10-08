import { test, expect } from '@playwright/test';
test('migra preferencias inglesas y conserva el contenido del usuario', async ({ page }) => {
    await page.addInitScript(() => {
        if (!localStorage.getItem('migrado-prueba')) {
            localStorage.setItem('sdd-studio:ui-language:v1', 'en');
            localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify({ version: 1, revision: 0, sddLanguage: 'en', name: 'My project', slug: 'my-project', idea: 'Book appointments', positive: '', negative: '', selections: {}, origins: {} }));
            localStorage.setItem('migrado-prueba', '1');
        }
    });
    await page.goto('./');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('switch')).toHaveCount(0);
    await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue('Book appointments');
    await expect(page.locator('pre')).toContainText('Book appointments');
    await expect(page.locator('pre')).toContainText('Especificación');
    await page.reload(); await expect(page.getByLabel('Nombre del proyecto')).toHaveValue('My project');
});
