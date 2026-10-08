import { readFileSync,writeFileSync } from 'node:fs';
import { expect,it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { emptyProfiles,type ComponentKind } from '../../src/domain/profiles';
import { builtinProfiles } from '../../src/catalog/profiles';
import { compile } from '../../src/engine/compiler';
import { createKitContext } from '../../src/engine/kitContext';
import { taskContexts,fileDomain } from '../../src/engine/agentContext';
import { brokenReferences } from '../../src/engine/references';
import { parseBackup,exportBackup } from '../../src/services/projectImport';
interface Sample {id:string;title:string;idea:string;actor:string;behavior:string;criterion:string;exception:string;mode:'nuevo'|'ampliacion'|'documentacion'}
const corpus=JSON.parse(readFileSync('specs/005-generador-profesional/fixtures/corpus.json','utf8')) as Sample[];
const kinds:Record<string,ComponentKind[]>={'01':['web'],'02':['web'],'03':['api'],'04':['cli'],'05':['escritorio'],'06':['movil','api'],'07':['datos'],'08':['dispositivo'],'09':['servicio'],'10':['web'],'11':['otro'],'12':['documental']};
const evidence:object[]=[];
for(const sample of corpus)it(`H4 corpus ${sample.id}: composición y entrada acotada`,()=>{
 const c=emptyConfiguration(),p=c.project!;c.idea=sample.idea;c.name=sample.title;p.mode=sample.mode;p.implementationRequired=sample.id!=='12';
 p.context.actors=[{id:'ACT-1',text:sample.actor,status:'confirmado',origin:'user',references:[]}];
 const r=createRequirement('RF-2');Object.assign(r,{title:sample.behavior,behavior:sample.behavior,context:sample.idea,actorId:'ACT-1',status:'confirmado',exceptions:[sample.exception],criteria:[{id:'CA-3',text:sample.criterion}]});p.requirements=[r];
 const components=kinds[sample.id].map((kind,index)=>({id:'CMP-'+index,name:sample.title+' '+kind,kind,responsibility:sample.behavior,profileId:builtinProfiles.find(profile=>profile.componentKinds.includes(kind))!.id,dependsOn:[],technologyIds:sample.id==='11'?['TEC-protocolo']:[]}));
 c.profile={...emptyProfiles(),components,profiles:structuredClone(builtinProfiles.filter(profile=>components.some(component=>component.profileId===profile.id)))};
 p.context.components=components.map(component=>({id:component.id,text:component.responsibility,status:'confirmado',origin:'user',references:[]}));r.componentIds=components.map(component=>component.id);
 if(sample.id==='11')c.profile.technologies=[{id:'TEC-protocolo',name:'Protocolo propio del instrumento',role:'protocolo',purpose:sample.behavior,constraints:[sample.exception],version:'Revisión propia A',sources:[],reviewedAt:'',support:'declarada'}];
 const first=compile(c),second=compile(c);expect(first.documents).toEqual(second.documents);expect(first.documents).toHaveLength(34);expect(first.diagnostics.some(d=>d.blocking)).toBe(false);expect(brokenReferences(first.documents)).toEqual([]);expect(first.coverage!.brokenReferences).toEqual([]);
 const spec=first.documents.find(d=>d.id==='spec')!.content;for(const text of [sample.actor,sample.behavior,sample.criterion,sample.exception])expect(spec).toContain(text);
 const packets=taskContexts(createKitContext(c));for(const packet of packets){expect(packet.entryFiles.length).toBeLessThanOrEqual(3);expect(packet.approvalRequired).toBe(true);if(packet.phase==='IMPLEMENT')expect(new Set(packet.allowedFiles.map(fileDomain)).size).toBeLessThanOrEqual(1);}
 if(sample.id==='11'){expect(first.targetTree).toEqual(p.mode==='documentacion'?['docs/OPERACION.md']:[]);expect(spec).toContain('Declarada por el usuario');}
 if(sample.id==='12'){expect(packets.every(packet=>packet.phase!=='IMPLEMENT')).toBe(true);expect(first.targetTree).toEqual(['docs/OPERACION.md']);}
 const backup=exportBackup([{id:'P-corpus',createdAt:'2026-10-08T00:00:00.000Z',updatedAt:'2026-10-08T00:00:00.000Z',draft:c,versions:[]}]);expect(backup.ok).toBe(true);if(backup.ok){const restored=parseBackup(backup.value);expect(restored.ok).toBe(true);if(restored.ok)expect(restored.value.projects[0].draft.profile).toEqual(c.profile);}
 evidence.push({id:sample.id,documents:34,componentKinds:kinds[sample.id],entryFilesMaximum:3,domainIsolation:true,declaredInputsPreserved:true,brokenReferences:0,deterministic:true,backupRoundTrip:true,semanticReview:'Pendiente'});if(evidence.length===corpus.length)writeFileSync('specs/005-generador-profesional/fixtures/h4-results.json',JSON.stringify(evidence,null,2)+'\n');
});
