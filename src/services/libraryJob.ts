import {isProjectLibrary,type ProjectLibrary} from '../domain/projectLibrary';
import {parseBackup,exportBackup,type ValidationResult} from './projectImport';
export type LibraryJob={kind:'read';raw:string}|{kind:'write';library:ProjectLibrary}|{kind:'import';raw:string}|{kind:'export';projects:import('../domain/projectLibrary').LocalProject[]};
export function validateLibraryJob(job:LibraryJob):ValidationResult<unknown>{
 if(job.kind==='import')return parseBackup(job.raw);
 if(job.kind==='export')return exportBackup(job.projects);
 try{
  const value=job.kind==='read'?JSON.parse(job.raw):job.library;
  if(!isProjectLibrary(value))return {ok:false,error:'La biblioteca no es válida o supera su cuota de 2 MiB. Los datos originales se conservan.'};
  return {ok:true,value:job.kind==='write'?JSON.stringify(value):value};
 }catch{return {ok:false,error:'La biblioteca está dañada. No se ha sustituido ni borrado su contenido.'};}
}
