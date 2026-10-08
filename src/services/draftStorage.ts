import { createProjectDefinition } from '../domain/projectDefinition';
import type { Configuration } from '../domain/models';
import { isConfiguration, validateConfiguration } from '../domain/validation';
import { knownIds } from '../catalog/technologies';
export const draftKey = 'sdd-studio:borrador:v1';
export function saveDraft(c: Configuration, storage?: Pick<Storage, 'setItem'>): string {
    if (validateConfiguration(c, knownIds).some(d => d.blocking))
        return 'Corrige los datos antes de guardar el borrador.';
    try {
        (storage ?? localStorage).setItem(draftKey, JSON.stringify(c));
        return 'Borrador guardado en este navegador.';
    }
    catch {
        return 'No se pudo guardar: almacenamiento restringido o sin espacio. Puedes continuar en memoria.';
    }
}
export function readDraft(storage?: Pick<Storage, 'getItem'>): {
    config: Configuration | null;
    message: string;
} {
    try {
        const raw = (storage ?? localStorage).getItem(draftKey);
        if (!raw)
            return { config: null, message: 'Sesión local preparada.' };
        const data: unknown = JSON.parse(raw);
        if (!isConfiguration(data) || validateConfiguration(data, knownIds).some(d=>d.blocking))
            throw new Error();
        return { config: { ...data, project: data.project ?? createProjectDefinition(data.slug, data.revision), designVersion: 1, sddLanguage: 'es' }, message: data.sddLanguage === 'en' ? 'Borrador recuperado. El idioma se ha actualizado a español; tus textos y decisiones se conservan.' : 'Borrador recuperado.' };
    }
    catch {
        return { config: null, message: 'No se pudo recuperar el borrador. El registro no es válido o el almacenamiento está restringido.' };
    }
}
