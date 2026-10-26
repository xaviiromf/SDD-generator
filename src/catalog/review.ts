import { technologies } from './technologies';
import { presets } from './presets';
/** Fecha de la última revisión del catálogo integrado. */
export const catalogReviewedAt = '2026-10-06';
export const catalogReviewLabel = new Date(`${catalogReviewedAt}T12:00:00Z`).toLocaleDateString(
  'es',
  { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' },
);
/** Entradas cuya revisión supera `maxDays` días; una entrada sin fecha propia usa la del catálogo. */
export function staleCatalogEntries(
  today: string,
  maxDays = 180,
): { id: string; reviewedAt: string }[] {
  const limit = Date.parse(`${today}T00:00:00Z`) - maxDays * 86_400_000;
  return [
    ...technologies.map(t => ({ id: t.id, reviewedAt: t.reviewedAt ?? catalogReviewedAt })),
    ...presets.map(p => ({
      id: `conjunto:${p.id}`,
      reviewedAt: p.reviewedAt ?? catalogReviewedAt,
    })),
  ].filter(entry => Date.parse(`${entry.reviewedAt}T00:00:00Z`) < limit);
}
