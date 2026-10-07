import { literal, template } from '../../i18n/translate';
import type { Configuration } from '../../domain/models';
import { createKitContext, type KitContext } from '../kitContext';
import { documentLink } from '../references';
export function tasksTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
    const path = `${ctx.folder}/tasks.md`;
    return template(ctx.config.sddLanguage)`# Tareas de implementación — 001\n\nEstado: propuestas, ninguna ejecutada. Requieren autorización explícita.\n\n${documentLink(path, `${ctx.folder}/spec.md`, literal('Especificación', ctx.config.sddLanguage))} · ${documentLink(path, `${ctx.folder}/plan.md`, 'Plan')}\n\n` + ctx.tasks.map(t => template(ctx.config.sddLanguage)`- [ ] [${t.id}] ${t.title}\n  - RF: ${t.rf}.\n  - Depende de: ${t.depends.join(', ') || literal('Ninguna', ctx.config.sddLanguage)}.\n  - Archivos previstos: ${t.files.join(', ') || literal('Concretar antes de implementar', ctx.config.sddLanguage)}.\n  - Finaliza cuando: ${t.done}`).join('\n\n') + '\n';
}
