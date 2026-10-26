import type { Configuration } from './models';
import {
  allocateId,
  createProjectDefinition,
  createRequirement,
  hasProjectContent,
  scopeLinesWithoutRequirement,
} from './projectDefinition';
/**
 * Ya no existe el modo sin requisitos estructurados. Un borrador anterior sin modelo veía su
 * alcance como requisitos del kit; al leerlo, cada línea se convierte en un requisito pendiente con
 * el texto literal, y el resto del borrador (perfiles y aportaciones incluidos) no cambia.
 */
export function migrateConfiguration(c: Configuration): {
  config: Configuration;
  converted: number;
} {
  if (c.modelVersion === 2) return { config: c, converted: 0 };
  if (hasProjectContent(c.project)) return { config: { ...c, modelVersion: 2 }, converted: 0 };
  const project = structuredClone(c.project ?? createProjectDefinition(c.slug, c.revision));
  const lines = scopeLinesWithoutRequirement(c.positive, project.requirements);
  for (const title of lines)
    project.requirements.push({ ...createRequirement(allocateId(project, 'RF')), title });
  return { config: { ...c, project, modelVersion: 2 }, converted: lines.length };
}
