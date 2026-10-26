/* global console */
// Informe de antigüedad del catálogo: `npm run catalog-report [días]`.
import process from 'node:process';
import { createServer } from 'vite';

const days = Number(process.argv[2] ?? 180);
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
try {
  const { catalogReviewedAt, staleCatalogEntries } =
    await server.ssrLoadModule('/src/catalog/review.ts');
  const today = new Date().toISOString().slice(0, 10);
  const stale = staleCatalogEntries(today, days);
  console.log(`Catálogo revisado el ${catalogReviewedAt}; hoy ${today}; umbral ${days} días.`);
  console.log(
    stale.length
      ? `${stale.length} entradas requieren revisión:`
      : 'Ninguna entrada supera el umbral.',
  );
  for (const entry of stale) console.log(`- ${entry.id} (${entry.reviewedAt})`);
} finally {
  await server.close();
}
