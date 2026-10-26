import { profileProjection } from '../profileProjection';
import type { KitContext } from '../kitContext';
import type { GeneratedDocument } from '../../domain/models';
import { agentsTemplate, decisionsTemplate, statusTemplate } from './governance';
import { initialValidation } from './validation';
import { specTemplate } from './spec';
import { planTemplate } from './plan';
import { tasksTemplate } from './tasks';
export function kitDocuments(ctx: KitContext): GeneratedDocument[] {
  const c = ctx.config;
  const templates: Record<string, () => string> = {
    'AGENTS.md': () => agentsTemplate(ctx),
    'docs/PROJECT_STATUS.md': () => statusTemplate(ctx),
    'docs/DECISIONS.md': () => decisionsTemplate(ctx),
    spec: () => specTemplate(c, ctx),
    plan: () => planTemplate(c, ctx),
    tasks: () => tasksTemplate(c, ctx),
    validation: () => initialValidation(ctx),
  };
  return ctx.manifest.map(document => {
    let content = templates[document.id]();
    // Datos de perfiles de borradores anteriores: el panel está aplazado, pero sus datos se conservan.
    if (c.profile && ['spec', 'plan'].includes(document.id)) content += '\n' + profileProjection(c);
    return { ...document, content, revision: c.revision };
  });
}
