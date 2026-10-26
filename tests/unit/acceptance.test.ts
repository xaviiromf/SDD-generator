import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import JSZip from 'jszip';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration, type Configuration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { exampleProject } from '../../src/catalog/exampleProject';
import { validateText } from '../../src/domain/validation';
import { safeDocumentPath } from '../../src/domain/validation';
import { brokenReferences } from '../../src/engine/references';
import { packageKit } from '../../src/services/zipExport';
/** Criterios de aceptación del generador (CA-01 a CA-13) como pruebas automáticas. */
const kit = (c: Configuration) => compile(c).documents;
const doc = (c: Configuration, id: string) => kit(c).find(d => d.id === id)!.content;
const decode = (text: string) =>
  text.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('\\|', '|');
function withRequirements(texts: { behavior: string; criterion: string }[]): Configuration {
  const c = emptyConfiguration();
  c.project!.requirements = texts.map((t, i) => ({
    ...createRequirement(`RF-${i + 1}`),
    title: `Requisito ${i + 1}`,
    status: 'confirmado',
    behavior: t.behavior,
    criteria: [{ id: `CA-${i + 1}`, text: t.criterion }],
  }));
  return c;
}
// 200 textos con acentos, tablas, código, signos y más de 2000 caracteres.
const corpus = Array.from({ length: 200 }, (_, i) => {
  const base = [
    `Señalización ${i}: año, pingüino, ¿qué? ¡sí! Ñandú`,
    `| columna ${i} | valor | otra |`,
    `Usa \`npm run build\` y <etiqueta> & "comillas" ${i}`,
    `Línea uno ${i}\nLínea dos con tabulación\tfinal`,
    `${'Texto largo con acentos áéíóú '.repeat(70)}${i}`,
  ][i % 5];
  return base;
});
describe('criterios de aceptación del generador', () => {
  it('CA-01: los textos del usuario se conservan sin truncar ni reescribir', () => {
    for (let i = 0; i < corpus.length; i += 10) {
      const batch = corpus.slice(i, i + 10);
      const c = withRequirements(
        batch.map(text => ({ behavior: text, criterion: text.replaceAll('\n', ' ') })),
      );
      const spec = decode(doc(c, 'spec'));
      for (const text of batch) {
        expect(spec).toContain(text);
        expect(spec).toContain(text.replaceAll('\n', ' '));
      }
      const idea = { ...c, idea: batch.join('\n') };
      expect(decode(doc(idea, 'spec'))).toContain(batch.join('\n'));
    }
  });
  it('CA-02: trazabilidad completa desde el Markdown exportado en diez proyectos mutados', () => {
    for (let n = 1; n <= 10; n++) {
      const c = withRequirements(
        Array.from({ length: n }, (_, i) => ({
          behavior: `Comportamiento ${i}`,
          criterion: `Resultado observable ${i}`,
        })),
      );
      const documents = kit(c),
        md = (id: string) => documents.find(d => d.id === id)!.content;
      const rfs = [...new Set([...md('spec').matchAll(/^### (RF-\d+) —/gm)].map(m => m[1]))];
      const tasks = [...md('tasks').matchAll(/\[(T-RF-\d+-(?:IMP|VAL))\]/g)].map(m => m[1]);
      const rows = [
        ...md('validation').matchAll(/^\| (RF-\d+) \| (CA-\d+):.*?\| (\S+) \| (\S+) \|/gm),
      ];
      expect(rfs).toHaveLength(n);
      expect(new Set(tasks).size).toBe(tasks.length);
      for (const rf of rfs) {
        const row = rows.filter(r => r[1] === rf);
        expect(row.length, rf).toBeGreaterThan(0);
        for (const r of row) {
          expect(tasks).toContain(r[3]);
          expect(tasks).toContain(r[4]);
        }
      }
      expect(brokenReferences(documents)).toEqual([]);
    }
  });
  it('CA-03: con entrada vacía no hay requisitos, criterios, decisiones ni contratos inventados', () => {
    const documents = kit(emptyConfiguration()),
      text = documents.map(d => d.content).join('\n');
    expect(text).not.toMatch(/\bRF-\d|\bCA-\d|\bCTR-\d|\bT-RF-/);
    const decisions = documents.find(d => d.id === 'docs/DECISIONS.md')!.content;
    const rows = [...decisions.matchAll(/^\| D-\d+ \|(.*)$/gm)].map(m => m[1]);
    // Solo las preferencias de estilo por defecto, declaradas como tales.
    expect(rows.every(r => /Valor por defecto|No aplicable/.test(r))).toBe(true);
  });
  it('CA-04: lo inferido o de un conjunto queda marcado y no entra en la lista de trabajo', () => {
    const c = withRequirements([{ behavior: 'Guardar', criterion: 'Se guarda' }]);
    c.project!.requirements.push({
      ...createRequirement('RF-9'),
      title: 'Sugerencia',
      status: 'propuesto',
      origin: 'local',
    });
    c.selections = { language: ['typescript'], testing: ['vitest'] };
    c.origins = { language: 'preset', testing: 'inference' };
    const decisions = doc(c, 'docs/DECISIONS.md');
    expect(decisions).toContain('Propuesta por un conjunto; sin aceptar');
    expect(decisions).toContain('Inferida; sin aceptar');
    expect(doc(c, 'tasks')).not.toContain('[T-RF-9-');
    expect(doc(c, 'validation')).not.toContain('| RF-9 |');
    expect(doc(c, 'plan')).toContain('## Propuesta del generador (no verificada)');
  });
  it('CA-05: toda validación empieza en «No ejecutado» y las plantillas no escriben resultados', () => {
    const c = withRequirements(
      Array.from({ length: 5 }, (_, i) => ({ behavior: `B${i}`, criterion: `C${i}` })),
    );
    const rows = doc(c, 'validation')
      .split('\n')
      .filter(l => /^\| RF-/.test(l));
    expect(rows.length).toBe(5);
    expect(rows.every(l => l.endsWith('| No ejecutado |'))).toBe(true);
    const source = ['validation', 'tasks', 'spec', 'plan']
      .map(f => readFileSync(`src/engine/templates/${f}.ts`, 'utf8'))
      .join('\n');
    expect(source).not.toMatch(/\| (?:Ejecutado|Superada?|Correcto|OK) \|/);
  });
  it('CA-06: «Completo» no aparece como estado en el kit', () => {
    for (const c of [emptyConfiguration(), exampleProject()]) {
      const result = compile(c);
      expect(result.documents.map(d => d.content).join('')).not.toMatch(/\bCompleto\b/);
      expect(result.documentStatuses!.every(s => s.state !== ('completo' as string))).toBe(true);
    }
  });
  it('CA-07: ningún camino de autorización sin acción humana; editar aguas arriba invalida', () => {
    const c = withRequirements([{ behavior: 'Guardar', criterion: 'Se guarda' }]);
    const checkpoints = compile(c).checkpoints!;
    expect(checkpoints.filter(cp => cp.place === 'repositorio').every(cp => !cp.met)).toBe(true);
    expect(checkpoints.find(cp => cp.id === 'P2')!.met).toBe(true);
    c.project!.requirements[0].criteria = [];
    expect(compile(c).checkpoints!.find(cp => cp.id === 'P2')!.met).toBe(false);
    expect(doc(c, 'AGENTS.md')).toContain('Nunca escribas ni modifiques');
    expect(doc(c, 'docs/PROJECT_STATUS.md')).toContain('Tareas autorizadas: Ninguna');
  });
  it('CA-08 y CA-09: siete archivos o menos, sin enlaces rotos, y el ZIP por defecto es el mínimo', async () => {
    const documents = kit(emptyConfiguration());
    expect(documents.length).toBeLessThanOrEqual(7);
    expect(brokenReferences(documents)).toEqual([]);
    const size = new TextEncoder().encode(documents.map(d => d.content).join('')).length;
    expect(size).toBeLessThan(1024 * 1024);
    const zip = await JSZip.loadAsync(await packageKit(documents));
    expect(Object.values(zip.files).filter(f => !f.dir)).toHaveLength(7);
  });
  it('CA-11: detecta credenciales sin falsos positivos y no saca rutas del ZIP', () => {
    const credentials = Array.from({ length: 50 }, (_, i) => {
      const value = `x${i}Y7`.repeat(5);
      return [
        `sk-${value}`,
        `ghp_${value}`,
        `AKIA${'ABCD1234EFGH5678'.slice(i % 4)}${'Z'.repeat(i % 4)}`,
        `api_key: ${value}`,
        `password="${value}"`,
        `secret=${value}`,
        `token: ${value}`,
        '-----BEGIN RSA PRIVATE KEY-----',
        '-----BEGIN OPENSSH PRIVATE KEY-----',
        `API-KEY = '${value}'`,
      ][i % 10];
    });
    const clean = Array.from(
      { length: 100 },
      (_, i) =>
        [
          `El token de sesión caduca a los ${i} minutos`,
          'password: contraseñadelusuario',
          `La clave primaria de la tabla ${i} es el identificador`,
          'secret: configuracion-del-servicio',
          `Reserva número ${i} para el cliente con matrícula ABCD`,
        ][i % 5],
    );
    for (const text of credentials)
      expect(
        validateText(text).some(d => d.blocking),
        text,
      ).toBe(true);
    for (const text of clean)
      expect(
        validateText(text).some(d => d.blocking),
        text,
      ).toBe(false);
    for (const path of ['../fuera.md', '/etc/passwd', 'specs/001-mi-proyecto/../../x.md'])
      expect(safeDocumentPath(path)).toBe(false);
  });
  it('CA-12: las funciones aplazadas no están en el flujo y MCP ya no existe', () => {
    for (const file of ['src/store/mcpStore.ts', 'src/services/mcpClient.ts'])
      expect(existsSync(file)).toBe(false);
    const visible = ['src/app/StudioLayout.tsx', 'src/components/configurator/Configurator.tsx']
      .map(f => readFileSync(f, 'utf8'))
      .join('\n');
    expect(visible).not.toMatch(/<ProjectLibrary\b|<ProfileStudio\b|<McpStatus\b/);
  });
  it.todo(
    'CA-10: tiempo de preparación con participantes (no automatizado: requiere personas y cronómetro)',
  );
  it.todo(
    'CA-13: eficacia del revisor (no automatizado: requiere un modelo externo y un corpus de 30 kits con defectos sembrados)',
  );
});
