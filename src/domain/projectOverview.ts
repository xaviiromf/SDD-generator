import type { Readiness } from './readiness';
import type { Checkpoint } from '../engine/checkpoints';
import type { WorkMode } from './profiles';
export interface DocumentPending {
  id: string;
  message: string;
}
export interface DocumentStatus {
  documentId: string;
  revision: number;
  /** «sin-pendientes» no se muestra; no acredita revisión, implementación ni pruebas. */
  state: 'sin-pendientes' | 'borrador';
  pendingCount: number;
  reasons: DocumentPending[];
  applicability: string;
}
export interface OverviewTarget {
  id: string;
  label: string;
  documentId?: string;
  panel?: 'idea' | 'configuration';
}
/** Pendientes agrupados para la Portada; cada requisito incompleto cuenta una vez. */
export interface PendingGroup {
  id: 'requisitos' | 'contexto' | 'datos' | 'arquitectura' | 'configuracion' | 'otros';
  label: string;
  count: number;
  next: string;
}
export interface ProjectOverview {
  projectId: string;
  /** Identificador visible que el usuario edita; projectId es la identidad estable de la biblioteca. */
  slug: string;
  revision: number;
  name: string;
  description: string;
  mode: WorkMode;
  profiles: { id: string; name: string }[];
  technologies: { id: string; name: string }[];
  pendingGroups: PendingGroup[];
  /** Revisión, autorización y evidencia: siempre pendientes hasta ejecutarse; no cuentan en el total. */
  processPending: number;
  counts: {
    rf: number;
    rnf: number;
    components: number;
    entities: number;
    technologies: number;
    pending: number;
    documentDrafts: number;
  };
  readiness: Readiness;
  checkpoints: Checkpoint[];
  architectureDiagramId?: string;
  architectureDiagramIds: string[];
  navigationTargets: OverviewTarget[];
}
