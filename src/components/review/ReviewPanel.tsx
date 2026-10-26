import { useState } from 'react';
import { ChevronDown, ClipboardCopy } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useDocumentStore } from '../../store/documentStore';
import { notify } from '../../store/uiStore';
import { copyText } from '../../services/clipboard';
import { parseReviewResponse, reviewPrompt } from '../../domain/reviewExchange';
/** Revisor independiente opcional: copiar el kit, pegar hallazgos; nunca decide ni aprueba. */
export function ReviewPanel() {
  const review = useEditorStore(s => s.config.review);
  const [raw, setRaw] = useState(''),
    [error, setError] = useState('');
  const documents = () => useDocumentStore.getState().compilation?.documents ?? [];
  return (
    <details className="review-panel">
      <summary>
        Revisión independiente (opcional) <small>{review ? review.length : 'omitida'}</small>
        <ChevronDown className="summary-chevron" size={16} aria-hidden />
      </summary>
      <p>
        Copia el kit con los textos originales en un asistente distinto y pega su respuesta JSON.
        Los hallazgos se guardan en docs/PROJECT_STATUS.md sin decidir nada; si no pegas ninguno, el
        kit registra que la revisión se omitió.
      </p>
      <button
        onClick={() =>
          void copyText(reviewPrompt(useEditorStore.getState().config, documents())).then(ok =>
            notify(
              ok ? 'Prompt de revisión copiado.' : 'No se pudo copiar el prompt.',
              ok ? 'exito' : 'error',
            ),
          )
        }
      >
        <ClipboardCopy size={16} aria-hidden /> Copiar prompt de revisión
      </button>
      <label className="field">
        <span>Respuesta del revisor (JSON)</span>
        <textarea rows={5} value={raw} onChange={e => setRaw(e.target.value)} spellCheck={false} />
      </label>
      <button
        disabled={!raw.trim()}
        onClick={() => {
          const result = parseReviewResponse(
            raw,
            documents().map(d => d.path),
          );
          if ('error' in result) return setError(result.error);
          setError('');
          setRaw('');
          useEditorStore.getState().setReview(result);
          notify(`${result.length} hallazgos registrados en el kit.`, 'exito');
        }}
      >
        Validar y registrar hallazgos
      </button>
      {review && (
        <button onClick={() => useEditorStore.getState().setReview(undefined)}>
          Quitar la revisión registrada
        </button>
      )}
      {error && (
        <p className="diagnostic" role="alert">
          {error}
        </p>
      )}
      {review && review.length > 0 && (
        <ul aria-label="Hallazgos del revisor">
          {review.map((f, i) => (
            <li key={i}>
              <strong>
                {f.documento} ({f.severidad})
              </strong>
              : {f.problema} «{f.evidencia}»
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
