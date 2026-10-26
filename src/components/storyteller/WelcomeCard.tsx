import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { notify } from '../../store/uiStore';
import { exampleProject } from '../../catalog/exampleProject';
export const welcomeKey = 'sdd-studio:bienvenida:v1';
function dismissed(): boolean {
  try {
    return localStorage.getItem(welcomeKey) === 'descartada';
  } catch {
    return false;
  }
}
/** Bienvenida de primera visita; no bloquea la edición. */
export function WelcomeCard() {
  const empty = useEditorStore(s => !s.config.idea.trim());
  const [hidden, setHidden] = useState(dismissed);
  if (hidden || !empty) return null;
  const close = () => {
    setHidden(true);
    try {
      localStorage.setItem(welcomeKey, 'descartada');
    } catch {
      /* La preferencia solo dura esta sesión. */
    }
  };
  return (
    <section className="welcome-card" aria-labelledby="bienvenida-titulo">
      <div className="welcome-head">
        <h3 id="bienvenida-titulo">De una idea a un kit de especificación en cuatro pasos</h3>
        <button className="welcome-close" aria-label="Ocultar bienvenida" onClick={close}>
          <X size={16} aria-hidden />
        </button>
      </div>
      <ol>
        <li>
          <strong>Idea.</strong> Cuenta el problema y qué debe hacer, en tus palabras.
        </li>
        <li>
          <strong>Requisitos.</strong> Convierte cada necesidad en un requisito con criterios.
        </li>
        <li>
          <strong>Configuración.</strong> Elige plataforma, arquitectura y tecnologías.
        </li>
        <li>
          <strong>Documentos.</strong> Revisa los siete documentos y descarga el kit.
        </li>
      </ol>
      <div className="welcome-actions">
        <button
          className="primary"
          onClick={() => {
            const current = useEditorStore.getState().config;
            if (
              current.revision > 0 &&
              !window.confirm('¿Sustituir la edición actual por el proyecto de ejemplo?')
            )
              return;
            useEditorStore
              .getState()
              .restore({ ...exampleProject(), revision: current.revision + 1 });
            notify('Proyecto de ejemplo cargado. Puedes editarlo o empezar en blanco.', 'exito');
          }}
        >
          <Sparkles size={16} aria-hidden /> Cargar proyecto de ejemplo
        </button>
        <button onClick={close}>Empezar en blanco</button>
      </div>
    </section>
  );
}
