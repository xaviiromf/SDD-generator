import { archetypeById } from '../catalog/archetypes';
import { finishes, fontFamilies, monoFamilies } from '../catalog/designOptions';
import type { Configuration } from './models';

export interface DesignGroups {
    typography: { headingFont: string; bodyFont: string; monoFont: string };
    colors: { background: string; surface: string; primaryAccent: string; secondaryAccent: string; border: string; text: string };
    finish: { texture: typeof finishes[number] };
    buttons: { radius: number; variant: 'solid' | 'outline' | 'ghost'; shadowDepth: number };
    cards: { borderWidth: number; shadow: 'none' | 'soft' | 'hard'; density: 'compact' | 'normal' | 'spacious' };
    icons: { strokeWidth: number; size: number };
    motion: { preset: 'snappy' | 'fluid' | 'spring' | 'none' };
}
export type DesignOverrides = { [G in keyof DesignGroups]?: Partial<DesignGroups[G]> };
export interface EffectiveDesign extends DesignGroups {
    baseArchetypeId?: string;
    baseTexture?: string;
    muted: string;
}
export const neutralDesign: EffectiveDesign = {
    typography: { headingFont: 'Geist Sans', bodyFont: 'Inter', monoFont: 'JetBrains Mono' },
    colors: { background: '#111215', surface: '#18191E', primaryAccent: '#2D5CF6', secondaryAccent: '', border: '#262830', text: '#FFFFFF' },
    finish: { texture: 'matte' }, buttons: { radius: 6, variant: 'solid', shadowDepth: 0 },
    cards: { borderWidth: 1, shadow: 'none', density: 'normal' }, icons: { strokeWidth: 2, size: 20 }, motion: { preset: 'snappy' }, muted: '#9CA3AF',
};
const choices: Record<string, readonly unknown[]> = {
    'typography.headingFont': fontFamilies, 'typography.bodyFont': fontFamilies, 'typography.monoFont': monoFamilies,
    'finish.texture': finishes, 'buttons.radius': [0, 6, 24], 'buttons.variant': ['solid', 'outline', 'ghost'], 'buttons.shadowDepth': [0, 1, 2, 3],
    'cards.borderWidth': [0, 1, 2], 'cards.shadow': ['none', 'soft', 'hard'], 'cards.density': ['compact', 'normal', 'spacious'],
    'icons.strokeWidth': [1.5, 2, 2.5], 'icons.size': [16, 20, 24], 'motion.preset': ['snappy', 'fluid', 'spring', 'none'],
};
export function validDesignValue(group: string, key: string, value: unknown): boolean {
    if (group === 'colors' && Object.hasOwn(neutralDesign.colors, key)) return typeof value === 'string' && (key === 'secondaryAccent' && value === '' || /^#[\da-f]{6}([\da-f]{2})?$/i.test(value));
    return choices[`${group}.${key}`]?.includes(value) ?? false;
}
export function isDesignOverrides(value: unknown): value is DesignOverrides {
    if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) return false;
    return Object.entries(value).every(([group, values]) => Object.hasOwn(neutralDesign, group) && group !== 'muted' && !!values && typeof values === 'object' && !Array.isArray(values) && [Object.prototype, null].includes(Object.getPrototypeOf(values)) && Object.entries(values).every(([key, v]) => validDesignValue(group, key, v)));
}
export function hasDesignOverrides(overrides?: DesignOverrides): boolean { return !!overrides && Object.values(overrides).some(group => Object.keys(group).length > 0); }
export function resolveDesign(configuration: Pick<Configuration, 'selections' | 'designOverrides'>): EffectiveDesign | undefined {
    const overrides = isDesignOverrides(configuration.designOverrides) ? configuration.designOverrides : undefined;
    const base = archetypeById.get(configuration.selections.archetype?.[0] ?? '');
    if (!base && !hasDesignOverrides(overrides)) return undefined;
    const result = structuredClone(neutralDesign);
    if (base) {
        result.baseArchetypeId = base.id; result.baseTexture = base.texture;
        result.typography = { headingFont: base.heading, bodyFont: base.body, monoFont: 'JetBrains Mono' };
        result.colors = { background: base.background, surface: base.surface, primaryAccent: base.accent, secondaryAccent: base.secondaryAccent, border: base.border, text: base.foreground };
        result.buttons.radius = base.radius; result.muted = base.muted;
        if (base.id === 'a05') result.cards = { borderWidth: 2.5, shadow: 'hard', density: 'normal' };
        if (base.id === 'a13') result.cards.density = 'compact';
        if (base.id === 'a20') result.cards.density = 'spacious';
    }
    for (const group of Object.keys(overrides ?? {}) as (keyof DesignGroups)[]) Object.assign(result[group], overrides?.[group]);
    if (overrides?.finish?.texture) delete result.baseTexture;
    return result;
}
export const motionDuration = (preset: DesignGroups['motion']['preset']) => preset === 'none' ? 0 : preset === 'snappy' ? 100 : 300;
export const cardPadding = (density: DesignGroups['cards']['density']) => ({ compact: 12, normal: 20, spacious: 28 })[density];
