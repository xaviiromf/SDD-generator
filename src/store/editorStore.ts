import { createProjectDefinition, createRequirement, contextKinds, type ContextKind, type ProjectDefinition, type ProjectItem, type StructuredRequirement } from '../domain/projectDefinition';
import { projectValidationErrors } from '../domain/projectValidation';
import { hasDesignOverrides, validDesignValue, type DesignGroups } from '../domain/design';
import type { Locale } from '../i18n/translate';
import { create } from 'zustand';
import { emptyConfiguration, singleFields, type Configuration, type Field, type Inference, type Selection } from '../domain/models';
import { technologyById } from '../catalog/technologies';
import { optionCompatible } from '../domain/compatibility';
interface EditorState {
    config: Configuration;
    projectError: string;
    updateProject: (patch: Partial<Pick<ProjectDefinition, 'mode' | 'implementationRequired'>>) => void;
    addProjectItem: (kind: ContextKind) => void;
    updateProjectItem: (kind: ContextKind, id: string, patch: Partial<Pick<ProjectItem, 'text' | 'status' | 'references'>>) => void;
    removeProjectItem: (kind: ContextKind, id: string) => void;
    addRequirement: () => void;
    updateRequirement: (id: string, patch: Partial<Omit<StructuredRequirement, 'id' | 'origin' | 'criteria'>>) => void;
    removeRequirement: (id: string) => void;
    moveRequirement: (id: string, direction: -1 | 1) => void;
    addCriterion: (requirementId: string) => void;
    updateCriterion: (requirementId: string, id: string, text: string) => void;
    removeCriterion: (requirementId: string, id: string) => void;
    setDesignOverride: <G extends keyof DesignGroups>(group: G, key: keyof DesignGroups[G], value: DesignGroups[G][keyof DesignGroups[G]]) => void;
    clearDesignOverrides: () => void;
    selectArchetype: (id: string, preserveOverrides: boolean) => void;
    detachArchetype: () => void;
    setSDDLanguage: (locale: Locale) => void;
    setText: (field: 'name' | 'slug' | 'idea' | 'positive' | 'negative', value: string) => void;
    select: (field: Field, id: string) => void;
    applyPreset: (selections: Selection) => void;
    applyInferences: (values: Inference[]) => boolean;
    restore: (config: Configuration) => void;
}
function allocate(project: ProjectDefinition, prefix: string): string {
    const ids = new Set([...contextKinds.flatMap(k => project.context[k].map(i=>i.id)), ...project.requirements.flatMap(r=>[r.id,...r.criteria.map(c=>c.id)])]);
    let id: string;
    do { id = `${prefix}-${project.nextId++}`; } while (ids.has(id));
    return id;
}
export const useEditorStore = create<EditorState>((set, get) => {
    const mutateProject = (change: (project: ProjectDefinition) => void) => {
        const config = get().config;
        const before = config.project ?? createProjectDefinition(config.slug,config.revision);
        const project = structuredClone(before);
        change(project);
        if (JSON.stringify(project) === JSON.stringify(before)) return;
        project.revision = config.revision + 1;
        const errors = projectValidationErrors(project);
        if (errors.length) { set({projectError: errors[0]}); return; }
        set({config:{...config,project,revision:project.revision},projectError:''});
    };
    return ({
    config: emptyConfiguration(),
    projectError: '',
    updateProject: patch => mutateProject(project=>Object.assign(project,patch)),
    addProjectItem: kind => mutateProject(project=>{project.context[kind].push({id:allocate(project,'CTX'),text:'',status:'pendiente',origin:'user',references:[]});}),
    updateProjectItem: (kind,id,patch) => mutateProject(project=>{const item=project.context[kind].find(i=>i.id===id);if(item) Object.assign(item,patch,{origin:'user'});}),
    removeProjectItem: (kind,id) => mutateProject(project=>{project.context[kind]=project.context[kind].filter(i=>i.id!==id);}),
    addRequirement: () => mutateProject(project=>{project.requirements.push(createRequirement(allocate(project,'RF')));}),
    updateRequirement: (id,patch) => mutateProject(project=>{const item=project.requirements.find(i=>i.id===id);if(item) Object.assign(item,patch,{origin:'user'});}),
    removeRequirement: id => mutateProject(project=>{project.requirements=project.requirements.filter(i=>i.id!==id);}),
    moveRequirement: (id,direction) => mutateProject(project=>{const index=project.requirements.findIndex(i=>i.id===id),target=index+direction;if(index>=0&&target>=0&&target<project.requirements.length)[project.requirements[index],project.requirements[target]]=[project.requirements[target],project.requirements[index]];}),
    addCriterion: requirementId => mutateProject(project=>{const item=project.requirements.find(i=>i.id===requirementId);if(item)item.criteria.push({id:allocate(project,'CA'),text:''});}),
    updateCriterion: (requirementId,id,text) => mutateProject(project=>{const item=project.requirements.find(i=>i.id===requirementId)?.criteria.find(i=>i.id===id);if(item)item.text=text;}),
    removeCriterion: (requirementId,id) => mutateProject(project=>{const item=project.requirements.find(i=>i.id===requirementId);if(item)item.criteria=item.criteria.filter(i=>i.id!==id);}),
    setDesignOverride: (group, key, value) => {
        if (!validDesignValue(group, String(key), value)) return;
        set(({ config }) => config.designOverrides?.[group]?.[key] === value ? {} : { config: { ...config, designVersion: 1, designOverrides: { ...config.designOverrides, [group]: { ...config.designOverrides?.[group], [key]: value } }, revision: config.revision + 1 } });
    },
    clearDesignOverrides: () => set(({ config }) => !hasDesignOverrides(config.designOverrides) ? {} : { config: { ...config, designOverrides: undefined, revision: config.revision + 1 } }),
    selectArchetype: (id, preserveOverrides) => {
        if (technologyById.get(id)?.field !== 'archetype') return;
        set(({ config }) => config.selections.archetype?.[0] === id && (preserveOverrides || !hasDesignOverrides(config.designOverrides)) ? {} : ({ config: { ...config, selections: { ...config.selections, archetype: [id] }, origins: { ...config.origins, archetype: 'manual' }, designOverrides: preserveOverrides ? config.designOverrides : undefined, revision: config.revision + 1 } }));
    },
    detachArchetype: () => set(({ config }) => !config.selections.archetype?.length ? {} : { config: { ...config, selections: { ...config.selections, archetype: [] }, origins: { ...config.origins, archetype: 'manual' }, revision: config.revision + 1 } }),
    setSDDLanguage: () => set(({config}) => config.sddLanguage === 'es' ? {} : { config: { ...config, sddLanguage: 'es', revision: config.revision + 1 } }),
    setText: (field, value) => set(state => state.config[field] === value ? state : { config: { ...state.config, [field]: value, revision: state.config.revision + 1 } }),
    select: (field, id) => {
        const entry = technologyById.get(id);
        if (!entry || entry.field !== field)
            return;
        set(({ config }) => {
            const current = config.selections[field] ?? [];
            const ids = current.includes(id) ? current.filter(value => value !== id) : singleFields.has(field) ? [id] : [...current, id];
            return { config: { ...config, selections: { ...config.selections, [field]: ids }, origins: { ...config.origins, [field]: 'manual' }, revision: config.revision + 1 } };
        });
    },
    applyPreset: selections => set(({ config }) => ({ config: { ...config, selections: { ...selections, archetype: config.selections.archetype ?? [], integrity: [...new Set([...(selections.integrity ?? []), 'no-emojis', 'spanish', 'anti-generic'])] }, origins: { ...Object.fromEntries(Object.keys(selections).map(field => [field, 'preset'])), ...(config.origins.archetype ? { archetype: config.origins.archetype } : {}) }, revision: config.revision + 1 } })),
    applyInferences: values => {
        const config = get().config;
        const selections = { ...config.selections };
        const origins = { ...config.origins };
        for (const [key, origin] of Object.entries(origins))
            if (origin === 'inference') {
                delete selections[key as Field];
                delete origins[key as Field];
            }
        for (const inference of values) {
            const entry = technologyById.get(inference.id);
            if (!entry || (origins[inference.field] && origins[inference.field] !== 'inference') || !optionCompatible(entry, { ...config, selections }))
                continue;
            const existing = selections[inference.field] ?? [];
            if (singleFields.has(inference.field) && existing.length)
                continue;
            selections[inference.field] = [...new Set([...existing, inference.id])];
            origins[inference.field] = 'inference';
        }
        if (JSON.stringify(selections) === JSON.stringify(config.selections) && JSON.stringify(origins) === JSON.stringify(config.origins))
            return false;
        set({ config: { ...config, selections, origins, revision: config.revision + 1 } });
        return true;
    },
    restore: config => { const project=config.project ?? createProjectDefinition(config.slug,config.revision); if(projectValidationErrors(project).length){set({projectError:'No se puede restaurar un modelo inválido.'});return;} const revision=get().config.revision+1;set({config:{...config,project:{...project,revision},sddLanguage:'es',revision},projectError:''}); }
});
});
