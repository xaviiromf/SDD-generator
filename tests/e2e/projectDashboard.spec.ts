import { builtinProfiles } from '../../src/catalog/profiles';
import { test, expect } from '@playwright/test';
import { visualProject } from '../fixtures/visualProject';
import { compile } from '../../src/engine/compiler';
test.use({ trace: 'off' });
test('portada comparte revisión, métricas y arquitectura; navega con foco sin alterar el kit', async ({ page }) => {
    const c = visualProject(), expected = compile(c);
    await page.addInitScript(c => localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify(c)), c); await page.goto('./');
    await page.getByRole('button', { name: 'Portada', exact: true }).click();
    const dashboard = page.getByRole('region', { name: 'Portada del proyecto', exact: true });
    await expect(dashboard.getByRole('heading', { name: c.name, exact: true })).toBeFocused();
    for (const [label, count] of [['Requisitos funcionales', 1], ['Requisitos no funcionales', 1], ['Componentes', 2], ['Entidades', 2], ['Tecnologías', 1]] as const) await expect(dashboard.locator('.dashboard-metric').filter({ hasText: label }).locator('strong')).toHaveText(String(count));
    await expect(dashboard).toContainText('Tecnología declarada'); await expect(dashboard).toContainText('pruebas y aceptación requieren evidencia propia');
    const block = dashboard.locator('.mermaid-block').first(); await expect(block.locator('.diagram-stage svg')).toBeVisible();
    await block.getByRole('button', { name: 'Código', exact: true }).click(); await expect(block.locator('code')).toHaveText(expected.diagrams!.diagrams.find(d => d.kind === 'architecture')!.source);
    await dashboard.getByRole('button', { name: 'Abrir arquitectura', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Revisa el contrato', exact: true })).toBeFocused(); await expect(page.getByRole('combobox', { name: 'Documento del kit', exact: true })).toHaveValue('docs/BASE_ARCHITECTURE.md');
    await expect(page.getByRole('combobox', { name: 'Documento del kit', exact: true }).locator('option')).toHaveCount(34);
    await page.getByRole('button', { name: 'Portada', exact: true }).click(); await page.getByRole('button', { name: 'Abrir validación prevista', exact: true }).click();
    await expect(page.locator('.document-state .document-status-badge')).toContainText('Borrador'); await expect(page.locator('.document-state')).toContainText('no ejecutadas');
});
test('portada vacía mantiene pendientes y primera apertura funciona sin red preparada', async ({ page, context }) => {
    await page.goto('./'); await expect(page.locator('.notice')).toContainText('Preparación sin conexión completa'); await context.setOffline(true); await page.reload();
    await page.getByRole('button', { name: 'Portada', exact: true }).click(); const dashboard = page.getByRole('region', { name: 'Portada del proyecto', exact: true });
    await expect(dashboard.getByRole('heading', { name: 'Mi proyecto', exact: true })).toBeVisible(); await expect(dashboard.locator('.dashboard-metric').filter({ hasText: 'Requisitos funcionales' }).locator('strong')).toHaveText('0');
    await expect(dashboard.locator('.diagram-stage svg').first()).toBeVisible(); await expect(dashboard).toContainText('Borrador documental');
    await dashboard.getByRole('button', { name: 'Editar idea y requisitos', exact: true }).click(); await expect(page.getByRole('heading', { name: 'Cuenta tu idea', exact: true })).toBeFocused();
});
for (const width of [320, 375, 767, 768, 1279, 1280, 1440]) test(`portada accesible a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 }); await page.goto('./'); await page.getByRole('button', { name: 'Portada', exact: true }).click();
    const dashboard = page.getByRole('region', { name: 'Portada del proyecto', exact: true }); await expect(dashboard.getByRole('heading', { name: 'Mi proyecto', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const sizes = await dashboard.getByRole('button').evaluateAll(buttons => buttons.map(b => ({ width: b.getBoundingClientRect().width, height: b.getBoundingClientRect().height })));
    expect(sizes.length).toBeGreaterThanOrEqual(6); expect(sizes.every(s => s.width >= 44 && s.height >= 44)).toBe(true);
    const link = dashboard.getByRole('button', { name: 'Editar idea y requisitos', exact: true }); await link.focus(); await page.keyboard.press('Enter'); await expect(page.getByRole('heading', { name: 'Cuenta tu idea', exact: true })).toBeFocused();
});
test('200 alternadores y navegación con arquitectura de portada activa incluyen cola y commit', async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium', 'Referencia de rendimiento en Chromium.'); test.setTimeout(90000);
    await page.addInitScript(() => { const state = { lastCommit: 0 }; (window as unknown as { dashboardCommits: typeof state }).dashboardCommits = state; (window as unknown as { __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown }).__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, inject: () => 1, onCommitFiberUnmount: () => {}, onCommitFiberRoot: () => { state.lastCommit = performance.now(); } }; });
    const c = visualProject(); c.project!.requirements = Array.from({ length: 100 }, (_, i) => ({ ...c.project!.requirements[0], id: `RF-${i + 100}`, criteria: [{ id: `CA-${i + 100}`, text: 'Conservación verificable' }] }));
    c.profile!.profiles = [...structuredClone(builtinProfiles), ...Array.from({ length: 5 }, (_, i) => ({ ...structuredClone(builtinProfiles[3]), id: `PER-banco-${i}`, name: `Perfil ${i}`, support: 'declarada' as const }))];
    c.profile!.technologies = Array.from({ length: 50 }, (_, i) => ({ id: `TEC-${i}`, name: `Tecnología ${i}`, role: 'protocolo' as const, purpose: 'Medir', constraints: [], version: '', sources: [], reviewedAt: '', support: 'declarada' as const }));
    c.profile!.components = Array.from({ length: 20 }, (_, i) => ({ id: `CMP-${i}`, name: `Componente ${i}`, kind: 'otro' as const, responsibility: 'Medir', profileId: 'perfil-sistema', dependsOn: i ? [`CMP-${i - 1}`] : [], technologyIds: [`TEC-${i}`] }));
    c.project!.context.components = c.profile!.components.map(item => ({ id: item.id, text: item.responsibility, references: item.dependsOn, status: 'confirmado', origin: 'user' }));
    c.project!.diagramFacts!.entityRelations = Array.from({ length: 100 }, (_, i) => ({ ...c.project!.diagramFacts!.entityRelations[0], id: `REL-${i}`, label: `Relación ${i}` }));
    const date = '2026-10-08T12:00:00.000Z', library = { schemaVersion: 1, revision: 1, activeId: 'P-0', projects: Array.from({ length: 20 }, (_, i) => ({ id: `P-${i}`, createdAt: date, updatedAt: date, draft: c, versions: [] })) };
    await page.addInitScript(({ c, library }) => { localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify(c)); localStorage.setItem('sdd-studio:biblioteca:v1', JSON.stringify(library)); }, { c, library }); await page.goto('./'); await expect(page.locator('.notice')).toContainText('Preparación sin conexión completa'); await page.getByRole('button', { name: 'Portada', exact: true }).click();
    const dashboard = page.getByRole('region', { name: 'Portada del proyecto', exact: true }); await expect(dashboard.locator('.diagram-stage svg').first()).toBeVisible();
    const metrics = await dashboard.evaluate(async element => {
        const samples: Record<string, number[]> = {}, layouts: Record<string, number[]> = {}, longTasks: number[] = []; let missingCommits = 0, svgMutations = 0;
        const mutation = new MutationObserver(records => { svgMutations += records.filter(record => record.type === 'attributes' && record.attributeName === 'data-svg-ready').length; }); mutation.observe(element, { subtree: true, attributes: true });
        const observer = new PerformanceObserver(list => longTasks.push(...list.getEntries().map(e => e.duration))); observer.observe({ type: 'longtask' });
        async function measure(kind: string, target: HTMLElement, event: Event) {
            const timestamp = event.timeStamp; await new Promise<void>(resolve => { const channel = new MessageChannel(); channel.port1.onmessage = () => { target.dispatchEvent(event); queueMicrotask(() => { const commit = (window as unknown as { dashboardCommits: { lastCommit: number } }).dashboardCommits.lastCommit; if (commit < timestamp) missingCommits++; (samples[kind] ??= []).push(performance.now() - timestamp); const layoutStart = performance.now(); void document.querySelector('.workspace')?.getBoundingClientRect(); (layouts[kind] ??= []).push(performance.now() - layoutStart); channel.port1.close(); channel.port2.close(); resolve(); }); }; channel.port2.postMessage(null); }); await new Promise(resolve => setTimeout(resolve, 17));
        }
        for (let i = 0; i < 200; i++) { const target = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent === (i % 2 ? 'Diagrama' : 'Código'))!; await measure('alternador', target, new MouseEvent('click', { bubbles: true })); }
        const toggleMutations = svgMutations; svgMutations = 0;
        for (let i = 0; i < 200; i++) { const target = Array.from(document.querySelectorAll<HTMLButtonElement>('.panel-navigation button')).find(b => b.textContent === (i % 2 ? 'Portada' : 'Documentos SDD'))!; await measure('navegacion', target, new MouseEvent('click', { bubbles: true })); }
        observer.disconnect(); mutation.disconnect(); return { svgMutations, toggleMutations, layout: Object.fromEntries(Object.entries(layouts).map(([name, values]) => { values.sort((a,b) => a-b); return [name, { samples: values.length, p95: values[189], max: values.at(-1) }]; })), scenarios: Object.fromEntries(Object.entries(samples).map(([name, values]) => { values.sort((a,b) => a-b); return [name, { samples: values.length, p50: values[99], p95: values[189], max: values.at(-1) }]; })), missingCommits, longTasks, volume: { profiles: 10, components: 20, technologies: 50, projects: 20, requirements: 100, relations: 100 }, method: 'Evento creado antes de MessageChannel, cola incluida hasta microtarea posterior al commit React; caché preparada del SVG.' };
    });
    console.info('Rendimiento H2 portada:', JSON.stringify(metrics)); await info.attach('portada-rendimiento', { body: JSON.stringify(metrics, null, 2), contentType: 'application/json' });
    expect(metrics.missingCommits).toBe(0); expect(metrics.svgMutations).toBe(0); expect(metrics.toggleMutations).toBe(0); for (const scenario of Object.values(metrics.scenarios)) { expect(scenario.samples).toBe(200); expect(scenario.p95).toBeLessThan(16); }
});
