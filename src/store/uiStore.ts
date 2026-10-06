import { create } from 'zustand';
export type Panel = 'config' | 'idea' | 'docs';
interface InterfaceState { panel: Panel; phase: string; palette: boolean; activeDocument: number; dismissed: string[]; notice: string; setPanel: (panel: Panel) => void }
export const useUIStore = create<InterfaceState>(set => ({ panel: 'config', phase: '1', palette: false, activeDocument: 0, dismissed: [], notice: '', setPanel: panel => set({ panel }) }));
