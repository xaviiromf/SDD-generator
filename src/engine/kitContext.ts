import { resolveDesign } from '../domain/design';
import type { Configuration } from '../domain/models';
import { effectiveConfiguration } from '../domain/compatibility';
import { escapeMarkdown } from '../domain/validation';
import { fieldLabels, technologyById } from '../catalog/technologies';
import { archetypeById } from '../catalog/archetypes';
import { createKitManifest, specificationFolder, validSlug } from './kitManifest';
import { targetProfile } from './targetProfile';
import { targetTasks } from './targetTasks';
export const textSection = (text: string) => escapeMarkdown(text.trim() || 'Pendiente de definir.');
export const tableCell = (text: string) =>
  textSection(text).replaceAll('|', '\\|').replaceAll('\n', ' ');
export function selectedStack(c: Configuration): string {
  return (
    Object.entries(c.selections)
      .filter(([, ids]) => ids.length)
      .map(
        ([field, ids]) =>
          `- ${fieldLabels[field as keyof typeof fieldLabels]}: ${ids.map(id => (id === 'spanish' ? (c.sddLanguage === 'en' ? 'Documentation in English' : 'Documentación en español') : (technologyById.get(id)?.label ?? id))).join(', ')}`,
      )
      .join('\n') || 'Pendiente de seleccionar.'
  );
}
export function createKitContext(input: Configuration) {
  const effective = effectiveConfiguration({ ...input, sddLanguage: 'es' });
  const config = {
    ...effective,
    slug: validSlug(input.slug) ? input.slug : 'identificador-pendiente',
  };
  const manifest = createKitManifest(config);
  const profile = targetProfile(config);
  const selectedArchetype = profile.visual
    ? archetypeById.get(config.selections.archetype?.[0] ?? '')
    : undefined;
  const archetype = selectedArchetype
    ? {
        ...selectedArchetype,
        name: selectedArchetype.name,
        texture: selectedArchetype.texture,
      }
    : undefined;
  return {
    config,
    manifest,
    profile,
    folder: specificationFolder(config.slug),
    stack: selectedStack(config),
    tasks: targetTasks(config, profile),
    design: profile.visual ? resolveDesign(config) : undefined,
    archetype,
  };
}
export type KitContext = ReturnType<typeof createKitContext>;
