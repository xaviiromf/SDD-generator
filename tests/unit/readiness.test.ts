import {expect,it} from 'vitest';
import {emptyConfiguration} from '../../src/domain/models';
import {createRequirement} from '../../src/domain/projectDefinition';
import {compile} from '../../src/engine/compiler';
it('separa configuración, calidad y autorización, y detecta contradicciones explícitas',()=>{
 const c=emptyConfiguration(),p=c.project!;p.implementationRequired=false;
 p.context.actors=[{id:'ACT-1',text:'Operador',status:'confirmado',origin:'user',references:[]}];
 const r=createRequirement('RF-2');Object.assign(r,{title:'Registrar pagos',behavior:'Registrar pagos',context:'Al recibir un pago',status:'confirmado',actorId:'ACT-1',criteria:[{id:'CA-3',text:'El registro queda guardado'}]});p.requirements=[r];
 c.negative='No incluir pagos';
 const result=compile(c);expect(result.readiness?.issues.some(i=>i.id.startsWith('contradiccion'))).toBe(true);
 expect(result.readiness?.configuration.applicable).toBe(0);
 c.negative='';const ready=compile(c).readiness!;expect(ready.quality.complete).toBe(6);expect(ready.state).toBe('listo-para-revision');
 expect(ready.conditions.at(-1)?.met).toBe(false);
});
it('el modelo inválido no hace caer el compilador y nunca permite exportación segura',()=>{
 const c=emptyConfiguration();c.project!.requirements=[createRequirement('RF-1')];c.project!.requirements[0].actorId='no-existe';
 const result=compile(c);expect(result.diagnostics.some(d=>d.blocking)).toBe(true);expect(result.readiness?.state).toBe('borrador');
});
