import { it, expect } from 'vitest';
import { compile } from '../../src/engine/compiler';
import { exampleProject } from '../../src/catalog/exampleProject';
import { isConfiguration } from '../../src/domain/validation';
import {
  parseReviewResponse,
  reviewPrompt,
  reviewSchemaVersion,
} from '../../src/domain/reviewExchange';
const c = exampleProject();
const documents = compile(c).documents,
  paths = documents.map(d => d.path);
const finding = {
  documento: 'AGENTS.md',
  severidad: 'media',
  problema: 'La regla de iconos no dice qué hacer sin interfaz.',
  evidencia: 'Iconos exclusivamente de lucide-react',
};
it('el prompt incluye los siete documentos y los textos originales, y pide solo JSON', () => {
  const prompt = reviewPrompt(c, documents);
  for (const path of paths) expect(prompt).toContain(`=== ${path} ===`);
  expect(prompt).toContain(c.idea.trim());
  expect(prompt).toContain(reviewSchemaVersion);
});
it('valida el esquema, los documentos del kit y los textos, y rechaza lo demás', () => {
  const ok = parseReviewResponse(
    JSON.stringify({ esquema: reviewSchemaVersion, hallazgos: [finding] }),
    paths,
  );
  expect(ok).toEqual([finding]);
  const error = (v: unknown) =>
    'error' in (parseReviewResponse(JSON.stringify(v), paths) as object);
  expect(error({ esquema: 'otro', hallazgos: [] })).toBe(true);
  expect(error({ esquema: reviewSchemaVersion, hallazgos: [], decision: 'aprobar' })).toBe(true);
  expect(
    error({ esquema: reviewSchemaVersion, hallazgos: [{ ...finding, documento: 'README.md' }] }),
  ).toBe(true);
  expect(
    error({ esquema: reviewSchemaVersion, hallazgos: [{ ...finding, severidad: 'crítica' }] }),
  ).toBe(true);
  expect(
    error({
      esquema: reviewSchemaVersion,
      hallazgos: [{ ...finding, evidencia: 'token=' + 'a1'.repeat(13) }],
    }),
  ).toBe(true);
});
it('los hallazgos se registran en PROJECT_STATUS.md y, si se omite, también queda constancia', () => {
  const status = (review?: (typeof finding)[]) =>
    compile({ ...c, review: review as never }).documents.find(
      d => d.id === 'docs/PROJECT_STATUS.md',
    )!.content;
  expect(status()).toContain('Omitida: no se pegó ninguna revisión independiente');
  expect(status([finding])).toContain('La regla de iconos no dice qué hacer sin interfaz.');
  expect(isConfiguration({ ...c, review: [finding] })).toBe(true);
  expect(isConfiguration({ ...c, review: [{ ...finding, extra: 1 }] })).toBe(false);
});
