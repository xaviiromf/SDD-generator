import { useEffect, useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { GitCompare, X } from 'lucide-react';
import type { Configuration, GeneratedDocument } from '../../domain/models';
import { lineDiff, type DiffLine } from '../../domain/lineDiff';
import { compileOnce } from '../../workers/compileOnce';
type Row = DiffLine | { kind: 'salto'; text: string };
/** Muestra solo los cambios con dos líneas de contexto alrededor. */
function hunks(lines: DiffLine[]): Row[] {
  const keep = lines.map((_, i) =>
    lines.slice(Math.max(0, i - 2), i + 3).some(l => l.kind !== 'igual'),
  );
  const rows: Row[] = [];
  lines.forEach((line, i) => {
    if (keep[i]) rows.push(line);
    else if (keep[i - 1]) rows.push({ kind: 'salto', text: '…' });
  });
  return rows;
}
/** Diferencias por documento entre una versión guardada y la edición actual. */
export function VersionDiff({
  label,
  version,
  current,
}: {
  label: string;
  version: Configuration;
  /** Se lee al abrir para no suscribir la cabecera a cada edición. */
  current: () => Configuration;
}) {
  const [open, setOpen] = useState(false);
  const [kits, setKits] = useState<{ before: GeneratedDocument[]; after: GeneratedDocument[] }>();
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('spec');
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    Promise.all([compileOnce(version), compileOnce(current())])
      .then(([before, after]) => {
        if (!cancelled) setKits({ before: before.documents, after: after.documents });
      })
      .catch(() => !cancelled && setError('No se pudieron generar los documentos de la versión.'));
    return () => {
      cancelled = true;
    };
  }, [open, version]); // `current` se lee solo al abrir.
  const changed = useMemo(
    () =>
      new Set(
        kits?.after
          .filter(d => d.content !== kits.before.find(b => b.id === d.id)?.content)
          .map(d => d.id) ?? [],
      ),
    [kits],
  );
  const before = kits?.before.find(d => d.id === selected),
    after = kits?.after.find(d => d.id === selected);
  const lines = before && after ? lineDiff(before.content, after.content) : undefined;
  const added = lines?.filter(l => l.kind === 'añadida').length ?? 0,
    removed = lines?.filter(l => l.kind === 'eliminada').length ?? 0;
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button>
          <GitCompare size={16} aria-hidden /> Diferencias por documento
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="dialog version-diff">
          <Dialog.Title>Diferencias con «{label}»</Dialog.Title>
          <Dialog.Description>
            Compara un documento del kit de la versión guardada con la edición actual. No modifica
            nada.
          </Dialog.Description>
          {error && <p role="alert">{error}</p>}
          {!kits && !error && <p role="status">Generando documentos de ambas revisiones…</p>}
          {kits && (
            <>
              <label className="field">
                <span>Documento ({changed.size} con cambios)</span>
                <select value={selected} onChange={e => setSelected(e.target.value)}>
                  {kits.after.map(d => (
                    <option key={d.id} value={d.id}>
                      {changed.has(d.id) ? '[cambios] ' : ''}
                      {d.path}
                    </option>
                  ))}
                </select>
              </label>
              {lines === null && <p>El documento es demasiado grande para compararlo aquí.</p>}
              {lines && !added && !removed && <p>Sin cambios en este documento.</p>}
              {lines && (added > 0 || removed > 0) && (
                <>
                  <p className="diff-summary">
                    {added} líneas añadidas y {removed} eliminadas.
                  </p>
                  <div
                    className="diff-view"
                    tabIndex={0}
                    role="region"
                    aria-label="Cambios del documento"
                  >
                    {hunks(lines).map((line, i) => (
                      <div key={i} className={`diff-line diff-${line.kind}`}>
                        <span aria-hidden="true">
                          {line.kind === 'añadida' ? '+' : line.kind === 'eliminada' ? '-' : ' '}
                        </span>
                        <span className="visually-hidden">
                          {line.kind === 'añadida'
                            ? 'Añadida: '
                            : line.kind === 'eliminada'
                              ? 'Eliminada: '
                              : ''}
                        </span>
                        {line.text || ' '}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
          <Dialog.Close className="close-icon" aria-label="Cerrar diferencias">
            <X size={18} />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
