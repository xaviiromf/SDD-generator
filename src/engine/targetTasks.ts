import { createProjectDefinition } from '../domain/projectDefinition';
import { implementationTaskId, validationTaskId } from './coverage';
import type { Configuration } from '../domain/models';
import { assertTaskGraph, type KitTask } from './taskGraph';
import type { TargetProfile } from './targetProfile';
/**
 * Dos tareas por requisito: T-RF-n-IMP y T-RF-n-VAL. Lo propuesto (por reglas locales o un
 * asistente) no entra en tasks.md hasta que la persona lo confirma o lo deja pendiente.
 */
export function targetTasks(c: Configuration, profile: TargetProfile): KitTask[] {
  const project = c.project ?? createProjectDefinition(c.slug);
  const code = project.implementationRequired && project.mode !== 'documentacion';
  const tasks = project.requirements
    .filter(r => r.status !== 'descartado' && r.status !== 'propuesto')
    .flatMap(r => [
      {
        id: implementationTaskId(r.id),
        title: `${code ? 'Implementar' : 'Documentar y revisar'}: ${r.title || r.behavior || 'Requisito pendiente'}`,
        rf: r.id,
        depends: [],
        files: code ? profile.domainFiles : [],
        done: r.behavior || 'Concretar el comportamiento antes de ejecutar esta tarea.',
      },
      {
        id: validationTaskId(r.id),
        title: `Verificar los criterios de ${r.id}`,
        rf: r.id,
        depends: [implementationTaskId(r.id)],
        files: [],
        done:
          r.criteria.map(cr => `${cr.id}: ${cr.text || 'Resultado pendiente'}`).join('; ') ||
          'Definir criterios observables antes de declarar la verificación.',
      },
    ]);
  assertTaskGraph(tasks);
  return tasks;
}
