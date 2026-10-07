import { literal, type Locale } from '../i18n/translate';
import type { Configuration } from '../domain/models';
import { effectiveConfiguration } from '../domain/compatibility';
import { escapeMarkdown } from '../domain/validation';
import { fieldLabels, technologyById } from '../catalog/technologies';
import { archetypeById } from '../catalog/archetypes';
import { createKitManifest, specificationFolder, validSlug } from './kitManifest';
import { targetProfile } from './targetProfile';
import { targetTasks } from './targetTasks';
import { requirements } from './requirements';
export const textSection = (text: string, locale: Locale = 'es') => escapeMarkdown(text.trim() || literal('Pendiente de definir.', locale));
export const tableCell = (text: string, locale: Locale = 'es') => textSection(text, locale).replaceAll('|', '\\|').replaceAll('\n', ' ');
export function selectedStack(c: Configuration): string {
    return Object.entries(c.selections).filter(([, ids]) => ids.length).map(([field, ids]) => `- ${literal(fieldLabels[field as keyof typeof fieldLabels], c.sddLanguage)}: ${ids.map(id => id === 'spanish' ? (c.sddLanguage === 'en' ? 'Documentation in English' : 'Documentación en español') : literal(technologyById.get(id)?.label ?? id, c.sddLanguage)).join(', ')}`).join('\n') || literal('Pendiente de seleccionar.', c.sddLanguage);
}
export function createKitContext(input: Configuration) {
    const effective = effectiveConfiguration(input);
    const config = { ...effective, slug: validSlug(input.slug) ? input.slug : 'identificador-pendiente' };
    const manifest = createKitManifest(config);
    const profile = targetProfile(config);
    const selectedArchetype = profile.visual ? archetypeById.get(config.selections.archetype?.[0] ?? '') : undefined;
    const archetype = selectedArchetype ? { ...selectedArchetype, name: literal(selectedArchetype.name, config.sddLanguage), texture: literal(selectedArchetype.texture, config.sddLanguage) } : undefined;
    return { config, manifest, profile, folder: specificationFolder(config.slug), stack: selectedStack(config), requirements: requirements(config), tasks: targetTasks(config, profile), archetype };
}
export type KitContext = ReturnType<typeof createKitContext>;
