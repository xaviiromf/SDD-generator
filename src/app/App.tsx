import { useEffect } from 'react';
import { StudioLayout } from './StudioLayout';
import { startGenerator } from '../workers/generatorClient';
import { useEditorStore } from '../store/editorStore';
import { useUIStore } from '../store/uiStore';
import { readDraft, saveDraft, draftKey } from '../services/draftStorage';
import { registerOffline } from '../services/offlineRegistration';
import { StatusMessage } from '../components/feedback/StatusMessage';
export function App() {
    useEffect(() => { document.documentElement.lang = 'es'; document.querySelector('meta[name=description]')?.setAttribute('content', 'Genera especificaciones en español con diseño personalizado y análisis local. MCP opcional.'); document.title = 'SDD-Studio — Una idea. Un plan claro.'; }, []);
    const restart = useUIStore(s => s.restart);
    useEffect(() => { const draft = readDraft(); if (draft.config)
        useEditorStore.getState().restore(draft.config); useUIStore.setState({ notice: [useUIStore.getState().notice, draft.message].filter(Boolean).join(' ') }); let timer: ReturnType<typeof setTimeout>; const unsubscribe = useEditorStore.subscribe((s, p) => { if (s.config === p.config)
        return; clearTimeout(timer); timer = setTimeout(() => { const c = useEditorStore.getState().config; const message = saveDraft(c); if (message.startsWith('Corrige')) {
        try {
            localStorage.removeItem(draftKey);
        }
        catch { /* La sesión permanece en memoria. */ }
    } useUIStore.setState({ notice: message }); }, 500); }); void registerOffline(); return () => { clearTimeout(timer); unsubscribe(); }; }, []);
    useEffect(() => startGenerator(), [restart]);
    useEffect(()=>{const flush=()=>{saveDraft(useEditorStore.getState().config);};const hidden=()=>{if(document.visibilityState==='hidden')flush();};window.addEventListener('pagehide',flush);document.addEventListener('visibilitychange',hidden);return ()=>{window.removeEventListener('pagehide',flush);document.removeEventListener('visibilitychange',hidden);};},[]);
    useEffect(()=>{let cancelled=false;let stop:(()=>void)|undefined;void import('../store/projectLibraryStore').then(async module=>{if(cancelled)return;stop=await module.initializeLibrary();if(cancelled)stop();});return ()=>{cancelled=true;stop?.();};},[]);
    return <><StudioLayout /><StatusMessage /></>;
}
