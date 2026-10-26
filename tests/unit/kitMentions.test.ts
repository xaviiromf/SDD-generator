import { it, expect } from 'vitest';
import { compile } from '../../src/engine/compiler';
import { brokenReferences } from '../../src/engine/references';
import { emptyConfiguration } from '../../src/domain/models';
import { exampleProject } from '../../src/catalog/exampleProject';
import { presets, resolvePreset } from '../../src/catalog/presets';
import { visualProject } from '../fixtures/visualProject';
/**
 * Menciones en prosa a documentos del espacio del kit (raíz, docs/, specs/, prompts/) que no están
 * entre los siete. Las rutas del repositorio destino de «Propuesta del generador» quedan fuera:
 * no son documentos del kit.
 */
function missingMentions(documents: { path: string; content: string }[]) {
  const known = new Set(documents.map(d => d.path.split('/').pop()!));
  const paths = new Set(documents.map(d => d.path));
  const missing: string[] = [];
  for (const d of documents) {
    const cut = d.content.indexOf('## Propuesta del generador');
    const prose = cut < 0 ? d.content : d.content.slice(0, cut);
    for (const [mention] of prose.matchAll(
      /\b(?:(?:docs|prompts|specs\/[\w-]+)\/)?[A-Za-z][\w-]*\.(?:md|txt)\b/g,
    ))
      if (mention.includes('/') ? !paths.has(mention) : !known.has(mention))
        missing.push(`${d.path}: ${mention}`);
  }
  return missing;
}
const configurations = [
  emptyConfiguration(),
  exampleProject(),
  visualProject(),
  ...presets.map(preset => ({
    ...emptyConfiguration(),
    selections: resolvePreset(
      preset,
      Object.fromEntries((preset.variants ?? []).map(v => [v.field, v.options[0]])),
    ),
  })),
];
it('ningún enlace ni mención del kit apunta a un archivo ausente', () => {
  for (const c of configurations) {
    const { documents } = compile(c);
    expect(brokenReferences(documents)).toEqual([]);
    expect(missingMentions(documents)).toEqual([]);
  }
});
it('la comprobación de menciones detecta un archivo ausente', () => {
  const { documents } = compile(exampleProject());
  const tampered = documents.map(d =>
    d.id === 'AGENTS.md' ? { ...d, content: d.content + '\nConsulta docs/ROADMAP.md.' } : d,
  );
  expect(missingMentions(tampered)).toEqual(['AGENTS.md: docs/ROADMAP.md']);
});
