import { lazy, memo, Suspense, useEffect, useState, type ReactNode } from 'react';
const ProjectDashboard = lazy(() =>
  import('../components/dashboard/ProjectDashboard').then(m => ({ default: m.ProjectDashboard })),
);
const LibraryExport = lazy(() =>
  import('../components/projects/ProjectLibrary').then(m => ({ default: m.LibraryExport })),
);
const RequirementsEditorContent = lazy(() =>
  import('../components/requirements/RequirementsEditor').then(m => ({
    default: m.RequirementsEditor,
  })),
);
import { ArrowRight, ArrowUpRight, Command, GitBranch, WifiOff } from 'lucide-react';
import { focusPanel, useUIStore, type Panel } from '../store/uiStore';
import { useEditorStore } from '../store/editorStore';
import { PanelNavigation, steps } from '../components/navigation/PanelNavigation';
import { AppearanceControls } from '../components/navigation/AppearanceControls';
import { Configurator as ConfiguratorContent } from '../components/configurator/Configurator';
import { IdeaEditor as IdeaEditorContent } from '../components/storyteller/IdeaEditor';
import { DocumentCanvas as DocumentCanvasContent } from '../components/documents/DocumentCanvas';
import { CommandPalette as CommandPaletteContent } from '../components/command/CommandPalette';
const Configurator = memo(ConfiguratorContent),
  IdeaEditor = memo(IdeaEditorContent),
  DocumentCanvas = memo(DocumentCanvasContent),
  CommandPalette = memo(CommandPaletteContent);

function SaveIndicator() {
  const save = useUIStore(s => s.saveState);
  const text =
    save.status === 'guardado'
      ? save.at
        ? `Guardado ${new Date(save.at).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}`
        : 'Guardado en este navegador'
      : save.status === 'error'
        ? 'Sin guardar'
        : 'Guardando…';
  return (
    <span className={`save-indicator save-${save.status}`} title="Borrador local de este navegador">
      {text}
    </span>
  );
}
function OfflinePill() {
  const ready = useUIStore(s => s.offlineReady);
  if (!ready) return null;
  return (
    <span className="offline-pill" title="Puedes recargar y exportar sin red">
      <WifiOff size={14} aria-hidden /> Disponible sin conexión
    </span>
  );
}
function ProjectName() {
  const name = useEditorStore(s => s.config.name);
  return <span className="header-project">{name || 'Proyecto sin nombre'}</span>;
}
function StepPanel({
  panel,
  number,
  title,
  hint,
  next,
  children,
}: {
  panel: Panel;
  number: string;
  title: string;
  hint: string;
  next?: Panel;
  children: ReactNode;
}) {
  const label = steps.find(s => s.id === panel)!.label;
  const nextLabel = next && steps.find(s => s.id === next)!.label;
  return (
    <section className={`studio-panel ${panel}-panel`} data-panel={panel} aria-label={label}>
      <div className="panel-title">
        <span>{number}</span>
        <h2 tabIndex={-1}>{title}</h2>
        <small>{hint}</small>
      </div>
      <div className="panel-body">{children}</div>
      {next && (
        <div className="panel-next">
          <button
            onClick={() => {
              useUIStore.setState({ panel: next });
              focusPanel(next);
            }}
          >
            Siguiente: {nextLabel}
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      )}
    </section>
  );
}
export function StudioLayout() {
  const panel = useUIStore(s => s.panel);
  const [overviewVisited, setOverviewVisited] = useState(false);
  const [requirementsVisited, setRequirementsVisited] = useState(false);
  useEffect(() => {
    if (panel === 'overview') setOverviewVisited(true);
    if (panel === 'requirements') setRequirementsVisited(true);
  }, [panel]);
  return (
    <>
      <header className="studio-header">
        <a className="brand" href={import.meta.env.BASE_URL} aria-label="SDD-Studio, inicio">
          <span className="brand-mark">
            <GitBranch size={18} aria-hidden />
          </span>
          <span className="brand-name">
            SDD<span className="brand-light">—Studio</span>
          </span>
        </a>
        <div className="header-status">
          <ProjectName />
          <SaveIndicator />
        </div>
        <div className="header-meta">
          <OfflinePill />
          <Suspense fallback={null}>
            <LibraryExport />
          </Suspense>
          <button
            aria-label="Buscar en el estudio"
            className="search-trigger"
            onClick={() => useUIStore.setState({ palette: true })}
          >
            <Command size={16} aria-hidden />
            <span>Buscar</span>
            <kbd>Ctrl K</kbd>
          </button>
          <AppearanceControls />
          <a
            className="repository-link"
            href="https://github.com/xaviiromf/SDD-generator"
            target="_blank"
            rel="noreferrer"
            aria-label="Ver repositorio en GitHub"
            title="Repositorio en GitHub"
          >
            <ArrowUpRight size={18} aria-hidden />
          </a>
        </div>
      </header>
      <PanelNavigation />
      <main className={`workspace active-${panel}`}>
        <section
          className="dashboard-panel"
          data-panel="overview"
          data-visited={overviewVisited}
          aria-label="Portada del proyecto"
        >
          {(overviewVisited || panel === 'overview') && (
            <Suspense fallback={<p role="status">Cargando portada del proyecto…</p>}>
              <ProjectDashboard />
            </Suspense>
          )}
        </section>
        <StepPanel
          panel="idea"
          number="01"
          title="Cuenta tu idea"
          hint="Lenguaje natural"
          next="requirements"
        >
          <IdeaEditor />
        </StepPanel>
        <StepPanel
          panel="requirements"
          number="02"
          title="Requisitos y contexto"
          hint="Qué debe cumplirse"
          next="config"
        >
          {(requirementsVisited || panel === 'requirements') && (
            <Suspense fallback={<p role="status">Cargando editor de requisitos…</p>}>
              <RequirementsEditorContent />
            </Suspense>
          )}
        </StepPanel>
        <StepPanel panel="config" number="03" title="Define el sistema" hint="7 fases" next="docs">
          <Configurator />
        </StepPanel>
        <section className="studio-panel docs-panel" data-panel="docs" aria-label="Documentos">
          <div className="panel-title">
            <span>04</span>
            <h2 tabIndex={-1}>Revisa el contrato</h2>
            <small>7 documentos</small>
          </div>
          <DocumentCanvas />
        </section>
      </main>
      <CommandPalette />
    </>
  );
}
