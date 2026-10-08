import {create} from 'zustand';
import {emptyConfiguration,type Configuration} from '../domain/models';
import {configurationDifferences,emptyLibrary,libraryLimits,validLibraryConfiguration,type ConfigurationDifferences,type LocalProject,type ProjectBackup,type ProjectLibrary} from '../domain/projectLibrary';
import {readLibrary,writeLibrary,libraryKey} from '../services/projectStorage';
import {runLibraryValidation} from '../services/libraryValidation';
import {draftKey} from '../services/draftStorage';
import {useEditorStore} from './editorStore';
interface Comparison {kind:'import'|'restore'|'open';source:string;configuration?:Configuration;targetId?:string;backup?:ProjectBackup;differences:ConfigurationDifferences;baseRevision:number}
interface LibraryState {
 library:ProjectLibrary;initialized:boolean;busy:boolean;error:string;pendingComparison:Comparison|null;replaceImports:boolean;
 createProject:(duplicate:boolean)=>Promise<boolean>;saveVersion:(label:string)=>Promise<boolean>;
 prepareOpen:(id:string)=>void;prepareRestore:(projectId:string,versionId:string)=>void;
 prepareImport:(raw:string)=>Promise<void>;setImportReplacement:(replace:boolean)=>void;confirmComparison:()=>Promise<boolean>;cancelComparison:()=>void;
 deleteProject:(id:string)=>Promise<boolean>;deleteVersion:(projectId:string,versionId:string)=>Promise<boolean>;
 exportProjects:(id?:string)=>Promise<string|null>;exportCurrent:()=>Promise<string|null>;
}
let storage:Storage,previousRaw:string|null=null,blocked=false,timer:ReturnType<typeof setTimeout>|undefined,queue:Promise<unknown>=Promise.resolve();
let foregroundOperations=0;
const editionKey='sdd-studio:edicion:v1';
export function flushProjectEdition():void{try{const configuration=useEditorStore.getState().config,library=useLibraryStore.getState().library;if(validLibraryConfiguration(configuration))storage.setItem(editionKey,JSON.stringify({activeId:library.activeId,libraryRevision:library.revision,configuration}));}catch{/* La biblioteca y la edición en memoria permanecen intactas. */}}
const id=(prefix:string)=>`${prefix}-${crypto.randomUUID()}`;
const now=()=>new Date().toISOString();
function record(configuration:Configuration):LocalProject{const date=now();return {id:id('P'),createdAt:date,updatedAt:date,draft:structuredClone(configuration),versions:[]};}
function persist(change:(library:ProjectLibrary,current:Configuration)=>{library:ProjectLibrary;activate?:Configuration}|null,guard:()=>boolean=()=>true,background=false):Promise<boolean>{
 if(!background){foregroundOperations++;useLibraryStore.setState({busy:true});}
 const operation=queue.then(async()=>{
  const state=useLibraryStore.getState();if(blocked||!state.initialized){useLibraryStore.setState({error:state.error||'La biblioteca todavía no está disponible.'});return false;}
  try{
   const current=useEditorStore.getState().config,library=structuredClone(state.library),active=library.projects.find(p=>p.id===library.activeId);
   if(active){active.draft=structuredClone(current);active.updatedAt=now();}
   const next=change(library,current);if(!next)return false;next.library.revision=state.library.revision+1;
   const result=await writeLibrary(next.library,previousRaw,storage,()=>guard()&&(!next.activate||useEditorStore.getState().config===current));
   if(!result.ok){useLibraryStore.setState({error:result.error});return false;}
   previousRaw=result.raw;useLibraryStore.setState({library:next.library,error:''});
   if(next.activate)useEditorStore.getState().restore(structuredClone(next.activate));flushProjectEdition();return true;
  }catch{useLibraryStore.setState({error:'No se pudo completar el cambio. La edición actual se conserva.'});return false;}
 }).finally(()=>{if(!background){foregroundOperations--;useLibraryStore.setState({busy:foregroundOperations>0});}});queue=operation.catch(()=>undefined);return operation;
}
function compareImport(backup:ProjectBackup,replace:boolean):ConfigurationDifferences{
 const entries:ConfigurationDifferences['entries']=[];let total=0;
 for(const project of backup.projects){const previous=replace?useLibraryStore.getState().library.projects.find(p=>p.id===project.id)?.draft:undefined;
  const differences=configurationDifferences(previous??emptyConfiguration(),project.draft);total+=differences.total;
  entries.push(...differences.entries.slice(0,libraryLimits.differences-entries.length).map(e=>({...e,path:`${project.draft.name}: ${e.path}`})));
 }return {entries,total};
}
export const useLibraryStore=create<LibraryState>((set,get)=>({
 library:emptyLibrary(),initialized:false,busy:false,error:'',pendingComparison:null,replaceImports:false,
 createProject:duplicate=>persist((library,current)=>{
  const next=record(duplicate?current:emptyConfiguration());if(!duplicate){next.draft.project!.projectId=next.id;next.draft.name='Nuevo proyecto';next.draft.slug='nuevo-proyecto';}
  library.projects.push(next);library.activeId=next.id;return {library,activate:next.draft};
 }),
 saveVersion:label=>persist(library=>{
  const active=library.projects.find(p=>p.id===library.activeId);if(!active)return null;
  if(active.versions.length>=libraryLimits.versions){set({error:'Máximo cinco versiones por proyecto. Respalda y elimina una versión explícitamente antes de guardar otra.'});return null;}
  active.versions.push({id:id('V'),label:label.trim()||`Versión ${active.versions.length+1}`,createdAt:now(),configuration:structuredClone(active.draft)});return {library};
 }),
 prepareOpen:targetId=>{const target=get().library.projects.find(p=>p.id===targetId);if(!target)return;const current=useEditorStore.getState().config;set({pendingComparison:{kind:'open',source:`Abrir ${target.draft.name}`,targetId,configuration:target.draft,differences:configurationDifferences(current,target.draft),baseRevision:current.revision},error:''});},
 prepareRestore:(targetId,versionId)=>{const p=get().library.projects.find(p=>p.id===targetId),v=p?.versions.find(v=>v.id===versionId);if(!p||!v)return;const current=useEditorStore.getState().config;set({pendingComparison:{kind:'restore',source:`Recuperar ${v.label} de ${p.draft.name}`,targetId,configuration:v.configuration,differences:configurationDifferences(get().library.activeId===targetId?current:p.draft,v.configuration),baseRevision:current.revision},error:''});},
 prepareImport:async raw=>{set({busy:true});try{const result=await runLibraryValidation({kind:'import',raw});if(!result.ok){set({error:result.error});return;}const backup=result.value as ProjectBackup;set({replaceImports:false,pendingComparison:{kind:'import',source:`Importar ${backup.projects.length} proyecto(s)`,backup,differences:compareImport(backup,false),baseRevision:useEditorStore.getState().config.revision},error:''});}finally{set({busy:false});}},
 setImportReplacement:replaceImports=>{const pending=get().pendingComparison;if(pending?.backup)set({replaceImports,pendingComparison:{...pending,differences:compareImport(pending.backup,replaceImports)}});},
 cancelComparison:()=>set({pendingComparison:null}),
 confirmComparison:async()=>{
  const pending=get().pendingComparison;if(!pending)return false;
  const ok=await persist((library,current)=>{
   if(current.revision!==pending.baseRevision){set({error:'La edición cambió desde la comparación. Cancela y compara de nuevo.'});return null;}
   if(pending.kind==='import'){
    for(const imported of pending.backup!.projects){
     const existing=get().replaceImports?library.projects.find(p=>p.id===imported.id):undefined;
     if(existing){library.projects.push({...structuredClone(existing),id:id('P')});library.projects=library.projects.filter(p=>p.id!==existing.id);library.projects.push(structuredClone(imported));}
     else library.projects.push({...structuredClone(imported),id:id('P')});
    }
    const target=library.projects.find(p=>p.id===library.activeId);return {library,activate:target?.draft};
   }
   const target=library.projects.find(p=>p.id===pending.targetId);if(!target)return null;
   if(pending.kind==='restore'){
    if(target.versions.length>=libraryLimits.versions){set({error:'No hay espacio para conservar el estado anterior. Respalda y elimina una versión antes de recuperar.'});return null;}
    target.versions.push({id:id('V'),label:'Antes de recuperar',createdAt:now(),configuration:structuredClone(target.draft)});target.draft=structuredClone(pending.configuration!);
   }
   library.activeId=target.id;return {library,activate:target.draft};
  },()=>get().pendingComparison===pending);if(ok)set({pendingComparison:null});return ok;
 },
 deleteProject:projectId=>persist(library=>{library.projects=library.projects.filter(p=>p.id!==projectId);if(library.activeId!==projectId)return {library};const next=library.projects[0]??record(emptyConfiguration());if(!library.projects.length)library.projects.push(next);library.activeId=next.id;return {library,activate:next.draft};}),
 deleteVersion:(projectId,versionId)=>persist(library=>{const p=library.projects.find(p=>p.id===projectId);if(p)p.versions=p.versions.filter(v=>v.id!==versionId);return {library};}),
 exportProjects:async projectId=>{
  const projects=structuredClone(get().library.projects.filter(p=>!projectId||p.id===projectId));const active=projects.find(p=>p.id===get().library.activeId);if(active)active.draft=structuredClone(useEditorStore.getState().config);
  const result=await runLibraryValidation({kind:'export',projects});if(!result.ok){set({error:result.error});return null;}return result.value as string;
 },
 exportCurrent:async()=>{const result=await runLibraryValidation({kind:'export',projects:[record(useEditorStore.getState().config)]});if(!result.ok){set({error:result.error});return null;}return result.value as string;},
}));
export async function initializeLibrary(adapter?:Storage):Promise<()=>void>{
 try{storage=adapter??localStorage;}catch{blocked=true;useLibraryStore.setState({initialized:true,error:'La biblioteca local no está disponible. Conserva un respaldo del borrador actual.'});return ()=>{};}
 clearTimeout(timer);queue=Promise.resolve();useLibraryStore.setState({initialized:false,busy:true,error:''});
 const read=await readLibrary(storage);previousRaw=read.raw;blocked=!!read.error;let library=read.library;
 const current=useEditorStore.getState().config;
 if(!blocked){
  if(!library.projects.length){const initial=record(current);library={...library,projects:[initial],activeId:initial.id};}
  else if(storage.getItem(draftKey)&&!library.projects.some(p=>[p.draft,...p.versions.map(v=>v.configuration)].some(c=>configurationDifferences(c,current).total===0))){
   const active=library.projects.find(p=>p.id===library.activeId);
   let owned=false;try{const reference=JSON.parse(storage.getItem(editionKey)??'null');owned=reference?.activeId===library.activeId&&reference?.libraryRevision===library.revision&&validLibraryConfiguration(reference.configuration)&&configurationDifferences(reference.configuration,current).total===0;}catch{/* Procedencia desconocida: recuperar como copia. */}
   if(active&&owned&&current.project?.projectId===active.draft.project?.projectId){active.draft=structuredClone(current);active.updatedAt=now();}
   else{const recovered=record(current);library={...library,projects:[...library.projects,recovered],activeId:recovered.id};}
  }
  if(JSON.stringify(library)!==previousRaw)library.revision=read.library.revision+1;
  const saved=await writeLibrary(library,previousRaw,storage);
  if(saved.ok){previousRaw=saved.raw;const active=library.projects.find(p=>p.id===library.activeId);if(active&&configurationDifferences(active.draft,current).total){
   if(useEditorStore.getState().config===current)useEditorStore.getState().restore(structuredClone(active.draft));
   else{const recovered=record(useEditorStore.getState().config);library={...library,projects:[...library.projects,recovered],activeId:recovered.id};const preserved=await writeLibrary(library,previousRaw,storage);if(preserved.ok)previousRaw=preserved.raw;else{blocked=true;useLibraryStore.setState({error:preserved.error});library=read.library;}}
  }}
  else{blocked=true;useLibraryStore.setState({error:saved.error});library=read.library;}
 }
 useLibraryStore.setState({library,initialized:true,busy:false,...(read.error?{error:read.error}:{})});
 if(!blocked)flushProjectEdition();
 const unsubscribe=useEditorStore.subscribe((state,previous)=>{if(state.config===previous.config)return;clearTimeout(timer);timer=setTimeout(()=>{void persist(l=>({library:l}),()=>true,true);},800);});
 if(useEditorStore.getState().config!==current&&!blocked)timer=setTimeout(()=>{void persist(l=>({library:l}),()=>true,true);},800);
 const changed=(event:StorageEvent)=>{if(event.key===libraryKey&&event.newValue!==previousRaw){blocked=true;useLibraryStore.setState({error:'La biblioteca cambió en otra pestaña. Exporta el borrador actual antes de recargar; tus datos permanecen en memoria.'});}};
 if(typeof window!=='undefined'){window.addEventListener('storage',changed);window.addEventListener('pagehide',flushProjectEdition);}
 return ()=>{clearTimeout(timer);unsubscribe();if(typeof window!=='undefined'){window.removeEventListener('storage',changed);window.removeEventListener('pagehide',flushProjectEdition);}};
}
