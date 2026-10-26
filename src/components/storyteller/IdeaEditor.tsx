import { useEditorStore } from '../../store/editorStore';
import { emptyConfiguration } from '../../domain/models';
import { draftKey } from '../../services/draftStorage';
import { notify, useUIStore } from '../../store/uiStore';
import { ScopeBadges } from './ScopeBadges';
import { WelcomeCard } from './WelcomeCard';
import { ScopeConversion } from '../requirements/ScopeConversion';
function TextField({
  field,
  label,
  multiline = false,
  placeholder,
}: {
  field: 'name' | 'slug' | 'idea' | 'positive' | 'negative';
  label: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  const value = useEditorStore(s => s.config[field]);
  const set = useEditorStore(s => s.setText);
  return (
    <label className={`field ${field === 'idea' ? 'idea-field' : ''}`}>
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={e => set(field, e.target.value)}
          rows={field === 'idea' ? 10 : 3}
        />
      ) : (
        <input value={value} onChange={e => set(field, e.target.value)} />
      )}
    </label>
  );
}
export function IdeaEditor() {
  const length = useEditorStore(s => s.config.idea.length);
  return (
    <div className="idea-content">
      <WelcomeCard />
      <p className="intro">
        Empieza por el problema.
        <br />
        <strong>La arquitectura viene después.</strong>
      </p>
      <div className="project-fields">
        <TextField field="name" label="Nombre del proyecto" />
        <TextField field="slug" label="Identificador" />
      </div>
      <TextField
        field="idea"
        label="Tu idea, en tus palabras"
        multiline
        placeholder="Quiero una aplicación para gestionar las reservas de mi taller. Debe funcionar sin conexión y guardar los datos en este navegador."
      />
      <p className={`character-count ${length > 20000 ? 'invalid' : ''}`}>
        {length.toLocaleString('es')} / 20.000 caracteres
      </p>
      <ScopeBadges />
      <TextField
        field="positive"
        label="Qué debe hacer"
        multiline
        placeholder="Una necesidad por línea. Por ejemplo: crear y cancelar reservas."
      />
      <ScopeConversion openRequirements />
      <TextField
        field="negative"
        label="Qué queda fuera"
        multiline
        placeholder="Por ejemplo: no incluir pagos, cuentas ni sincronización en la nube."
      />

      <button
        className="clear-draft"
        onClick={() => {
          if (
            !window.confirm(
              '¿Borrar únicamente el borrador de SDD-Studio? Esta acción reinicia tu configuración local.',
            )
          )
            return;
          try {
            localStorage.removeItem(draftKey);
          } catch {
            notify('No se pudo borrar el registro. Se reiniciará la sesión en memoria.', 'aviso');
          }
          useEditorStore.getState().restore({
            ...emptyConfiguration(),
            sddLanguage: useEditorStore.getState().config.sddLanguage,
          });
          useUIStore.setState({ dismissed: [] });
          notify('Borrador reiniciado.', 'exito');
        }}
      >
        Borrar borrador
      </button>
      <div className="local-note">
        <span className="status-dot" /> Motor local disponible sin conexión.
      </div>
    </div>
  );
}
