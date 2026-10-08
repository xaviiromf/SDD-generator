import {it,expect} from 'vitest';
import {emptyConfiguration} from '../../src/domain/models';
import {emptyLibrary,isProjectLibrary,configurationDifferences,libraryLimits,validLibraryConfiguration} from '../../src/domain/projectLibrary';
import {documentSections,reconcileDocuments,isManualSections} from '../../src/domain/manualSections';
import {validateConfiguration} from '../../src/domain/validation';
import {createKitManifest} from '../../src/engine/kitManifest';
it('valida biblioteca, límites, fechas, IDs y versiones sin aceptar datos desconocidos',()=>{
 const l=emptyLibrary(),now='2026-10-08T12:00:00.000Z';l.activeId='P-1';l.projects=[{id:'P-1',createdAt:now,updatedAt:now,draft:emptyConfiguration(),versions:[]}];
 expect(isProjectLibrary(l)).toBe(true);expect(isProjectLibrary({...l,schemaVersion:2})).toBe(false);
 expect(isProjectLibrary({...l,projects:[...l.projects,...l.projects]})).toBe(false);
 expect(isProjectLibrary({...l,activeId:'P-otro'})).toBe(false);
 l.projects[0].versions=Array.from({length:libraryLimits.versions+1},(_,i)=>({id:`V-${i}`,label:'Versión',createdAt:now,configuration:emptyConfiguration()}));expect(isProjectLibrary(l)).toBe(false);
 expect(validLibraryConfiguration({...emptyConfiguration(),mcpToken:'dato'})).toBe(false);
 expect(validLibraryConfiguration({...emptyConfiguration(),project:{...emptyConfiguration().project,extra:'dato'}})).toBe(false);
 expect(validLibraryConfiguration({...emptyConfiguration(),slug:'../fuera'})).toBe(false);
});
it('compara por IDs y comunica límites de visualización sin ocultar el total',()=>{
 const a=emptyConfiguration(),b=structuredClone(a);b.name='Nuevo';b.revision=9;expect(configurationDifferences(a,b).entries.map(e=>e.path)).toEqual(['name']);
 a.project!.context.actors=Array.from({length:100},(_,i)=>({id:`ACT-${i}`,text:'Antes',origin:'user',status:'pendiente',references:[]}));b.project=structuredClone(a.project);b.project!.context.actors.forEach(v=>{v.text='Después';v.status='confirmado';v.references=['ACT-1'];});
 const result=configurationDifferences(a,b);expect(result.total).toBeGreaterThan(200);expect(result.entries).toHaveLength(200);
});
it('reconcilia secciones y conserva aportaciones ante cambios y destino perdido',()=>{
 const manifest=createKitManifest({slug:'mi-proyecto'}),doc={...manifest.find(d=>d.id==='spec')!,revision:1,content:'# Documento\n\n### RF-2 — Guardar\n\nTexto original\n\n## Otro\n'};
 const section=documentSections(doc.content).find(s=>s.key==='rf-RF-2')!;
 const addition={id:'MAN-1',documentId:'spec',sectionKey:section.key,title:'Decisión humana',text:'Conservar este dato',baseContent:section.content};
 expect(isManualSections([addition])).toBe(true);
 const same=reconcileDocuments([doc],[addition]);expect(same.conflicts).toEqual([]);expect(same.documents[0].content).toContain('Conservar este dato');
 const changed=reconcileDocuments([{...doc,content:doc.content.replace('Guardar','Guardar cambios')}],[addition]);expect(changed.conflicts).toHaveLength(1);expect(changed.conflicts[0].missing).toBe(false);expect(changed.documents[0].content).toContain('Conservar este dato');
 expect(reconcileDocuments([{...doc,content:'# Sin requisito'}],[addition]).conflicts[0].missing).toBe(true);
 expect(documentSections('# Documento\n```md\n## Código\n```\n').map(s=>s.key)).toEqual(['documento','documento-2']);
 expect(documentSections('# Documento\n````md\n```\n## Código interno\n````\n## Sección real\n').map(s=>s.key)).toEqual(['documento','documento-2','seccion-real']);
 const ordered=reconcileDocuments([doc],[{...addition,text:'Primera nota'},{...addition,id:'MAN-2',text:'Segunda nota'}]).documents[0].content;expect(ordered.indexOf('Primera nota')).toBeLessThan(ordered.indexOf('Segunda nota'));
});
it('rechaza adiciones inseguras y documentos ajenos antes de almacenar o generar',()=>{
 const c=emptyConfiguration();c.manualSections=[{id:'MAN-1',documentId:'spec',sectionKey:'documento',title:'Nota',text:'token='+'a'.repeat(25),baseContent:''}];
 expect(validateConfiguration(c).some(d=>d.blocking)).toBe(true);
 expect(isManualSections([{...c.manualSections[0],documentId:'../externo'}])).toBe(false);
 c.manualSections[0].text=String.fromCodePoint(0x1f600);expect(validateConfiguration(c).some(d=>d.blocking)).toBe(true);
});
