import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { archetypes } from '../../catalog/archetypes';
import { hasDesignOverrides } from '../../domain/design';
import { useEditorStore } from '../../store/editorStore';
import { ArchetypeCard } from './ArchetypeCard';
export function ArchetypeCarousel() {
    const selected = useEditorStore(s => s.config.selections.archetype?.[0]);
    const [index, setIndex] = useState(() => Math.max(0, archetypes.findIndex(a => a.id === selected)));
    const [pending, setPending] = useState('');
    const invoker = useRef<HTMLElement | null>(null);
    const a = archetypes[index];
    const step = (delta: number) => setIndex(i => (i + delta + archetypes.length) % archetypes.length);
    function select() {
        const store = useEditorStore.getState();
        if (a.id === selected) { store.detachArchetype(); return; }
        if (hasDesignOverrides(store.config.designOverrides)) { invoker.current = document.activeElement as HTMLElement; setPending(a.id); }
        else store.selectArchetype(a.id, true);
    }
    function commit(preserve: boolean) { useEditorStore.getState().selectArchetype(pending, preserve); setPending(''); }
    return <section className="archetype-carousel" aria-label="Selector de estilos" aria-roledescription="carrusel" onKeyDown={e => {
        if ((e.target as HTMLElement).matches('input,textarea,select') || (e.target as HTMLElement).closest('[role=dialog]')) return;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); }
    }}><div className="carousel-controls"><button aria-label="Estilo anterior" onClick={() => step(-1)}><ChevronLeft/></button><span aria-live="polite">{index + 1} / {archetypes.length}</span><button aria-label="Estilo siguiente" onClick={() => step(1)}><ChevronRight/></button></div><ArchetypeCard a={a} selected={a.id === selected} onSelect={select}/><Dialog.Root open={!!pending} onOpenChange={open => { if (!open) setPending(''); }}><Dialog.Portal><Dialog.Overlay className="overlay"/><Dialog.Content className="dialog" onCloseAutoFocus={e => { e.preventDefault(); invoker.current?.focus(); }}><Dialog.Title>Cambiar el estilo base</Dialog.Title><Dialog.Description>Tienes ajustes personalizados. Decide cómo aplicarlos al nuevo estilo.</Dialog.Description><div className="dialog-actions"><button onClick={() => commit(true)}>Conservar ajustes</button><button onClick={() => commit(false)}>Restablecer ajustes</button><Dialog.Close>Cancelar</Dialog.Close></div><Dialog.Close className="close-icon" aria-label="Cerrar"><X size={18}/></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root></section>;
}
