import { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { documentPaths } from '../../domain/models';
import { useUIStore } from '../../store/uiStore';
const groups = [{ name: 'specs', indices: [0, 1, 2] }, { name: 'constitution.md', indices: [3] }, { name: 'docs', indices: [4] }, { name: 'prompts', indices: [5] }];
export function FileTree() {
    const [expanded, setExpanded] = useState<string[]>(['specs']);
    const [focus, setFocus] = useState(0);
    const active = useUIStore(s => s.activeDocument);
    const rows = groups.flatMap(g => g.name.endsWith('.md') ? [{ label: g.name, folder: false, index: g.indices[0] }] : [{ label: g.name, folder: true, index: -1 }, ...(expanded.includes(g.name) ? g.indices.map(index => ({ label: documentPaths[index].split('/')[1], folder: false, index })) : [])]);
    return <details className="file-tree"><summary><Folder size={14}/> Estructura del kit <small>6 archivos</small></summary><div role="tree" aria-label="Archivos del kit" onKeyDown={event => { if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : Math.max(0, Math.min(rows.length - 1, focus + (event.key === 'ArrowDown' ? 1 : -1)));
        setFocus(next);
        (event.currentTarget.children[next] as HTMLElement)?.focus();
    } }}>{rows.map((row, i) => <button key={row.label} role="treeitem" tabIndex={focus === i ? 0 : -1} aria-selected={!row.folder && active === row.index} aria-expanded={row.folder ? expanded.includes(row.label) : undefined} aria-level={row.folder || row.label === 'constitution.md' ? 1 : 2} onFocus={() => setFocus(i)} onKeyDown={e => { if (row.folder && ['ArrowRight', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault();
        setExpanded(e.key === 'ArrowRight' ? [...new Set([...expanded, row.label])] : expanded.filter(v => v !== row.label));
    } }} onClick={() => row.folder ? setExpanded(expanded.includes(row.label) ? expanded.filter(v => v !== row.label) : [...expanded, row.label]) : useUIStore.setState({ activeDocument: row.index })}>{row.folder ? (expanded.includes(row.label) ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : <FileText size={14}/>}<span>{row.label}</span></button>)}</div></details>;
}
