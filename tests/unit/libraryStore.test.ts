import {it,expect,afterEach,vi} from 'vitest';
import {emptyConfiguration,type Compilation} from '../../src/domain/models';
import {useEditorStore} from '../../src/store/editorStore';
import {useLibraryStore,initializeLibrary,flushProjectEdition} from '../../src/store/projectLibraryStore';
import {useDocumentStore} from '../../src/store/documentStore';
import {libraryKey} from '../../src/services/projectStorage';
import {exportBackup} from '../../src/services/projectImport';
import {createKitManifest} from '../../src/engine/kitManifest';
import {documentSections} from '../../src/domain/manualSections';
let stop:(()=>void)|undefined;afterEach(()=>{stop?.();stop=undefined;});
function memory():Storage{const map=new Map<string,string>();return {get length(){return map.size;},clear:()=>map.clear(),key:i=>[...map.keys()][i]??null,getItem:key=>map.get(key)??null,setItem:(key,value)=>{map.set(key,value);},removeItem:key=>{map.delete(key);}};}
it('preserva proyectos, historial y borrador al cambiar y recuperar con comparación',async()=>{
 const storage=memory();useEditorStore.setState({config:emptyConfiguration()});stop=await initializeLibrary(storage);
 useEditorStore.getState().setText('name','Proyecto inicial');expect(await useLibraryStore.getState().saveVersion('Base revisada')).toBe(true);
 const first=useLibraryStore.getState().library.projects[0],version=first.versions[0];
 expect(await useLibraryStore.getState().createProject(false)).toBe(true);useEditorStore.getState().setText('name','Segundo proyecto');
 useLibraryStore.getState().prepareOpen(first.id);expect(useLibraryStore.getState().pendingComparison?.differences.total).toBeGreaterThan(0);
 useLibraryStore.getState().cancelComparison();expect(useEditorStore.getState().config.name).toBe('Segundo proyecto');
 useLibraryStore.getState().prepareOpen(first.id);expect(await useLibraryStore.getState().confirmComparison()).toBe(true);expect(useEditorStore.getState().config.name).toBe('Proyecto inicial');
 useEditorStore.getState().setText('idea','Cambio posterior');useLibraryStore.getState().prepareRestore(first.id,version.id);expect(await useLibraryStore.getState().confirmComparison()).toBe(true);
 expect(useEditorStore.getState().config.idea).toBe('');expect(useLibraryStore.getState().library.projects.find(p=>p.id===first.id)!.versions.at(-1)!.configuration.idea).toBe('Cambio posterior');
 expect(JSON.parse(storage.getItem(libraryKey)!).projects).toHaveLength(2);
});
it('importación cancelada, sustitución con copia y comparación obsoleta no pierden datos',async()=>{
 const storage=memory();useEditorStore.setState({config:emptyConfiguration()});stop=await initializeLibrary(storage);
 const original=storage.getItem(libraryKey),project=structuredClone(useLibraryStore.getState().library.projects[0]);project.draft.idea='Texto importado';
 const backup=exportBackup([project]);if(!backup.ok)throw new Error('Respaldo');
 await useLibraryStore.getState().prepareImport(backup.value);useLibraryStore.getState().cancelComparison();expect(storage.getItem(libraryKey)).toBe(original);
 await useLibraryStore.getState().prepareImport(backup.value);useEditorStore.getState().setText('idea','Edición durante revisión');expect(await useLibraryStore.getState().confirmComparison()).toBe(false);expect(storage.getItem(libraryKey)).toBe(original);
 useLibraryStore.getState().cancelComparison();await useLibraryStore.getState().prepareImport(backup.value);useLibraryStore.getState().setImportReplacement(true);expect(await useLibraryStore.getState().confirmComparison()).toBe(true);
 expect(useEditorStore.getState().config.idea).toBe('Texto importado');expect(useLibraryStore.getState().library.projects.some(p=>p.draft.idea==='Edición durante revisión')).toBe(true);
});
it('conserva edición en memoria y datos originales ante corrupción o conflicto entre pestañas',async()=>{
 const storage=memory();storage.setItem(libraryKey,'{roto');useEditorStore.setState({config:emptyConfiguration()});stop=await initializeLibrary(storage);
 expect(await useLibraryStore.getState().createProject(false)).toBe(false);expect(storage.getItem(libraryKey)).toBe('{roto');stop();
 storage.clear();stop=await initializeLibrary(storage);const original=storage.getItem(libraryKey);storage.setItem(libraryKey,original+' ');
 useEditorStore.getState().setText('idea','Conservar en memoria');expect(await useLibraryStore.getState().saveVersion('Prueba')).toBe(false);expect(useEditorStore.getState().config.idea).toBe('Conservar en memoria');expect(storage.getItem(libraryKey)).toBe(original+' ');
});
it('una regeneración en conflicto no publica ni exporta hasta resolver sin borrar la aportación',()=>{
 const config=emptyConfiguration(),manifest=createKitManifest(config),content='# Documento\n\n## Alcance\nAnterior\n',section=documentSections(content).find(s=>s.key==='alcance')!;
 config.manualSections=[{id:'MAN-1',documentId:'spec',sectionKey:section.key,title:'Nota',text:'Texto manual',baseContent:section.content}];useEditorStore.setState({config});
 const result={revision:0,slug:config.slug,documents:manifest.map(d=>({...d,content:d.id==='spec'?content:'# Otro',revision:0})),diagnostics:[],suggestions:[],inferences:[],maturity:{score:0,pillars:[]},targetTree:[]} satisfies Compilation;
 useDocumentStore.getState().publish(result);expect(useDocumentStore.getState().compilation!.documents[30].content).toContain('Texto manual');
 useEditorStore.getState().setText('idea','Cambio');const changed={...result,revision:1,documents:result.documents.map(d=>({...d,revision:1,content:d.content.replace('Anterior','Nuevo')}))};useDocumentStore.getState().publish(changed);
 expect(useDocumentStore.getState().manualConflicts).toHaveLength(1);expect(useDocumentStore.getState().compilation!.revision).toBe(0);
 expect(useDocumentStore.getState().resolveManualConflicts({'MAN-1':'keep'})).toBe(true);const revision=useEditorStore.getState().config.revision;
 useDocumentStore.getState().publish({...changed,revision,documents:changed.documents.map(d=>({...d,revision}))});expect(useDocumentStore.getState().manualConflicts).toEqual([]);expect(useDocumentStore.getState().compilation!.documents[30].content).toContain('Texto manual');
});

it('recupera una edición al cerrar antes del guardado diferido sin duplicar su proyecto',async()=>{
 const storage=memory();useEditorStore.setState({config:emptyConfiguration()});stop=await initializeLibrary(storage);
 await useLibraryStore.getState().createProject(false);const active=useLibraryStore.getState().library.activeId;
 useEditorStore.getState().setText('name','Edición inmediata');storage.setItem('sdd-studio:borrador:v1',JSON.stringify(useEditorStore.getState().config));flushProjectEdition();stop();
 const recovered=JSON.parse(storage.getItem('sdd-studio:borrador:v1')!);useEditorStore.setState({config:emptyConfiguration()});useEditorStore.getState().restore(recovered);stop=await initializeLibrary(storage);
 expect(useLibraryStore.getState().library.projects).toHaveLength(2);expect(useLibraryStore.getState().library.activeId).toBe(active);expect(useLibraryStore.getState().library.projects.find(p=>p.id===active)!.draft.name).toBe('Edición inmediata');
});
it('una edición con procedencia antigua se recupera como copia sin sobrescribir otra pestaña',async()=>{
 const storage=memory();useEditorStore.setState({config:emptyConfiguration()});stop=await initializeLibrary(storage);
 useEditorStore.getState().setText('idea','Edición propia');storage.setItem('sdd-studio:borrador:v1',JSON.stringify(useEditorStore.getState().config));flushProjectEdition();stop();
 const other=JSON.parse(storage.getItem(libraryKey)!);other.revision++;other.projects[0].draft.idea='Edición ajena';storage.setItem(libraryKey,JSON.stringify(other));
 stop=await initializeLibrary(storage);expect(useLibraryStore.getState().library.projects).toHaveLength(2);expect(useLibraryStore.getState().library.projects.some(p=>p.draft.idea==='Edición ajena')).toBe(true);expect(useEditorStore.getState().config.idea).toBe('Edición propia');
});

it('cancelar una confirmación en vuelo conserva biblioteca y edición',async()=>{
 const storage=memory();useEditorStore.setState({config:emptyConfiguration()});stop=await initializeLibrary(storage);
 await useLibraryStore.getState().createProject(false);const first=useLibraryStore.getState().library.projects[0];useLibraryStore.getState().prepareOpen(first.id);
 const original=storage.getItem(libraryKey),current=useEditorStore.getState().config;const confirming=useLibraryStore.getState().confirmComparison();useLibraryStore.getState().cancelComparison();expect(await confirming).toBe(false);expect(storage.getItem(libraryKey)).toBe(original);expect(useEditorStore.getState().config).toBe(current);
});

it('respalda todos los proyectos y la edición actual aunque falle el guardado por cuota',async()=>{
 const storage=memory();useEditorStore.setState({config:emptyConfiguration()});stop=await initializeLibrary(storage);
 await useLibraryStore.getState().saveVersion('Historia preservada');useEditorStore.getState().setText('idea','Edición sin espacio');storage.setItem=()=>{throw new Error('Cuota');};
 expect(await useLibraryStore.getState().saveVersion('No guardar')).toBe(false);const exported=await useLibraryStore.getState().exportProjects();expect(exported).not.toBeNull();const backup=JSON.parse(exported!);expect(backup.projects[0].draft.idea).toBe('Edición sin espacio');expect(backup.projects[0].versions[0].label).toBe('Historia preservada');
});

it('el autoguardado no deshabilita acciones de usuario mientras valida en segundo plano',async()=>{
 const storage=memory();useEditorStore.setState({config:emptyConfiguration()});stop=await initializeLibrary(storage);vi.useFakeTimers();
 try{useEditorStore.getState().setText('idea','Edición en curso');vi.advanceTimersByTime(800);await Promise.resolve();expect(useLibraryStore.getState().busy).toBe(false);await Promise.resolve();await Promise.resolve();}
 finally{stop();stop=undefined;vi.useRealTimers();}
});
