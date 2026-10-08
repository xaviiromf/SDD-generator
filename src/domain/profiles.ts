import { technologyById } from '../catalog/technologies';
import { builtinProfiles } from '../catalog/profiles';
import type { ProjectDefinition } from './projectDefinition';
export const workModes = ['nuevo', 'ampliacion', 'migracion', 'documentacion'] as const;
export type WorkMode = typeof workModes[number];
export const modeLabels: Record<WorkMode, string> = { nuevo: 'Proyecto nuevo', ampliacion: 'Ampliación de proyecto existente', migracion: 'Migración', documentacion: 'Documentación sin software' };
export const componentKinds = ['web', 'movil', 'api', 'cli', 'escritorio', 'datos', 'dispositivo', 'servicio', 'documental', 'otro'] as const;
export type ComponentKind = typeof componentKinds[number];
export const componentLabels: Record<ComponentKind,string> = {web:'Web',movil:'Móvil',api:'API',cli:'Línea de comandos',escritorio:'Escritorio',datos:'Datos',dispositivo:'Dispositivo',servicio:'Servicio',documental:'Proceso documental',otro:'Otro'};
export const technologyRoles = ['lenguaje', 'framework', 'base-datos', 'protocolo', 'herramienta', 'otro'] as const;
export interface ProfileSource { label: string; url: string }
export interface ProfileMetadata { version: string; sources: ProfileSource[]; reviewedAt: string; support: 'declarada' | 'verificada' }
export interface DeclarativeProfile extends ProfileMetadata {
    id: string; name: string; description: string; appliesTo: WorkMode[]; componentKinds: ComponentKind[];
    capabilities: string[]; questions: string[]; constraints: string[]; sections: string[];
}
export interface CustomTechnology extends ProfileMetadata {
    id: string; name: string; role: typeof technologyRoles[number]; purpose: string; constraints: string[]; support: 'declarada';
}
export interface ProjectComponent {
    id: string; name: string; kind: ComponentKind; responsibility: string; profileId: string; dependsOn: string[]; technologyIds: string[];
}
export interface ProfileConfiguration { schemaVersion: 1; profiles: DeclarativeProfile[]; components: ProjectComponent[]; technologies: CustomTechnology[] }
export const profileLimits = { bytes: 128 * 1024, profiles: 10, components: 20, technologies: 50, text: 2000, list: 20, sources: 5 } as const;
export const emptyProfiles = (): ProfileConfiguration => ({ schemaVersion: 1, profiles: [], components: [], technologies: [] });
const record = (v:unknown): v is Record<string,unknown> => !!v && typeof v === 'object' && !Array.isArray(v) && [Object.prototype,null].includes(Object.getPrototypeOf(v));
const keys = (v:Record<string,unknown>,allowed:string[]) => Object.keys(v).length === allowed.length && Object.keys(v).every(k=>allowed.includes(k));
const id = (v:unknown):v is string => typeof v==='string' && /^[A-Za-z][A-Za-z0-9-]{0,63}$/.test(v);
/** Declaraciones acotadas; no se interpretan expresiones ni se ejecuta contenido. */
export function isDeclaration(v:unknown, max:number=profileLimits.text):v is string {
    return typeof v==='string' && v.length<=max && !Array.from(v).some(char=>char.charCodeAt(0)<32&&![9,10,13].includes(char.charCodeAt(0))) && !/[<>`{}$]|=>|&&|\|\||javascript\s*:|\b(?:eval|exec|function)\s*\(|\b(?:const|let|var)\s+\w+\s*=/i.test(v) && !/(?:^|\n)\s*(?:sudo|npm|npx|curl|wget|rm|bash|sh|node|python|powershell)\s+\S/i.test(v);
}
const texts = (v:unknown):v is string[] => Array.isArray(v)&&v.length<=profileLimits.list&&v.every(x=>isDeclaration(x));
const refs = (v:unknown):v is string[] => Array.isArray(v)&&v.length<=50&&v.every(id)&&new Set(v).size===v.length;
const date = (v:unknown) => v==='' || typeof v==='string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
function source(v:unknown):boolean {
    if(!record(v)||!keys(v,['label','url'])||!isDeclaration(v.label,100)||typeof v.url!=='string'||v.url.length>2000)return false;
    try {const u=new URL(v.url);return u.protocol==='https:'&&!!u.hostname&&!u.username&&!u.password&&!/[\s<>`{}]/.test(v.url);}catch{return false;}
}
const metadata = (v:Record<string,unknown>) => isDeclaration(v.version,80) && date(v.reviewedAt) && Array.isArray(v.sources)&&v.sources.length<=profileLimits.sources&&v.sources.every(source);
const canonical = (v:unknown):string => JSON.stringify(v,(_k,x)=>record(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
function profile(v:unknown):v is DeclarativeProfile {
    if(!record(v)||!keys(v,['id','name','description','version','sources','reviewedAt','support','appliesTo','componentKinds','capabilities','questions','constraints','sections'])||!id(v.id)||!isDeclaration(v.name,100)||!v.name.trim()||!isDeclaration(v.description)||!metadata(v)||!['declarada','verificada'].includes(String(v.support)))return false;
    if(!Array.isArray(v.appliesTo)||!v.appliesTo.length||v.appliesTo.length>4||!v.appliesTo.every(x=>workModes.includes(x as WorkMode))||new Set(v.appliesTo).size!==v.appliesTo.length||!Array.isArray(v.componentKinds)||!v.componentKinds.length||!v.componentKinds.every(x=>componentKinds.includes(x as ComponentKind))||new Set(v.componentKinds).size!==v.componentKinds.length||!['capabilities','questions','constraints','sections'].every(k=>texts(v[k])))return false;
    const integrated=builtinProfiles.find(p=>p.id===v.id);
    return v.support==='verificada'?!!integrated&&canonical(integrated)===canonical(v):!integrated;
}
function technology(v:unknown):v is CustomTechnology {
    return record(v)&&keys(v,['id','name','role','purpose','constraints','version','sources','reviewedAt','support'])&&id(v.id)&&!technologyById.has(v.id)&&isDeclaration(v.name,100)&&!!v.name.trim()&&technologyRoles.includes(v.role as CustomTechnology['role'])&&isDeclaration(v.purpose)&&texts(v.constraints)&&metadata(v)&&v.support==='declarada';
}
export function profileValidationErrors(value:unknown):string[] {
    try {
        if(!record(value)||!keys(value,['schemaVersion','profiles','components','technologies'])||value.schemaVersion!==1||!Array.isArray(value.profiles)||value.profiles.length>profileLimits.profiles||!value.profiles.every(profile)||!Array.isArray(value.technologies)||value.technologies.length>profileLimits.technologies||!value.technologies.every(technology)||!Array.isArray(value.components)||value.components.length>profileLimits.components)return ['Los perfiles o tecnologías no son declaraciones válidas, o exceden sus límites.'];
        if(new TextEncoder().encode(JSON.stringify(value)).length>profileLimits.bytes)return ['Los perfiles superan 128 KiB.'];
        const p=value as unknown as ProfileConfiguration;
        const all=[...p.profiles,...p.technologies,...p.components].map(x=>x.id);
        if(new Set(all).size!==all.length)return ['Los perfiles, componentes y tecnologías requieren IDs únicos.'];
        for(const c of p.components){
            if(!record(c)||!keys(c as unknown as Record<string,unknown>,['id','name','kind','responsibility','profileId','dependsOn','technologyIds'])||!id(c.id)||!isDeclaration(c.name,100)||!c.name.trim()||!componentKinds.includes(c.kind)||!isDeclaration(c.responsibility)||typeof c.profileId!=='string'||!refs(c.dependsOn)||!refs(c.technologyIds)||c.dependsOn.includes(c.id)||c.dependsOn.some(ref=>!p.components.some(x=>x.id===ref))||c.technologyIds.some(ref=>!p.technologies.some(x=>x.id===ref))||c.profileId&&!p.profiles.some(x=>x.id===c.profileId))return ['Un componente tiene datos o referencias inválidas.'];
        }
        const done=new Set<string>(),visiting=new Set<string>();
        const visit=(key:string):boolean=>{if(visiting.has(key))return false;if(done.has(key))return true;visiting.add(key);if(!p.components.find(c=>c.id===key)!.dependsOn.every(visit))return false;visiting.delete(key);done.add(key);return true;};
        return p.components.every(c=>visit(c.id))?[]:['La composición de componentes contiene un ciclo de dependencias.'];
    }catch{return ['Los perfiles no pueden validarse como datos JSON.'];}
}
export const isProfileConfiguration = (v:unknown):v is ProfileConfiguration => profileValidationErrors(v).length===0;
export function profileWarnings(value:ProfileConfiguration|undefined, project?:Pick<ProjectDefinition,'mode'|'implementationRequired'>):string[] {
    if(!value)return [];
    const warnings:string[]=[];const mode=project?.mode??'nuevo';
    for(const p of value.profiles){if(!p.appliesTo.includes(mode))warnings.push(`${p.name}: el perfil no aplica al modo elegido.`);if(p.support==='declarada')warnings.push(`${p.name}: Declarada por el usuario; aplicabilidad sin verificar.`);if(!p.version||!p.sources.length||!p.reviewedAt)warnings.push(`${p.name}: versión, fuentes o fecha de revisión pendientes.`);}
    for(const t of value.technologies){warnings.push(`${t.name}: Declarada por el usuario; compatibilidad y protocolo requieren revisión.`);if(!t.version||!t.sources.length||!t.reviewedAt)warnings.push(`${t.name}: versión, fuentes o fecha de revisión pendientes.`);}
    for(const c of value.components){const p=value.profiles.find(p=>p.id===c.profileId);if(!p)warnings.push(`${c.name}: perfil pendiente.`);else if(!p.componentKinds.includes(c.kind))warnings.push(`${c.name}: tipo de componente incompatible con su perfil.`);if((mode==='documentacion'||project?.implementationRequired===false)&&c.kind!=='documental')warnings.push(`${c.name}: componente de software conservado en un trabajo documental.`);if(c.kind==='otro')warnings.push(`${c.name}: rutas y contratos específicos pendientes; no se asumirá un destino web.`);}
    return warnings;
}
