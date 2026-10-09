import { CircleCheck, CircleDashed } from 'lucide-react';
import type { DocumentStatus } from '../../domain/projectOverview';
export function DocumentStateBadge({ status }: { status: DocumentStatus }) {
    const complete = status.state === 'completo', Icon = complete ? CircleCheck : CircleDashed;
    const explanation = complete ? 'Completo documentalmente; no acredita implementación, pruebas ni aceptación.' : status.reasons.map(r => r.message).join(' ');
    return <span className={`document-status-badge status-${status.state}`} aria-label={`${complete ? 'Completo' : 'Borrador'}${complete ? '' : `, ${status.pendingCount} pendientes`}. ${explanation}`} title={explanation}><Icon size={14} aria-hidden="true"/><span>{complete ? 'Completo' : `Borrador (${status.pendingCount})`}</span></span>;
}
