import { literal } from '../i18n/translate';
import type { Configuration } from '../domain/models';
import { scopeRequirements, requirementId } from './requirements';
import { specificationFolder } from './kitManifest';
import { assertTaskGraph, type KitTask } from './taskGraph';
import type { TargetProfile } from './targetProfile';
const taskId = (number: number) => `T-001-${String(number).padStart(2, '0')}`;
export function targetTasks(c: Configuration, profile: TargetProfile): KitTask[] {
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
