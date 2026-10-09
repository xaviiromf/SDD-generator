import { useEffect, useState } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { presentDocumentStatus } from '../../store/documentStore';
import { DocumentStateBadge } from './DocumentStateBadge';
import { useTranslation } from '../../i18n/useTranslation';
import * as Tabs from '@radix-ui/react-tabs';
import { DocumentContent } from './DocumentContent';
import { quickDocumentIds } from '../../engine/kitManifest';
import { useUIStore } from '../../store/uiStore';
import { useDocumentStore } from '../../store/documentStore';
function navigateDocumentHref(href: string): boolean {
    if (/^(?:[a-z]+:|\/\/|#)/i.test(href)) return false;
    const documents = useDocumentStore.getState().compilation?.documents ?? [];
    const selected = useUIStore.getState().activeDocument;
    const current = documents.find(d => d.id === selected) ?? documents.find(d => d.id === 'spec');
    if (!current) return false;
    try { const target = new URL(href, `https://sdd.local/${current.path}`); const destination = documents.find(d => d.path === decodeURIComponent(target.pathname.slice(1))); if (!destination) return false; useUIStore.setState({ activeDocument: destination.id }); return true; } catch { return false; }
}
export function DocumentTabs() { const { t } = useTranslation();
    const pending = useDocumentStore(s => s.pending);
    const conflicts = useDocumentStore(s => s.manualConflicts);
    const error = useDocumentStore(s => s.error);
    const selected = useUIStore(s => s.activeDocument);
    const compilation = useDocumentStore(s => s.compilation);
    const revision = compilation?.revision ?? 0;
    const current = useEditorStore(s => s.config.revision === revision);
    const [visited, setVisited] = useState<string[]>([]);
    const documents = compilation?.documents ?? [];
    const active = documents.find(d => d.id === selected) ?? documents.find(d => d.id === 'spec');
    const quick = documents.filter(d => quickDocumentIds.includes(d.id)).sort((a, b) => quickDocumentIds.indexOf(a.id) - quickDocumentIds.indexOf(b.id));
    useEffect(() => { if (active) setVisited(previous => [...previous.filter(id => id !== active.id), active.id].slice(-2)); }, [active?.id]);
    const views = documents.filter(d => visited.includes(d.id) || d.id === active?.id);
    const shownTabs = [...quick, ...views.filter(d => !quick.some(q => q.id === d.id))];
    return <Tabs.Root className="document-tabs" value={active?.id ?? 'spec'} onValueChange={activeDocument => useUIStore.setState({ activeDocument })}><label className="field document-selector"><span>{t("Documento del kit")}</span><select aria-label={t("Documento del kit")} value={active?.id ?? ''} onChange={event => useUIStore.setState({ activeDocument: event.target.value })}>{documents.map(d => <option key={d.id} value={d.id}>{d.path}</option>)}</select></label><Tabs.List aria-label={t("Documentos generados")} className="document-tab-list">{shownTabs.map(d => <Tabs.Trigger key={d.id} value={d.id}>{d.id === 'orchestrator' ? '00-orchestrator' : quickDocumentIds.includes(d.id) ? d.id : d.path.split('/').pop()}</Tabs.Trigger>)}</Tabs.List>{views.map(d => { const status = presentDocumentStatus(compilation?.documentStatuses?.find(s => s.documentId === d.id), { revision, pending: pending || !current, conflict: conflicts.some(c => c.documentId === d.id), error }); return <Tabs.Content key={d.id} value={d.id} forceMount className={d.id === active?.id ? "document-view" : "document-view-cache"}><div className={d.id === active?.id ? "document-path" : "document-path-cache"}><span>{d.path}</span><span>{d.format}</span></div><div className={d.id === active?.id ? "document-state" : "document-state-cache"}><DocumentStateBadge status={status}/><details><summary>Estado y pendientes del documento</summary><p>{status.applicability}</p><ul>{status.reasons.map(reason => <li key={reason.id}>{reason.message}</li>)}</ul>{!status.reasons.length && <p>Sin pendientes estructurales aplicables; requiere revisión humana.</p>}</details></div><DocumentContent content={d.content} plain={d.format === 'TXT'} revision={d.revision} diagrams={compilation?.diagrams?.diagrams} active={d.id === active?.id} navigate={navigateDocumentHref}/>
</Tabs.Content>; })}</Tabs.Root>;
}
