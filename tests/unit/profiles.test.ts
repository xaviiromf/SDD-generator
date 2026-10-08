import { describe,expect,it } from 'vitest';
import { builtinProfiles } from '../../src/catalog/profiles';
import { emptyProfiles,isProfileConfiguration,profileValidationErrors,profileWarnings,type CustomTechnology,type DeclarativeProfile } from '../../src/domain/profiles';
import { emptyConfiguration } from '../../src/domain/models';
import { isConfiguration,validateConfiguration } from '../../src/domain/validation';
import { validLibraryConfiguration } from '../../src/domain/projectLibrary';
const technology=():CustomTechnology=>({id:'personal-protocolo',name:'Protocolo del instrumento',role:'protocolo',purpose:'Transportar mediciones',constraints:['Mantener compatibilidad con el equipo existente'],version:'',sources:[],reviewedAt:'',support:'declarada'});
const ownProfile=():DeclarativeProfile=>({...structuredClone(builtinProfiles[3]),id:'personal-instrumento',name:'Instrumento científico',support:'declarada',reviewedAt:'',sources:[]});
describe('contratos H4',()=>{
 it('conserva borradores anteriores e instantáneas verificadas sin aceptar una verificación propia',()=>{
  const c=emptyConfiguration();expect(isConfiguration(c)).toBe(true);expect(validLibraryConfiguration(c)).toBe(true);
  c.profile={...emptyProfiles(),profiles:structuredClone([...builtinProfiles])};expect(validLibraryConfiguration(c)).toBe(true);
  const changed=structuredClone(c.profile);changed.profiles[0].questions=['Otra pregunta'];expect(isProfileConfiguration(changed)).toBe(false);
  const own=ownProfile();c.profile.profiles.push(own);expect(isProfileConfiguration(c.profile)).toBe(true);own.support='verificada';expect(isProfileConfiguration(c.profile)).toBe(false);
 });
 it('rechaza código, estilos, comandos, expresiones, fuentes inseguras y campos de prototipo',()=>{
  for(const forbidden of ['<script>alert(1)</script>','const x = 1','function () {}','body { color: red }','npm install algo','$(curl sitio)','javascript:alert(1)','x => x']){
   const p={...emptyProfiles(),profiles:[{...ownProfile(),description:forbidden}]};expect(isProfileConfiguration(p),forbidden).toBe(false);
  }
  for(const payload of [{...ownProfile(),script:'alert(1)'},{...ownProfile(),sources:[{label:'Fuente',url:'https://usuario:clave@ejemplo.com'}]},{...ownProfile(),reviewedAt:'2026-02-30'},{...ownProfile(),reviewedAt:'9999-99-99'}])expect(isProfileConfiguration({...emptyProfiles(),profiles:[payload]})).toBe(false);
  expect(isProfileConfiguration(JSON.parse('{"schemaVersion":1,"profiles":[],"components":[],"technologies":[],"__proto__":{}}'))).toBe(false);
 });
 it('modela web, móvil y API por separado y rechaza referencias, duplicados y ciclos',()=>{
  const p={...emptyProfiles(),profiles:structuredClone([...builtinProfiles]),technologies:[technology()],components:[{id:'C-web',name:'Web',kind:'web' as const,responsibility:'Interfaz de gestión',profileId:'perfil-web',dependsOn:['C-api'],technologyIds:[]},{id:'C-movil',name:'Móvil',kind:'movil' as const,responsibility:'Captura sin conexión',profileId:'perfil-movil',dependsOn:['C-api'],technologyIds:[]},{id:'C-api',name:'API',kind:'api' as const,responsibility:'Validar solicitudes',profileId:'perfil-api',dependsOn:[],technologyIds:['personal-protocolo']}]};
  expect(isProfileConfiguration(p)).toBe(true);p.components[2].dependsOn=['C-web'];expect(profileValidationErrors(p)[0]).toContain('ciclo');p.components[2].dependsOn=['inexistente'];expect(isProfileConfiguration(p)).toBe(false);p.components[2].dependsOn=[];p.components[2].technologyIds=['inexistente'];expect(isProfileConfiguration(p)).toBe(false);
 });
 it('explica incertidumbre y modo documental sin borrar las decisiones',()=>{
  const c=emptyConfiguration();c.profile={...emptyProfiles(),profiles:[ownProfile()],technologies:[technology()],components:[{id:'C-instrumento',name:'Instrumento',kind:'otro',responsibility:'Medir',profileId:'personal-instrumento',dependsOn:[],technologyIds:['personal-protocolo']}]};
  c.project!.mode='documentacion';c.project!.implementationRequired=false;
  expect(profileWarnings(c.profile,c.project).join('\n')).toContain('Declarada por el usuario');expect(profileWarnings(c.profile,c.project).join('\n')).toContain('trabajo documental');expect(validateConfiguration(c).some(d=>d.blocking)).toBe(false);expect(c.profile.components).toHaveLength(1);
 });
 it('aplica límites y controles de texto de configuración/importación',()=>{
  const c=emptyConfiguration();c.profile={...emptyProfiles(),technologies:Array.from({length:51},(_,i)=>({...technology(),id:'propia-'+i}))};expect(isConfiguration(c)).toBe(false);
  c.profile.technologies=[{...technology(),purpose:'token: ABCDEFGHIJKLMNOPQRSTUVWXYZ'}];expect(validateConfiguration(c).some(d=>d.blocking)).toBe(true);expect(validLibraryConfiguration(c)).toBe(false);
 });
});

it('rechaza colisiones con catálogo y contradicciones entre componente y contexto',()=>{
 const c=emptyConfiguration();c.profile={...emptyProfiles(),technologies:[{...technology(),id:'react'}]};expect(isProfileConfiguration(c.profile)).toBe(false);
 c.profile={...emptyProfiles(),components:[{id:'CMP-1',name:'Sistema',kind:'otro',responsibility:'Conservar datos',profileId:'',dependsOn:[],technologyIds:[]}]};c.project!.context.components=[{id:'CMP-1',text:'Borrar datos',status:'confirmado',origin:'user',references:[]}];expect(validateConfiguration(c).some(d=>d.blocking&&d.message.includes('contradicen'))).toBe(true);expect(validLibraryConfiguration(c)).toBe(false);
});
