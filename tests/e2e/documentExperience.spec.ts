import { test, expect } from '@playwright/test';
import { visualProject } from '../fixtures/visualProject';
import { compile } from '../../src/engine/compiler';
test.use({ trace: 'off' });
const fixture = ['## Banco de lectura', ...['NOTE', 'TIP', 'IMPORTANT', 'WARNING', 'CAUTION'].flatMap(kind => [`> [!${kind}]`, `> Contenido ${kind} conservado.`, '> Segunda línea con **énfasis** y `código`.', '']), '> [!DESCONOCIDO]', '> Cita desconocida conservada.', '', '````markdown', '> [!NOTE]', '```mermaid', 'flowchart TD', 'A --> B', '```', '````', '', '<b>HTML literal e inerte</b>', '[Enlace inseguro](javascript:alert)', '', '| Identificador | Descripción amplia | Estado |', '|---|---|---|', ...Array.from({ length: 45 }, (_, i) => `| Fila ${i} | Descripción de una celda amplia con datos preservados número ${i} | Pendiente |`), '| Final | `dato|literal` y barra escapada \\| conservados | Completo |', '| Extra | Dato | Pendiente | Celda adicional conservada |'].join('\n');
for (const width of [375, 768, 1280]) test(`alertas, cercas, tablas y fuente preservadas a ${width}px`, async ({ page }) => {
    const c = visualProject(); c.manualSections = [{ id: 'AP-1', documentId: 'README.md', sectionKey: 'documento', title: 'Banco visual', text: fixture, baseContent: '' }];
    await page.addInitScript(c => localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify(c)), c); await page.setViewportSize({ width, height: 1000 });
    const origin = new URL(test.info().project.use.baseURL!).origin; const requests: string[] = []; page.on('request', r => { if (new URL(r.url()).origin !== origin) requests.push(r.url()); }); await page.goto('./'); if (width < 768) await page.getByRole('button', { name: 'Documentos SDD', exact: true }).click();
    await page.getByRole('combobox', { name: 'Documento del kit', exact: true }).selectOption('README.md'); const content = page.locator('.document-content');
    for (const [title, kind] of [['Nota', 'NOTE'], ['Consejo', 'TIP'], ['Importante', 'IMPORTANT'], ['Advertencia', 'WARNING'], ['Precaución', 'CAUTION']]) { const alert = content.getByRole('note', { name: title, exact: true }); await expect(alert).toHaveCount(1); await expect(alert).toContainText(`Contenido ${kind} conservado.`); await expect(alert.locator('strong').first()).toHaveText(title); }
    await expect(content.locator('blockquote')).toContainText('[!DESCONOCIDO]'); await expect(content.locator('.markdown-code').filter({ hasText: '> [!NOTE]' })).toHaveCount(1); await expect(content.locator('.mermaid-block')).toHaveCount(0);
    await expect(content).toContainText('<b>HTML literal e inerte</b>'); await expect(content.locator('b')).toHaveCount(0); await expect(content.locator('a[href^="javascript:"]')).toHaveCount(0); await expect(content).toContainText('Celda adicional conservada');
    const table = content.getByRole('table').last(); await expect(table.getByRole('columnheader')).toHaveCount(4); await expect(table.getByRole('cell', { name: 'dato|literal y barra escapada | conservados', exact: true })).toBeVisible();
    const region = table.locator('..'); await region.focus(); await expect(region).toBeFocused();
    const sticky = await region.evaluate(element => { const header = element.querySelector('th')!; element.scrollTop = 150; const rect = element.getBoundingClientRect(), th = header.getBoundingClientRect(); return { position: getComputedStyle(header).position, top: th.top - rect.top, horizontal: element.scrollWidth > element.clientWidth }; });
    expect(sticky.position).toBe('sticky'); expect(sticky.top).toBeLessThanOrEqual(3); expect(sticky.horizontal).toBe(true); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const contrast = await content.evaluate(element => {
        const luminance = (value: string) => { const channels = value.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => { const s = v / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; }); return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722; };
        return Array.from(element.querySelectorAll<HTMLElement>('.markdown-alert-title strong, th')).map(node => { let background = node; while (getComputedStyle(background).backgroundColor === 'rgba(0, 0, 0, 0)' && background.parentElement) background = background.parentElement; const front = luminance(getComputedStyle(node).color), back = luminance(getComputedStyle(background).backgroundColor); return (Math.max(front, back) + .05) / (Math.min(front, back) + .05); });
    }); expect(contrast.length).toBeGreaterThanOrEqual(9); expect(contrast.every(ratio => ratio >= 4.5)).toBe(true);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('sdd-studio:borrador:v1')!).manualSections[0].text); expect(stored).toBe(fixture); expect(requests).toEqual([]);
});
test('explorador conserva 34 rutas, teclado e iconos por tipo; agrega pendientes', async ({ page }) => {
    const c = visualProject(), expected = compile(c).documents.map(d => d.path).sort(); await page.addInitScript(c => localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify(c)), c); await page.goto('./');
    await expect(page.getByRole('combobox', { name: 'Documento del kit', exact: true }).locator('option')).toHaveCount(34);
    await page.getByText('Estructura del kit', { exact: false }).click(); const tree = page.getByRole('tree', { name: 'Archivos del kit', exact: true });
    await expect(tree).toBeVisible();
    for (let i = 0; i < 8; i++) { const closed = tree.locator('[aria-expanded="false"]'); if (!await closed.count()) break; const label = await closed.first().getAttribute('aria-label'); const folder = tree.getByRole('treeitem', { name: label!, exact: true }); await folder.click(); await expect(folder).toHaveAttribute('aria-expanded', 'true'); }
    const paths = await tree.getByRole('treeitem').evaluateAll(rows => rows.filter(row => !row.hasAttribute('aria-expanded')).map(row => row.getAttribute('aria-label')!).sort()); expect(paths).toEqual(expected);
    const txt = tree.getByRole('treeitem', { name: 'MANUAL-PARA-USUARIO.txt', exact: true }); await expect(txt.locator('svg.lucide-file-type-2')).toHaveCount(1);
    const md = tree.getByRole('treeitem', { name: 'README.md', exact: true }); await expect(md.locator('svg.lucide-file-text')).toHaveCount(1); await md.focus(); await page.keyboard.press('ArrowDown'); await expect(tree.getByRole('treeitem').nth(1)).toBeFocused();
    const docs = tree.getByRole('treeitem', { name: 'docs', exact: true }); await expect(docs.locator('.document-status-badge')).toContainText('Borrador'); await expect(docs).toHaveAttribute('aria-describedby', /tree-state-/);
    const validation = tree.getByRole('treeitem', { name: /specs\/001-.*\/validation.md/ }); await validation.click(); await expect(validation).toHaveAttribute('aria-selected', 'true'); await expect(page.locator('.document-state')).toContainText('no ejecutadas');
    await page.locator('.document-state summary').click(); await expect(page.locator('.document-state li')).toBeVisible();
});
