import type { OverviewTarget } from '../domain/projectOverview';
import { create } from 'zustand';
/** Pasos del estudio en el orden del flujo; 'overview' es la Portada. */
export type Panel = 'overview' | 'idea' | 'requirements' | 'config' | 'docs';
export const panelOrder: Panel[] = ['overview', 'idea', 'requirements', 'config', 'docs'];
export type NoticeKind = 'info' | 'exito' | 'aviso' | 'error';
export interface Notice {
  id: number;
  kind: NoticeKind;
  text: string;
}
export interface SaveState {
  status: 'pendiente' | 'guardado' | 'error';
  at?: number;
}
export const uiLanguageKey = 'sdd-studio:ui-language:v1';
export function migrateUiLanguage(storage?: Pick<Storage, 'getItem' | 'removeItem'>): string {
  try {
    const target = storage ?? localStorage;
    const previous = target.getItem(uiLanguageKey);
    target.removeItem(uiLanguageKey);
    return previous === 'en'
      ? 'La interfaz se ha actualizado a español; tus textos y decisiones se conservan.'
      : '';
  } catch {
    return '';
  }
}
const migrationNotice = migrateUiLanguage();
interface InterfaceState {
  panel: Panel;
  phase: string;
  palette: boolean;
  requestedPreset: string;
  restart: number;
  activeDocument: string;
  dismissed: string[];
  notices: Notice[];
  saveState: SaveState;
  offlineReady: boolean;
  setPanel: (panel: Panel) => void;
}
let nextNotice = 1;
export const useUIStore = create<InterfaceState>(set => ({
  panel: 'idea',
  phase: '1',
  palette: false,
  requestedPreset: '',
  restart: 0,
  activeDocument: 'spec',
  dismissed: [],
  notices: migrationNotice ? [{ id: nextNotice++, kind: 'info', text: migrationNotice }] : [],
  saveState: { status: 'pendiente' },
  offlineReady: false,
  setPanel: panel => set({ panel }),
}));

/** Añade una notificación; las repetidas sustituyen a la anterior y se conservan cuatro como máximo. */
export function notify(text: string, kind: NoticeKind = 'info'): number {
  const id = nextNotice++;
  useUIStore.setState(s => ({
    notices: [...s.notices.filter(n => n.text !== text), { id, kind, text }].slice(-4),
  }));
  return id;
}
export function dismissNotice(id: number): void {
  useUIStore.setState(s => ({ notices: s.notices.filter(n => n.id !== id) }));
}

export function focusPanel(panel: Panel): void {
  requestAnimationFrame(() =>
    document.querySelector<HTMLElement>(`[data-panel="${panel}"] h2`)?.focus(),
  );
}

export function openOverviewTarget(target: OverviewTarget): void {
  const panel = target.documentId ? 'docs' : target.panel === 'configuration' ? 'config' : 'idea';
  useUIStore.setState({
    panel,
    ...(target.documentId ? { activeDocument: target.documentId } : {}),
  });
  focusPanel(panel);
}
