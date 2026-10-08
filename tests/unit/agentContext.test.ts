import { expect,it } from 'vitest';
import { compile } from '../../src/engine/compiler';
import { createKitContext } from '../../src/engine/kitContext';
import { isolateTasks,taskContexts } from '../../src/engine/agentContext';
import { assertTaskGraph } from '../../src/engine/taskGraph';
import { emptyConfiguration } from '../../src/domain/models';
import { builtinProfiles } from '../../src/catalog/profiles';
import { emptyProfiles } from '../../src/domain/profiles';
it('entrega tres entradas por tarea sin exigir leer todas las guías',()=>{
 const c=emptyConfiguration();c.selections={platform:['web'],frontend:['react']};const ctx=createKitContext(c);
 for(const task of taskContexts(ctx)){expect(task.entryFiles).toHaveLength(3);expect(task.entryFiles).toEqual(['AGENTS.md','docs/PROJECT_STATUS.md','specs/001-mi-proyecto/spec.md']);expect(task.approvalRequired).toBe(true);expect(task.contracts).toHaveLength(2);}
 const result=compile(c);expect(result.documents).toHaveLength(34);expect(result.documents.find(d=>d.id==='tasks')!.content).toContain('Paquetes de contexto por tarea');
 for(const d of result.documents.filter(d=>d.path==='AGENTS.md'||d.path.startsWith('prompts/')))expect(d.content).toContain('Máximo tres archivos');
});
it('divide archivos de UI y núcleo en tareas distintas y actualiza las dependencias finales',()=>{
 const tasks=isolateTasks([{id:'T-1',title:'Implementar flujo',rf:'RF-1',depends:[],files:['src/domain/','src/components/'],done:'Verificar comportamiento'},{id:'T-2',title:'Validar',rf:'RF-1',depends:['T-1'],files:['docs/VERIFICATION.md'],done:'Registrar evidencia'}],'specs/001-prueba');
 assertTaskGraph(tasks);expect(tasks.find(t=>t.id==='T-1-UI')!.files).toEqual(['src/components/']);expect(tasks.find(t=>t.id==='T-1-NUCLEO')!.files).toEqual(['src/domain/']);expect(tasks.find(t=>t.id==='T-2')!.depends).toEqual(['T-1','T-1-NUCLEO','T-1-UI']);
 const validation=isolateTasks([{id:'T-V',title:'Verificar accesibilidad y adaptación',rf:'RF-1',depends:[],files:['src/domain/','src/components/'],done:'Registrar evidencia'}],'specs/001-prueba');expect(validation).toHaveLength(1);expect(validation[0].files).toEqual(['specs/001-prueba/validation.md','docs/VERIFICATION.md','docs/PROJECT_STATUS.md']);
});
it('un componente desconocido no autoriza leer directorios raíz y VALIDATE solo permite informes',()=>{
 const c=emptyConfiguration();c.profile={...emptyProfiles(),profiles:[structuredClone(builtinProfiles[3])],components:[{id:'C-instrumento',name:'Instrumento',kind:'otro',responsibility:'Medir',profileId:'perfil-sistema',dependsOn:[],technologyIds:[]}]};
 const ctx=createKitContext(c);expect(ctx.profile.paths).toEqual([]);
 for(const packet of taskContexts(ctx)){expect(packet.allowedFiles).not.toContain('src/');if(packet.phase==='VALIDATE')expect(packet.allowedFiles.every(p=>p.endsWith('.md'))).toBe(true);}
});
