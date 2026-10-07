export const fields = ['platform', 'architecture', 'language', 'runtime', 'frontend', 'backend', 'state', 'primitives', 'highlight', 'packaging', 'content', 'storage', 'protocol', 'styling', 'archetype', 'auth', 'security', 'integrity', 'tooling', 'testing', 'lint', 'deploy'] as const;
export type Field = typeof fields[number];
export type Origin = 'manual' | 'preset' | 'inference';
export type Selection = Partial<Record<Field, string[]>>;
export interface Configuration {
    version: 1;
    revision: number;
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
export const documentPaths = ['specs/spec.md', 'specs/plan.md', 'specs/tasks.md', 'constitution.md', 'docs/PROJECT.md', 'prompts/00-orchestrator.md'] as const;
export type DocumentPath = typeof documentPaths[number];
export interface GeneratedDocument {
    path: DocumentPath;
    content: string;
    revision: number;
}
export interface Compilation {
    revision: number;
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
export function emptyConfiguration(): Configuration { return { version: 1, revision: 0, name: 'Mi proyecto', slug: 'mi-proyecto', idea: '', positive: '', negative: '', selections: {}, origins: {} }; }
export const singleFields = new Set<Field>(['platform', 'architecture', 'runtime', 'frontend', 'styling', 'archetype', 'auth']);
