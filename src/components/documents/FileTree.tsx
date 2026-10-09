import { TreeDocumentBadge, TreeDocumentStates } from './TreeDocumentStates';
import type { GeneratedDocument } from '../../domain/models';
import { useTranslation } from '../../i18n/useTranslation';
import { memo, useMemo, useRef, useState, useEffect } from 'react';
import { Folder, FolderOpen, FileText, FileType2, ChevronRight, ChevronDown } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useDocumentStore } from '../../store/documentStore';
import { kitTree, type KitNode } from '../../engine/kitTree';
interface Row { node: KitNode; level: number; parent?: string; position: number; size: number; }
export const FileTree = memo(function FileTree() { const { t } = useTranslation();
    const metadata = useDocumentStore(s => JSON.stringify(s.compilation?.documents.map(({ content, revision, ...rest }) => { void content; void revision; return rest; }) ?? []));
    const documents = useMemo(() => (JSON.parse(metadata) as GeneratedDocument[]).map(d => ({ ...d, content: '', revision: 0 })), [metadata]);
    const active = useUIStore(s => s.activeDocument);
    const roots = useMemo(() => kitTree(documents ?? []), [documents]);
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState<string[]>(['specs']);
    const [focus, setFocus] = useState('README.md');
    const refs = useRef(new Map<string, HTMLButtonElement>());
    const path = documents?.find(d => d.id === active)?.path;
    useEffect(() => { if (path) { const parts = path.split('/').slice(0, -1); const parents = parts.map((_, i) => parts.slice(0, i + 1).join('/')); setExpanded(previous => [...new Set([...previous, ...parents])]); } }, [path]);
    const rows: Row[] = [];
    const flatten = (nodes: KitNode[], level: number, parent?: string) => nodes.forEach((node, i) => { rows.push({ node, level, parent, position: i + 1, size: nodes.length }); if (expanded.includes(node.key)) flatten(node.children, level + 1, node.key); });
    flatten(roots, 1);
    const move = (key?: string) => { if (key) { setFocus(key); refs.current.get(key)?.focus(); } };
    const toggle = (key: string) => setExpanded(previous => previous.includes(key) ? previous.filter(v => v !== key) : [...previous, key]);
    const focusedKey = rows.some(r => r.node.key === focus) ? focus : rows[0]?.node.key;
    return <details className="file-tree" onToggle={event => setOpen(event.currentTarget.open)}><summary><Folder size={14}/>  {t("Estructura del kit")} <small>{documents?.length ?? 0}  {t("archivos")}</small></summary>{open && <TreeDocumentStates><div role="tree" aria-label={t("Archivos del kit")} className="kit-tree">{rows.map((row, i) => {
        const { node } = row;
        const folder = !node.document;
        const descendants = (entry: KitNode): string[] => entry.document ? [entry.document.id] : entry.children.flatMap(descendants);
        const documentIds = descendants(node);
        const statusId = `tree-state-${node.key.replace(/[^a-zA-Z0-9-]/g, '-')}`;
        return <button key={node.key} ref={el => { if (el) refs.current.set(node.key, el); else refs.current.delete(node.key); }} role="treeitem" aria-label={node.key} aria-describedby={statusId} aria-level={row.level} aria-posinset={row.position} aria-setsize={row.size} tabIndex={focusedKey === node.key ? 0 : -1} aria-selected={folder ? undefined : active === node.document?.id} aria-expanded={folder ? expanded.includes(node.key) : undefined} style={{ paddingLeft: 12 + (row.level - 1) * 16 }} onFocus={() => setFocus(node.key)} onKeyDown={event => {
            if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'ArrowRight', 'ArrowLeft'].includes(event.key)) event.preventDefault();
            if (event.key === 'ArrowDown') move(rows[Math.min(i + 1, rows.length - 1)]?.node.key);
            if (event.key === 'ArrowUp') move(rows[Math.max(i - 1, 0)]?.node.key);
            if (event.key === 'Home') move(rows[0]?.node.key);
            if (event.key === 'End') move(rows.at(-1)?.node.key);
            if (event.key === 'ArrowRight' && folder) { if (!expanded.includes(node.key)) toggle(node.key); else move(node.children[0]?.key); }
            if (event.key === 'ArrowLeft') { if (folder && expanded.includes(node.key)) toggle(node.key); else move(row.parent); }
        }} onClick={() => folder ? toggle(node.key) : useUIStore.setState({ activeDocument: node.document!.id })}>{folder ? <><span aria-hidden="true">{expanded.includes(node.key) ? <ChevronDown size={12}/> : <ChevronRight size={12}/>}</span>{expanded.includes(node.key) ? <FolderOpen size={15} aria-hidden="true"/> : <Folder size={15} aria-hidden="true"/>}</> : node.document?.format === 'TXT' ? <FileType2 size={15} aria-hidden="true"/> : <FileText size={15} aria-hidden="true"/>}<span className="tree-file-name">{node.name}</span><TreeDocumentBadge documentIds={documentIds} nodeKey={node.key}/></button>;
    })}</div></TreeDocumentStates>}</details>;
});
