import {it,expect} from 'vitest';
import {emptyConfiguration} from '../../src/domain/models';
import {emptyLibrary,type LocalProject} from '../../src/domain/projectLibrary';
import {readLibrary,writeLibrary,libraryKey} from '../../src/services/projectStorage';
import {parseBackup,exportBackup} from '../../src/services/projectImport';
function memoryStorage():Storage{const map=new Map<string,string>();return {get length(){return map.size;},clear:()=>map.clear(),key:i=>[...map.keys()][i]??null,getItem:key=>map.get(key)??null,setItem:(key,value)=>{map.set(key,value);},removeItem:key=>{map.delete(key);}};}
const now='2026-10-08T12:00:00.000Z';const record=():LocalProject=>({id:'P-1',createdAt:now,updatedAt:now,draft:emptyConfiguration(),versions:[]});
it('guarda y lee atómicamente, rechaza concurrencia y preserva biblioteca corrupta',async()=>{
 const storage=memoryStorage(),l=emptyLibrary();l.projects=[record()];l.activeId='P-1';
 expect(await writeLibrary(l,null,storage)).toMatchObject({ok:true});const original=storage.getItem(libraryKey);
 expect((await readLibrary(storage)).library).toEqual(l);
 expect(await writeLibrary({...l,revision:1},null,storage)).toMatchObject({ok:false});expect(storage.getItem(libraryKey)).toBe(original);
 storage.setItem(libraryKey,'{roto');expect((await readLibrary(storage)).error).toBeTruthy();expect(storage.getItem(libraryKey)).toBe('{roto');
});
it('no cambia datos cuando falla la cuota ni permite serializar modelo inválido',async()=>{
 const storage=memoryStorage();storage.setItem(libraryKey,'anterior');storage.setItem=()=>{throw new Error('Cuota');};
 expect(await writeLibrary(emptyLibrary(),'anterior',storage)).toMatchObject({ok:false});expect(storage.getItem(libraryKey)).toBe('anterior');
 expect(await writeLibrary({...emptyLibrary(),schemaVersion:2} as never,'anterior',storage)).toMatchObject({ok:false});
});
it('respaldo conserva requisitos, diseño y adiciones sin aceptar claves extra o prototipos',()=>{
 const p=record();p.draft.manualSections=[{id:'MAN-1',documentId:'spec',sectionKey:'documento',title:'Nota',text:'Texto propio',baseContent:''}];
 const out=exportBackup([p]);expect(out.ok).toBe(true);if(!out.ok)return;
 expect(parseBackup(out.value)).toEqual({ok:true,value:{format:'sdd-studio-backup',schemaVersion:1,projects:[p]}});
 for(const raw of ['{roto',out.value.replace('"schemaVersion":1','"schemaVersion":2'),out.value.replace('"projects":','"token":"valor","projects":'),'{"__proto__":{},"format":"sdd-studio-backup","schemaVersion":1,"projects":[]}'])expect(parseBackup(raw).ok).toBe(false);
});
it('rechaza importaciones adversas por tamaño, rutas, referencias, texto y duplicados',()=>{
 expect(parseBackup(' '.repeat(2*1024*1024+1)).ok).toBe(false);
 for(const mutate of [(p:LocalProject)=>{p.draft.slug='../fuera';},(p:LocalProject)=>{p.draft.idea='token='+'a'.repeat(25);},(p:LocalProject)=>{p.draft.idea=String.fromCodePoint(0x1f600);},(p:LocalProject)=>{p.draft.project!.context.actors=[{id:'ACT-1',text:'Actor',status:'confirmado',origin:'user',references:['ACT-ausente']}];}]){
  const p=record();mutate(p);expect(parseBackup(JSON.stringify({format:'sdd-studio-backup',schemaVersion:1,projects:[p]})).ok).toBe(false);
 }
 expect(parseBackup(JSON.stringify({format:'sdd-studio-backup',schemaVersion:1,projects:[record(),record()]})).ok).toBe(false);
});

it('rechaza cuota total y secretos en metadatos sin escribir, y respeta cancelación del commit',async()=>{
 const storage=memoryStorage(),l=emptyLibrary();l.projects=[record()];l.activeId='P-1';const saved=await writeLibrary(l,null,storage);if(!saved.ok)throw new Error('Guardar');
 expect(await writeLibrary(l,saved.raw,storage,()=>false)).toMatchObject({ok:false});expect(storage.getItem(libraryKey)).toBe(saved.raw);
 const p=record();p.id='sk-'+'a'.repeat(24);expect(exportBackup([p]).ok).toBe(false);
 const large=emptyLibrary();large.projects=Array.from({length:20},(_,i)=>{const p=record();p.id=`P-${i}`;p.draft.idea='dato '.repeat(4000);p.versions=Array.from({length:3},(_,n)=>({id:`V-${n}`,label:'Base',createdAt:now,configuration:structuredClone(p.draft)}));return p;});large.activeId='P-0';
 expect(await writeLibrary(large,saved.raw,storage)).toMatchObject({ok:false});expect(storage.getItem(libraryKey)).toBe(saved.raw);
});
