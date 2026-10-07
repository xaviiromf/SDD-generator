import { useEffect, useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useEditorStore } from '../../store/editorStore';
import { searchTechnologies } from '../../engine/matcher';
import { normalize } from '../../engine/tokenizer';
import { presets } from '../../catalog/presets';
export function CommandPalette() {
    const open = useUIStore(s => s.palette);
    const [query, setQuery] = useState('');
    const [index, setIndex] = useState(0);
    const select = useEditorStore(s => s.select);
    const previousFocus = useRef<HTMLElement | null>(null);
    useEffect(() => { const handler = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        useUIStore.setState({ palette: !useUIStore.getState().palette });
    } }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, []);
    const entries = [...presets.filter(p => normalize(p.label + ' ' + p.description).includes(normalize(query))).map(p => ({ id: p.id, label: p.label, category: 'Conjunto predefinido', run: () => useUIStore.setState({ panel: 'config', requestedPreset: p.id }) })), ...searchTechnologies(query).map(t => ({ id: t.id, label: t.label, category: t.field === 'archetype' ? 'Arquetipo' : 'Tecnología', run: () => { select(t.field, t.id); useUIStore.setState({ panel: 'config', phase: String(t.phase) }); } }))].slice(0, 35);
    const execute = (i: number) => { entries[i]?.run(); useUIStore.setState({ palette: false }); };
    return <Dialog.Root open={open} onOpenChange={palette => { useUIStore.setState({ palette }); setQuery(''); setIndex(0); }}><Dialog.Portal><Dialog.Overlay className="overlay"/><Dialog.Content className="dialog command-dialog" onOpenAutoFocus={() => { previousFocus.current = document.activeElement as HTMLElement; }} onCloseAutoFocus={event => { event.preventDefault(); previousFocus.current?.focus(); }}><Dialog.Title>Buscar en el estudio</Dialog.Title><Dialog.Description>225 opciones y ocho conjuntos. Usa flechas, Enter o Escape.</Dialog.Description><div className="command-search"><Search size={18}/><input aria-label="Buscar tecnologías y conjuntos" value={query} onChange={e => { setQuery(e.target.value); setIndex(0); }} onKeyDown={e => { if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIndex(Math.min(index + 1, entries.length - 1));
    } if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIndex(Math.max(0, index - 1));
    } if (e.key === 'Enter') {
        e.preventDefault();
        execute(index);
    } }} aria-controls="command-results" aria-activedescendant={entries[index] ? `command-${index}` : undefined} role="combobox" aria-expanded="true" autoComplete="off" placeholder="Una tecnología, un estilo o una arquitectura…"/></div><div id="command-results" role="listbox" className="command-results">{entries.length ? entries.map((entry, i) => <button key={entry.id} id={`command-${i}`} role="option" aria-selected={i === index} onMouseMove={() => setIndex(i)} onClick={() => execute(i)}><span>{entry.label}<small>{entry.category}</small></span><ArrowUpRight size={16}/></button>) : <p>No hay coincidencias. Prueba otra palabra.</p>}</div><Dialog.Close className="close-icon" aria-label="Cerrar búsqueda"><X size={18}/></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>;
}
