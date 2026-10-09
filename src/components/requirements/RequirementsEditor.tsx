import { memo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import type { ContextKind, ProjectStatus, StructuredRequirement } from '../../domain/projectDefinition';
import { ContextInterview } from './ContextInterview';
export const contextLabels: Record<ContextKind,string> = {components:'Componentes',actors:'Actores',capabilities:'Capacidades',processes:'Procesos',entities:'Datos y entidades',rules:'Reglas de negocio',decisions:'Decisiones',assumptions:'Supuestos',questions:'Preguntas pendientes',exclusions:'Exclusiones',contracts:'Contratos declarados'};
export const statusLabels: Record<ProjectStatus,string> = {pendiente:'Pendiente',propuesto:'Propuesto',confirmado:'Confirmado',descartado:'Descartado'};
export function ReferencePicker({kind,label,value,onChange}:{kind:ContextKind;label:string;value:string[];onChange:(value:string[])=>void}) {
 const options=useEditorStore(s=>s.config.project?.context[kind]);
 return <fieldset className="requirement-links"><legend>{label}</legend>{options?.filter(i=>i.status!=='descartado').map(item=><label key={item.id}><input type="checkbox" checked={value.includes(item.id)} onChange={e=>onChange(e.target.checked?[...value,item.id]:value.filter(id=>id!==item.id))}/><span>{item.id}: {item.text || 'Sin descripción'}</span></label>)}{!options?.length&&<p>Sin elementos declarados. Añádelos en Entrevista y contexto.</p>}</fieldset>;
}
const RequirementCard=memo(function RequirementCard({id,index,total}:{id:string;index:number;total:number}) {
 const item=useEditorStore(s=>s.config.project?.requirements.find(r=>r.id===id));
 const actions=useEditorStore(useShallow(s=>({update:s.updateRequirement,remove:s.removeRequirement,move:s.moveRequirement,addCriterion:s.addCriterion,updateCriterion:s.updateCriterion,removeCriterion:s.removeCriterion})));
 const actors=useEditorStore(s=>s.config.project?.context.actors);
 const [expanded,setExpanded]=useState(!item?.title);
 if(!item)return null;
 const patch=(value:Partial<Omit<StructuredRequirement,'id'|'origin'|'criteria'>>)=>actions.update(id,value);
 return <details className="requirement-card" open={expanded} onToggle={e=>setExpanded(e.currentTarget.open)} data-requirement-id={id}>
  <summary>{id} · {item.title || 'Requisito por definir'} <small>{statusLabels[item.status]}</small></summary>
  {expanded&&<div className="requirement-fields">
   <label className="field"><span>Título del requisito</span><input maxLength={500} value={item.title} onChange={e=>patch({title:e.target.value})}/></label>
   <div className="requirement-grid"><label className="field"><span>Tipo</span><select value={item.kind} onChange={e=>patch({kind:e.target.value as StructuredRequirement['kind']})}><option value="functional">Funcional</option><option value="nonfunctional">No funcional</option></select></label>
   <label className="field"><span>Prioridad</span><select value={item.priority} onChange={e=>patch({priority:e.target.value as StructuredRequirement['priority']})}><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select></label></div>
   <label className="field"><span>Estado del requisito</span><select value={item.status} onChange={e=>patch({status:e.target.value as ProjectStatus})}>{Object.entries(statusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
   <label className="field"><span>Actor responsable</span><select value={item.actorId} onChange={e=>patch({actorId:e.target.value})}><option value="">Pendiente de definir</option>{actors?.filter(a=>a.status!=='descartado').map(a=><option key={a.id} value={a.id}>{a.id}: {a.text||'Sin descripción'}</option>)}</select></label>
   <label className="field"><span>Contexto y condición</span><textarea maxLength={2000} rows={2} value={item.context} onChange={e=>patch({context:e.target.value})}/></label>
   <label className="field"><span>Comportamiento esperado</span><textarea maxLength={2000} rows={3} value={item.behavior} onChange={e=>patch({behavior:e.target.value})}/></label>
   <label className="field"><span>Excepciones y rechazos, una por línea</span><textarea rows={2} value={item.exceptions.join('\n')} onChange={e=>patch({exceptions:e.target.value ? e.target.value.split('\n'):[]})}/></label>
   <fieldset><legend>Criterios de aceptación observables</legend>{item.criteria.map(criterion=><div className="criterion-row" key={criterion.id}><label className="field"><span>Criterio {criterion.id}</span><textarea maxLength={2000} rows={2} value={criterion.text} onChange={e=>actions.updateCriterion(id,criterion.id,e.target.value)}/></label><button aria-label={`Eliminar criterio ${criterion.id}`} onClick={()=>actions.removeCriterion(id,criterion.id)}><Trash2 size={16}/></button></div>)}
   <button disabled={item.criteria.length>=10} onClick={()=>actions.addCriterion(id)}><Plus size={16}/>Añadir criterio</button></fieldset>
   <details><summary>Vincular reglas, componentes y decisiones</summary><ReferencePicker kind="rules" label="Reglas aplicables" value={item.ruleIds} onChange={ruleIds=>patch({ruleIds})}/><ReferencePicker kind="components" label="Componentes afectados" value={item.componentIds} onChange={componentIds=>patch({componentIds})}/><ReferencePicker kind="decisions" label="Decisiones relacionadas" value={item.decisionIds} onChange={decisionIds=>patch({decisionIds})}/><ReferencePicker kind="contracts" label="Contratos relacionados" value={item.contractIds} onChange={contractIds=>patch({contractIds})}/></details>
   <p className="requirement-help">Origen: aportado por el usuario. Confirmar un requisito no ejecuta sus pruebas.</p>
   <div className="requirement-actions"><button disabled={index===0} aria-label={`Subir ${id}`} onClick={()=>actions.move(id,-1)}><ArrowUp size={16}/></button><button disabled={index===total-1} aria-label={`Bajar ${id}`} onClick={()=>actions.move(id,1)}><ArrowDown size={16}/></button><button onClick={()=>{if(window.confirm(`¿Eliminar el requisito ${id} y sus criterios?`))actions.remove(id);}}><Trash2 size={16}/>Eliminar requisito</button></div>
  </div>}
 </details>;
});
export function RequirementsEditor(){
 const [visited,setVisited]=useState(false);
 const ids=useEditorStore(useShallow(s=>s.config.project?.requirements.map(r=>r.id)??[]));
 const add=useEditorStore(s=>s.addRequirement),error=useEditorStore(s=>s.projectError);
 return <section className="requirements-editor" aria-label="Definición estructurada del proyecto"><h3>Define el trabajo y cómo comprobarlo</h3><p>Conserva tus reglas y criterios. Lo no declarado seguirá pendiente.</p><ContextInterview/>
 <details className="requirements-list" onToggle={event=>{if(event.currentTarget.open)setVisited(true);}}><summary>Requisitos y criterios <small>{ids.length} / 100</small></summary>{visited&&<><p>Puedes empezar aquí sin escoger tecnologías.</p>{ids.map((id,index)=><RequirementCard key={id} id={id} index={index} total={ids.length}/>)}<button disabled={ids.length>=100} onClick={add}><Plus size={16}/>Añadir requisito</button></>}</details>
 {error&&<p className="diagnostic" role="alert">{error} Desvincula las referencias antes de eliminar un elemento.</p>}</section>;
}
