import { hasProjectContent } from '../../domain/projectDefinition';
import { textSection } from '../kitContext';
import { calculateCoverage, coverageMarkdown } from '../coverage';
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
        if (hasProjectContent(c.project)) {
            const project=c.project!;
            const coverage=calculateCoverage(project);
            const includeContext = document.path === 'docs/DECISIONS.md' ? ['decisions','assumptions'] as const : document.id === 'constitution' ? ['rules','exclusions'] as const : document.id === 'PROJECT' ? ['actors','capabilities','processes','entities','questions','exclusions'] as const : document.path === 'TECHNICAL_CONTEXT.md' ? ['components','contracts'] as const : [];
            for(const kind of includeContext) if(project.context[kind].length) content+=`\n## Declaraciones del contexto (${kind === 'decisions'?'decisiones':kind === 'assumptions'?'supuestos':kind === 'rules'?'reglas':kind === 'exclusions'?'exclusiones':kind === 'actors'?'actores':kind === 'capabilities'?'capacidades':kind === 'processes'?'procesos':kind === 'entities'?'datos':kind === 'questions'?'preguntas':kind === 'components'?'componentes':'contratos'})\n\n${project.context[kind].filter(item=>item.status!=='descartado').map(item=>`- ${item.id}: ${textSection(item.text)} (${item.status}; aportado, no ejecutado).`).join('\n')}\n`;
            if(document.path==='docs/TRACEABILITY.md') content+=`\n## Grafo de requisitos declarados\n\n${coverageMarkdown(coverage)}`;
            if(document.id==='validation') content+=`\n## Criterios declarados, no ejecutados\n\n${coverageMarkdown(coverage)}`;
            if(!['spec','plan','tasks','validation'].includes(document.id) && document.path!=='docs/TRACEABILITY.md') content+=`\n## Contexto canónico de esta revisión\n\nModelo v${project.schemaVersion}; revisión ${c.revision}. ${project.requirements.filter(r=>r.status!=='descartado').map(r=>r.id).join(', ')||'Requisitos pendientes'}. Consultar la especificación activa y docs/TRACEABILITY.md antes de actuar.\n\n${project.implementationRequired?'Código pendiente de autorización; no hay evidencia ejecutada.':'Trabajo documental sin software: preparación, pruebas de código y tareas de programación no aplican.'}\n`;
        }
        return { ...document, content, revision: c.revision };
    });
}
