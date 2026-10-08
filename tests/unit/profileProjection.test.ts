import { expect,it } from 'vitest';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
import { emptyProfiles } from '../../src/domain/profiles';
import { builtinProfiles } from '../../src/catalog/profiles';
it('proyecta instantáneas y componentes sin asignar la misma tecnología a todos',()=>{
 const c=emptyConfiguration();c.profile={...emptyProfiles(),profiles:structuredClone([...builtinProfiles]),components:[{id:'C-web',name:'Gestión web',kind:'web',responsibility:'Administrar',profileId:'perfil-web',dependsOn:['C-api'],technologyIds:[]},{id:'C-api',name:'Servicio',kind:'api',responsibility:'Validar',profileId:'perfil-api',dependsOn:[],technologyIds:[]}]};
 const first=compile(c),second=compile(c);expect(first.documents).toEqual(second.documents);expect(first.documents).toHaveLength(34);expect(first.targetTree).toEqual(['componentes/C-web/','componentes/C-api/']);
 for(const id of ['spec','plan']){const text=first.documents.find(d=>d.id===id)!.content;expect(text).toContain('Gestión web');expect(text).toContain('1.0.0');expect(text).toContain('Verificada');expect(text).toContain('no implementación del destino');}
});
it('mantiene un protocolo propio fuera de catálogo y no inventa código web',()=>{
 const c=emptyConfiguration();c.profile={...emptyProfiles(),technologies:[{id:'instrumento-protocolo',name:'Protocolo de medición',role:'protocolo',purpose:'Conservar compatibilidad con el instrumento',constraints:['Entorno sin red'],version:'',sources:[],reviewedAt:'',support:'declarada'}]};
 const result=compile(c);expect(result.targetTree).toEqual([]);expect(result.documents.find(d=>d.id==='plan')!.content).toContain('Declarada por el usuario');expect(result.diagnostics.some(d=>d.message.includes('protocolo requieren revisión'))).toBe(true);expect(result.inferences.some(i=>i.id==='instrumento-protocolo')).toBe(false);
});
it('los modos conservan datos y documentación no propone código aunque exista una selección anterior',()=>{
 const c=emptyConfiguration();c.selections={platform:['web'],frontend:['react']};c.project!.mode='documentacion';c.project!.implementationRequired=false;
 const result=compile(c);expect(result.targetTree).toEqual(['docs/OPERACION.md']);expect(result.documents.find(d=>d.id==='tasks')!.content).not.toContain('Implementar flujo');expect(c.selections.frontend).toEqual(['react']);
 for(const mode of ['ampliacion','migracion'] as const){c.project!.mode=mode;c.project!.implementationRequired=true;expect(compile(c).documents.find(d=>d.id==='plan')!.content).toContain('conservar sus interfaces');}
});
it('un perfil inválido bloquea exportación y no se interpreta como una receta',()=>{
 const c=emptyConfiguration();c.profile={...emptyProfiles(),profiles:[{...structuredClone(builtinProfiles[0]),description:'npm install no-autorizado'}]};expect(compile(c).diagnostics.some(d=>d.blocking)).toBe(true);
});
