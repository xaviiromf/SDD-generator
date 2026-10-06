import { create } from 'zustand';
import type { Compilation } from '../domain/models';
interface Documents { compilation: Compilation | null; pending: boolean; error: string; publish: (result: Compilation) => void; fail: (message: string) => void }
export const useDocumentStore = create<Documents>(set => ({ compilation: null, pending: true, error: '', publish: compilation => set({ compilation, pending: false, error: '' }), fail: error => set({ error, pending: false }) }));
