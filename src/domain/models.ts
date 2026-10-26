import type { DocumentStatus, ProjectOverview } from './projectOverview';
import type { DiagramProjection } from './diagrams';
import type { ProfileConfiguration } from './profiles';
import type { Readiness } from './readiness';
import type { ManualSection } from './manualSections';
import type { ReviewFinding } from './reviewExchange';
import type { Coverage } from '../engine/coverage';
import type { Checkpoint } from '../engine/checkpoints';
import { createProjectDefinition, type ProjectDefinition } from './projectDefinition';
import type { DesignOverrides } from './design';
import type { KitDocument } from '../engine/kitManifest';
/** Solo 'es' es vigente; 'en' se acepta al leer borradores antiguos y se migra a español. */
export type Locale = 'es' | 'en';
export function isLocale(value: unknown): value is Locale {
  return value === 'es' || value === 'en';
}
export const fields = [
  'platform',
  'architecture',
  'language',
  'runtime',
  'frontend',
  'backend',
  'api',
  'addons',
  'state',
  'primitives',
  'highlight',
  'packaging',
  'content',
  'storage',
  'protocol',
  'styling',
  'archetype',
  'auth',
  'security',
  'integrity',
  'tooling',
  'testing',
  'lint',
  'deploy',
] as const;
export type Field = (typeof fields)[number];
export type Origin = 'manual' | 'preset' | 'inference';
export type Selection = Partial<Record<Field, string[]>>;
export interface Configuration {
  version: 1;
  revision: number;
  sddLanguage?: Locale;
  designVersion?: 1;
  /** 2: modelo estructurado obligatorio. Los borradores sin marca se migran al leerlos. */
  modelVersion?: 2;
  designOverrides?: DesignOverrides;
  project?: ProjectDefinition;
  profile?: ProfileConfiguration;
  manualSections?: ManualSection[];
  /** Hallazgos del revisor independiente pegados por la persona (opcional). */
  review?: ReviewFinding[];
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
  /** Fecha ISO de revisión propia; si falta se usa la del catálogo (src/catalog/review.ts). */
  reviewedAt?: string;
}
export interface Diagnostic {
  kind?: 'compatibility' | 'safety' | 'style';
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
  checkpoints?: Checkpoint[];
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
export function emptyConfiguration(): Configuration {
  return {
    version: 1,
    designVersion: 1,
    modelVersion: 2,
    revision: 0,
    sddLanguage: 'es',
    name: 'Mi proyecto',
    slug: 'mi-proyecto',
    idea: '',
    positive: '',
    negative: '',
    selections: {},
    origins: {},
    project: createProjectDefinition(),
  };
}
export const singleFields = new Set<Field>([
  'platform',
  'architecture',
  'runtime',
  'frontend',
  'styling',
  'archetype',
  'auth',
]);
