import type { Configuration } from '../../domain/models';
import { createKitContext, textSection, tableCell, type KitContext } from '../kitContext';
import { documentLink } from '../references';
export { scopeRequirements } from '../requirements';
export const section = textSection;
export function specTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
    const path = `${ctx.folder}/spec.md`;
    return `# Especificación — ${section(c.name)}\n\nIdentificador: 001. Estado: DOCUMENT. Implementación pendiente de autorización explícita.\n\n${documentLink(path, `${ctx.folder}/plan.md`, 'Plan')} · ${documentLink(path, `${ctx.folder}/tasks.md`, 'Tareas')}\n\n## Problema y propósito\n\n${section(c.idea)}\n\n## Usuarios e historias\n\nUsuarios, roles y recorridos: pendientes de concretar a partir del propósito. No se inventan reglas de negocio.\n\n## Alcance positivo\n\n${section(c.positive)}\n\n## Exclusiones\n\n${section(c.negative)}\n\n## Requisitos funcionales\n\n${ctx.requirements.map(r => `- ${r.id}: ${r.text}`).join('\n')}\n\n## Datos y contratos\n\nEntidades, atributos, relaciones, permisos y respuestas específicas: pendientes de revisión humana.\n\n## Criterios de aceptación\n\n| RF | Acción | Resultado verificable |\n|---|---|---|\n${ctx.requirements.map(r => `| ${r.id} | Ejecutar el recorrido aprobado y sus casos de error | ${tableCell(r.text)} Verificar conforme al contrato revisado. |`).join('\n')}\n\n## Decisiones pendientes\n\nRevisar contratos y criterios antes de código. Las selecciones no equivalen a autorización de implementación. El kit no reemplaza el juicio de ingeniería.\n`;
}
