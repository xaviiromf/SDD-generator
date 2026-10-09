import type { DocumentStatus, ProjectOverview } from './projectOverview';
import type { DiagramProjection } from './diagrams';
import type { ProfileConfiguration } from './profiles';
import type { Readiness } from './readiness';
import type { ManualSection } from './manualSections';
import type { Coverage } from '../engine/coverage';
import { createProjectDefinition, type ProjectDefinition } from './projectDefinition';
import type { DesignOverrides } from './design';
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
    designVersion?: 1;
    designOverrides?: DesignOverrides;
    project?: ProjectDefinition;
    profile?: ProfileConfiguration;
    manualSections?: ManualSection[];
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
    kind?: 'compatibility' | 'safety';
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
    overview?: ProjectOverview;
    documentStatuses?: DocumentStatus[];
    diagrams?: DiagramProjection;
    coverage?: Coverage;
    readiness?: Readiness;
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
export function emptyConfiguration(): Configuration { return { version: 1, designVersion: 1, revision: 0, sddLanguage: 'es', name: 'Mi proyecto', slug: 'mi-proyecto', idea: '', positive: '', negative: '', selections: {}, origins: {}, project: createProjectDefinition() }; }
export const singleFields = new Set<Field>(['platform', 'architecture', 'runtime', 'frontend', 'styling', 'archetype', 'auth']);
