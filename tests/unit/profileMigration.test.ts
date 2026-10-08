import { expect,it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { emptyProfiles } from '../../src/domain/profiles';
import { readDraft,saveDraft } from '../../src/services/draftStorage';
it('recupera perfiles declarados con advertencias sin perder modo ni datos',()=>{
 const c=emptyConfiguration();c.idea='Conservar el protocolo';c.project!.mode='ampliacion';c.profile={...emptyProfiles(),technologies:[{id:'TEC-protocolo',name:'Protocolo propio',role:'protocolo',purpose:'Medir',constraints:[],version:'',sources:[],reviewedAt:'',support:'declarada'}]};let raw='';const storage={setItem:(_key:string,value:string)=>{raw=value;},getItem:()=>raw};
 expect(saveDraft(c,storage)).toBe('Borrador guardado en este navegador.');const restored=readDraft(storage).config;expect(restored?.profile).toEqual(c.profile);expect(restored?.project?.mode).toBe('ampliacion');expect(restored?.idea).toBe(c.idea);expect(raw).toBe(JSON.stringify(c));
});
it('conserva el registro y rechaza perfiles con código o verificación falsa',()=>{
 const c=emptyConfiguration();c.profile={...emptyProfiles(),technologies:[{id:'TEC-protocolo',name:'Protocolo',role:'protocolo',purpose:'npm install secreto',constraints:[],version:'',sources:[],reviewedAt:'',support:'declarada'}]};const raw=JSON.stringify(c);const storage={getItem:()=>raw};expect(readDraft(storage).config).toBeNull();expect(storage.getItem()).toBe(raw);
});
