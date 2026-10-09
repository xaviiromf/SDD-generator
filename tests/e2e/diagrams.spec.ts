import { test, expect, type Page } from '@playwright/test';
import { readFile, readdir } from 'node:fs/promises';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { emptyProfiles } from '../../src/domain/profiles';
import { builtinProfiles } from '../../src/catalog/profiles';
import { compile } from '../../src/engine/compiler';
test.use({ trace: 'off' });
function fixture() {
    const c = emptyConfiguration(); c.name = 'Reservas'; c.idea = 'Gestionar reservas locales';
    c.profile = { ...emptyProfiles(), components: [{ id: 'CMP-1', name: 'Interfaz', kind: 'web', responsibility: 'Consultar', profileId: '', dependsOn: ['CMP-2'], technologyIds: ['TEC-1'] }, { id: 'CMP-2', name: 'Servicio local', kind: 'servicio', responsibility: 'Guardar', profileId: '', dependsOn: [], technologyIds: [] }], technologies: [{ id: 'TEC-1', name: 'TypeScript', role: 'lenguaje', purpose: 'Contratos', constraints: [], version: '', sources: [], reviewedAt: '', support: 'declarada' }] };
    c.project!.context.components = c.profile.components.map(item => ({ id: item.id, text: item.responsibility, references: item.dependsOn, status: 'confirmado', origin: 'user' }));
    c.project!.context.entities = ['E-1', 'E-2'].map(id => ({ id, text: id === 'E-1' ? 'Persona' : 'Reserva', references: [], status: 'confirmado', origin: 'user' }));
    c.project!.context.actors = [{ id: 'ACT-1', text: 'Cliente', references: [], status: 'confirmado', origin: 'user' }];
    c.project!.context.decisions = [{ id: 'D-1', text: 'Persistencia local', references: [], status: 'confirmado', origin: 'user' }];
    const rf = createRequirement('RF-1'); Object.assign(rf, { title: 'Crear reserva', actorId: 'ACT-1', context: 'Solicitar disponibilidad', behavior: 'Reserva registrada', componentIds: ['CMP-1'], decisionIds: ['D-1'], exceptions: ['Sin cupos', 'Datos inválidos'], criteria: [{ id: 'CA-1', text: 'La reserva aparece en la lista' }] }); c.project!.requirements = [rf];
    c.project!.diagramFacts = { schemaVersion: 1, entityRelations: [{ id: 'REL-1', fromEntityId: 'E-1', toEntityId: 'E-2', label: 'solicita', fromCardinality: 'uno', toCardinality: 'cero-muchos', identifying: false, status: 'confirmado' }] };
    return c;
}
async function seed(page: Page) { await page.addInitScript(c => localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify(c)), fixture()); await page.goto('./'); }
async function architecture(page: Page) {
    if ((await page.viewportSize())!.width < 768) await page.getByRole('button', { name: 'Documentos SDD', exact: true }).click();
    await page.getByRole('combobox', { name: 'Documento del kit', exact: true }).selectOption('docs/BASE_ARCHITECTURE.md');
    await page.locator('.document-content').evaluate(el => { el.scrollTop = el.scrollHeight; });
    await page.locator('.document-content .diagram-lazy').first().scrollIntoViewIfNeeded();
    const block = page.locator('.document-content .mermaid-block').first(); await expect(block).toBeVisible(); return block;
}
test('parser real valida arquitectura, ER, secuencias y trazabilidad con caracteres reservados', async ({ page }) => {
    await seed(page); const c = fixture(); c.project!.requirements[0].behavior = 'end: "texto" [dato] (valor); saltos\nconservados';
    const sources = compile(c).diagrams!.diagrams.map(d => d.source);
    const files = await readdir('dist/assets'), filename = files.find(f => /^mermaid\.core-.*\.js$/.test(f))!;
    const result = await page.evaluate(async ({ sources, path }) => {
        const { default: mermaid } = await import(path); mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', htmlLabels: false, layout: 'dagre' });
        const types: string[] = []; for (const source of sources) { const parsed = await mermaid.parse(source); types.push(parsed.diagramType); } return types;
    }, { sources, path: `/SDD-generator/assets/${filename}` });
    expect(result).toHaveLength(sources.length); expect(new Set(result).size).toBe(3);
});
test('visor renderiza, alterna fuente exacta y descarga SVG y PNG completos', async ({ page }) => {
    await seed(page); const coldStart = Date.now(); const block = await architecture(page);
    await expect(block.locator('.diagram-stage svg')).toBeVisible();
    console.info('Primera vista SVG H1:', JSON.stringify({ milliseconds: Date.now() - coldStart, cache: 'módulo sin ejecutar', browser: test.info().project.name }));
    await block.getByRole('button', { name: 'Código', exact: true }).click(); await expect(block.locator('.mermaid-source')).toContainText('flowchart TD');
    await expect(block.getByRole('button', { name: 'Código', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await block.getByRole('button', { name: 'Diagrama', exact: true }).click(); await expect(block.locator('.diagram-stage svg')).toBeVisible();
    await block.getByRole('button', { name: 'Acercar diagrama', exact: true }).click();
    await expect(block.locator('.diagram-tools span')).toHaveText('125 %');
    await block.getByRole('button', { name: 'Código', exact: true }).click();
    await block.getByRole('button', { name: 'Diagrama', exact: true }).click();
    await expect(block).toHaveAttribute('aria-busy', 'false');
    await expect(block.locator('.diagram-tools span')).toHaveText('125 %');
    const region = block.getByRole('region', { name: /Vista interactiva/ }); await region.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Home');
    for (const format of ['SVG', 'PNG']) {
        const [download] = await Promise.all([page.waitForEvent('download'), block.getByRole('button', { name: `Descargar ${format}`, exact: true }).click()]);
        const file = await readFile((await download.path())!);
        if (format === 'SVG') { expect(file.toString()).toContain('<svg'); expect(file.toString()).not.toMatch(/foreignObject|onclick|<script/); }
        else { expect([...file.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]); expect(file.readUInt32BE(16)).toBeGreaterThan(0); expect(file.readUInt32BE(20)).toBeLessThanOrEqual(4096); }
    }
});
test('mapa muestra ediciones sin aplicar y cancelar restaura ficha y fuente', async ({ page }) => {
    await seed(page); await page.getByText('Perfiles y componentes', { exact: true }).click();
    const map = page.getByRole('region', { name: 'Mapa de arquitectura', exact: true });
    await map.locator('.diagram-lazy').first().scrollIntoViewIfNeeded();
    await expect(map.locator('.diagram-stage svg').first()).toBeVisible();
    const field = page.getByLabel('Nombre del componente', { exact: true }).first(); await field.fill('Interfaz candidata');
    await expect(map).toHaveAttribute('data-preview-state', 'previa');
    await expect(map.locator('.diagram-stage svg').first()).toContainText('Interfaz candidata');
    expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sdd-studio:borrador:v1')!).profile.components[0].name)).toBe('Interfaz');
    await page.getByRole('button', { name: 'Descartar cambios sin aplicar', exact: true }).click(); await expect(field).toHaveValue('Interfaz');
    await expect(map).toHaveAttribute('data-preview-state', 'confirmada'); await expect(map.locator('.diagram-stage svg').first()).not.toContainText('Interfaz candidata');
});
test('primera apertura de un diagrama funciona offline tras preparar caché', async ({ page, context }) => {
    await seed(page); await expect(page.locator('.notice')).toContainText('Preparación sin conexión completa');
    await context.setOffline(true); await page.reload(); const block = await architecture(page); await expect(block.locator('.diagram-stage svg')).toBeVisible();
    const [download] = await Promise.all([page.waitForEvent('download'), block.getByRole('button', { name: 'Descargar SVG', exact: true }).click()]); expect((await readFile((await download.path())!, 'utf8'))).toContain('<svg');
});
for (const width of [320, 375, 767, 768, 1279, 1280, 1440]) test(`visor mantiene foco y no desborda a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 }); await seed(page); const block = await architecture(page); await expect(block.locator('.diagram-stage svg')).toBeVisible();
    const code = block.getByRole('button', { name: 'Código', exact: true }); await code.focus(); await page.keyboard.press('Enter'); await expect(code).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const sizes = await block.getByRole('button').evaluateAll(buttons => buttons.map(b => ({ width: b.getBoundingClientRect().width, height: b.getBoundingClientRect().height })));
    expect(sizes.every(s => s.width >= 44 && s.height >= 44)).toBe(true);
});
test('200 entradas incluyen espera del evento y commit con mapa de volumen activo', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Referencia de rendimiento en Chromium.'); test.setTimeout(90000);
    await page.addInitScript(() => { const state = { lastCommit: 0 }; (window as unknown as { diagramCommits: typeof state }).diagramCommits = state; (window as unknown as { __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown }).__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, inject: () => 1, onCommitFiberUnmount: () => {}, onCommitFiberRoot: () => { state.lastCommit = performance.now(); } }; });
    const c = fixture();
    c.profile!.profiles = [...structuredClone(builtinProfiles), ...Array.from({ length: 5 }, (_, i) => ({ ...structuredClone(builtinProfiles[3]), id: `PER-medir-${i}`, name: `Perfil ${i}`, support: 'declarada' as const }))];
    c.profile!.technologies = Array.from({ length: 50 }, (_, i) => ({ id: `TEC-${i}`, name: `Tecnología ${i}`, role: 'protocolo' as const, purpose: 'Medir', constraints: [], version: '', sources: [], reviewedAt: '', support: 'declarada' as const }));
    c.profile!.components = Array.from({ length: 20 }, (_, i) => ({ id: `CMP-${i}`, name: `Componente ${i}`, kind: 'otro' as const, responsibility: 'Medir', profileId: 'perfil-sistema', dependsOn: i ? [`CMP-${i - 1}`] : [], technologyIds: [`TEC-${i}`] }));
    c.project!.context.components = c.profile!.components.map(item => ({ id: item.id, text: item.responsibility, references: item.dependsOn, status: 'confirmado', origin: 'user' }));
    c.project!.requirements = Array.from({ length: 100 }, (_, i) => ({ ...createRequirement(`RF-${i}`), title: `Requisito ${i}`, behavior: 'Conservar datos', criteria: [{ id: `CA-${i}`, text: 'Conservación verificable' }] }));
    const date = '2026-10-08T12:00:00.000Z';
    const library = { schemaVersion: 1, revision: 1, activeId: 'P-0', projects: Array.from({ length: 20 }, (_, i) => ({ id: `P-${i}`, createdAt: date, updatedAt: date, draft: c, versions: [] })) };
    await page.addInitScript(({ c, library }) => { localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify(c)); localStorage.setItem('sdd-studio:biblioteca:v1', JSON.stringify(library)); }, { c, library });
    await page.goto('./'); await page.getByText('Perfiles y componentes', { exact: true }).click();
    const map = page.getByRole('region', { name: 'Mapa de arquitectura', exact: true }); await map.locator('.diagram-lazy').first().scrollIntoViewIfNeeded(); await expect(map.locator('.diagram-stage svg').first()).toBeVisible();
    await page.getByLabel('Nombre del componente', { exact: true }).first().scrollIntoViewIfNeeded();
    await page.getByLabel('Nombre del componente', { exact: true }).first().focus();
    const result = await page.getByLabel('Nombre del componente', { exact: true }).first().evaluate(async element => {
        const input = element as HTMLInputElement;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
        const samples: number[] = [], layout: number[] = [], waits: number[] = [], longTasks: number[] = [], mapTimes: number[] = [];
        let mapStart = 0, missingCommits = 0; const map = document.querySelector<HTMLElement>('[aria-label="Mapa de arquitectura"]')!;
        const mutation = new MutationObserver(() => { if (mapStart && map.querySelector('.diagram-stage')?.shadowRoot?.querySelector('svg')?.textContent?.includes(input.value)) { mapTimes.push(performance.now() - mapStart); mapStart = 0; } }); mutation.observe(map, { subtree: true, childList: true, attributes: true });
        const observer = new PerformanceObserver(list => longTasks.push(...list.getEntries().map(e => e.duration))); observer.observe({ type: 'longtask' });
        for (let i = 0; i < 200; i++) {
            const event = new Event('input', { bubbles: true }); const timestamp = event.timeStamp;
            await new Promise<void>(resolve => {
                const channel = new MessageChannel();
                channel.port1.onmessage = () => { waits.push(performance.now() - timestamp); setter.call(input, `Componente editado ${i}`); mapStart = performance.now(); input.dispatchEvent(event); queueMicrotask(() => { const commit = (window as unknown as { diagramCommits: { lastCommit: number } }).diagramCommits.lastCommit; if (commit < timestamp) missingCommits++; samples.push(performance.now() - timestamp); const paintStart = performance.now(); void input.getBoundingClientRect(); layout.push(performance.now() - paintStart); channel.port1.close(); channel.port2.close(); resolve(); }); };
                channel.port2.postMessage(null);
            });
            await new Promise(resolve => setTimeout(resolve, i % 10 === 9 ? 300 : 17));
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        const controls: Record<string, number[]> = {};
        async function measureControl(kind: string, target: HTMLElement, event: Event) {
            const timestamp = event.timeStamp;
            await new Promise<void>(resolve => { const channel = new MessageChannel(); channel.port1.onmessage = () => { target.dispatchEvent(event); queueMicrotask(() => { (controls[kind] ??= []).push(performance.now() - timestamp); channel.port1.close(); channel.port2.close(); resolve(); }); }; channel.port2.postMessage(null); });
            await new Promise(resolve => setTimeout(resolve, 17));
        }
        const buttons = () => Array.from(map.querySelectorAll<HTMLButtonElement>('button'));
        for (let i = 0; i < 200; i++) { const target = buttons().find(b => b.textContent === (i % 2 ? 'Diagrama' : 'Código'))!; await measureControl('alternador', target, new MouseEvent('click', { bubbles: true })); }
        for (let i = 0; i < 200; i++) { const target = buttons().find(b => b.getAttribute('aria-label') === (i % 2 ? 'Alejar diagrama' : 'Acercar diagrama'))!; await measureControl('zoom', target, new MouseEvent('click', { bubbles: true })); }
        const region = map.querySelector<HTMLElement>('.diagram-viewport')!;
        for (let i = 0; i < 200; i++) await measureControl('pan', region, new KeyboardEvent('keydown', { bubbles: true, key: i % 2 ? 'ArrowLeft' : 'ArrowRight' }));
        observer.disconnect(); mutation.disconnect();
        const describe = (values: number[]) => { values.sort((a, b) => a - b); return { samples: values.length, p50: values[Math.floor(values.length * .5)], p95: values[Math.ceil(values.length * .95) - 1], max: values.at(-1) }; };
        return { interaction: describe(samples), layout: describe(layout), missingCommits, controls: Object.fromEntries(Object.entries(controls).map(([key, values]) => [key, describe(values)])), queue: describe(waits), map: describe(mapTimes), longTasks, volume: { profiles: 10, components: 20, technologies: 50, projects: 20, requirements: 100 }, method: 'Evento creado antes de MessageChannel: espera de cola, dispatch, microtarea posterior al commit React comprobado por hook; layout forzado medido después, por separado.' };
    });
    console.info('Rendimiento H1 con mapa:', JSON.stringify(result));
    const navigation = await page.getByRole('combobox', { name: 'Documento del kit', exact: true }).evaluate(async element => {
        const select = element as HTMLSelectElement, values = Array.from(select.options).filter(o => ['README.md', 'MANUAL-PARA-USUARIO.txt'].includes((o.textContent ?? '').trim())).map(o => o.value), times: number[] = [];
        if (values.length !== 2) throw new Error('Faltan destinos del kit para medir navegación.');
        for (let i = 0; i < 200; i++) {
            const event = new Event('change', { bubbles: true }), timestamp = event.timeStamp;
            await new Promise<void>(resolve => { const channel = new MessageChannel(); channel.port1.onmessage = () => { select.value = values[i % 2]; select.dispatchEvent(event); queueMicrotask(() => { times.push(performance.now() - timestamp); channel.port1.close(); channel.port2.close(); resolve(); }); }; channel.port2.postMessage(null); });
            await new Promise(resolve => setTimeout(resolve, 17));
        }
        times.sort((a,b) => a-b); return { samples: times.length, p95: times[189], max: times.at(-1), destinations: values };
    });
    console.info('Navegación H1:', JSON.stringify(navigation)); expect(navigation.samples).toBe(200); expect(navigation.p95).toBeLessThan(16);
    await testInfo.attach('mapa-rendimiento', { body: JSON.stringify(result, null, 2), contentType: 'application/json' });
    for (const control of Object.values(result.controls)) { expect(control.samples).toBe(200); expect(control.p95).toBeLessThan(16); } expect(result.missingCommits).toBe(0); expect(result.interaction.samples).toBe(200); expect(result.interaction.p95).toBeLessThan(16); expect(result.map.samples).toBeGreaterThan(0); expect(result.map.p95).toBeLessThanOrEqual(300);
});
