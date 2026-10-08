import { profileWarnings } from './profiles';
import { hasProjectContent } from './projectDefinition';
import type { Configuration, Diagnostic } from './models';
import type { Coverage } from '../engine/coverage';
export interface PreparationIssue {id:string;source:string;message:string;severity:'bloqueo'|'revision'}
export interface Readiness {state:'borrador'|'listo-para-revision';configuration:{complete:number;applicable:number};quality:{complete:number;applicable:number};issues:PreparationIssue[];conditions:{label:string;met:boolean}[]}
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
export function calculateReadiness(c:Configuration,coverage:Coverage|undefined,diagnostics:Diagnostic[],pillars:{label:string;complete:boolean}[]):Readiness {
 const issues:PreparationIssue[]=[];
 const add=(id:string,source:string,message:string,severity:PreparationIssue['severity']='bloqueo')=>issues.push({id,source,message,severity});
 if(c.profile)for(const [i,message] of profileWarnings(c.profile,c.project).entries())add(`perfil-${i}`,'Perfiles y componentes',message,'revision');
 const p=c.project,active=p?.requirements.filter(r=>r.status!=='descartado')??[];
 if(!hasProjectContent(p)||!active.length)add('requisitos-ausentes','Proyecto','Declara requisitos y criterios observables; una idea y una pila no bastan.');
 let complete=0;
 for(const r of active){
  const checks=[!!r.title.trim(),!!r.behavior.trim(),!!r.context.trim(),r.status==='confirmado',r.criteria.length>0&&r.criteria.every(cr=>!!cr.text.trim()),r.kind==='nonfunctional'||!!p?.context.actors.find(a=>a.id===r.actorId&&a.text.trim()&&a.status==='confirmado')];
  complete+=checks.filter(Boolean).length;
  if(!checks[0]||!checks[1])add(`descripcion-${r.id}`,r.id,'Completa título y comportamiento esperado.');
  if(!checks[2])add(`contexto-${r.id}`,r.id,'Define la condición o contexto de aplicación.');
  if(!checks[3])add(`confirmacion-${r.id}`,r.id,'El requisito todavía no está confirmado por el usuario.');
  if(!checks[4])add(`criterios-${r.id}`,r.id,'Añade criterios con resultados observables; no hay pruebas ejecutadas.');
  if(!checks[5])add(`actor-${r.id}`,r.id,'Vincula un actor confirmado y descrito para este requisito funcional.');
  if(!r.exceptions.some(text=>text.trim()))add(`excepciones-${r.id}`,r.id,'Revisar errores, rechazos o justificar que no aplican.','revision');
  for(const ref of [...r.ruleIds,...r.componentIds,...r.decisionIds,...r.contractIds]){
   const item=p&&Object.values(p.context).flat().find(i=>i.id===ref);
   if(item && (!item.text.trim()||item.status!=='confirmado'))add(`pendiente-${r.id}-${ref}`,`${r.id} / ${ref}`,'Revisar la declaración relacionada antes de implementar.');
  }
 }
 for(const error of coverage?.brokenReferences??[])add(`referencia-${issues.length}`,'Referencias',error);
 for(const question of p?.context.questions.filter(q=>q.status!=='descartado')??[])add(`pregunta-${question.id}`,question.id,question.text.trim()||'Pregunta sin resolver.');
 for(const assumption of p?.context.assumptions.filter(q=>q.status!=='confirmado'&&q.status!=='descartado')??[])add(`supuesto-${assumption.id}`,assumption.id,'Revisar o descartar el supuesto antes de implementar.');
 const exclusions=[...c.negative.split('\n').map((text,index)=>({id:`exclusion-${index+1}`,text})),...(p?.context.exclusions.filter(i=>i.status!=='descartado')??[])];
 for(const exclusion of exclusions){
  const excluded=normalize(exclusion.text).replace(/^(?:no incluir|no generar|no usar|no|sin)\s+/,'');
  if(excluded.length<4)continue;
  const positive=active.map(r=>({id:r.id,text:[r.title,r.behavior].join(' ')})).concat(c.positive.split('\n').filter(Boolean).map((text,index)=>({id:`alcance-${index+1}`,text})));
  for(const item of positive)if((' '+normalize(item.text)+' ').includes(' '+excluded+' '))add(`contradiccion-${item.id}-${exclusion.id}`,`${item.id} / ${exclusion.id}`,'La misma necesidad aparece en el alcance positivo y en una exclusión. Revísala.');
 }
 if(p?.implementationRequired!==false&&p?.mode!=='documentacion')for(const pillar of pillars.filter(p=>!p.complete))add(`configuracion-${normalize(pillar.label).replaceAll(' ','-')}`,'Configuración',`Pendiente de definir o justificar: ${pillar.label}.`);
 for(const diagnostic of diagnostics.filter(d=>d.blocking))add(`seguridad-${issues.length}`,'Datos',diagnostic.message);
 const blocked=issues.some(i=>i.severity==='bloqueo');
 return {state:blocked?'borrador':'listo-para-revision',configuration:{complete:(p?.implementationRequired===false||p?.mode==='documentacion')?0:pillars.filter(p=>p.complete).length,applicable:(p?.implementationRequired===false||p?.mode==='documentacion')?0:pillars.length},quality:{complete,applicable:active.length*6},issues,conditions:[{label:'Requisitos y criterios declarados',met:active.length>0},{label:'Referencias y datos seguros',met:!(coverage?.brokenReferences.length)&&!diagnostics.some(d=>d.blocking)},{label:'Sin pendientes bloqueantes conocidos',met:!blocked},{label:'Revisión semántica y autorización explícita',met:false}]};
}
