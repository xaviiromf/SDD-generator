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
