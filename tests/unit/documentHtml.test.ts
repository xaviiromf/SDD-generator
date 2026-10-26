import { expect, it } from 'vitest';
import { documentHtml } from '../../src/components/export/documentHtml';
import { compile } from '../../src/engine/compiler';
import { exampleProject } from '../../src/catalog/exampleProject';
it('exporta HTML autónomo sin scripts, con texto escapado y fuente Mermaid de respaldo', async () => {
  const c = { ...exampleProject(), idea: 'Probar <script>alert(1)</script> & comillas "dobles"' };
  const spec = compile(c).documents.find(d => d.id === 'spec')!;
  const html = await documentHtml(spec);
  expect(html.startsWith('<!doctype html>')).toBe(true);
  expect(html).toContain('<html lang="es">');
  expect(html).not.toMatch(/<script/i);
  expect(html).toContain('&lt;script&gt;');
  expect(html).toContain('<h1>Especificación — Reservas del taller</h1>');
  // Sin navegador el renderizador no está disponible: se conserva la fuente del diagrama.
  expect(html).toContain('sequenceDiagram');
  const manual = { ...spec, format: 'TXT' as const, content: 'Texto plano <b>sin marcado</b>' };
  expect(await documentHtml(manual)).toContain('<pre>');
});
