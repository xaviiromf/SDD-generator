import type { Configuration } from '../../domain/models';
import { targetTree } from '../targetTree';
import { scopeRequirements } from './spec';
import { assertTaskGraph, type KitTask } from '../taskGraph';
export function tasksTemplate(c: Configuration): string {
    const scope = scopeRequirements(c);
    const securityId = 'T' + (4 + scope.length), visualId = 'T' + (5 + scope.length), validationId = 'T' + (6 + scope.length);
    const tasks: KitTask[] = [
        { id: 'T1', title: 'Revisar requisitos y contratos pendientes', rf: 'RF-01, RF-03', depends: [], files: ['specs/spec.md', 'specs/plan.md'], done: 'Usuario revisa reglas, contratos y autoriza explícitamente implementación.' },
        { id: 'T2', title: 'Preparar la base técnica del destino', rf: 'RF-01', depends: ['T1'], files: targetTree(c).filter(p => !p.endsWith('/')).slice(0, 4), done: 'Construcción mínima del destino ejecutada y verificada.' },
        { id: 'T3', title: 'Implementar flujo y validación de dominio', rf: 'RF-01, RF-02', depends: ['T2'], files: ['src/'], done: 'Flujo principal y entradas inválidas cumplen los criterios aprobados.' },
        ...scope.map((r, index) => ({ id: 'T' + (4 + index), title: r.text, rf: r.id, depends: ['T3'], files: targetTree(c).filter(path => path.startsWith('src/') || path.startsWith('cmd/')), done: 'La acción declarada cumple el contrato y los criterios revisados: ' + r.text })),
        { id: securityId, title: 'Integrar persistencia y seguridad elegidas', rf: 'RF-03', depends: ['T3'], files: ['src/storage/', 'tests/'], done: 'Contratos de almacenamiento y permisos comprobados con datos sintéticos.' },
        { id: visualId, title: 'Verificar accesibilidad y adaptación cuando aplique', rf: 'RF-04', depends: ['T3'], files: ['src/', 'tests/'], done: 'Teclado, contraste y tamaños objetivo verificables; no aplica justificado para destinos no visuales.' },
        { id: validationId, title: 'Validar y registrar evidencia', rf: 'RF-01, RF-02, RF-03, RF-04', depends: [securityId, visualId, ...scope.map((_, index) => 'T' + (4 + index))], files: ['specs/validation.md', 'docs/PROJECT_STATUS.md'], done: 'Comandos, códigos de salida y limitaciones reales registrados; aceptación del usuario separada.' }
    ];
    assertTaskGraph(tasks);
    return '# Tareas de implementación\n\nEstado: propuestas, ninguna ejecutada. Requieren autorización explícita.\n\n' + tasks.map(t => `- [ ] [${t.id}] ${t.title}\n  - RF: ${t.rf}.\n  - Depende de: ${t.depends.join(', ') || 'Ninguna'}.\n  - Archivos previstos: ${t.files.join(', ')}.\n  - Finaliza cuando: ${t.done}`).join('\n\n') + '\n';
}
