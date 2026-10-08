import { hasDesignOverrides, validDesignValue, type DesignGroups } from '../domain/design';
import type { Locale } from '../i18n/translate';
import { create } from 'zustand';
import { emptyConfiguration, singleFields, type Configuration, type Field, type Inference, type Selection } from '../domain/models';
import { technologyById } from '../catalog/technologies';
import { optionCompatible } from '../domain/compatibility';
interface EditorState {
    config: Configuration;
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
export const useEditorStore = create<EditorState>((set, get) => ({
    config: emptyConfiguration(),
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
    restore: config => set({ config: { ...config, sddLanguage: 'es', revision: get().config.revision + 1 } })
}));
