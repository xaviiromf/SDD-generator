import { activeRequirements } from '../projectProjection';
import { tableCell, type KitContext } from '../kitContext';
import { implementationTaskId, validationTaskId } from '../coverage';
import { createProjectDefinition } from '../../domain/projectDefinition';
/** Único registro de evidencia del kit: una fila por criterio y todo en «No ejecutado». */
export function initialValidation(ctx: KitContext): string {
  const p = ctx.config.project ?? createProjectDefinition(ctx.config.slug);
  const rows = activeRequirements(p)
    .filter(r => r.status !== 'propuesto')
    .flatMap(r =>
      (r.criteria.length
        ? r.criteria
        : [{ id: 'Pendiente', text: 'Definir un criterio observable' }]
      ).map(
        c =>
          `| ${r.id} | ${c.id}: ${tableCell(c.text)} | ${implementationTaskId(r.id)} | ${validationTaskId(r.id)} | Pendiente | No ejecutado |`,
      ),
    );
  return `# Validación — ${ctx.folder}

Único registro de evidencia. Todo empieza en «No ejecutado» y solo cambia con orden, entorno, fecha, huella y salida reales, después de la autorización (P6). Este archivo no contiene resultados del generador.

| RF | Criterio | Tarea de implementación | Tarea de validación | Evidencia | Estado |
|---|---|---|---|---|---|
${rows.join('\n') || '| Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | No ejecutado |'}

## Uso y accesibilidad

${ctx.profile.visual ? 'Revisar la interfaz real: teclado, foco, contraste, estados y adaptación. Registrar solo lo ejecutado.' : 'Revisar argumentos, ayudas, errores y límites de actuación.'}

## Aceptación

Pendiente de confirmación explícita de la persona después de revisar el comportamiento real.
`;
}
