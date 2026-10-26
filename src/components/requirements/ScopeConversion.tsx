import { ListPlus } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { scopeLinesWithoutRequirement } from '../../domain/projectDefinition';
import { focusPanel, notify, useUIStore } from '../../store/uiStore';
/** Convierte las líneas de «Qué debe hacer» en requisitos pendientes. */
export function ScopeConversion({
  openRequirements = false,
  onConverted,
}: {
  openRequirements?: boolean;
  onConverted?: () => void;
}) {
  const pending = useEditorStore(
    s =>
      scopeLinesWithoutRequirement(s.config.positive, s.config.project?.requirements ?? []).length,
  );
  if (!pending) return null;
  return (
    <button
      className="scope-conversion"
      onClick={() => {
        const added = useEditorStore.getState().addRequirementsFromScope();
        if (!added) {
          notify(
            useEditorStore.getState().projectError || 'No se pudieron crear los requisitos.',
            'error',
          );
          return;
        }
        notify(
          `${added} ${added === 1 ? 'requisito creado' : 'requisitos creados'} como pendientes. Completa actor, comportamiento y criterios en Requisitos.`,
          'exito',
        );
        onConverted?.();
        if (openRequirements) {
          useUIStore.setState({ panel: 'requirements' });
          focusPanel('requirements');
        }
      }}
    >
      <ListPlus size={16} aria-hidden />
      Convertir {pending} {pending === 1 ? 'línea' : 'líneas'} en requisitos
    </button>
  );
}
