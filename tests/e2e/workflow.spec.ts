import { test, expect, type Page } from '@playwright/test';
async function chooseSPA(page: Page) { await page.getByLabel('Conjunto predefinido').selectOption('client-spa'); await page.getByRole('button', { name: 'Aplicar conjunto', exact: true }).click(); await page.getByRole('button', { name: 'Estética y tokens' }).click(); await page.getByRole('button', { name: 'Precisión suiza para software', exact: true }).click(); }
test('genera kit, respeta intención y descarga ZIP', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('./');
    await chooseSPA(page);
    await page.getByLabel('Tu idea, en tus palabras').fill('Aplicación de reservas con tailwnd, sin Firebase.');
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', '100');
    await expect(page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true })).toBeEnabled();
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true }).click();
    expect((await download).suggestedFilename()).toBe('mi-proyecto-sdd.zip');
    await page.getByRole('tab', { name: 'constitution', exact: true }).click();
    await expect(page.locator('pre')).toContainText('Cero emojis');
    await page.getByRole('button', { name: 'Comando de Setup Rápido' }).click();
    await expect(page.getByLabel('Contenido para copiar')).toContainText('npm create vite');
    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
    expect(errors).toEqual([]);
});
test('busca erratas por teclado y conserva decisiones al cancelar', async ({ page }) => {
    await page.goto('./');
    await page.getByRole('button', { name: 'Buscar', exact: false }).click();
    await page.getByLabel('Buscar tecnologías y conjuntos').fill('tailwnd');
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Estilo', { exact: true })).toHaveValue('tailwind');
    await page.getByLabel('Conjunto predefinido').selectOption('systems-cli');
    await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
    await expect(page.getByLabel('Estilo', { exact: true })).toHaveValue('tailwind');
});
test('bloquea secretos y mantiene HTML como texto', async ({ page }) => {
    await page.goto('./');
    await page.getByLabel('Tu idea, en tus palabras').fill('<script>window.fallo=true</script>');
    await expect(page.locator('pre')).toContainText('&lt;script&gt;');
    expect(await page.evaluate(() => Object.prototype.hasOwnProperty.call(window, 'fallo'))).toBe(false);
    await page.getByLabel('Tu idea, en tus palabras').fill('token=' + 'a'.repeat(25));
    await expect(page.getByRole('alert')).toContainText('posible credencial');
    await expect(page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true })).toBeDisabled();
});
test('recarga y exporta sin red tras preparar la caché', async ({ page, context }) => {
    await page.goto('./');
    await chooseSPA(page);
    await page.getByLabel('Tu idea, en tus palabras').fill('Reservas locales');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await expect.poll(() => page.evaluate(async () => { const names = await caches.keys(); return names.some(n => n.startsWith('sdd-studio-')); })).toBe(true);
    await page.waitForTimeout(650);
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue('Reservas locales');
    await expect(page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true })).toBeEnabled();
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true }).click();
    await download;
});
for (const width of [375, 767, 768, 1279, 1280, 1440])
    test(`adapta paneles a ${width}px sin desbordamiento`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto('./');
        if (width < 768)
            await page.getByRole('button', { name: 'Documentos SDD', exact: true }).click();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        const bounds = await page.locator('button:visible').evaluateAll(elements => elements.map(e => { const r = e.getBoundingClientRect(); return { name: e.textContent, w: r.width, h: r.height }; }));
        expect(bounds.filter(b => b.w < 43.9 || b.h < 43.9)).toEqual([]);
        await page.screenshot({ path: `test-results/estudio-${width}.png`, fullPage: true });
    });
