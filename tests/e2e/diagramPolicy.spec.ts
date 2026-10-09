import { test, expect } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
let server: ChildProcess;
test.beforeAll(async () => {
    server = spawn('npm', ['run', 'dev', '--', '--port', '4175', '--strictPort'], { stdio: 'ignore', detached: true });
    for (let i = 0; i < 100; i++) { try { if ((await fetch('http://127.0.0.1:4175/SDD-generator/')).ok) return; } catch { /* Esperar servidor local. */ } await new Promise(resolve => setTimeout(resolve, 100)); }
    throw new Error('No se pudo abrir el banco público SVG.');
});
test.afterAll(() => { if (server?.pid) process.kill(-server.pid, 'SIGTERM'); });
test('SVG autónomo conserva referencias locales, distingue IDs y bloquea contenido activo', async ({ page }) => {
    await page.goto('http://127.0.0.1:4175/SDD-generator/');
    const result = await page.evaluate(async () => {
        const path = '/SDD-generator/src/services/diagramSvgPolicy.ts';
        const { sanitizeDiagramSvg } = await import(path);
        const wrap = (body: string) => `<svg xmlns="http://www.w3.org/2000/svg" id="prueba" viewBox="0 0 200 100">${body}</svg>`;
        const accepted = sanitizeDiagramSvg(wrap('<defs><marker id="punta"><path d="M0 0 L5 5"/></marker></defs><style>#prueba .linea{stroke:#333;marker-end:url(#punta)}</style><path class="linea" d="M0 0 L100 50"/>'), { title: 'Arquitectura de prueba', description: 'Dos nodos relacionados.' });
        const xml = new DOMParser().parseFromString(accepted.sanitizedSvg, 'image/svg+xml');
        const rejected: string[] = [];
        const hostile = ['<script>alert(1)</script>', '<foreignObject><div>HTML</div></foreignObject>', '<rect onclick="alert(1)"/>', '<image href="https://example.com/x.svg"/>', '<style>@import url(https://example.com/x.css);</style>', '<style>#prueba rect{fill:url(https://example.com/x.svg)}</style>', '<style>body{color:red}</style>', '<style>#prueba + body{color:red}</style>', '<path marker-end="url(#ausente)"/>', '<g id="igual"/><g id="igual"/>', '<filter><feImage href="https://example.com/x"/></filter>'];
        for (const body of hostile) { try { sanitizeDiagramSvg(wrap(body)); } catch { rejected.push(body); } }
        const rendererPath = '/SDD-generator/src/services/diagramRenderer.ts';
        const { renderDiagram } = await import(rendererPath);
        const sources = ['flowchart TD\nA["Uno"] --> B["Dos"]', 'erDiagram\nA["Persona"]\nB["Reserva"]\nA ||..o{ B : "solicita"', 'sequenceDiagram\nactor A as Cliente\nparticipant P as Proyecto\nalt Flujo feliz\nA->>P: Solicitud\nP-->>A: Respuesta\nelse Excepción\nP-->>A: Pendiente\nend'];
        const svg: string[] = [];
        for (let i = 0; i < sources.length; i++) { svg.push((await renderDiagram({ instanceId: `politica_${i}`, source: sources[i], revision: 1, token: 1, theme: 'claro', title: 'Diagrama accesible', description: 'Descripción textual completa.' })).sanitizedSvg); }
        const obsolete = renderDiagram({ instanceId: 'carrera', source: sources[0], revision: 1, token: 1, theme: 'claro', title: 'Anterior', description: 'Anterior' });
        const current = renderDiagram({ instanceId: 'carrera', source: sources[0], revision: 2, token: 2, theme: 'claro', title: 'Vigente', description: 'Vigente' });
        const race = await Promise.allSettled([obsolete, current]);
        const documents = svg.map(s => new DOMParser().parseFromString(s, 'image/svg+xml'));
        const ids = documents.flatMap(d => Array.from(d.querySelectorAll('[id]')).map(e => e.id));
        return { race: race.map(r => r.status), accepted: !xml.querySelector('parsererror'), title: xml.querySelector('title')?.textContent, rejected: rejected.length, expected: hostile.length, rendered: documents.length, unique: new Set(ids).size === ids.length, descriptions: documents.map(d => d.querySelector('desc')?.textContent) };
    });
    expect(result.race).toEqual(['rejected', 'fulfilled']); expect(result.accepted).toBe(true); expect(result.title).toBe('Arquitectura de prueba'); expect(result.rejected).toBe(result.expected); expect(result.rendered).toBe(3); expect(result.unique).toBe(true); expect(result.descriptions).toEqual(Array(3).fill('Descripción textual completa.'));
});
