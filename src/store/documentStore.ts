import type { DocumentStatus } from '../domain/projectOverview';
import {create} from 'zustand';
import type {Compilation} from '../domain/models';
import {documentSections,reconcileDocuments,type SectionConflict} from '../domain/manualSections';
import {useEditorStore} from './editorStore';
interface Documents {
 compilation:Compilation|null;pending:boolean;error:string;
 pendingCompilation:Compilation|null;generatedCompilation:Compilation|null;manualConflicts:SectionConflict[];
 publish:(result:Compilation)=>void;fail:(message:string)=>void;
 resolveManualConflicts:(choices:Record<string,'keep'|'detach'>)=>boolean;
}
export const useDocumentStore=create<Documents>((set,get)=>({
 compilation:null,pending:true,error:'',pendingCompilation:null,generatedCompilation:null,manualConflicts:[],
 publish:result=>{
  const config=useEditorStore.getState().config;if(result.revision!==config.revision)return;
  const combined=reconcileDocuments(result.documents,config.manualSections??[]);
  if(combined.conflicts.length){set({pendingCompilation:result,manualConflicts:combined.conflicts,pending:false,error:''});return;}
  const diagnostics=[...result.diagnostics];
  if(new TextEncoder().encode(combined.documents.map(d=>d.content).join('')).length>1048576)diagnostics.push({kind:'safety',message:'El kit combinado supera 1 MiB. Reduce las aportaciones antes de exportar.',blocking:true});
  set({compilation:{...result,documents:combined.documents,diagnostics},generatedCompilation:result,pendingCompilation:null,manualConflicts:[],pending:false,error:''});
 },
 fail:error=>set({error,pending:false}),
 resolveManualConflicts:choices=>{
  const {pendingCompilation:result,manualConflicts}=get(),config=useEditorStore.getState().config;
  if(!result||result.revision!==config.revision||manualConflicts.some(c=>!choices[c.additionId])){set({error:'La revisión cambió o faltan decisiones. Espera la generación y revisa de nuevo.'});return false;}
  const sections=(config.manualSections??[]).map(a=>{
   if(!manualConflicts.some(c=>c.additionId===a.id))return a;
   const section=choices[a.id]==='keep'?documentSections(result.documents.find(d=>d.id===a.documentId)!.content).find(s=>s.key===a.sectionKey):undefined;
   return section?{...a,baseContent:section.content}:{...a,sectionKey:'documento',baseContent:''};
  });return useEditorStore.getState().setManualSections(sections);
 },
}));


/** Estado de presentación; los datos de la revisión confirmada permanecen intactos. */
export function presentDocumentStatus(base: DocumentStatus | undefined, view: { revision: number; pending: boolean; conflict: boolean; error: string }): DocumentStatus {
 const reasons = new Map((base?.reasons ?? []).map(reason => [reason.id, reason]));
 if (!base) reasons.set('estado-pendiente', { id: 'estado-pendiente', message: 'Estado documental pendiente de generar.' });
 if (view.pending || base?.revision !== view.revision) reasons.set('revision-pendiente', { id: 'revision-pendiente', message: 'Actualización pendiente: se muestra una revisión anterior.' });
 if (view.conflict) reasons.set('conflicto-manual', { id: 'conflicto-manual', message: 'Aportaciones manuales pendientes de reconciliar.' });
 if (view.error) reasons.set('generacion-error', { id: 'generacion-error', message: view.error });
 const list = [...reasons.values()];
 return { documentId: base?.documentId ?? '', revision: base?.revision ?? view.revision, state: list.length ? 'borrador' : 'completo', pendingCount: list.length, reasons: list, applicability: base?.applicability ?? 'Aplicabilidad pendiente.' };
}
