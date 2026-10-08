import { hasProjectContent } from '../domain/projectDefinition';
import { implementationTaskId, validationTaskId } from './coverage';
import { literal } from '../i18n/translate';
import type { Configuration } from '../domain/models';
import { scopeRequirements, requirementId } from './requirements';
import { specificationFolder } from './kitManifest';
import { assertTaskGraph, type KitTask } from './taskGraph';
import type { TargetProfile } from './targetProfile';
const taskId = (number: number) => `T-001-${String(number).padStart(2, '0')}`;
export function targetTasks(c: Configuration, profile: TargetProfile): KitTask[] {
    if (hasProjectContent(c.project)) {
        const project=c.project!;
        const folder=specificationFolder(c.slug);
        const active=project.requirements.filter(r=>r.status!=='descartado');
        const base:KitTask={id:'T-BASE-REVISION',title:'Revisar requisitos, preguntas y autorización',rf:active.map(r=>r.id).join(', ')||'Pendiente',depends:[],files:[`${folder}/spec.md`,`${folder}/plan.md`],done:'El responsable revisa requisitos y criterios; no se inicia código sin autorización.'};
        const tasks:KitTask[]=[base];
        for(const r of active){
            const ownFiles=project.implementationRequired?profile.domainFiles:[`${folder}/spec.md`,'docs/PROJECT.md'];
            tasks.push({id:implementationTaskId(r.id),title:`${project.implementationRequired?'Implementar':'Documentar y revisar'}: ${r.title||r.behavior||'Requisito pendiente'}`,rf:r.id,depends:[base.id],files:ownFiles,done:r.behavior||'Concretar comportamiento antes de ejecutar esta tarea.'});
            tasks.push({id:validationTaskId(r.id),title:`Verificar criterios de ${r.id}`,rf:r.id,depends:[implementationTaskId(r.id)],files:[`${folder}/validation.md`,'docs/TRACEABILITY.md'],done:r.criteria.map(criterion=>`${criterion.id}: ${criterion.text||'Resultado pendiente'}`).join('; ')||'Definir criterios observables antes de declarar verificación.'});
        }
        assertTaskGraph(tasks);return tasks;
    }
    const scope = scopeRequirements(c);
    const folder = specificationFolder(c.slug);
    const security = taskId(4 + scope.length), visual = taskId(5 + scope.length), validation = taskId(6 + scope.length);
    const tasks: KitTask[] = [
        { id: taskId(1), title: literal('Revisar requisitos y contratos pendientes', c.sddLanguage), rf: `${requirementId(1)}, ${requirementId(3)}`, depends: [], files: [`${folder}/spec.md`, `${folder}/plan.md`], done: literal('El usuario revisa los contratos y autoriza explícitamente la implementación.', c.sddLanguage) },
        { id: taskId(2), title: literal('Preparar la base técnica del destino', c.sddLanguage), rf: requirementId(1), depends: [taskId(1)], files: profile.paths.filter(p => !p.endsWith('/')).slice(2, 6), done: literal('La base mínima del destino está construida y verificada con comandos registrados.', c.sddLanguage) },
        { id: taskId(3), title: literal('Implementar flujo y validación de dominio', c.sddLanguage), rf: `${requirementId(1)}, ${requirementId(2)}`, depends: [taskId(2)], files: profile.domainFiles, done: literal('El flujo y las entradas inválidas cumplen los contratos aprobados.', c.sddLanguage) },
        ...scope.map((r, index) => ({ id: taskId(4 + index), title: r.text, rf: r.id, depends: [taskId(3)], files: profile.domainFiles, done: literal('Verificar la acción conforme al contrato revisado: ', c.sddLanguage) + r.text })),
        { id: security, title: literal('Integrar persistencia y seguridad elegidas', c.sddLanguage), rf: requirementId(3), depends: [taskId(3)], files: profile.storageFiles, done: literal('Persistencia, validación y permisos comprobados con datos sintéticos; si falta una base de datos, concretarla antes de implementación.', c.sddLanguage) },
        { id: visual, title: literal('Verificar accesibilidad y adaptación cuando aplique', c.sddLanguage), rf: requirementId(4), depends: [taskId(3)], files: profile.domainFiles, done: profile.visual ? literal('Teclado, foco, contraste y adaptación revisados en la interfaz real.', c.sddLanguage) : literal('Verificar ayudas, errores y operación accesible del destino; revisión visual web no aplica.', c.sddLanguage) },
        { id: validation, title: literal('Validar y registrar evidencia', c.sddLanguage), rf: requirementsList(), depends: [security, visual, ...scope.map((_, index) => taskId(4 + index))], files: [`${folder}/validation.md`, 'docs/PROJECT_STATUS.md', 'docs/VERIFICATION.md', 'docs/TRACEABILITY.md'], done: literal('Comandos, salidas y límites reales registrados; aceptación del usuario pendiente hasta confirmación explícita.', c.sddLanguage) }
    ];
    assertTaskGraph(tasks);
    return tasks;
}
function requirementsList() { return [1, 2, 3, 4].map(requirementId).join(', '); }
