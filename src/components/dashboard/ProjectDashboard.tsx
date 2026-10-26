import { useEffect, useMemo, useRef } from 'react';
import {
  ArrowRight,
  Blocks,
  ClipboardList,
  FileCheck2,
  Layers,
  Network,
  TriangleAlert,
  ChevronDown,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useDocumentStore } from '../../store/documentStore';
import { useEditorStore } from '../../store/editorStore';
import { useUIStore, openOverviewTarget } from '../../store/uiStore';
import { DiagramView } from '../diagrams/DiagramView';
import { readyForReview } from '../../engine/checkpoints';
const modes = {
  nuevo: 'Proyecto nuevo',
  ampliacion: 'Ampliación',
  migracion: 'Migración',
  documentacion: 'Documentación sin software',
};
export function ProjectDashboard() {
  const { overview, diagrams, pending, conflicts, error } = useDocumentStore(
    useShallow(s => ({
      overview: s.compilation?.overview,
      diagrams: s.compilation?.diagrams,
      pending: s.pending,
      conflicts: s.manualConflicts,
      error: s.error,
    })),
  );
  const active = useUIStore(s => s.panel === 'overview');
  const revision = useEditorStore(s => s.config.revision);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, []);
  const architecture = useMemo(
    () => diagrams?.diagrams.filter(d => d.kind === 'architecture') ?? [],
    [diagrams],
  );
  const updating = pending || overview?.revision !== revision || conflicts.length > 0;
  if (!overview)
    return (
      <div className="project-dashboard">
        <h2 ref={heading} tabIndex={-1}>
          Portada del proyecto
        </h2>
        <p role="status">{error || 'Preparando ficha del proyecto…'}</p>
        <button
          onClick={() => openOverviewTarget({ id: 'idea', label: 'Editar idea', panel: 'idea' })}
        >
          Editar idea y requisitos
        </button>
      </div>
    );
  const metrics = [
    { label: 'Requisitos funcionales', value: overview.counts.rf, icon: ClipboardList },
    { label: 'Requisitos no funcionales', value: overview.counts.rnf, icon: FileCheck2 },
    { label: 'Componentes', value: overview.counts.components, icon: Blocks },
    { label: 'Entidades', value: overview.counts.entities, icon: Layers },
    { label: 'Tecnologías', value: overview.counts.technologies, icon: Network },
    { label: 'Pendientes por resolver', value: overview.counts.pending, icon: TriangleAlert },
  ];
  return (
    <div className="project-dashboard" data-overview-revision={overview.revision}>
      <header className="dashboard-heading">
        <div>
          <span className="eyebrow">PORTADA DEL PROYECTO / REVISIÓN {overview.revision}</span>
          <h2 ref={heading} tabIndex={-1}>
            {overview.name || 'Nombre por definir'}
          </h2>
        </div>
        <span className="dashboard-readiness">
          {readyForReview(overview.checkpoints)
            ? 'Listo para revisión humana'
            : 'Borrador documental'}
        </span>
      </header>
      {updating && (
        <p className="dashboard-updating" role="status">
          Actualización pendiente. Se muestra la revisión confirmada {overview.revision}.
          {conflicts.length > 0 && ' Revisa las aportaciones manuales.'}
        </p>
      )}
      {error && <p role="alert">{error}</p>}
      <p className="dashboard-description">
        {overview.description ||
          'Describe el proyecto y declara requisitos para completar su ficha.'}
      </p>
      <dl className="dashboard-facts">
        <div>
          <dt>Modo de trabajo</dt>
          <dd>{modes[overview.mode]}</dd>
        </div>
        <div>
          <dt>Identificador</dt>
          <dd>{overview.slug}</dd>
        </div>
        <div>
          <dt>Perfiles</dt>
          <dd>{overview.profiles.map(p => p.name).join(', ') || 'Sin perfiles declarados'}</dd>
        </div>
        <div>
          <dt>Tecnologías seleccionadas o declaradas</dt>
          <dd>{overview.technologies.map(t => t.name).join(', ') || 'Tecnologías por definir'}</dd>
        </div>
      </dl>
      <section aria-label="Métricas del proyecto" className="dashboard-metrics">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="dashboard-metric">
            <Icon size={19} aria-hidden="true" />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>
      <p className="dashboard-explanation">
        Recuentos de declaraciones activas; los marcadores del diagrama no cuentan.{' '}
        {overview.counts.documentDrafts} de 7 documentos son borradores con pendientes. Que un
        documento no tenga pendientes no acredita revisión, implementación, pruebas ni aceptación.
      </p>
      <nav aria-label="Accesos del proyecto" className="dashboard-links">
        {overview.navigationTargets.map(target => (
          <button key={target.id} onClick={() => openOverviewTarget(target)}>
            {target.label}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        ))}
      </nav>
      <section className="dashboard-architecture" aria-labelledby="dashboard-architecture-heading">
        <h3 id="dashboard-architecture-heading">Arquitectura del proyecto</h3>
        <p>Fuente compartida con plan.md. Todas las partes conservan sus referencias.</p>
        {architecture.length ? (
          architecture.map(d => (
            <DiagramView
              key={`${overview.projectId}-${d.id}`}
              active={active}
              source={d.source}
              revision={overview.revision}
              title={d.title}
              description={d.description}
            />
          ))
        ) : (
          <p>Arquitectura pendiente de declarar.</p>
        )}
      </section>
      {overview.pendingGroups.length > 0 && (
        <section className="dashboard-groups" aria-labelledby="pendientes-categoria">
          <h3 id="pendientes-categoria">Siguientes pasos por categoría</h3>
          <ul>
            {overview.pendingGroups.map(group => (
              <li key={group.id}>
                <strong>
                  {group.label} <span>{group.count}</span>
                </strong>
                <p>{group.next}</p>
              </li>
            ))}
          </ul>
          <p>
            Además quedan {overview.processPending} pasos de proceso (revisión, autorización y
            evidencia) que se cierran al revisar y ejecutar el proyecto objetivo.
          </p>
        </section>
      )}
      <details className="dashboard-pending">
        <summary>
          Preparación y pendientes ({overview.readiness.issues.length})
          <ChevronDown className="summary-chevron" size={16} aria-hidden />
        </summary>
        <ul>
          {overview.readiness.issues.map(issue => (
            <li key={issue.id}>
              <strong>{issue.source}</strong>: {issue.message}
            </li>
          ))}
        </ul>
        {!overview.readiness.issues.length && <p>Sin bloqueos estructurales conocidos.</p>}
        <p>
          Las verificaciones del proyecto objetivo siguen «No ejecutado» hasta registrar evidencia.
          La revisión semántica y autorización permanecen pendientes.
        </p>
      </details>
    </div>
  );
}
