import {libraryLimits,safeData,validProjects,type ProjectBackup} from '../domain/projectLibrary';
export type ValidationResult<T>={ok:true;value:T}|{ok:false;error:string};
export function parseBackup(raw:string):ValidationResult<ProjectBackup>{
 if(new TextEncoder().encode(raw).length>libraryLimits.importBytes)return {ok:false,error:'El respaldo supera el límite de 2 MiB.'};
 try{
  const value=JSON.parse(raw);
  if(!value||typeof value!=='object'||Array.isArray(value)||!safeData(value)||Object.keys(value).some(k=>!['format','schemaVersion','projects'].includes(k))||value.format!=='sdd-studio-backup'||value.schemaVersion!==1||!validProjects(value.projects)||value.projects.length===0)return {ok:false,error:'Respaldo no válido: revisa formato, versión, referencias, límites y seguridad del texto.'};
  return {ok:true,value};
 }catch{return {ok:false,error:'No se pudo leer el JSON del respaldo. Los datos actuales se conservan.'};}
}
export function exportBackup(projects:ProjectBackup['projects']):ValidationResult<string>{
 if(!validProjects(projects)||!projects.length)return {ok:false,error:'No hay proyectos válidos para respaldar.'};
 const raw=JSON.stringify({format:'sdd-studio-backup',schemaVersion:1,projects});
 return new TextEncoder().encode(raw).length<=libraryLimits.importBytes?{ok:true,value:raw}:{ok:false,error:'El respaldo supera el límite de 2 MiB.'};
}
