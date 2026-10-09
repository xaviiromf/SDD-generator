import { useEffect, useState, type ComponentType } from 'react';
import { useEditorStore } from '../../store/editorStore';
export function ProfileStudio() {
    const [open, setOpen] = useState(false), [Panel, setPanel] = useState<ComponentType | null>(null), [error, setError] = useState(''), [retry, setRetry] = useState(0);
    const projectId = useEditorStore(s => s.config.project?.projectId ?? s.config.slug);
    useEffect(() => {
        if (!open || Panel) return;
        let alive = true; setError('');
        import('./ProfilePanelRuntime').then(module => { if (alive) setPanel(() => module.ProfilesPanel); }).catch(() => { if (alive) setError('No se pudo cargar el configurador local. Puedes reintentar; el proyecto se conserva.'); });
        return () => { alive = false; };
    }, [open, Panel, retry]);
    return <details className="profile-studio" onToggle={event => setOpen(event.currentTarget.open)}><summary>Perfiles y componentes</summary>{open && (Panel ? <Panel key={projectId}/> : error ? <div role="alert"><p>{error}</p><button onClick={() => setRetry(value => value + 1)}>Reintentar configurador</button></div> : <p role="status">Cargando configurador local…</p>)}</details>;
}
