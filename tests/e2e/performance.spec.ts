import { test, expect } from '@playwright/test';
test.use({ trace: 'off' });
test('presupuestos de edición y generación en producción', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'El entorno de referencia de rendimiento es Chromium.');
    test.setTimeout(60000);
    await page.goto('./');
    await page.getByLabel('Conjunto predefinido').selectOption('client-spa');
    await page.getByRole('button', { name: 'Aplicar conjunto', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true })).toBeEnabled();
    const measurements = await page.evaluate(async () => {
        const input = document.querySelector<HTMLTextAreaElement>('.idea-field textarea')!;
        const durations: number[] = [];
        let start = 0;
        const entries: number[] = [];
        const observer = new PerformanceObserver(list => { entries.push(...list.getEntries().map(e => e.duration)); });
        observer.observe({ type: 'longtask', buffered: false });
        const capture = () => { start = performance.now(); };
        const bubble = () => { durations.push(performance.now() - start); };
        document.addEventListener('input', capture, true);
        document.addEventListener('input', bubble);
        const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!;
        for (let i = 0; i < 200; i++) {
            setter.call(input, ('reservas '.repeat(2220) + String(i)).slice(0, 20000));
            input.dispatchEvent(new Event('input', { bubbles: true }));
            await new Promise(resolve => setTimeout(resolve, 17));
        }
        await new Promise(resolve => setTimeout(resolve, 250));
        const generationTimes:number[]=[];
        for(let i=0;i<30;i++){
            const begin=performance.now();
            setter.call(input,'reservas '.repeat(2220)+'final'+i);
            input.dispatchEvent(new Event('input',{bubbles:true}));
            await new Promise<void>(resolve=>{const mutation=new MutationObserver(()=>{const button=Array.from(document.querySelectorAll('button')).find(b=>b.textContent?.includes('Descargar Kit SDD'));if(button&&!button.disabled){mutation.disconnect();resolve();}});mutation.observe(document.body,{subtree:true,attributes:true,childList:true});});
            generationTimes.push(performance.now()-begin);
        }
        generationTimes.sort((a,b)=>a-b);
        document.removeEventListener('input', capture, true);
        document.removeEventListener('input', bubble);
        observer.disconnect();
        durations.sort((a, b) => a - b);
        return { inputP95: durations[Math.ceil(durations.length * .95) - 1], generationMs: generationTimes[28], generationSamples:generationTimes.length, longTasks: entries, events: durations.length };
    });
    console.info('Mediciones de rendimiento:', JSON.stringify(measurements));
    await testInfo.attach('rendimiento', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' });
    expect(measurements.inputP95).toBeLessThan(16);
    expect(measurements.generationMs).toBeLessThanOrEqual(150);
    expect(measurements.longTasks).toEqual([]);
});
test('mide treinta cambios de conjunto y treinta ZIP en navegador', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Medición de referencia en Chromium.');
    test.setTimeout(60000);
    await page.goto('./');
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => { const metrics: {
        start: number;
        times: number[];
    } = { start: 0, times: [] }; (window as unknown as {
        presetMetrics: typeof metrics;
    }).presetMetrics = metrics; document.addEventListener('click', e => { if ((e.target as HTMLElement).textContent === 'Aplicar conjunto')
        metrics.start = performance.now(); }, true); document.addEventListener('click', e => { if ((e.target as HTMLElement).textContent === 'Aplicar conjunto')
        metrics.times.push(performance.now() - metrics.start); }); });
    for (let i = 0; i < 30; i++) {
        await page.getByLabel('Conjunto predefinido').selectOption(i % 2 ? 'client-spa' : 'systems-cli');
        await page.getByRole('button', { name: 'Aplicar conjunto', exact: true }).click();
    }
    await expect(page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true })).toBeEnabled();
    for (let i = 0; i < 31; i++) {
        await page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true }).click();
        await expect.poll(() => page.evaluate(() => performance.getEntriesByName('sdd:empaquetado-zip').length)).toBe(i + 1);
    }
    const result = await page.evaluate(() => { const preset = (window as unknown as {
        presetMetrics: {
            times: number[];
        };
    }).presetMetrics.times.sort((a, b) => a - b); const zip = performance.getEntriesByName('sdd:empaquetado-zip').slice(1).map(e => e.duration).sort((a, b) => a - b); return { presetSamples: preset.length, presetP95: preset[28], zipSamples: zip.length, zipP95: zip[28] }; });
    console.info('Mediciones de conjunto y ZIP:', JSON.stringify(result));
    await testInfo.attach('conjuntos-zip', { body: JSON.stringify(result), contentType: 'application/json' });
    expect(result.presetSamples).toBe(30);
    expect(result.presetP95).toBeLessThan(16);
    expect(result.zipSamples).toBe(30);
    expect(result.zipP95).toBeLessThan(100);
});

test('200 ajustes actualizan la muestra con p95 menor de 16 ms sin renderizar raíz, cabecera ni idea', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'Medición de referencia en Chromium.'); test.setTimeout(60000);
    await page.addInitScript(() => {
        type Fiber = { child: Fiber | null; sibling: Fiber | null; return: Fiber | null; stateNode: HTMLElement | null; type: unknown; flags: number; memoizedProps: unknown; memoizedState: unknown; alternate: Fiber | null };
        const tracked = new Map<unknown, string>(); const previous = new WeakMap<Fiber, { props: unknown; state: unknown }>(); const renders: Record<string, number> = {}; let commits = 0;
        (window as unknown as { designRenders: unknown }).designRenders = { renders, get commits() { return commits; } };
        (window as unknown as { __REACT_DEVTOOLS_GLOBAL_HOOK__: unknown }).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
            supportsFiber: true, inject: () => 1, onCommitFiberUnmount: () => {},
            onCommitFiberRoot: (_id: number, root: { current: Fiber }) => {
                commits++;
                function visit(f: Fiber | null) { if (!f) return;
                    if (f.stateNode instanceof HTMLElement) {
                        if (f.stateNode.matches('.studio-header,.idea-content,.file-tree,.maturity,select[aria-label=Estilo]')) {
                            let parent = f.return; while (parent && typeof parent.type !== 'function') parent = parent.return;
                            if (parent) { const key = f.stateNode.classList.contains('studio-header') ? 'cabecera' : f.stateNode.classList.contains('idea-content') ? 'idea' : f.stateNode.classList.contains('file-tree') ? 'arbol' : f.stateNode.classList.contains('maturity') ? 'madurez' : 'configuracion'; tracked.set(parent.type, key); if (key === 'cabecera') { let ancestor = parent.return; while (ancestor && typeof ancestor.type !== 'function') ancestor = ancestor.return; if (ancestor) tracked.set(ancestor.type, 'raiz'); } }
                        }
                    }
                    visit(f.child);
                    const label = tracked.get(f.type); if (label) { const last = previous.get(f) ?? (f.alternate ? previous.get(f.alternate) : undefined); if (!last || f.memoizedProps !== last.props || f.memoizedState !== last.state) renders[label] = (renders[label] ?? 0) + 1; const snapshot = { props: f.memoizedProps, state: f.memoizedState }; previous.set(f,snapshot); if (f.alternate) previous.set(f.alternate,snapshot); }
                    visit(f.sibling);
                }
                visit(root.current);
            },
        };
    });
    await page.goto('./'); await page.getByRole('button', { name: 'Estética y tokens' }).click(); await page.getByText('Ajustes Avanzados de Diseño', { exact: true }).click();
    await page.getByLabel('HEX de texto', { exact: true }).fill('#DDDDDD'); await expect(page.getByTestId('design-sandbox')).toBeVisible(); await page.waitForTimeout(250);
    const result = await page.evaluate(async () => {
        const metrics = (window as unknown as { designRenders: { renders: Record<string, number>; commits: number } }).designRenders;
        const before = { ...metrics.renders }; const commitsBefore = metrics.commits;
        const sandbox = document.querySelector('[data-testid=design-sandbox]')!;
        const input = document.querySelector<HTMLInputElement>('[aria-label="HEX de texto"]')!;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!; const times: number[] = [];
        for (let i = 0; i < 200; i++) {
            const value = i % 2 ? '#FFFFFF' : '#EEEEEE'; const start = performance.now();
            await new Promise<void>(resolve => { const observer = new MutationObserver(() => { if ((sandbox as HTMLElement).style.getPropertyValue('--text') === value) { void getComputedStyle(sandbox).color; times.push(performance.now() - start); observer.disconnect(); resolve(); } }); observer.observe(sandbox, { attributes: true, attributeFilter: ['style'] }); setter.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); });
            await new Promise(resolve => setTimeout(resolve, 17));
        }
        times.sort((a,b) => a-b);
        return { samples: times.length, p95: times[189], commits: metrics.commits - commitsBefore, foreignRenders: Object.fromEntries(['raiz','cabecera','idea','arbol','madurez','configuracion'].map(key => [key, (metrics.renders[key] ?? 0) - (before[key] ?? 0)])), tracked: Object.keys(metrics.renders) };
    });
    console.info('Mediciones de muestra:', JSON.stringify(result)); await testInfo.attach('muestra-diseno', { body: JSON.stringify(result), contentType: 'application/json' });
    expect(result.samples).toBe(200); expect(result.p95).toBeLessThan(16); expect(result.commits).toBeGreaterThan(0); expect(result.tracked.sort()).toEqual(['arbol','cabecera','configuracion','idea','madurez','raiz']); expect(result.foreignRenders).toEqual({ raiz: 0, cabecera: 0, idea: 0, arbol: 0, madurez: 0, configuracion: 0 });
});
