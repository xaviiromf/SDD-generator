import { beforeEach, expect, it } from 'vitest';
import { useEditorStore } from '../../src/store/editorStore';
import { emptyConfiguration } from '../../src/domain/models';
beforeEach(()=>useEditorStore.getState().restore(emptyConfiguration()));
it('conserva IDs al reordenar y rechaza borrar un actor referenciado sin perder el requisito',()=>{
 const store=useEditorStore.getState();store.addProjectItem('actors');
 const actor=useEditorStore.getState().config.project!.context.actors[0];
 store.addRequirement();store.addRequirement();
 const id=useEditorStore.getState().config.project!.requirements[0].id;
 store.updateRequirement(id,{actorId:actor.id,behavior:'Cancelar reserva'});store.addCriterion(id);
 store.moveRequirement(id,1);expect(useEditorStore.getState().config.project!.requirements[1].id).toBe(id);
 store.removeProjectItem('actors',actor.id);expect(useEditorStore.getState().projectError).toContain('referencia');
 expect(useEditorStore.getState().config.project!.context.actors).toHaveLength(1);
 store.updateRequirement(id,{actorId:''});store.removeProjectItem('actors',actor.id);
 expect(useEditorStore.getState().config.project!.context.actors).toHaveLength(0);
});
it('publica una revisión coherente y protege límites',()=>{
 const store=useEditorStore.getState();store.addRequirement();
 const config=useEditorStore.getState().config,id=config.project!.requirements[0].id;
 store.updateRequirement(id,{title:'x'.repeat(501)});
 expect(useEditorStore.getState().config.revision).toBe(config.revision);
 store.updateRequirement(id,{title:'Nuevo título'});
 expect(useEditorStore.getState().config.project!.revision).toBe(useEditorStore.getState().config.revision);
});
