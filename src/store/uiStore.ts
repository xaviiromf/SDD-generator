import { type Locale } from '../i18n/translate';
import { create } from 'zustand';
export type Panel = 'config' | 'idea' | 'docs';
export const uiLanguageKey = 'sdd-studio:ui-language:v1';
export function migrateUiLanguage(storage?: Pick<Storage, 'getItem' | 'removeItem'>): string {
    try { const target = storage ?? localStorage; const previous = target.getItem(uiLanguageKey); target.removeItem(uiLanguageKey); return previous === 'en' ? 'La interfaz se ha actualizado a español; tus textos y decisiones se conservan.' : ''; } catch { return ''; }
}
const migrationNotice = migrateUiLanguage();
interface InterfaceState {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    panel: Panel;
    phase: string;
    palette: boolean;
    requestedPreset: string;
    restart: number;
    activeDocument: string;
    dismissed: string[];
    notice: string;
    setPanel: (panel: Panel) => void;
}
export const useUIStore = create<InterfaceState>(set => ({ locale: 'es', setLocale: () => set({ locale: 'es' }), panel: 'config', phase: '1', palette: false, requestedPreset: '', restart: 0, activeDocument: 'spec', dismissed: [], notice: migrationNotice, setPanel: panel => set({ panel }) }));
