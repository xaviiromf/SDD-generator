import { test, expect } from '@playwright/test';
async function configure(page: import('@playwright/test').Page) {
    await page.getByRole('button', { name: 'Ajustes de MCP' }).click();
    await page.getByLabel('URL del servidor MCP').fill('http://127.0.0.1:3999/mcp');
    await expect(page.getByText('Destino del envío:', { exact: false })).toContainText('127.0.0.1:3999');
    await page.getByLabel('Activar MCP y permitir').check();
    await page.getByRole('button', { name: 'Guardar ajustes' }).click();
}
test('conecta, prioriza decisiones y mantiene fallback silencioso al superar el plazo', async ({ page, context }) => {
    let delay = false; const calls: { method: string; params?: { arguments?: { text?: string } } }[] = [];
    await page.route('http://127.0.0.1:3999/mcp', async route => {
        const request = route.request(); if (request.method() === 'DELETE') { await route.fulfill({ status: 204 }); return; }
        const r = request.postDataJSON(); calls.push(r);
        if (!r.id) { await route.fulfill({ status: 202 }); return; }
        if (delay && r.method === 'tools/call') await new Promise(resolve => setTimeout(resolve, 1800));
        const result = r.method === 'initialize' ? { protocolVersion: '2025-11-25', capabilities: { tools: {} } } : r.method === 'tools/list' ? { tools: [{ name: 'match_technologies', inputSchema: { type: 'object', properties: { text: { type: 'string' }, exclusions: { type: 'string' } } } }] } : { structuredContent: { matches: [{ id: 'typescript', confidence: .95, reason: '' }], missingScopes: [] } };
        await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ jsonrpc: '2.0', id: r.id, result }) }).catch(() => {});
    });
    await page.goto('./'); await configure(page); await page.getByLabel('Tu idea, en tus palabras').fill('Una idea sin palabras técnicas');
    await expect(page.getByText('MCP Conectado', { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sdd-studio:borrador:v1') ?? '{}').selections?.language)).toEqual(['typescript']);
    expect(calls.filter(c => c.method !== 'tools/call').every(c => !JSON.stringify(c).includes('Una idea sin palabras técnicas'))).toBe(true);
    await context.setOffline(true); await expect(page.getByText('Motor Local Activo', { exact: true })).toBeVisible();
    await context.setOffline(false); await expect(page.getByText('MCP Conectado', { exact: true })).toBeVisible();
    delay = true; await page.getByLabel('Tu idea, en tus palabras').fill('Python para reservas');
    await expect(page.getByText('Motor Local Activo', { exact: true })).toBeVisible();
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('sdd-studio:borrador:v1') ?? '{}').selections?.language)).toEqual(['python']);
    await page.waitForTimeout(2000); await expect(page.getByText('Motor Local Activo', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true })).toBeEnabled();
    expect(await page.evaluate(() => localStorage.getItem('sdd-studio:mcp:v1'))).not.toContain('Python');
});
test('probar conexión no envía idea y un destino caído no interrumpe la edición', async ({ page }) => {
    const bodies: string[] = [];
    await page.route('http://127.0.0.1:3999/mcp', async route => { bodies.push(route.request().postData() ?? ''); await route.fulfill({ status: 401 }); });
    await page.goto('./'); await page.getByLabel('Tu idea, en tus palabras').fill('Idea privada');
    await page.getByRole('button', { name: 'Ajustes de MCP' }).click(); await page.getByLabel('URL del servidor MCP').fill('http://127.0.0.1:3999/mcp');
    await page.getByRole('button', { name: 'Probar conexión sin enviar idea' }).click();
    await expect(page.getByText('No se pudo conectar.', { exact: false })).toBeVisible(); expect(bodies.join('')).not.toContain('Idea privada');
    await page.keyboard.press('Escape'); await expect(page.getByRole('button', { name: 'Ajustes de MCP' })).toBeFocused();
    await expect(page.getByLabel('Tu idea, en tus palabras')).toHaveValue('Idea privada');
});

import { createServer, type ServerResponse } from 'node:http';
test('SSE heredado real negocia CORS, no guarda credenciales y deja de enviar al desactivar', async ({ page }) => {
    let stream: ServerResponse | undefined; const requests: { method: string; params?: { arguments?: { text?: string } } }[] = []; let bearer = '';
    const server = createServer((req,res) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4173');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'content-type,accept,authorization,mcp-session-id,mcp-protocol-version');
        res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
        if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
        if (req.url === '/sse' && req.method === 'POST') { res.writeHead(405); res.end(); return; }
        if (req.url === '/sse') { res.writeHead(200, { 'Content-Type': 'text/event-stream' }); stream = res; res.write('event: endpoint\ndata: /mensajes\n\n'); return; }
        let body = ''; req.on('data', chunk => { body += String(chunk); }); req.on('end', () => {
            bearer = req.headers.authorization ?? ''; const r = JSON.parse(body); requests.push(r);
            if (r.id) {
                const result = r.method === 'initialize' ? { protocolVersion: '2024-11-05', capabilities: { tools: {} } } : r.method === 'tools/list' ? { tools: [{ name: 'infer_intent', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } }] } : { content: [{ type: 'text', text: JSON.stringify({ matches: [{ id: 'python', confidence: .95, reason: 'acción' }], missingScopes: [] }) }] };
                const event = `event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', id: r.id, result })}\n\n`;
                for (const chunk of Buffer.from(event)) stream?.write(Buffer.from([chunk]));
            }
            res.writeHead(202); res.end();
        });
    });
    await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve)); const address = server.address() as { port: number };
    try {
        await page.goto('./'); await page.getByLabel('Tu idea, en tus palabras').fill('Una idea privada');
        await page.getByRole('button', { name: 'Ajustes de MCP' }).click(); await page.getByLabel('URL del servidor MCP').fill(`http://127.0.0.1:${address.port}/sse`);
        await page.getByLabel('Credencial de sesión opcional').fill('sesion-de-prueba');
        await page.getByRole('button', { name: 'Probar conexión sin enviar idea' }).click(); await expect(page.getByText('Conexión verificada.', { exact: false })).toBeVisible();
        expect(requests.every(r => r.method !== 'tools/call')).toBe(true);
        await page.getByLabel('Activar MCP y permitir').check(); await page.getByRole('button', { name: 'Guardar ajustes' }).click();
        await expect(page.getByText('MCP Conectado', { exact: true })).toBeVisible(); expect(bearer).toBe('Bearer sesion-de-prueba');
        expect(requests.filter(r => r.method === 'tools/call')[0].params?.arguments?.text).toBe('Una idea privada');
        expect(await page.evaluate(() => JSON.stringify(Object.entries(localStorage)))).not.toContain('sesion-de-prueba');
        await page.getByRole('button', { name: 'Ajustes de MCP' }).click(); await page.getByLabel('Activar MCP y permitir').uncheck(); await page.getByRole('button', { name: 'Guardar ajustes' }).click();
        await expect(page.getByText('Motor Local Activo', { exact: true })).toBeVisible(); const count = requests.filter(r => r.method === 'tools/call').length;
        await page.getByLabel('Tu idea, en tus palabras').fill('Rust después del apagado'); await page.waitForTimeout(500); expect(requests.filter(r => r.method === 'tools/call')).toHaveLength(count);
    } finally { server.closeAllConnections(); await new Promise<void>(resolve => server.close(() => resolve())); }
});
for (const width of [320, 768, 1280]) test(`ajustes MCP mantienen foco y controles accesibles a ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 }); await page.goto('./');
    if (width < 1280) await page.getByRole('button', { name: 'Idea / Prompt', exact: true }).click();
    const trigger = page.getByRole('button', { name: 'Ajustes de MCP' }); await trigger.click();
    await expect(page.getByLabel('URL del servidor MCP')).toBeFocused();
    await page.getByLabel('URL del servidor MCP').fill('https://servidor.example/mcp');
    const box = await page.getByLabel('Activar MCP y permitir').boundingBox(); expect(box!.width).toBeGreaterThanOrEqual(44); expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
    await expect(page.getByText('Motor Local Activo', { exact: true })).toBeVisible();
});
