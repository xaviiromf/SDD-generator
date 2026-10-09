import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { CustomTechnology, ProfileConfiguration, ProjectComponent } from '../../domain/profiles';
import type { ArchitecturePreviewResult } from '../../domain/diagrams';
import { useEditorStore } from '../../store/editorStore';
import { startArchitecturePreview, type ArchitecturePreviewClient } from '../../workers/architecturePreviewClient';
import { DiagramView } from './DiagramView';
export interface ArchitectureMapHandle { component: (item: ProjectComponent) => void; technology: (item: CustomTechnology) => void; reset: () => void }
export const ArchitectureMap = forwardRef<ArchitectureMapHandle, { value: ProfileConfiguration; projectId: string }>(function ArchitectureMap({ value, projectId }, ref) {
    const revision = useEditorStore(s => s.config.revision);
    const base = useRef(value); base.current = value;
    const components = useRef(new Map<string, ProjectComponent>()), technologies = useRef(new Map<string, CustomTechnology>());
    const client = useRef<ArchitecturePreviewClient | null>(null), token = useRef(0);
    const [result, setResult] = useState<ArchitecturePreviewResult | null>(null), [updating, setUpdating] = useState(true), [preview, setPreview] = useState(false), [error, setError] = useState('');
    const request = useCallback(() => {
        const candidateProfile = { ...base.current, components: base.current.components.map(c => components.current.get(c.id) ?? c), technologies: base.current.technologies.map(t => technologies.current.get(t.id) ?? t) };
        setPreview(components.current.size > 0 || technologies.current.size > 0); setUpdating(true); setError('');
        client.current?.request({ projectId, baseRevision: revision, previewToken: ++token.current, candidateProfile });
    }, [projectId, revision]);
    useEffect(() => {
        try { client.current = startArchitecturePreview(next => {
            const config = useEditorStore.getState().config;
            if ((config.project?.projectId ?? config.slug) !== next.projectId || config.revision !== next.baseRevision) return;
            setUpdating(false);
            if (next.state === 'invalido') setError('Vista previa inválida. Se mantiene el último mapa válido; revisa dependencias y tecnologías.');
            else { setResult(next); setError(''); }
        }, message => { setUpdating(false); setError(message); }); }
        catch { setUpdating(false); setError('No se pudo iniciar el mapa local. Tu configuración se conserva.'); }
        return () => { client.current?.dispose(); client.current = null; };
    }, []);
    useEffect(() => {
        for (const [id, edit] of components.current) { const saved = value.components.find(c => c.id === id); if (!saved || JSON.stringify(saved) === JSON.stringify(edit)) components.current.delete(id); }
        for (const [id, edit] of technologies.current) { const saved = value.technologies.find(t => t.id === id); if (!saved || JSON.stringify(saved) === JSON.stringify(edit)) technologies.current.delete(id); }
        request();
    }, [value, request]);
    useImperativeHandle(ref, () => ({
        component: item => { const saved = base.current.components.find(c => c.id === item.id); if (JSON.stringify(saved) === JSON.stringify(item)) components.current.delete(item.id); else components.current.set(item.id, item); request(); },
        technology: item => { const saved = base.current.technologies.find(t => t.id === item.id); if (JSON.stringify(saved) === JSON.stringify(item)) technologies.current.delete(item.id); else technologies.current.set(item.id, item); request(); },
        reset: () => { components.current.clear(); technologies.current.clear(); request(); },
    }), [request]);
    return <section className="architecture-map" aria-label="Mapa de arquitectura" data-preview-token={result?.previewToken} data-preview-state={preview ? 'previa' : 'confirmada'}>
        <h3>Mapa de arquitectura</h3><p>{preview ? 'Vista previa sin aplicar. Los cambios se guardan con cada ficha.' : 'Configuración aplicada del proyecto.'}</p>
        {updating && <p role="status">Actualizando mapa…</p>}{error && <p role="status">{error}</p>}
        <div className="architecture-map-parts">{result?.diagrams.map(d => <DiagramView key={d.id} source={d.source} revision={result.baseRevision} title={`${d.title}${d.part.total > 1 ? ` — Parte ${d.part.index} de ${d.part.total}` : ''}`} description={d.description}/>)}</div>
        {result?.issues.length ? <details><summary>Pendientes de arquitectura ({result.issues.length})</summary><ul>{result.issues.map((i, n) => <li key={`${i.id}-${n}`}>{i.message}</li>)}</ul></details> : null}
    </section>;
});
