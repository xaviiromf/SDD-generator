import type { KitContext } from '../kitContext';
import type { GeneratedDocument } from '../../domain/models';
import { rootTemplate } from './root';
import { governanceTemplate } from './governance';
import { promptTemplate } from './prompts';
import { reusableTemplate, initialValidation } from './reusable';
import { specTemplate } from './spec';
import { planTemplate } from './plan';
import { tasksTemplate } from './tasks';
import { projectTemplate } from './project';
import { constitutionTemplate } from './constitution';
import { orchestratorTemplate } from './orchestrator';
export function kitDocuments(ctx: KitContext): GeneratedDocument[] {
    return ctx.manifest.map(document => {
        let content: string;
        const c = ctx.config;
        switch (document.id) {
            case 'spec': content = specTemplate(c, ctx); break;
            case 'plan': content = planTemplate(c, ctx); break;
            case 'tasks': content = tasksTemplate(c, ctx); break;
            case 'validation': content = initialValidation(ctx); break;
            case 'constitution': content = constitutionTemplate(c); break;
            case 'PROJECT': content = projectTemplate(c, ctx); break;
            case 'orchestrator': content = orchestratorTemplate(ctx); break;
            default: content = document.category === 'gobernanza' ? governanceTemplate(document.path, ctx) : document.path.startsWith('prompts/') ? promptTemplate(document.path, ctx) : document.path.startsWith('specs/') ? reusableTemplate(document.path, ctx) : rootTemplate(document.path, ctx);
        }
        return { ...document, content, revision: c.revision };
    });
}
