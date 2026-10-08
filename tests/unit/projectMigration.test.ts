import { expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { readDraft, saveDraft } from '../../src/services/draftStorage';
it('migra aditivamente sin cambiar el registro original ni texto, decisiones o diseño',()=>{
 const legacy=emptyConfiguration();delete legacy.project;legacy.idea='Texto original';legacy.revision=17;
 legacy.selections={language:['python']};legacy.origins={language:'manual'};legacy.designOverrides={colors:{background:'#123456'}};
 const raw=JSON.stringify(legacy);let write='';
 const result=readDraft({getItem:()=>raw});
 expect(result.config?.project?.revision).toBe(17);expect(result.config?.project?.requirements).toEqual([]);
 expect(result.config).toMatchObject(legacy);
 expect(saveDraft(result.config!,{setItem:(_key,value)=>{write=value;}})).toContain('guardado');
 expect(JSON.parse(write).idea).toBe('Texto original');expect(raw).toBe(JSON.stringify(legacy));
});
it('rechaza un modelo estructuralmente inválido sin escribir ni borrar el registro',()=>{
 const data=emptyConfiguration();data.project!.schemaVersion=2 as 1;
 const raw=JSON.stringify(data);expect(readDraft({getItem:()=>raw}).config).toBeNull();
});
