import { it, expect } from 'vitest';
import { packageKit } from '../../src/services/zipExport';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
it('empaqueta y descomprime el caso de aproximadamente 1 MiB',async()=>{
    const documents=compile(emptyConfiguration()).documents.map(d=>({...d,content:'a'.repeat(30800)}));
    const start=performance.now();const bytes=await packageKit(documents);
    const {default:JSZip}=await import('jszip');const zip=await JSZip.loadAsync(bytes);
    expect((await zip.file('specs/001-mi-proyecto/spec.md')!.async('string')).length).toBe(30800);
    console.info(JSON.stringify({tipo:'ZIP máximo',textoBytes:1047200,tiempoMs:performance.now()-start}));
});
it('empaqueta 30 kits de referencia en el presupuesto', async () => {
    const documents = compile({ ...emptyConfiguration(), idea: 'reservas '.repeat(2200) }).documents;
    const size = new TextEncoder().encode(documents.map(d => d.content).join('')).byteLength;
    expect(size).toBeLessThanOrEqual(250 * 1024);
    await packageKit(documents);
    const times = [];
    for (let i = 0; i < 30; i++) {
        const start = performance.now();
        await packageKit(documents);
        times.push(performance.now() - start);
    }
    times.sort((a, b) => a - b);
    const p95 = times[28];
    console.info(JSON.stringify({ tipo: 'ZIP de referencia', bytes: size, muestras: 30, p95_ms: p95 }));
    expect(p95).toBeLessThan(100);
});
