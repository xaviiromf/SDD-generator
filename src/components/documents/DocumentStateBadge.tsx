import { memo } from 'react';
import { CircleDashed } from 'lucide-react';
import type { DocumentStatus } from '../../domain/projectOverview';
const explain = (status: DocumentStatus) => status.reasons.map(r => r.message).join(' ');
/** Memo por contenido visible: los estados se recalculan en cada compilación con objetos nuevos. */
export const DocumentStateBadge = memo(
  function DocumentStateBadge({ status }: { status: DocumentStatus }) {
    // sin pendientes no hay insignia; ningún estado afirma que el documento esté terminado.
    if (status.state !== 'borrador') return null;
    const explanation = explain(status);
    return (
      <span
        className="document-status-badge status-borrador"
        aria-label={`Borrador, ${status.pendingCount} pendientes. ${explanation}`}
        title={explanation}
      >
        <CircleDashed size={14} aria-hidden="true" />
        <span>{`Borrador (${status.pendingCount})`}</span>
      </span>
    );
  },
  (a, b) =>
    a.status.state === b.status.state &&
    a.status.pendingCount === b.status.pendingCount &&
    explain(a.status) === explain(b.status),
);
