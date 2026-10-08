import {emptyLibrary,type ProjectLibrary} from '../domain/projectLibrary';
import {runLibraryValidation} from './libraryValidation';
export const libraryKey='sdd-studio:biblioteca:v1';
export interface LibraryRead {library:ProjectLibrary;raw:string|null;error:string|null}
export type LibraryWrite={ok:true;raw:string}|{ok:false;error:string};
export async function readLibrary(storage:Storage=localStorage):Promise<LibraryRead>{
 let raw:string|null;
 try{raw=storage.getItem(libraryKey);}catch{return {library:emptyLibrary(),raw:null,error:'No se puede acceder a la biblioteca local. Puedes trabajar en memoria y respaldar tu borrador.'};}
 if(raw===null)return {library:emptyLibrary(),raw,error:null};
 const result=await runLibraryValidation({kind:'read',raw});
 return result.ok?{library:result.value as ProjectLibrary,raw,error:null}:{library:emptyLibrary(),raw,error:result.error};
}
export async function writeLibrary(library:ProjectLibrary,previousRaw:string|null,storage:Storage=localStorage,guard:()=>boolean=()=>true):Promise<LibraryWrite>{
 const result=await runLibraryValidation({kind:'write',library});if(!result.ok)return result;
 const commit=():LibraryWrite=>{try{
  if(storage.getItem(libraryKey)!==previousRaw)return {ok:false,error:'La biblioteca cambió en otra pestaña. Respalda tu edición antes de recargar; no se sobrescribieron datos.'};
  if(!guard())return {ok:false,error:'La edición cambió durante la comparación. Revisa las diferencias de nuevo; no se sustituyeron datos.'};
  const raw=result.value as string;storage.setItem(libraryKey,raw);return {ok:true,raw};
 }catch{return {ok:false,error:'No se pudo guardar la biblioteca: almacenamiento restringido o cuota agotada. La edición permanece en memoria.'};}};
 try{return typeof navigator!=='undefined'&&navigator.locks?await navigator.locks.request(libraryKey,commit):commit();}
 catch{return {ok:false,error:'No se pudo adquirir el acceso a la biblioteca. Los datos actuales se conservan.'};}
}
