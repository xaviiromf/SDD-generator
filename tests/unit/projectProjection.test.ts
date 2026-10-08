import {expect,it} from 'vitest';
import {emptyConfiguration} from '../../src/domain/models';
import {compile} from '../../src/engine/compiler';
import {createRequirement} from '../../src/domain/projectDefinition';
it('proyecta literalmente actor, reglas, criterios y pendientes sin ejecutar evidencia',()=>{
 const c=emptyConfiguration(),p=c.project!;p.context.actors=[{id:'ACT-1',text:'Administradora',status:'confirmado',origin:'user',references:[]}];
 const r=createRequirement('RF-10');r.title='Cancelar reserva';r.behavior='Cancelar reserva pendiente';r.actorId='ACT-1';r.criteria=[{id:'CA-11',text:'La reserva queda cancelada'}];p.requirements=[r];
 const result=compile(c),spec=result.documents.find(d=>d.id==='spec')!.content;
 expect(spec).toContain('Administradora');expect(spec).toContain('La reserva queda cancelada');expect(spec).toContain('No ejecutado');expect(spec).not.toContain('RF-001-01');
 expect(result.documents).toHaveLength(34);expect(result.documents.find(d=>d.id==='plan')!.content).toContain('RF-10');
});
it('genera tareas estables, criterios enlazados y modo sin código con las mismas 34 rutas',()=>{
 const c=emptyConfiguration(),p=c.project!;p.mode='documentacion';p.implementationRequired=false;
 const r=createRequirement('RF-15');r.behavior='Registrar devolución física';r.criteria=[{id:'CA-17',text:'El registro queda cerrado'}];p.requirements=[r];
 const result=compile(c);expect(result.coverage?.links[0].taskId).toBe('T-REQUISITO-RF-15');
 expect(result.coverage?.links[0].applicable).toBe(false);expect(result.targetTree).not.toContain('src/');
 const tasks=result.documents.find(d=>d.id==='tasks')!.content;expect(tasks).toContain('CA-17');expect(tasks).not.toContain('Preparar la base técnica');
 const trace=result.documents.find(d=>d.path==='docs/TRACEABILITY.md')!.content;expect(trace).toContain('T-VALIDACION-RF-15');
 expect(result.documents.find(d=>d.id==='validation')!.content).toContain('No ejecutado');
 expect(result.documents.every(d=>d.revision===c.revision)).toBe(true);
});
