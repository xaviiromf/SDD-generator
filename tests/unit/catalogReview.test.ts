import { expect, it } from 'vitest';
import { catalogReviewedAt, staleCatalogEntries } from '../../src/catalog/review';
import { technologies } from '../../src/catalog/technologies';
import { presets } from '../../src/catalog/presets';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
it('todas las entradas tienen fecha de revisión válida y se detecta la antigüedad', () => {
  expect(catalogReviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  for (const entry of [...technologies, ...presets])
    expect(entry.reviewedAt ?? catalogReviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(staleCatalogEntries(catalogReviewedAt)).toEqual([]);
  expect(staleCatalogEntries('2027-06-01')).toHaveLength(technologies.length + presets.length);
  const context = compile(emptyConfiguration()).documents.find(d => d.id === 'plan')!;
  expect(context.content).toContain(`se revisó el ${catalogReviewedAt}`);
});
