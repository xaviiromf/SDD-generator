import type {Configuration} from './models';
import {fields} from './models';
import {isConfiguration,validateConfiguration,validateText} from './validation';
import {technologyById} from '../catalog/technologies';

export interface ProjectVersion {id:string;label:string;createdAt:string;configuration:Configuration}
export interface LocalProject {id:string;createdAt:string;updatedAt:string;draft:Configuration;versions:ProjectVersion[]}
export interface ProjectLibrary {schemaVersion:1;revision:number;activeId:string|null;projects:LocalProject[]}
export interface ProjectBackup {format:'sdd-studio-backup';schemaVersion:1;projects:LocalProject[]}
export interface Difference {path:string;before:string;after:string;kind:'added'|'removed'|'changed'}
export interface ConfigurationDifferences {entries:Difference[];total:number}
export const libraryLimits={projects:20,versions:5,bytes:2*1024*1024,configurationBytes:512*1024,importBytes:2*1024*1024,depth:50,differences:200} as const;
export function emptyLibrary():ProjectLibrary{return {schemaVersion:1,revision:0,activeId:null,projects:[]};}
export function librarySize(value:ProjectLibrary):number{return JSON.stringify(value).length*2;}
function keys(value:object,allowed:string[]):boolean{return Object.keys(value).every(key=>allowed.includes(key));}
function safeId(value:unknown):value is string{return typeof value==='string'&&/^[A-Za-z][A-Za-z0-9-]{0,63}$/.test(value);}
function date(value:unknown):value is string{return typeof value==='string'&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString()===value;}
export function safeData(value:unknown,depth=0):boolean{
 if(depth>libraryLimits.depth)return false;
 if(!value||typeof value!=='object')return true;
 return Object.entries(value).every(([key,child])=>!['__proto__','constructor','prototype'].includes(key)&&safeData(child,depth+1));
}
export function validLibraryConfiguration(value:unknown):value is Configuration{
 if(!isConfiguration(value)||!keys(value,['version','revision','sddLanguage','designVersion','designOverrides','project','manualSections','name','slug','idea','positive','negative','selections','origins'])||!safeData(value))return false;
 if(Object.keys(value.selections).some(k=>!fields.includes(k as typeof fields[number])))return false;
 const p=value.project;
 if(p&&(!keys(p,['schemaVersion','projectId','revision','nextId','mode','implementationRequired','requirements','context'])||
  Object.values(p.context).some(items=>items.some(item=>!keys(item,['id','text','status','origin','references'])))||
  p.requirements.some(r=>!keys(r,['id','title','kind','status','origin','actorId','context','behavior','priority','exceptions','criteria','ruleIds','componentIds','decisionIds','contractIds'])||r.criteria.some(c=>!keys(c,['id','text'])))))return false;
 return new TextEncoder().encode(JSON.stringify(value)).length<=libraryLimits.configurationBytes&&!validateConfiguration(value,new Set(technologyById.keys())).some(d=>d.blocking);
}
export function validProjects(value:unknown):value is LocalProject[]{
 if(!Array.isArray(value)||value.length>libraryLimits.projects)return false;
 if(validateText(JSON.stringify(value)).some(d=>d.blocking))return false;
 const ids=new Set<string>();
 for(const record of value){
  if(!record||typeof record!=='object'||!keys(record,['id','createdAt','updatedAt','draft','versions']))return false;
  const p=record as LocalProject;
  if(!safeId(p.id)||ids.has(p.id)||!date(p.createdAt)||!date(p.updatedAt)||p.updatedAt<p.createdAt||!validLibraryConfiguration(p.draft)||!Array.isArray(p.versions)||p.versions.length>libraryLimits.versions)return false;
  ids.add(p.id);const versions=new Set<string>();
  for(const v of p.versions){
   if(!v||typeof v!=='object'||!keys(v,['id','label','createdAt','configuration'])||!safeId(v.id)||versions.has(v.id)||!date(v.createdAt)||typeof v.label!=='string'||!v.label.trim()||v.label.length>80||validateText(v.label).length||!validLibraryConfiguration(v.configuration))return false;
   versions.add(v.id);
  }
 }
 return true;
}
export function isProjectLibrary(value:unknown):value is ProjectLibrary{
 if(!value||typeof value!=='object'||Array.isArray(value)||!keys(value,['schemaVersion','revision','activeId','projects'])||!safeData(value))return false;
 const l=value as ProjectLibrary;
 return l.schemaVersion===1&&Number.isSafeInteger(l.revision)&&l.revision>=0&&validProjects(l.projects)&&(l.projects.length===0?l.activeId===null:l.projects.some(p=>p.id===l.activeId))&&librarySize(l)<=libraryLimits.bytes;
}
export function configurationDifferences(before:Configuration,after:Configuration):ConfigurationDifferences{
 const entries:Difference[]=[];let total=0;
 function display(value:unknown):string{return value===undefined?'Sin definir':typeof value==='string'?value:JSON.stringify(value);}
 function visit(a:unknown,b:unknown,path:string){
  if(JSON.stringify(a)===JSON.stringify(b))return;
  if(a&&b&&typeof a==='object'&&typeof b==='object'&&!Array.isArray(a)&&!Array.isArray(b)){
   for(const key of new Set([...Object.keys(a),...Object.keys(b)]))if(key!=='revision')visit((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key],path?`${path}.${key}`:key);
  }else if(Array.isArray(a)&&Array.isArray(b)&&[...a,...b].every(v=>v&&typeof v==='object'&&'id'in v)){
   const left=new Map(a.map(v=>[v.id,v])),right=new Map(b.map(v=>[v.id,v]));
   for(const id of new Set([...left.keys(),...right.keys()]))visit(left.get(id),right.get(id),`${path}.${id}`);
   if(a.map(v=>v.id).join('|')!==b.map(v=>v.id).join('|'))visit(a.map(v=>v.id),b.map(v=>v.id),`${path}.orden`);
  }else{total++;if(entries.length<libraryLimits.differences)entries.push({path,before:display(a),after:display(b),kind:a===undefined?'added':b===undefined?'removed':'changed'});}
 }
 visit(before,after,'');return {entries,total};
}
