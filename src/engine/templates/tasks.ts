import type { Configuration } from '../../domain/models';
import { createKitContext, type KitContext } from '../kitContext';
import { documentLink } from '../references';
export function tasksTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
  const path = `${ctx.folder}/tasks.md`;
  return `# Tareas — ${ctx.folder}

Estado: propuestas, ninguna ejecutada. Solo se implementan las que autorice el bloque «Autorización» de docs/PROJECT_STATUS.md. Los identificadores no se renumeran después de la revisión humana.

${documentLink(path, `${ctx.folder}/spec.md`, 'Especificación')} · ${documentLink(path, `${ctx.folder}/plan.md`, 'Plan')} · ${documentLink(path, `${ctx.folder}/validation.md`, 'Validación')}

## Contexto común

Pila y preferencias: AGENTS.md. Contratos: plan.md. Las rutas son candidatas de la sección «Propuesta del generador (no verificada)» de plan.md; no son archivos existentes ni rutas autorizadas.

${
  ctx.tasks
    .map(
      t =>
        `- [ ] [${t.id}] ${t.title}\n  - RF: ${t.rf}.\n  - Depende de: ${t.depends.join(', ') || 'Ninguna'}.\n  - Finaliza cuando: ${t.done}`,
    )
    .join('\n\n') || 'Sin tareas: declara y confirma requisitos en el estudio.'
}
`;
}
