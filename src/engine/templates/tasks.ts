import type { Configuration } from '../../domain/models';
import { createKitContext, type KitContext } from '../kitContext';
import { documentLink } from '../references';
export function tasksTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
    const path = `${ctx.folder}/tasks.md`;
    return `# Tareas de implementación — 001\n\nEstado: propuestas, ninguna ejecutada. Requieren autorización explícita.\n\n${documentLink(path, `${ctx.folder}/spec.md`, 'Especificación')} · ${documentLink(path, `${ctx.folder}/plan.md`, 'Plan')}\n\n` + ctx.tasks.map(t => `- [ ] [${t.id}] ${t.title}\n  - RF: ${t.rf}.\n  - Depende de: ${t.depends.join(', ') || 'Ninguna'}.\n  - Archivos previstos: ${t.files.join(', ') || 'Concretar antes de implementar'}.\n  - Finaliza cuando: ${t.done}`).join('\n\n') + '\n';
}
