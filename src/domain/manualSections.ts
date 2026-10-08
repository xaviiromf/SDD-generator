import {createKitManifest} from '../engine/kitManifest';
import type {GeneratedDocument} from './models';

export interface ManualSection {
 id:string; documentId:string; sectionKey:string; title:string; text:string; baseContent:string;
}
export interface DocumentSection {key:string;title:string;start:number;end:number;content:string}
export interface SectionConflict {additionId:string;documentId:string;title:string;previous:string;next:string;missing:boolean}
export const manualLimits={items:50,bytes:128*1024,text:10000,base:40000} as const;
const documentIds=new Set(createKitManifest({slug:'mi-proyecto'}).map(d=>d.id));
export function isManualSections(value:unknown):value is ManualSection[]{
 if(!Array.isArray(value)||value.length>manualLimits.items)return false;
 const ids=new Set<string>();
 for(const entry of value){
  if(!entry||typeof entry!=='object'||Array.isArray(entry))return false;
  const s=entry as Record<string,unknown>;
  if(Object.keys(s).some(k=>!['id','documentId','sectionKey','title','text','baseContent'].includes(k)))return false;
  if(!['id','documentId','sectionKey','title','text','baseContent'].every(k=>typeof s[k]==='string'))return false;
  const a=entry as ManualSection;
  if(!/^[A-Za-z][A-Za-z0-9-]{0,63}$/.test(a.id)||ids.has(a.id)||!documentIds.has(a.documentId))return false;
  if(!/^[a-zA-Z0-9-]{1,160}$/.test(a.sectionKey)||a.title.length>100||a.text.length>manualLimits.text||a.baseContent.length>manualLimits.base)return false;
  ids.add(a.id);
 }
 return new TextEncoder().encode(JSON.stringify(value)).length<=manualLimits.bytes;
}
/** Los encabezados dentro de bloques de código no delimitan una sección. */
export function documentSections(content:string):DocumentSection[]{
 const headings:{key:string;title:string;start:number}[]=[];const counts=new Map<string,number>([['documento',1]]);let offset=0,fence:{character:string;length:number}|null=null;
 for(const line of content.split(/(?<=\n)/)){
  const marker=line.match(/^\s*(`{3,}|~{3,})/);
  if(marker){if(!fence)fence={character:marker[1][0],length:marker[1].length};else if(marker[1][0]===fence.character&&marker[1].length>=fence.length&&!line.slice(marker[0].length).trim())fence=null;}
  const match=!fence&&line.match(/^#{1,6}\s+(.+?)\s*\n?$/);
  if(match){
   const title=match[1],rf=title.match(/\bRF-[A-Za-z0-9-]+\b/);
   const stem=rf?`rf-${rf[0]}`:title.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,140)||'seccion';
   const count=(counts.get(stem)??0)+1;counts.set(stem,count);headings.push({key:count===1?stem:`${stem}-${count}`,title,start:offset});
  }
  offset+=line.length;
 }
 return [{key:'documento',title:'Final del documento',start:content.length,end:content.length,content:''},...headings.map((h,i)=>({...h,end:headings[i+1]?.start??content.length,content:content.slice(h.start,headings[i+1]?.start??content.length)}))];
}
export function reconcileDocuments(documents:GeneratedDocument[],additions:ManualSection[]):{documents:GeneratedDocument[];conflicts:SectionConflict[]}{
 if(!additions.length)return {documents,conflicts:[]};
 const conflicts:SectionConflict[]=[];
 const combined=documents.map(doc=>{
  const sections=documentSections(doc.content),insertions:{at:number;text:string;order:number}[]=[];
  for(const addition of additions.filter(a=>a.documentId===doc.id&&a.text.trim())){
   const section=sections.find(s=>s.key===addition.sectionKey);
   if(!section||section.content!==addition.baseContent)conflicts.push({additionId:addition.id,documentId:doc.id,title:addition.title,previous:addition.baseContent,next:section?.content??'',missing:!section});
   const text=addition.text.replace(/[<>]/g,c=>c==='<'?'&lt;':'&gt;');
   const title=addition.title.replace(/[<>\r\n]/g,' ');
   insertions.push({at:section?.end??doc.content.length,order:insertions.length,text:`\n\n### Aportación manual: ${title||addition.id}\n\n${text}\n\n`});
  }
  let content=doc.content;
  for(const insertion of insertions.sort((a,b)=>b.at-a.at||b.order-a.order))content=content.slice(0,insertion.at)+insertion.text+content.slice(insertion.at);
  return content===doc.content?doc:{...doc,content};
 });
 return {documents:combined,conflicts};
}
