import { isLocale, type Locale } from '../i18n/translate';
import { create } from 'zustand';
export type Panel = 'config' | 'idea' | 'docs';
export const uiLanguageKey = 'sdd-studio:ui-language:v1';
function savedLocale(): Locale { try { const value = localStorage.getItem(uiLanguageKey); return isLocale(value) ? value : 'es'; } catch { return 'es'; } }
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
export const useUIStore = create<InterfaceState>(set => ({ locale: savedLocale(), setLocale: locale => { set({locale}); try { localStorage.setItem(uiLanguageKey, locale); } catch { set({notice: 'La preferencia de idioma se mantiene solo en memoria; no se pudo guardar.'}); } }, panel: 'config', phase: '1', palette: false, requestedPreset: '', restart: 0, activeDocument: 'spec', dismissed: [], notice: '', setPanel: panel => set({ panel }) }));
