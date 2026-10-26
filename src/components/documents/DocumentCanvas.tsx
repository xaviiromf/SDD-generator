import { Activity, lazy, memo, Suspense } from 'react';
const ManualSections = lazy(() =>
  import('../projects/ManualSections').then(m => ({ default: m.ManualSections })),
);
const ReviewPanel = lazy(() =>
  import('../review/ReviewPanel').then(module => ({ default: module.ReviewPanel })),
);
const PreparationReview = lazy(() =>
  import('../review/PreparationReview').then(module => ({ default: module.PreparationReview })),
);
import { AlertCircle, BookOpen, ClipboardCopy, RefreshCw } from 'lucide-react';
import { useDocumentStore } from '../../store/documentStore';
import { focusPanel, notify, useUIStore } from '../../store/uiStore';
import { useEditorStore } from '../../store/editorStore';
import { copyText } from '../../services/clipboard';
import { errorReport } from '../../services/errorReport';
import { MaturityMeter } from './MaturityMeter';
import { FileTree } from './FileTree';
import { DocumentTabs as DocumentTabsContent } from './DocumentTabs';
import { DocumentOutline as DocumentOutlineContent } from './DocumentOutline';
import { ExportBar as ExportBarContent } from '../export/ExportBar';
// Sin props: memo evita reconstruirlos al alternar el modo del lienzo.
const DocumentTabs = memo(DocumentTabsContent),
  DocumentOutline = memo(DocumentOutlineContent),
  ExportBar = memo(ExportBarContent);
/**
 * En el paso Documentos el lector ocupa el ancho completo con explorador e índice; en los demás
 * pasos se muestra como vista previa junto al editor. Todo permanece montado y el
 * modo solo cambia clases, para que alternar pasos no reconstruya el árbol (presupuesto de 16 ms).
 * Activity aplaza a baja prioridad las actualizaciones de las partes ocultas en la vista previa.
 */
export function DocumentCanvas() {
  const full = useUIStore(s => s.panel === 'docs');
  // aportaciones aplazadas; solo se muestran si el borrador ya las tiene, para resolverlas.
  const manual = useEditorStore(s => (s.config.manualSections?.length ?? 0) > 0);
  const pending = useDocumentStore(s => s.pending);
  const error = useDocumentStore(s => s.error);
  const diagnostics = useDocumentStore(s => s.compilation?.diagnostics);
  return (
    <div className={`canvas ${full ? 'canvas-full' : 'canvas-preview'}`}>
      <ExportBar />
      {pending && (
        <p className="updating" role="status">
          Actualizando documentos…
        </p>
      )}
      {error && (
        <div className="diagnostic" role="alert">
          <AlertCircle size={16} />
          <p>{error}</p>
          <button onClick={() => useUIStore.setState(s => ({ restart: s.restart + 1 }))}>
            <RefreshCw size={14} /> Reintentar
          </button>
          <button
            onClick={() =>
              void copyText(
                errorReport('Motor de generación', error, useEditorStore.getState().config),
              ).then(ok =>
                notify(
                  ok
                    ? 'Informe copiado; no incluye tu idea ni tus textos.'
                    : 'No se pudo copiar el informe.',
                  ok ? 'exito' : 'error',
                ),
              )
            }
          >
            <ClipboardCopy size={14} /> Copiar informe
          </button>
        </div>
      )}
      {diagnostics
        ?.filter(d => !d.blocking)
        .map((d, index) => (
          <div className="diagnostic" role="alert" key={index}>
            <AlertCircle size={16} />
            <span>{d.message}</span>
          </div>
        ))}
      <div className="document-browser">
        <aside className="document-explorer" aria-label="Explorador documental">
          <div className="preview-summary">
            <MaturityMeter />
            <button
              className="open-reader"
              onClick={() => {
                useUIStore.setState({ panel: 'docs' });
                focusPanel('docs');
              }}
            >
              <BookOpen size={16} aria-hidden /> Abrir lector completo
            </button>
          </div>
          <Activity mode={full ? 'visible' : 'hidden'}>
            <div className="reader-only">
              <FileTree defaultOpen />
            </div>
            <div className="reader-only">
              <Suspense fallback={<p>Cargando revisión del proyecto…</p>}>
                <PreparationReview />
              </Suspense>
              <Suspense fallback={null}>
                <ReviewPanel />
              </Suspense>
            </div>
          </Activity>
        </aside>
        <div className="document-reader">
          <DocumentTabs />
          {manual && (
            <Activity mode={full ? 'visible' : 'hidden'}>
              <div className="reader-only">
                <Suspense fallback={<p>Cargando aportaciones…</p>}>
                  <ManualSections />
                </Suspense>
              </div>
            </Activity>
          )}
        </div>
        <Activity mode={full ? 'visible' : 'hidden'}>
          <DocumentOutline />
        </Activity>
      </div>
    </div>
  );
}
