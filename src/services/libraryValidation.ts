import {validateLibraryJob,type LibraryJob} from './libraryJob';
import type {ValidationResult} from './projectImport';
export async function runLibraryValidation(job:LibraryJob):Promise<ValidationResult<unknown>>{
 if(typeof Worker==='undefined')return validateLibraryJob(job);
 return new Promise(resolve=>{
  let worker:Worker;
  try{worker=new Worker(new URL('../workers/projectImport.worker.ts',import.meta.url),{type:'module'});}catch{resolve({ok:false,error:'No se pudo iniciar la validación local. Los datos actuales se conservan.'});return;}
  const finish=(result:ValidationResult<unknown>)=>{clearTimeout(timeout);worker.terminate();resolve(result);};
  const timeout=setTimeout(()=>finish({ok:false,error:'La validación local excedió el plazo. Intenta de nuevo; los datos actuales se conservan.'}),5000);
  worker.onmessage=e=>finish(e.data);worker.onerror=()=>finish({ok:false,error:'Falló la validación local. Los datos actuales se conservan.'});
  worker.postMessage(job);
 });
}
