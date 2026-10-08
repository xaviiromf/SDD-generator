import { beforeEach,expect,it } from 'vitest';
import { useEditorStore } from '../../src/store/editorStore';
import { emptyConfiguration } from '../../src/domain/models';
import { emptyProfiles } from '../../src/domain/profiles';
import { builtinProfiles } from '../../src/catalog/profiles';
beforeEach(()=>useEditorStore.setState({config:emptyConfiguration(),projectError:''}));
it('cambia modo sin perder diseño, selecciones ni textos y conserva continuidad documental',()=>{
 useEditorStore.getState().setText('idea','Conservar el proceso');useEditorStore.getState().select('frontend','react');
 for(const mode of ['ampliacion','migracion','documentacion','nuevo'] as const){const before=useEditorStore.getState().config;useEditorStore.getState().setWorkMode(mode);const after=useEditorStore.getState().config;expect(after.project!.mode).toBe(mode);expect(after.project!.implementationRequired).toBe(mode!=='documentacion');expect(after.idea).toBe(before.idea);expect(after.selections).toEqual(before.selections);expect(after.revision).toBe(before.revision+1);}
 useEditorStore.getState().updateProject({implementationRequired:false});expect(useEditorStore.getState().config.project!.mode).toBe('documentacion');
});
it('sincroniza componentes en una revisión y rechaza suprimir un componente referenciado',()=>{
 const profile={...emptyProfiles(),profiles:[structuredClone(builtinProfiles[0])],components:[{id:'C-web',name:'Web',kind:'web' as const,responsibility:'Gestionar reservas',profileId:'perfil-web',dependsOn:[],technologyIds:[]}]};
 expect(useEditorStore.getState().setProfileConfiguration(profile)).toBe(true);const c=useEditorStore.getState().config;expect(c.revision).toBe(1);expect(c.project!.context.components[0].text).toBe('Gestionar reservas');
 useEditorStore.getState().addRequirement();const rf=useEditorStore.getState().config.project!.requirements[0].id;useEditorStore.getState().updateRequirement(rf,{componentIds:['C-web']});
 const before=useEditorStore.getState().config;expect(useEditorStore.getState().setProfileConfiguration({...profile,components:[]})).toBe(false);expect(useEditorStore.getState().config).toBe(before);
 useEditorStore.getState().updateProjectItem('components','C-web',{text:'Consultar reservas'});expect(useEditorStore.getState().config.profile!.components[0].responsibility).toBe('Consultar reservas');expect(useEditorStore.getState().config.revision).toBe(before.revision+1);
});
it('rechaza configuración adversa sin publicar y recupera instantáneas completas',()=>{
 const before=useEditorStore.getState().config;const profile={...emptyProfiles(),profiles:[{...structuredClone(builtinProfiles[0]),description:'<script>peligro</script>'}]};expect(useEditorStore.getState().setProfileConfiguration(profile)).toBe(false);expect(useEditorStore.getState().config).toBe(before);
 const own={...emptyProfiles(),technologies:[{id:'personal-instrumento',name:'Protocolo',role:'protocolo' as const,purpose:'Medir',constraints:[],version:'Revisión A',sources:[],reviewedAt:'',support:'declarada' as const}]};expect(useEditorStore.getState().setProfileConfiguration(own)).toBe(true);const snapshot=structuredClone(useEditorStore.getState().config);useEditorStore.getState().setProfileConfiguration(emptyProfiles());useEditorStore.getState().restore(snapshot);expect(useEditorStore.getState().config.profile).toEqual(own);
});

it('editar requisitos conserva identidad del perfil y no publica cambios de estética',()=>{
 const profile={...emptyProfiles(),profiles:[structuredClone(builtinProfiles[0])]};useEditorStore.getState().setProfileConfiguration(profile);const before=useEditorStore.getState().config.profile;useEditorStore.getState().addRequirement();const id=useEditorStore.getState().config.project!.requirements[0].id;useEditorStore.getState().updateRequirement(id,{title:'Nuevo requisito'});expect(useEditorStore.getState().config.profile).toBe(before);
});
