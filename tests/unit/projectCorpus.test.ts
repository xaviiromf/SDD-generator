import { readFileSync, writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { compile } from '../../src/engine/compiler';
import { brokenReferences } from '../../src/engine/references';
interface Sample {id:string;title:string;idea:string;actor:string;behavior:string;criterion:string;exception:string;mode:'nuevo'|'ampliacion'|'documentacion'}
const corpus=JSON.parse(readFileSync('specs/005-generador-profesional/fixtures/corpus.json','utf8')) as Sample[];
const evidence:object[]=[];
for(const sample of corpus)it(`corpus ${sample.id}: ${sample.title}`,()=>{
 const c=emptyConfiguration(),p=c.project!;c.idea=sample.idea;c.name=sample.title;
 p.mode=sample.mode;p.implementationRequired=sample.id!=='12';
 p.context.actors=[{id:'ACT-1',text:sample.actor,status:'confirmado',origin:'user',references:[]}];
 const r=createRequirement('RF-2');Object.assign(r,{title:sample.behavior,behavior:sample.behavior,context:sample.idea,actorId:'ACT-1',status:'confirmado',exceptions:[sample.exception],criteria:[{id:'CA-3',text:sample.criterion}]});p.requirements=[r];
 const first=compile(c),second=compile(c),spec=first.documents.find(d=>d.id==='spec')!.content;
 expect(first.documents).toEqual(second.documents);expect(first.documents).toHaveLength(34);
 for(const text of [sample.actor,sample.behavior,sample.criterion,sample.exception])expect(spec).toContain(text);
 expect(brokenReferences(first.documents)).toEqual([]);expect(first.coverage?.brokenReferences).toEqual([]);
 expect(first.coverage?.links[0].criterionIds).toEqual(['CA-3']);expect(first.diagnostics.some(d=>d.blocking)).toBe(false);
 expect(first.documents.find(d=>d.id==='tasks')!.content).toContain('CA-3');
 expect(first.documents.find(d=>d.id==='validation')!.content).toContain('No ejecutado');
 expect(first.readiness?.quality).toEqual({complete:6,applicable:6});
 if(sample.id==='12')expect(first.targetTree.some(p=>p.startsWith('src/'))).toBe(false);
 evidence.push({id:sample.id,documents:34,declaredInputsPreserved:true,stableRevision:true,brokenReferences:0,criterionLinked:true,semanticReview:'Pendiente',externalInference:'No ejecutada'});
 if(evidence.length===corpus.length)writeFileSync('specs/005-generador-profesional/fixtures/h2-results.json',JSON.stringify(evidence,null,2)+'\n');
});
it('verifica cien requisitos con IDs estables sin superar el presupuesto documental',()=>{
 const c=emptyConfiguration();for(let i=0;i<100;i++){const r=createRequirement(`RF-${i}`);r.title=`Requisito ${i}`;r.behavior='Conservar los datos aportados';r.criteria=[{id:`CA-${i}`,text:'Los datos permanecen disponibles'}];c.project!.requirements.push(r);}
 const result=compile(c);expect(result.documents).toHaveLength(34);expect(result.coverage?.links).toHaveLength(100);
 expect(new TextEncoder().encode(result.documents.map(d=>d.content).join('')).length).toBeLessThan(1048576);
});
