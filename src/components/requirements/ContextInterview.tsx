import { memo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Plus, Trash2 } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { contextKinds, type ContextKind, type ProjectDefinition, type ProjectStatus } from '../../domain/projectDefinition';
import { contextLabels, statusLabels } from './RequirementsEditor';
const ContextRow=memo(function ContextRow({kind,id}:{kind:ContextKind;id:string}){
 const item=useEditorStore(s=>s.config.project?.context[kind].find(i=>i.id===id));
 const update=useEditorStore(s=>s.updateProjectItem),remove=useEditorStore(s=>s.removeProjectItem);
 const options=useEditorStore(useShallow(s=>contextKinds.flatMap(k=>s.config.project?.context[k]??[])));
 if(!item)return null;
 return <div className="context-row"><label className="field"><span>{contextLabels[kind]} · {id}</span><textarea maxLength={2000} rows={2} value={item.text} onChange={e=>update(kind,id,{text:e.target.value})}/></label><label className="field"><span>Estado de {id}</span><select value={item.status} onChange={e=>update(kind,id,{status:e.target.value as ProjectStatus})}>{Object.entries(statusLabels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</select></label>
 <details><summary>Referencias de {id}</summary>{options.filter(i=>i.id!==id).map(option=><label className="context-reference" key={option.id}><input type="checkbox" checked={item.references.includes(option.id)} onChange={e=>update(kind,id,{references:e.target.checked?[...item.references,option.id]:item.references.filter(ref=>ref!==option.id)})}/><span>{option.id}: {option.text||'Sin descripción'}</span></label>)}{!options.some(i=>i.id!==id)&&<p>Declara otro elemento para poder relacionarlo.</p>}</details>
 <button aria-label={`Eliminar ${id}`} onClick={()=>{if(window.confirm(`¿Eliminar ${id}? Sus referencias deben estar desvinculadas.`))remove(kind,id);}}><Trash2 size={16}/>Eliminar elemento</button></div>;
});
export function ContextInterview(){
 const [kind,setKind]=useState<ContextKind>('actors');
 const ids=useEditorStore(useShallow(s=>s.config.project?.context[kind].map(i=>i.id)??[]));
 const mode=useEditorStore(s=>s.config.project?.mode??'nuevo'),implementation=useEditorStore(s=>s.config.project?.implementationRequired??true);
 const update=useEditorStore(s=>s.updateProject),add=useEditorStore(s=>s.addProjectItem);
 const platform=useEditorStore(s=>s.config.selections.platform?.[0]);
 return <details className="context-interview"><summary>Entrevista y contexto</summary><p>Responde con información de tu proyecto. Las preguntas orientan; no completan reglas automáticamente.</p>
 <label className="field"><span>Modo de trabajo</span><select value={mode} onChange={e=>update({mode:e.target.value as ProjectDefinition['mode']})}><option value="nuevo">Proyecto nuevo</option><option value="ampliacion">Ampliación existente</option><option value="migracion">Migración</option><option value="documentacion">Documentación o diagnóstico</option></select></label>
 <label className="context-reference"><input type="checkbox" checked={implementation} onChange={e=>update({implementationRequired:e.target.checked})}/><span>El proyecto requiere implementación de software</span></label>
 <ul className="interview-questions"><li>¿Quién necesita el trabajo y en qué situación?</li><li>¿Qué datos entran, qué resultado sale y qué debe rechazarse?</li><li>¿Cómo comprobarás que cada requisito se cumple?</li>{mode!=='nuevo'&&<li>¿Qué interfaces y comportamientos existentes deben conservarse?</li>}{implementation&&['web-spa','web-ssr','pwa'].includes(platform??'')&&<li>¿Qué necesita quien usa la interfaz y cuándo debe funcionar sin red?</li>}{implementation&&['cli','daemon','shell'].includes(platform??'')&&<li>¿Qué entradas, salidas y efectos operativos deben controlarse?</li>}{!implementation&&<li>¿Quién revisará la evidencia del proceso sin tareas de programación?</li>}</ul>
 <label className="field"><span>Aspecto del contexto</span><select value={kind} onChange={e=>setKind(e.target.value as ContextKind)}>{contextKinds.map(value=><option key={value} value={value}>{contextLabels[value]}</option>)}</select></label>
 {ids.map(id=><ContextRow key={id} kind={kind} id={id}/>)}<button disabled={ids.length>=100} onClick={()=>add(kind)}><Plus size={16}/>Añadir {contextLabels[kind].toLocaleLowerCase('es')}</button>
 </details>;
}
