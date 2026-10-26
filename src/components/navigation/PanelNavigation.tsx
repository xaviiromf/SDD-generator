import { useEffect } from 'react';
import {
  Check,
  Circle,
  Files,
  LayoutDashboard,
  ListChecks,
  PenLine,
  SlidersHorizontal,
} from 'lucide-react';
import { focusPanel, panelOrder, useUIStore, type Panel } from '../../store/uiStore';
import { useDocumentStore } from '../../store/documentStore';
export const steps = [
  { id: 'overview', label: 'Portada', icon: LayoutDashboard },
  { id: 'idea', label: 'Idea', icon: PenLine, number: 1, checkpoint: 'P1' },
  { id: 'requirements', label: 'Requisitos', icon: ListChecks, number: 2, checkpoint: 'P2' },
  { id: 'config', label: 'Configuración', icon: SlidersHorizontal, number: 3, checkpoint: 'P3' },
  { id: 'docs', label: 'Documentos', icon: Files, number: 4, checkpoint: 'P4' },
] as const satisfies readonly {
  id: Panel;
  label: string;
  icon: unknown;
  number?: number;
  checkpoint?: string;
}[];
/** Cada paso refleja su punto de control (P1 a P4); no certifica calidad. */
function useStepStates(): Partial<Record<Panel, boolean>> {
  const met = useDocumentStore(s =>
    (s.compilation?.checkpoints ?? [])
      .filter(c => c.met)
      .map(c => c.id)
      .join(),
  );
  return Object.fromEntries(
    steps.map(step => [step.id, 'checkpoint' in step && met.includes(step.checkpoint)]),
  );
}
export function PanelNavigation() {
  const panel = useUIStore(s => s.panel);
  const setPanel = useUIStore(s => s.setPanel);
  const states = useStepStates();
  useEffect(() => {
    // Alt + 1…5 recorre los pasos sin chocar con los atajos de pestañas del navegador.
    const key = (event: KeyboardEvent) => {
      if (!event.altKey || event.ctrlKey || event.metaKey || !/^Digit[1-5]$/.test(event.code))
        return;
      event.preventDefault();
      const next = panelOrder[Number(event.code.slice(5)) - 1];
      useUIStore.setState({ panel: next });
      focusPanel(next);
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  return (
    <nav className="panel-navigation" aria-label="Pasos del estudio">
      {steps.map(step => {
        const Icon = step.icon;
        const complete = states[step.id];
        return (
          <button
            key={step.id}
            aria-pressed={panel === step.id}
            aria-current={panel === step.id ? 'step' : undefined}
            aria-describedby={'number' in step ? `estado-${step.id}` : undefined}
            onClick={() => setPanel(step.id)}
          >
            <Icon size={18} aria-hidden />
            <span>{step.label}</span>
            {'number' in step && (
              <span
                className={`step-state ${complete ? 'complete' : ''}`}
                id={`estado-${step.id}`}
                aria-hidden="true"
              >
                {complete ? <Check size={12} aria-hidden /> : <Circle size={10} aria-hidden />}
                <span className="visually-hidden">
                  Paso {step.number}, punto de control {step.checkpoint}:{' '}
                  {complete ? 'superado' : 'pendiente'}
                </span>
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
