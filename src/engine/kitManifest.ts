import type { Configuration } from '../domain/models';
export interface KitDocument {
  id: string;
  path: string;
  title: string;
  format: 'MD' | 'TXT';
  category: 'raiz' | 'gobernanza' | 'especificacion';
}
export function validSlug(slug: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(slug);
}
/** Carpeta specs/NNN-<slug>/: 001 en la primera exportación; N en cada cambio posterior. */
export function specificationFolder(slug: string, number = 1): string {
  if (!validSlug(slug) || !Number.isInteger(number) || number < 1 || number > 999)
    throw new Error('Corrige el identificador antes de generar rutas.');
  return `specs/${String(number).padStart(3, '0')}-${slug}`;
}
/** Kit de siete documentos: sin README ni guías aparte. */
export function createKitManifest(config: Pick<Configuration, 'slug'>): KitDocument[] {
  const folder = specificationFolder(config.slug);
  return [
    { id: 'AGENTS.md', path: 'AGENTS.md', title: 'AGENTS.md', format: 'MD', category: 'raiz' },
    ...['docs/PROJECT_STATUS.md', 'docs/DECISIONS.md'].map(path => ({
      id: path,
      path,
      title: path.split('/').pop()!,
      format: 'MD' as const,
      category: 'gobernanza' as const,
    })),
    ...['spec', 'plan', 'tasks', 'validation'].map(id => ({
      id,
      path: `${folder}/${id}.md`,
      title: id,
      format: 'MD' as const,
      category: 'especificacion' as const,
    })),
  ];
}
