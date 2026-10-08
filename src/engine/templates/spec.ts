import { hasProjectContent } from '../../domain/projectDefinition';
import { structuredSpec } from '../projectProjection';
import { literal, template } from '../../i18n/translate';
import type { Configuration } from '../../domain/models';
import { createKitContext, textSection, tableCell, type KitContext } from '../kitContext';
import { documentLink } from '../references';
export { scopeRequirements } from '../requirements';
export const section = textSection;
export function specTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
    if (hasProjectContent(ctx.config.project)) return structuredSpec(ctx);
    const path = `${ctx.folder}/spec.md`;
    return template(ctx.config.sddLanguage)`# Especificación — ${section(c.name, ctx.config.sddLanguage)}\n\nIdentificador: 001. Estado: DOCUMENT. Implementación pendiente de autorización explícita.\n\n${documentLink(path, `${ctx.folder}/plan.md`, 'Plan')} · ${documentLink(path, `${ctx.folder}/tasks.md`, literal('Tareas', ctx.config.sddLanguage))}\n\n## Problema y propósito\n\n${section(c.idea, ctx.config.sddLanguage)}\n\n## Usuarios e historias\n\nUsuarios, roles y recorridos: pendientes de concretar a partir del propósito. No se inventan reglas de negocio.\n\n## Alcance positivo\n\n${section(c.positive, ctx.config.sddLanguage)}\n\n## Exclusiones\n\n${section(c.negative, ctx.config.sddLanguage)}\n\n## Requisitos funcionales\n\n${ctx.requirements.map(r => `- ${r.id}: ${r.text}`).join('\n')}\n\n## Datos y contratos\n\nEntidades, atributos, relaciones, permisos y respuestas específicas: pendientes de revisión humana.\n\n## Criterios de aceptación\n\n| RF | Acción | Resultado verificable |\n|---|---|---|\n${ctx.requirements.map(r => template(ctx.config.sddLanguage)`| ${r.id} | Ejecutar el recorrido aprobado y sus casos de error | ${tableCell(r.text, ctx.config.sddLanguage)} Verificar conforme al contrato revisado. |`).join('\n')}\n\n## Decisiones pendientes\n\nRevisar contratos y criterios antes de código. Las selecciones no equivalen a autorización de implementación. El kit no reemplaza el juicio de ingeniería.\n`;
}
