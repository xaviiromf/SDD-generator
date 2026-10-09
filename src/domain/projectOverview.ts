import type { Readiness } from './readiness';
import type { WorkMode } from './profiles';
export interface DocumentPending { id: string; message: string }
export interface DocumentStatus {
    documentId: string; revision: number; state: 'completo' | 'borrador'; pendingCount: number;
    reasons: DocumentPending[]; applicability: string;
}
export interface OverviewTarget { id: string; label: string; documentId?: string; panel?: 'idea' | 'configuration' }
export interface ProjectOverview {
    projectId: string; revision: number; name: string; description: string; mode: WorkMode;
    profiles: { id: string; name: string }[]; technologies: { id: string; name: string }[];
    counts: { rf: number; rnf: number; components: number; entities: number; technologies: number; pending: number; documentDrafts: number; documentComplete: number };
    readiness: Readiness; architectureDiagramId?: string; architectureDiagramIds: string[]; navigationTargets: OverviewTarget[];
}
