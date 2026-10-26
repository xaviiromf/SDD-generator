import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { useUIStore } from '../../store/uiStore';

/** Encabezados de nivel 1 a 3 fuera de bloques de código, en orden de aparición. */
export function documentHeadings(content: string): { level: number; text: string }[] {
  const headings: { level: number; text: string }[] = [];
  let fence = '';
  for (const line of content.split('\n')) {
    const marker = /^ {0,3}(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (marker[0] === fence[0] && marker.length >= fence.length) fence = '';
      continue;
    }
    const heading = !fence && /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading)
      headings.push({
        level: heading[1].length,
        text: heading[2].replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[`*_]/g, ''),
      });
  }
  return headings;
}

function scrollToHeading(text: string, index: number) {
  const reader = document.querySelector('.document-content');
  const matches = [...(reader?.querySelectorAll('h1, h2, h3') ?? [])].filter(
    h => h.textContent?.trim() === text.trim(),
  );
  const target = (matches[index] ?? matches[0]) as HTMLElement | undefined;
  if (!target) return;
  target.scrollIntoView({ block: 'start' });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

export function DocumentOutline() {
  const documents = useDocumentStore(s => s.compilation?.documents);
  const active = useUIStore(s => s.activeDocument);
  const index = documents?.findIndex(d => d.id === active) ?? -1;
  const current = documents?.[index];
  const headings = useMemo(
    () => (current && current.format === 'MD' ? documentHeadings(current.content) : []),
    [current],
  );
  if (!documents || !current) return null;
  const previous = documents[index - 1],
    next = documents[index + 1];
  const seen = new Map<string, number>();
  return (
    <aside className="document-outline" aria-label="Contenido del documento">
      <nav aria-label="Documentos anterior y siguiente" className="document-pager">
        <button
          disabled={!previous}
          onClick={() => previous && useUIStore.setState({ activeDocument: previous.id })}
          title={previous?.path}
        >
          <ChevronLeft size={14} aria-hidden /> Anterior
        </button>
        <button
          disabled={!next}
          onClick={() => next && useUIStore.setState({ activeDocument: next.id })}
          title={next?.path}
        >
          Siguiente <ChevronRight size={14} aria-hidden />
        </button>
      </nav>
      <p className="outline-position">
        {index + 1} de {documents.length}
      </p>
      {headings.length > 0 && (
        <>
          <h3>En este documento</h3>
          <ol>
            {headings.map((h, i) => {
              const occurrence = seen.get(h.text) ?? 0;
              seen.set(h.text, occurrence + 1);
              return (
                <li key={i} className={`outline-level-${h.level}`}>
                  <button onClick={() => scrollToHeading(h.text, occurrence)}>{h.text}</button>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </aside>
  );
}
