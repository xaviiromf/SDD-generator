import { useMemo, useState } from 'react';
import { ChevronDown, ClipboardCopy, Sparkles } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useEditorStore } from '../../store/editorStore';
import { notify } from '../../store/uiStore';
import { extractContext } from '../../domain/contextExtraction';
import {
  assistantPrompt,
  parseAssistantResponse,
  type AssistantResponse,
} from '../../domain/assistantExchange';
import type { ContextKind } from '../../domain/projectDefinition';
import { copyText } from '../../services/clipboard';
import { contextLabels } from './RequirementsEditor';
interface Item {
  id: string;
  kind: ContextKind | 'requirement';
  text: string;
  detail?: string;
}
function ProposalList({
  items,
  origin,
  onDone,
}: {
  items: Item[];
  origin: 'local' | 'assistant-accepted';
  onDone: (accepted: string[]) => void;
}) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set(items.map(i => i.id)));
  return (
    <>
      <ul className="proposal-list">
        {items.map(item => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={checked.has(item.id)}
                onChange={e => {
                  const next = new Set(checked);
                  if (e.target.checked) next.add(item.id);
                  else next.delete(item.id);
                  setChecked(next);
                }}
              />
              <span>
                <small>
                  {item.kind === 'requirement' ? 'Requisito' : contextLabels[item.kind]}
                </small>
                {item.text}
                {item.detail && <em>{item.detail}</em>}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <button
        disabled={!checked.size}
        onClick={() => {
          const chosen = items.filter(i => checked.has(i.id));
          const store = useEditorStore.getState();
          const context = store.acceptContextProposals(
            chosen
              .filter(i => i.kind !== 'requirement')
              .map(i => ({ kind: i.kind as ContextKind, text: i.text })),
            origin,
          );
          const requirements = useEditorStore.getState().acceptAssistantRequirements(
            chosen
              .filter(i => i.kind === 'requirement')
              .map(i => {
                const [comportamiento = '', ...criterios] = (i.detail ?? '').split('\n');
                return { titulo: i.text, comportamiento, criterios };
              }),
          );
          if (!context && !requirements && useEditorStore.getState().projectError)
            notify(useEditorStore.getState().projectError, 'error');
          else {
            notify(
              `${context + requirements} propuestas añadidas con estado «Propuesto». Revísalas antes de confirmarlas.`,
              'exito',
            );
            onDone(chosen.map(i => i.id));
          }
        }}
      >
        Añadir seleccionadas ({checked.size})
      </button>
    </>
  );
}
/** Propuestas locales y asistente externo por copiar y pegar. */
export function AssistancePanel() {
  const input = useEditorStore(
    useShallow(s => ({
      idea: s.config.idea,
      positive: s.config.positive,
      negative: s.config.negative,
    })),
  );
  const context = useEditorStore(s => s.config.project?.context);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const local = useMemo(
    () =>
      extractContext(input, context ? { context } : undefined)
        .map(p => ({
          id: `${p.kind}:${p.text}`,
          kind: p.kind,
          text: p.text,
          detail: `«${p.evidence}»`,
        }))
        .filter(p => !dismissed.has(p.id)),
    [input, context, dismissed],
  );
  const [raw, setRaw] = useState('');
  const [parsed, setParsed] = useState<AssistantResponse | null>(null);
  const [error, setError] = useState('');
  const external: Item[] = parsed
    ? [
        ...parsed.actores.map(text => ({ kind: 'actors' as const, text })),
        ...parsed.entidades.map(text => ({ kind: 'entities' as const, text })),
        ...parsed.exclusiones.map(text => ({ kind: 'exclusions' as const, text })),
        ...parsed.preguntas.map(text => ({ kind: 'questions' as const, text })),
      ]
        .map((item, i): Item => ({ ...item, id: `a${i}` }))
        .concat(
          parsed.requisitos.map((r, i) => ({
            id: `r${i}`,
            kind: 'requirement' as const,
            text: r.titulo,
            detail: [r.comportamiento, ...r.criterios].join('\n'),
          })),
        )
    : [];
  return (
    <details className="assistance-panel">
      <summary>
        <Sparkles size={16} aria-hidden /> Propuestas y asistente
        <small>{local.length} propuestas locales</small>
        <ChevronDown className="summary-chevron" size={16} aria-hidden />
      </summary>
      <section aria-labelledby="propuestas-locales">
        <h4 id="propuestas-locales">Propuestas a partir de tu idea</h4>
        <p>
          Reglas locales detectan actores, datos y exclusiones en tu texto. Nada se añade sin tu
          confirmación.
        </p>
        {local.length ? (
          <ProposalList
            key={local.map(i => i.id).join('|')}
            items={local}
            origin="local"
            onDone={ids => setDismissed(new Set([...dismissed, ...ids]))}
          />
        ) : (
          <p>Sin propuestas nuevas. Describe quién usa el sistema y qué datos gestiona.</p>
        )}
      </section>
      <section aria-labelledby="asistente-externo">
        <h4 id="asistente-externo">Asistente externo sin conexión del estudio</h4>
        <p>
          Copia el prompt en el asistente de IA que prefieras y pega aquí su respuesta JSON. El
          estudio no envía nada: tú decides qué compartir y qué aceptar.
        </p>
        <button
          onClick={() =>
            void copyText(assistantPrompt(useEditorStore.getState().config)).then(ok =>
              notify(
                ok ? 'Prompt de análisis copiado.' : 'No se pudo copiar el prompt.',
                ok ? 'exito' : 'error',
              ),
            )
          }
        >
          <ClipboardCopy size={16} aria-hidden /> Copiar prompt de análisis
        </button>
        <label className="field">
          <span>Respuesta del asistente (JSON)</span>
          <textarea
            rows={5}
            value={raw}
            onChange={e => setRaw(e.target.value)}
            spellCheck={false}
          />
        </label>
        <button
          disabled={!raw.trim()}
          onClick={() => {
            const result = parseAssistantResponse(raw);
            if ('error' in result) {
              setError(result.error);
              setParsed(null);
            } else {
              setError('');
              setParsed(result);
            }
          }}
        >
          Validar respuesta
        </button>
        {error && (
          <p className="diagnostic" role="alert">
            {error}
          </p>
        )}
        {parsed && !external.length && <p>La respuesta no contiene propuestas.</p>}
        {parsed && external.length > 0 && (
          <ProposalList
            key={raw}
            items={external}
            origin="assistant-accepted"
            onDone={() => {
              setParsed(null);
              setRaw('');
            }}
          />
        )}
      </section>
    </details>
  );
}
