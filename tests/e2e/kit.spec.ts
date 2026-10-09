import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import JSZip from 'jszip';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';

test('navega y exporta los 34 documentos, TXT y carpeta activa adaptada', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByLabel('Documento del kit').locator('option')).toHaveCount(34);
    await page.getByLabel('Identificador', { exact: true }).fill('reservas');
    await expect(page.locator('.document-path')).toContainText('specs/001-reservas/spec.md');
    const selector = page.getByLabel('Documento del kit');
    const options = await selector.locator('option').evaluateAll(elements => elements.map(e => ({ id: (e as HTMLOptionElement).value, path: e.textContent! })));
    for (const option of options) {
        await selector.selectOption(option.id);
        await expect(page.locator('.document-path')).toContainText(option.path);
        expect((await page.locator('.document-content').innerText()).length).toBeGreaterThan(150);
    }
    await selector.selectOption('MANUAL-PARA-USUARIO.txt');
    await expect(page.locator('.document-path')).toContainText('TXT');
    await expect(page.locator('pre')).toContainText('GUÍA BREVE');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true }).click();
    const download = await downloadPromise;
    const zip = await JSZip.loadAsync(await readFile((await download.path())!));
    const files = Object.values(zip.files).filter(entry => !entry.dir);
    expect(files).toHaveLength(34);
    expect(files.map(entry => entry.name).sort()).toEqual(options.map(option => option.path).sort());
    expect(await zip.file('docs/PROJECT_STATUS.md')!.async('string')).toContain('Código autorizado | No;');
    expect(await zip.file('specs/001-reservas/validation.md')!.async('string')).toContain('No ejecutado');
    expect(zip.file('specs/spec.md')).toBeNull();
    expect(await zip.file('MANUAL-PARA-USUARIO.txt')!.async('string')).toBe(await page.locator('pre').innerText());
    await selector.selectOption('spec');
    await page.getByLabel('Identificador', { exact: true }).fill('pedidos');
    await expect(selector).toHaveValue('spec');
    await expect(page.locator('.document-path')).toContainText('specs/001-pedidos/spec.md');
});

test('árbol anidado opera con flechas y activa archivos por identidad', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByLabel('Documento del kit').locator('option')).toHaveCount(34);
    await page.getByText('Estructura del kit', { exact: false }).click();
    const tree = page.getByRole('tree');
    const specs = tree.getByRole('treeitem', { name: 'specs', exact: true });
    await specs.focus();
    await page.keyboard.press('ArrowLeft');
    await expect(specs).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('ArrowRight');
    await expect(specs).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(tree.getByRole('treeitem', { name: 'specs/README.md', exact: true })).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('.document-path')).toContainText('specs/README.md');
    await expect(tree.getByRole('treeitem', { name: 'specs/README.md', exact: true })).toHaveAttribute('aria-selected', 'true');
});

test('restaura un borrador anterior y actualiza una caché previa sin recargar al editar', async ({ page, context }) => {
    await page.addInitScript(() => {
        if (!localStorage.getItem('sdd-studio:borrador:v1')) localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify({ version: 1, revision: 2, name: 'CLI anterior', slug: 'anterior', idea: 'Conservar borrador', positive: '', negative: '', selections: { platform: ['cli'], architecture: ['client'], language: ['rust'], storage: ['memory'] }, origins: { platform: 'manual', architecture: 'manual', language: 'manual', storage: 'manual' } }));
        sessionStorage.setItem('cargas-prueba', String(Number(sessionStorage.getItem('cargas-prueba') ?? 0) + 1));
    });
    let previous = true;
    const server = createServer(async (request, response) => {
        const pathname = new URL(request.url!, 'http://localhost').pathname;
        if (previous && pathname === '/SDD-generator/sw.js') {
            response.setHeader('Content-Type', 'application/javascript');
            response.end("self.addEventListener('install',e=>e.waitUntil(caches.open('sdd-studio-anterior')));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));");
            return;
        }
        const file = pathname.slice('/SDD-generator/'.length) || 'index.html';
        if (!pathname.startsWith('/SDD-generator/') || file.split('/').includes('..')) { response.writeHead(404); response.end(); return; }
        try {
            const content = await readFile('dist/' + file);
            response.setHeader('Content-Type', file.endsWith('.js') ? 'application/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream');
            response.end(content);
        } catch { response.writeHead(404); response.end(); }
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/SDD-generator/`;
    try {
    await page.goto(url);
    await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue('Conservar borrador');
    await expect(page.getByLabel('Documento del kit').locator('option')).toHaveCount(34);
    await expect(page.locator('.document-path')).toContainText('specs/001-anterior/spec.md');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
    previous = false;
    await page.evaluate(async () => { const registration = await navigator.serviceWorker.getRegistration(); await registration!.update(); });
    await expect.poll(() => page.evaluate(async () => (await navigator.serviceWorker.getRegistration())?.waiting?.state)).toBe('installed');
    await expect(page.getByRole('status').filter({ hasText: 'nueva versión disponible' })).toBeVisible();
    await page.getByLabel('Tu idea, en tus palabras').fill('Borrador editado durante actualización');
    expect(await page.evaluate(() => sessionStorage.getItem('cargas-prueba'))).toBe('1');
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sdd-studio:borrador:v1')!).idea)).toBe('Borrador editado durante actualización');
    await page.close();
    const reopened = await context.newPage();
    await reopened.goto(url);
    await expect.poll(() => reopened.evaluate(async () => (await caches.keys()).includes('sdd-studio-anterior'))).toBe(false);
    await context.setOffline(true);
    await reopened.reload();
    await expect(reopened.getByLabel('Tu idea, en tus palabras')).toHaveValue('Borrador editado durante actualización');
    await expect(reopened.getByLabel('Documento del kit').locator('option')).toHaveCount(34);
    const download = reopened.waitForEvent('download');
    await reopened.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true }).click();
    await download;
    } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});
