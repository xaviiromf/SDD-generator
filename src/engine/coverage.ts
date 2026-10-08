import type { ProjectDefinition } from '../domain/projectDefinition';
import { projectValidationErrors } from '../domain/projectValidation';
export interface CoverageLink {requirementId:string;taskId:string;validationTaskId:string;criterionIds:string[];decisionIds:string[];contractIds:string[];applicable:boolean}
export interface Coverage {links:CoverageLink[];brokenReferences:string[]}
export const implementationTaskId=(id:string)=>`T-REQUISITO-${id}`;
export const validationTaskId=(id:string)=>`T-VALIDACION-${id}`;
export function calculateCoverage(project:ProjectDefinition):Coverage {
 return {links:project.requirements.filter(r=>r.status!=='descartado').map(r=>({requirementId:r.id,taskId:implementationTaskId(r.id),validationTaskId:validationTaskId(r.id),criterionIds:r.criteria.map(c=>c.id),decisionIds:[...r.decisionIds],contractIds:[...r.contractIds],applicable:project.implementationRequired})),brokenReferences:projectValidationErrors(project)};
}
export function coverageMarkdown(coverage:Coverage):string {
 return `| RF | Trabajo | Validación | Criterios | Decisiones | Contratos | Aplicabilidad de código | Evidencia |\n|---|---|---|---|---|---|---|---|\n${coverage.links.map(link=>`| ${link.requirementId} | ${link.taskId} | ${link.validationTaskId} | ${link.criterionIds.join(', ')||'Pendientes'} | ${link.decisionIds.join(', ')||'Pendientes'} | ${link.contractIds.join(', ')||'Pendientes'} | ${link.applicable?'Prevista':'No aplica; tarea documental'} | No ejecutado |`).join('\n')||'| Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | No ejecutado |'}\n`;
}
