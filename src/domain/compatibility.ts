import { technologyById, technologies } from '../catalog/technologies';
import type { Configuration, Diagnostic, Field, Technology } from './models';
export const webPlatforms = ['web-spa', 'web-ssr', 'pwa', 'extension'];
export const visualPlatforms = [...webPlatforms, 'desktop', 'linux', 'windows', 'macos', 'mobile', 'android', 'ios', 'game'];
export function styleApplies(c: Configuration): boolean { const platform = c.selections.platform?.[0]; return !platform || visualPlatforms.includes(platform); }
export function optionCompatible(entry: Technology, c: Configuration): boolean {
  const platform = c.selections.platform?.[0];
  if ((entry.field === 'styling' || entry.field === 'archetype') && !styleApplies(c)) return entry.id === 'not-applicable';
  if (entry.platforms && platform && !entry.platforms.includes(platform)) return false;
  if (entry.languages && c.selections.language?.length && !entry.languages.some(lang => c.selections.language?.includes(lang))) return false;
  if (c.selections.architecture?.includes('client') && ['postgres','mysql','mariadb','mongodb','redis','dragonfly','memcached','supabase','firebase','appwrite','pocketbase'].includes(entry.id)) return false;
  if (c.selections.architecture?.includes('client') && entry.field === 'backend' && !['clap','tokio','typer','rich','scapy','requests'].includes(entry.id)) return false;
  return true;
}
export function effectiveConfiguration(c: Configuration): Configuration {
  if (styleApplies(c)) return c;
  return { ...c, selections: { ...c.selections, styling: ['not-applicable'], archetype: [] } };
}
export function compatibilityDiagnostics(c: Configuration): Diagnostic[] {
  const result: Diagnostic[] = [];
  for (const [field, ids] of Object.entries(effectiveConfiguration(c).selections)) for (const id of ids) {
    const entry = technologyById.get(id);
    if (!entry || entry.field !== field) result.push({ field: field as Field, message: 'La opción no pertenece al campo seleccionado.', blocking: true });
    else if (!optionCompatible(entry, c)) result.push({ field: entry.field, message: `${entry.label} no es compatible con las decisiones actuales. Revisa el campo seleccionado.`, blocking: true });
  }
  const storage = c.selections.storage ?? [];
  if (storage.includes('memory') && storage.length > 1) result.push({ field: 'storage', message: 'En memoria como única persistencia no se combina con otra base de datos. Retira la opción sobrante.', blocking: true });
  return result;
}
export function optionsFor(field: Field, c: Configuration): Technology[] { return technologies.filter(entry => entry.field === field && optionCompatible(entry, c)); }
