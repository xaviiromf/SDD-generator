import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';
import type { DocumentStatus } from '../../domain/projectOverview';
import { useDocumentStore, presentDocumentStatus } from '../../store/documentStore';
import { useEditorStore } from '../../store/editorStore';
import { DocumentStateBadge } from './DocumentStateBadge';
const StateContext = createContext(new Map<string, DocumentStatus>());
/** La isla de estados no vuelve a renderizar la estructura/teclado del árbol. */
export function TreeDocumentStates({ children }: { children: ReactNode }) {
    const { statuses, revision, pending, conflicts, error } = useDocumentStore(useShallow(s => ({ statuses: s.compilation?.documentStatuses, revision: s.compilation?.revision ?? 0, pending: s.pending, conflicts: s.manualConflicts, error: s.error })));
    const current = useEditorStore(s => s.config.revision === revision);
    const value = useMemo(() => new Map(statuses?.map(status => [status.documentId, presentDocumentStatus(status, { revision, pending: pending || !current, conflict: conflicts.some(c => c.documentId === status.documentId), error })])), [statuses, revision, pending, current, conflicts, error]);
    return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}
export function TreeDocumentBadge({ documentIds, nodeKey }: { documentIds: string[]; nodeKey: string }) {
    const states = useContext(StateContext), children = documentIds.map(id => states.get(id));
    const reasons = new Map(children.flatMap(child => child?.reasons ?? [{ id: 'estado-pendiente', message: 'Estado documental por generar.' }]).map(reason => [reason.id, reason]));
    const list = [...reasons.values()];
    const status: DocumentStatus = { documentId: nodeKey, revision: children[0]?.revision ?? 0, state: list.length ? 'borrador' : 'completo', reasons: list, pendingCount: list.length, applicability: `Estado agregado de ${documentIds.length} documentos; pendientes deduplicados.` };
    return <span className="tree-document-state" id={`tree-state-${nodeKey.replace(/[^a-zA-Z0-9-]/g, '-')}`}><DocumentStateBadge status={status}/></span>;
}
