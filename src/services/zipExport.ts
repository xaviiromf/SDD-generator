import { safeDocumentPath, validateText } from '../domain/validation';
import type { Configuration, GeneratedDocument } from '../domain/models';
import { createKitManifest, specificationFolder, validSlug } from '../engine/kitManifest';
async function zipDocuments(documents: { path: string; content: string }[]) {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  documents.forEach(d => zip.file(d.path, d.content, { date: new Date('2026-01-01T00:00:00Z') }));
  const start = performance.now();
  const bytes = await zip.generateAsync({ type: 'uint8array', compression: 'STORE' });
  performance.measure('sdd:empaquetado-zip', { start, end: performance.now() });
  return bytes;
}
const tooLarge = (documents: { content: string }[]) =>
  new TextEncoder().encode(documents.map(d => d.content).join('')).length > 1048576;
const unsafe = (content: string) => validateText(content).some(d => d.blocking);
/** Primera exportación: los siete documentos del manifiesto, con rutas únicas y seguras. */
export async function packageKit(
  documents: GeneratedDocument[],
  config: Pick<Configuration, 'slug'> = { slug: 'mi-proyecto' },
): Promise<Uint8Array> {
  if (!validSlug(config.slug))
    throw new Error('El kit contiene rutas, revisiones o contenidos no válidos.');
  const expected = createKitManifest(config);
  const byId = new Map(expected.map(d => [d.id, d]));
  if (
    documents.length !== expected.length ||
    new Set(documents.map(d => d.id)).size !== expected.length ||
    new Set(documents.map(d => d.path)).size !== expected.length ||
    new Set(documents.map(d => d.revision)).size !== 1 ||
    documents.some(d => {
      const entry = byId.get(d.id);
      return (
        !entry ||
        entry.path !== d.path ||
        entry.format !== d.format ||
        !safeDocumentPath(d.path, config.slug) ||
        unsafe(d.content)
      );
    })
  )
    throw new Error('El kit contiene rutas, revisiones o contenidos no válidos.');
  if (tooLarge(documents))
    throw new Error('El kit supera 1 MiB. Acota el alcance antes de exportar.');
  return zipDocuments(documents);
}
/**
 * Cambio en un proyecto existente: solo la carpeta specs/NNN-<slug>/ con sus cuatro
 * documentos y un fragmento para DECISIONS.md y otro para AGENTS.md. Nunca PROJECT_STATUS.md.
 */
export function changeDocuments(documents: GeneratedDocument[], slug: string, number: number) {
  const from = specificationFolder(slug),
    to = specificationFolder(slug, number),
    suffix = String(number).padStart(3, '0');
  const section = (id: string, heading: string) => {
    const content = documents.find(d => d.id === id)?.content ?? '';
    const start = content.indexOf(heading);
    return start < 0 ? '' : content.slice(start);
  };
  return [
    ...documents
      .filter(d => d.category === 'especificacion')
      .map(d => ({ path: d.path.replace(from, to), content: d.content.replaceAll(from, to) })),
    {
      path: `DECISIONS-fragmento-${suffix}.md`,
      content: `# Fragmento de decisiones — ${to}

Añade estas filas al final de docs/DECISIONS.md con números D-nnn libres. No borres las anteriores.

${section('docs/DECISIONS.md', '| ID |')}`,
    },
    {
      path: `AGENTS-fragmento-${suffix}.md`,
      content: `# Fragmento de AGENTS.md — ${to}

Sustituye con esta sección la de AGENTS.md solo si cambiaron las preferencias de estilo o la pila.

${section('AGENTS.md', '## Pila declarada')}`,
    },
  ];
}
export async function packageChange(
  documents: GeneratedDocument[],
  slug: string,
  number: number,
): Promise<Uint8Array> {
  if (!validSlug(slug) || !Number.isInteger(number) || number < 2 || number > 999)
    throw new Error('Indica un número de carpeta entre 002 y 999.');
  const files = changeDocuments(documents, slug, number);
  if (
    new Set(files.map(f => f.path)).size !== files.length ||
    files.some(f => f.path.includes('..') || unsafe(f.content)) ||
    tooLarge(files)
  )
    throw new Error('El cambio contiene rutas o contenidos no válidos.');
  return zipDocuments(files);
}
export async function saveDownload(content: Blob, filename: string) {
  const { saveAs } = await import('file-saver');
  saveAs(content, filename);
}
