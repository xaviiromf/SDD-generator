import { useEffect } from 'react';
import { StudioLayout } from './StudioLayout';
import { startGenerator } from '../workers/generatorClient';
import { useEditorStore } from '../store/editorStore';
import { notify, useUIStore } from '../store/uiStore';
import { readDraft, saveDraft } from '../services/draftStorage';
import { registerOffline } from '../services/offlineRegistration';
import { StatusMessage } from '../components/feedback/StatusMessage';
export function App() {
  useEffect(() => {
    document.documentElement.lang = 'es';
    document
      .querySelector('meta[name=description]')
      ?.setAttribute(
        'content',
        'Genera especificaciones en español con diseño personalizado y análisis local.',
      );
    document.title = 'SDD-Studio — Una idea. Un plan claro.';
  }, []);
  const restart = useUIStore(s => s.restart);
  useEffect(() => {
    const draft = readDraft();
    if (draft.config) useEditorStore.getState().restore(draft.config);
    if (draft.config) useUIStore.setState({ saveState: { status: 'guardado' } });
    if (draft.message !== 'Sesión local preparada.')
      notify(draft.message, draft.config ? 'info' : 'aviso');
    let timer: ReturnType<typeof setTimeout>;
    const unsubscribe = useEditorStore.subscribe((s, p) => {
      if (s.config === p.config) return;
      if (useUIStore.getState().saveState.status !== 'pendiente')
        useUIStore.setState({ saveState: { status: 'pendiente' } });
      clearTimeout(timer);
      timer = setTimeout(() => {
        const c = useEditorStore.getState().config;
        const message = saveDraft(c);
        const saved = message === 'Borrador guardado en este navegador.';
        useUIStore.setState({
          saveState: saved ? { status: 'guardado', at: Date.now() } : { status: 'error' },
        });
        // un texto bloqueante no se guarda, pero se conserva el último borrador válido.
        if (!saved) notify(message, 'error');
      }, 500);
    });
    void registerOffline();
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);
  useEffect(() => startGenerator(), [restart]);
  useEffect(() => {
    const flush = () => {
      saveDraft(useEditorStore.getState().config);
    };
    const hidden = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', hidden);
    };
  }, []);
  return (
    <>
      <StudioLayout />
      <StatusMessage />
    </>
  );
}
