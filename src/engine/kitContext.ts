import type { Configuration } from '../domain/models';
import { effectiveConfiguration } from '../domain/compatibility';
import { escapeMarkdown } from '../domain/validation';
import { fieldLabels, technologyById } from '../catalog/technologies';
import { archetypeById } from '../catalog/archetypes';
import { createKitManifest, specificationFolder, validSlug } from './kitManifest';
import { targetProfile } from './targetProfile';
import { targetTasks } from './targetTasks';
import { requirements } from './requirements';
export const textSection = (text: string) => escapeMarkdown(text.trim() || 'Pendiente de definir.');
export const tableCell = (text: string) => textSection(text).replaceAll('|', '\\|').replaceAll('\n', ' ');
export function selectedStack(c: Configuration): string {
    return Object.entries(c.selections).filter(([, ids]) => ids.length).map(([field, ids]) => `- ${fieldLabels[field as keyof typeof fieldLabels]}: ${ids.map(id => technologyById.get(id)?.label ?? id).join(', ')}`).join('\n') || 'Pendiente de seleccionar.';
}
export function createKitContext(input: Configuration) {
    const effective = effectiveConfiguration(input);
    const config = { ...effective, slug: validSlug(input.slug) ? input.slug : 'identificador-pendiente' };
    const manifest = createKitManifest(config);
    const profile = targetProfile(config);
    return { config, manifest, profile, folder: specificationFolder(config.slug), stack: selectedStack(config), requirements: requirements(config), tasks: targetTasks(config, profile), archetype: profile.visual ? archetypeById.get(config.selections.archetype?.[0] ?? '') : undefined };
}
export type KitContext = ReturnType<typeof createKitContext>;
