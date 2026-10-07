import type { Configuration } from '../domain/models';
export interface KitDocument {
    id: string;
    path: string;
    title: string;
    format: 'MD' | 'TXT';
    category: 'raiz' | 'gobernanza' | 'guia' | 'plantilla' | 'especificacion';
}
export const baseKitPaths = [
    'README.md', 'AGENTS.md', 'constitution.md', 'TECHNICAL_CONTEXT.md', 'SDD_MANUAL.md', 'MANUAL-PARA-USUARIO.txt',
    'docs/PROJECT.md', 'docs/BASE_ARCHITECTURE.md', 'docs/BASE_OBSERVATIONS.md', 'docs/DECISIONS.md',
    'docs/ENVIRONMENT_AND_VERIFICATION.md', 'docs/PROJECT_STATUS.md', 'docs/ROADMAP.md', 'docs/TRACEABILITY.md', 'docs/SDD_VALIDATION.md', 'docs/VERIFICATION.md',
    'prompts/README.md', 'prompts/00-orchestrator.md', 'prompts/01-specify.md', 'prompts/02-plan.md', 'prompts/03-tasks.md',
    'prompts/04-implement.md', 'prompts/05-validate.md', 'prompts/06-changes.md', 'prompts/07-resume-pause.md',
    'specs/README.md', 'specs/_templates/spec.md', 'specs/_templates/plan.md', 'specs/_templates/tasks.md', 'specs/_templates/validation.md'
] as const;
export function validSlug(slug: string): boolean { return /^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(slug); }
export function specificationFolder(slug: string): string {
    if (!validSlug(slug)) throw new Error('Corrige el identificador antes de generar rutas.');
    return `specs/001-${slug}`;
}
export function createKitManifest(config: Pick<Configuration, 'slug'>): KitDocument[] {
    const folder = specificationFolder(config.slug);
    const entries: KitDocument[] = baseKitPaths.map(path => ({
        id: path === 'constitution.md' ? 'constitution' : path === 'docs/PROJECT.md' ? 'PROJECT' : path === 'prompts/00-orchestrator.md' ? 'orchestrator' : path,
        path, title: path.split('/').pop()!, format: path.endsWith('.txt') ? 'TXT' : 'MD',
        category: path.startsWith('docs/') ? 'gobernanza' : path.startsWith('prompts/') ? 'guia' : path.includes('_templates/') ? 'plantilla' : path.includes('/') ? 'guia' : 'raiz'
    }));
    for (const id of ['spec', 'plan', 'tasks', 'validation']) entries.push({ id, path: `${folder}/${id}.md`, title: id, format: 'MD', category: 'especificacion' });
    return entries;
}
export const quickDocumentIds = ['spec', 'plan', 'tasks', 'constitution', 'PROJECT', 'orchestrator'];
