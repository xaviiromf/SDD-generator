import type { KitContext } from './kitContext';
import { tableCell, textSection } from './kitContext';
import type { KitTask } from './taskGraph';
export type TaskDomain = 'Núcleo'|'Interfaz y estética'|'Servicios'|'Integración pública'|'Documentación';
export const fileDomain=(path:string):TaskDomain=>{
    if(/^(?:docs|specs|prompts)\/|\.md$|\.txt$/.test(path))return 'Documentación';
    if(/(?:^|\/)(?:interfaz|components|styles|frontend|pages|scenes)(?:\/|$)|\.(?:tsx|vue|svelte|astro|css)$|app\/(?:page|layout)/.test(path))return 'Interfaz y estética';
    if(/(?:^|\/)(?:services|workers|offline|api|storage|migrations)(?:\/|$)|(?:asgi|wsgi|celery|consumers|serializers)\./.test(path))return 'Servicios';
    if(/(?:^|\/)(?:app|store|integracion)(?:\/|$)/.test(path))return 'Integración pública';
    return 'Núcleo';
};
/** Un directorio raíz ambiguo no constituye permiso para recorrer el repositorio. */
const isolatedPath=(path:string)=>!['src/','tests/','scripts/','scenes/'].includes(path);
export function isolateTasks(tasks:KitTask[],folder:string):KitTask[]{
    const result:KitTask[]=[];const splitEnds=new Map<string,string[]>();
    for(const task of tasks){
        if(/^(?:Validar|Verificar criterios|Verificar accesibilidad)/.test(task.title)){result.push({...task,files:[`${folder}/validation.md`,'docs/VERIFICATION.md','docs/PROJECT_STATUS.md']});continue;}
        const files=task.files.filter(isolatedPath);
        const groups=new Map<TaskDomain,string[]>();for(const file of files){const domain=fileDomain(file);groups.set(domain,[...(groups.get(domain)??[]),file]);}
        if(groups.size<=1){result.push({...task,files});continue;}
        result.push({...task,title:`Definir contrato por dominio: ${task.title}`,files:[`${folder}/plan.md`],done:'Revisar contratos y autorizar por separado las tareas de cada dominio.'});
        const ids:string[]=[];
        for(const [domain,paths] of groups){if(domain==='Documentación')continue;const id=`${task.id}-${domain==='Núcleo'?'NUCLEO':domain==='Interfaz y estética'?'UI':domain==='Servicios'?'SERVICIOS':'INTEGRACION'}`;ids.push(id);result.push({...task,id,title:`${domain}: ${task.title}`,depends:[task.id],files:paths});}
        splitEnds.set(task.id,ids);
    }
    for(const task of result){const own=task.depends.length===1&&task.id.startsWith(task.depends[0]+'-');if(!own)task.depends=[...new Set(task.depends.flatMap(id=>[id,...(splitEnds.get(id)??[])]))];}
    return result;
}
export interface AgentTaskContext {id:string;phase:'DOCUMENT'|'IMPLEMENT'|'VALIDATE';domain:TaskDomain;entryFiles:string[];allowedFiles:string[];dependencies:string[];contracts:string[];approvalRequired:boolean}
export function taskContexts(ctx:KitContext):AgentTaskContext[]{
    return ctx.tasks.map(task=>{
        const validation=/^(?:Validar|Verificar criterios|Verificar accesibilidad)/.test(task.title);
        const domains=new Set(task.files.map(fileDomain));
        const domain=validation?'Documentación':domains.size===1?[...domains][0]:'Documentación';
        const phase=validation?'VALIDATE':domain==='Documentación'?'DOCUMENT':'IMPLEMENT';
        return {id:task.id,phase,domain,entryFiles:['AGENTS.md','docs/PROJECT_STATUS.md',`${ctx.folder}/spec.md`],allowedFiles:phase==='VALIDATE'?task.files.filter(f=>fileDomain(f)==='Documentación'):task.files,dependencies:task.depends,contracts:[`${ctx.folder}/plan.md: contratos de ${task.rf}`,`${ctx.folder}/spec.md: ${task.rf}`],approvalRequired:true};
    });
}
export function agentPackages(ctx:KitContext):string {
    return `## Paquetes de contexto por tarea\n\nCada paquete es una propuesta, no una autorización. Lee como máximo tres archivos al entrar; consulta únicamente los apartados pertinentes. Después identifica la tarea y amplía lectura solo a sus archivos permitidos y contratos públicos. No leer todo el kit. VALIDATE lee resultados e informes; una corrección requiere volver a IMPLEMENT con tarea registrada.\n\n${taskContexts(ctx).map((packet,index)=>{const task=ctx.tasks[index];return `### Paquete ${packet.id}\n\nObjetivo: ${textSection(task.title)}. RF: ${task.rf}.\n\nFase: ${packet.phase}. Dominio: ${packet.domain}.\n\nEntrada (máximo tres): ${packet.entryFiles.map(p=>'\x60'+p+'\x60').join(', ')}.\n\nDependencias: ${packet.dependencies.join(', ')||'Ninguna'}. Contratos públicos: ${packet.contracts.join('; ')}.\n\nArchivos permitidos: ${packet.allowedFiles.map(p=>'\x60'+p+'\x60').join(', ')||'Pendientes de concretar antes de implementar; no autoriza recorrer directorios raíz'}. ${packet.phase==='VALIDATE'?'Leer únicamente salidas, trazas e informes; no inspeccionar implementación.':'Prohibido leer internals de otros dominios. Separar tareas de contrato e integración antes de cruzar fronteras.'}\n\nCriterios: ${tableCell(task.done.slice(0,1000))}. Consultar los criterios completos de ${task.rf} en la especificación activa.\n\nPuerta de aprobación: registrar alcance e IDs autorizados en docs/PROJECT_STATUS.md. Detenerse ante contratos, rutas o dependencias pendientes; no instalar ni programar por recibir este paquete. Estado inicial: No ejecutado.`;}).join('\n\n')}\n`;
}
export function agentAccessMatrix():string {
    return `## Matriz de acceso y contexto acotado\n\nEntrada obligatoria: AGENTS.md, docs/PROJECT_STATUS.md y únicamente el apartado pertinente de la especificación activa. Máximo tres archivos antes de identificar la tarea. Consultar después su paquete en tasks.md y contratos delimitados de plan.md; no cargar todo el kit.\n\n| Fase | Leer | Escribir |\n|---|---|---|\n| DOCUMENT | Especificaciones, estado y contratos pertinentes | Documentación revisable |\n| IMPLEMENT | Archivos autorizados del subsistema y contratos públicos | Archivos de la tarea aprobada |\n| VALIDATE | Salidas de pruebas, trazas e informes | Evidencia y estado |\n\nUI no lee internals de núcleo ni compilador. Núcleo no lee internals de UI ni estilos. Servicios e integración consumen contratos nombrados; una importación no autoriza inspeccionar otra implementación. Una corrección abandona VALIDATE y registra tarea IMPLEMENT. Requiere aprobación explícita antes de código; las carpetas propuestas y perfiles declarados no conceden permiso.\n`;
}
