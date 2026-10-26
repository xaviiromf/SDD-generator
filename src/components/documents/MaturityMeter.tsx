import { memo, useMemo } from 'react';
import { useDocumentStore } from '../../store/documentStore';
import { ChevronDown } from 'lucide-react';
export const MaturityMeter = memo(function MaturityMeter() {
  const metadata = useDocumentStore(s => JSON.stringify(s.compilation?.maturity ?? null));
  const maturity = useMemo(
    () =>
      JSON.parse(metadata) as {
        score: number;
        pillars: { label: string; complete: boolean }[];
      } | null,
    [metadata],
  );
  return (
    <div className="maturity">
      <div>
        <span>Cobertura de configuración</span>
        <strong>
          {maturity?.score ?? 0}
          <small> %</small>
        </strong>
      </div>
      <progress aria-label="Cobertura de configuración" max={100} value={maturity?.score ?? 0} />
      <details>
        <summary>
          Revisar seis pilares
          <ChevronDown className="summary-chevron" size={16} aria-hidden />
        </summary>
        <ul>
          {maturity?.pillars.map(p => (
            <li key={p.label}>
              <span className={p.complete ? 'complete' : 'incomplete'} />
              {p.label}
              <small>{p.complete ? 'Definido' : 'Pendiente'}</small>
            </li>
          ))}
        </ul>
        <p>El porcentaje mide decisiones declaradas; no certifica viabilidad ni seguridad.</p>
      </details>
    </div>
  );
});
