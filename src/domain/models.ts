import type { Locale } from '../i18n/translate';
import type { KitDocument } from '../engine/kitManifest';
export const fields = ['platform', 'architecture', 'language', 'runtime', 'frontend', 'backend', 'api', 'addons', 'state', 'primitives', 'highlight', 'packaging', 'content', 'storage', 'protocol', 'styling', 'archetype', 'auth', 'security', 'integrity', 'tooling', 'testing', 'lint', 'deploy'] as const;
export type Field = typeof fields[number];
export type Origin = 'manual' | 'preset' | 'inference';
export type Selection = Partial<Record<Field, string[]>>;
export interface Configuration {
    version: 1;
    revision: number;
    sddLanguage?: Locale;
    name: string;
    slug: string;
    idea: string;
    positive: string;
    negative: string;
    selections: Selection;
    origins: Partial<Record<Field, Origin>>;
}
export interface Technology {
    id: string;
    label: string;
    field: Field;
    phase: number;
    aliases: string[];
    languages?: string[];
    platforms?: string[];
    requires?: Selection;
}
export interface Diagnostic {
    message: string;
    field?: Field;
    blocking: boolean;
}
export interface Suggestion {
    id: string;
    message: string;
    options: string[];
}
export interface Inference {
    id: string;
    field: Field;
    explanation: string;
}
export type DocumentPath = string;
export interface GeneratedDocument extends KitDocument {
    id: string;
    format: 'MD' | 'TXT';
    path: DocumentPath;
    content: string;
    revision: number;
}
export interface Compilation {
    sddLanguage?: Locale;
    revision: number;
    slug: string;
    documents: GeneratedDocument[];
    diagnostics: Diagnostic[];
    suggestions: Suggestion[];
    inferences: Inference[];
    maturity: {
        score: number;
        pillars: {
            label: string;
            complete: boolean;
        }[];
    };
    targetTree: string[];
}
export function emptyConfiguration(): Configuration { return { version: 1, revision: 0, sddLanguage: 'es', name: 'Mi proyecto', slug: 'mi-proyecto', idea: '', positive: '', negative: '', selections: {}, origins: {} }; }
export const singleFields = new Set<Field>(['platform', 'architecture', 'runtime', 'frontend', 'styling', 'archetype', 'auth']);
