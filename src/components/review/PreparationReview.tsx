import { memo, useMemo, useState } from 'react';
import { useDocumentStore } from '../../store/documentStore';
import type { Readiness } from '../../domain/readiness';
import { readyForReview, type Checkpoint } from '../../engine/checkpoints';
import type { Coverage } from '../../engine/coverage';
import { ChevronDown } from 'lucide-react';
export const PreparationReview = memo(function PreparationReview() {
  const metadata = useDocumentStore(s =>
    JSON.stringify({
      readiness: s.compilation?.readiness,
      checkpoints: s.compilation?.checkpoints,
      coverage: s.compilation?.coverage,
    }),
  );
  const {
    readiness,
    checkpoints = [],
    coverage,
  } = useMemo(
    () =>
      JSON.parse(metadata) as {
        readiness?: Readiness;
        checkpoints?: Checkpoint[];
        coverage?: Coverage;
      },
    [metadata],
  );
  const [issuesOpen, setIssuesOpen] = useState(false),
    [coverageOpen, setCoverageOpen] = useState(false);
  if (!readiness) return null;
  return (
    <section className="preparation-review" aria-label="Preparación y trazabilidad">
      <h3>Preparación para revisar</h3>
      <p className="preparation-state">
        {readyForReview(checkpoints)
          ? 'Listo para revisión humana'
          : 'Borrador con puntos de control pendientes'}
      </p>
      <p>
        Comprobaciones de campos: {readiness.quality.complete} / {readiness.quality.applicable}.
        Esto no mide la corrección del negocio.
      </p>
      <ul className="checkpoints" aria-label="Puntos de control">
        {checkpoints.map(checkpoint => (
          <li key={checkpoint.id}>
            <span className={checkpoint.met ? 'complete' : 'incomplete'} />
            <strong>
              {checkpoint.id} {checkpoint.label}
            </strong>
            :{' '}
            {checkpoint.place === 'repositorio'
              ? 'fuera del estudio'
              : checkpoint.met
                ? 'superado'
                : 'pendiente'}
            {!checkpoint.met && (
              <ul>
                {checkpoint.missing.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <details open={issuesOpen} onToggle={e => setIssuesOpen(e.currentTarget.open)}>
        <summary>
          Diagnósticos de preparación <small>{readiness.issues.length}</small>
          <ChevronDown className="summary-chevron" size={16} aria-hidden />
        </summary>
        {issuesOpen && (
          <ul className="preparation-issues">
            {readiness.issues.map(issue => (
              <li key={issue.id}>
                <strong>{issue.source}</strong>
                <span>
                  {issue.message}{' '}
                  {issue.severity === 'bloqueo' ? 'Pendiente para implementar.' : 'Revisar.'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </details>
      <details open={coverageOpen} onToggle={e => setCoverageOpen(e.currentTarget.open)}>
        <summary>
          Grafo de trazabilidad <small>{coverage?.links.length ?? 0} requisitos</small>
          <ChevronDown className="summary-chevron" size={16} aria-hidden />
        </summary>
        {coverageOpen &&
          (coverage?.links.length ? (
            <div
              className="coverage-scroll"
              tabIndex={0}
              role="region"
              aria-label="Tabla de trazabilidad"
            >
              <table>
                <thead>
                  <tr>
                    <th>Requisito</th>
                    <th>Trabajo y validación</th>
                    <th>Criterios</th>
                    <th>Decisiones y contratos</th>
                  </tr>
                </thead>
                <tbody>
                  {coverage.links.map(link => (
                    <tr key={link.requirementId}>
                      <td>{link.requirementId}</td>
                      <td>
                        {link.taskId}
                        <br />
                        {link.validationTaskId}
                        {!link.applicable && <p>Código no aplicable</p>}
                      </td>
                      <td>{link.criterionIds.join(', ') || 'Pendientes'}</td>
                      <td>
                        {[...link.decisionIds, ...link.contractIds].join(', ') || 'Pendientes'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>Todos los resultados de validación empiezan «No ejecutado».</p>
            </div>
          ) : (
            <p>Añade requisitos estructurados para construir su trazabilidad.</p>
          ))}
      </details>
      <p>
        El análisis detecta reglas estructurales y contradicciones explícitas conocidas. Revisión
        semántica, autorización y aceptación siguen siendo decisiones humanas.
      </p>
    </section>
  );
});
