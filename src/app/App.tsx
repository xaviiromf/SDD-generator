import { useEffect } from 'react';
import { StudioLayout } from './StudioLayout';
import { startGenerator } from '../workers/generatorClient';
import { useEditorStore } from '../store/editorStore';
import { useUIStore } from '../store/uiStore';
import { readDraft, saveDraft, draftKey } from '../services/draftStorage';
import { registerOffline } from '../services/offlineRegistration';
import { StatusMessage } from '../components/feedback/StatusMessage';
export function App() {
    const restart = useUIStore(s => s.restart);
    useEffect(() => { const draft = readDraft(); if (draft.config)
        useEditorStore.getState().restore(draft.config); useUIStore.setState({ notice: draft.message }); let timer: ReturnType<typeof setTimeout>; const unsubscribe = useEditorStore.subscribe((s, p) => { if (s.config === p.config)
        return; clearTimeout(timer); timer = setTimeout(() => { const c = useEditorStore.getState().config; const message = saveDraft(c); if (message.startsWith('Corrige')) {
        try {
            localStorage.removeItem(draftKey);
        }
        catch { /* La sesión permanece en memoria. */ }
    } useUIStore.setState({ notice: message }); }, 500); }); void registerOffline(); return () => { clearTimeout(timer); unsubscribe(); }; }, []);
    useEffect(() => startGenerator(), [restart]);
    return <><StudioLayout /><StatusMessage /></>;
}
