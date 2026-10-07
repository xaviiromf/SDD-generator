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
        { id: taskId(1), title: 'Revisar requisitos y contratos pendientes', rf: `${requirementId(1)}, ${requirementId(3)}`, depends: [], files: [`${folder}/spec.md`, `${folder}/plan.md`], done: 'El usuario revisa los contratos y autoriza explícitamente la implementación.' },
        { id: taskId(2), title: 'Preparar la base técnica del destino', rf: requirementId(1), depends: [taskId(1)], files: profile.paths.filter(p => !p.endsWith('/')).slice(2, 6), done: 'La base mínima del destino está construida y verificada con comandos registrados.' },
        { id: taskId(3), title: 'Implementar flujo y validación de dominio', rf: `${requirementId(1)}, ${requirementId(2)}`, depends: [taskId(2)], files: profile.domainFiles, done: 'El flujo y las entradas inválidas cumplen los contratos aprobados.' },
        ...scope.map((r, index) => ({ id: taskId(4 + index), title: r.text, rf: r.id, depends: [taskId(3)], files: profile.domainFiles, done: 'Verificar la acción conforme al contrato revisado: ' + r.text })),
        { id: security, title: 'Integrar persistencia y seguridad elegidas', rf: requirementId(3), depends: [taskId(3)], files: profile.storageFiles, done: 'Persistencia, validación y permisos comprobados con datos sintéticos; si falta una base de datos, concretarla antes de implementación.' },
        { id: visual, title: 'Verificar accesibilidad y adaptación cuando aplique', rf: requirementId(4), depends: [taskId(3)], files: profile.domainFiles, done: profile.visual ? 'Teclado, foco, contraste y adaptación revisados en la interfaz real.' : 'Verificar ayudas, errores y operación accesible del destino; revisión visual web no aplica.' },
        { id: validation, title: 'Validar y registrar evidencia', rf: requirementsList(), depends: [security, visual, ...scope.map((_, index) => taskId(4 + index))], files: [`${folder}/validation.md`, 'docs/PROJECT_STATUS.md', 'docs/VERIFICATION.md', 'docs/TRACEABILITY.md'], done: 'Comandos, salidas y límites reales registrados; aceptación del usuario pendiente hasta confirmación explícita.' }
    ];
    assertTaskGraph(tasks);
    return tasks;
}
function requirementsList() { return [1, 2, 3, 4].map(requirementId).join(', '); }
