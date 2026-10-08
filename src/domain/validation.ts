import { isDesignOverrides } from './design';
import { isLocale } from '../i18n/translate';
import { fields, singleFields, type Configuration, type Diagnostic, type Field } from './models';
import { createKitManifest, validSlug } from '../engine/kitManifest';
import { technologyById } from '../catalog/technologies';
// Propiedades pictográficas y modificadores; el patrón no contiene símbolos prohibidos.
export const emojiPattern = /[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u20E3]/u;
const secretPattern = /(?:sk-[a-zA-Z0-9]{20,}|gh[pousr]_[a-zA-Z0-9]{20,}|AKIA[A-Z0-9]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|(?:api[_-]?key|password|secret|token)\s*[:=]\s*["']?[a-zA-Z0-9_/-]{16,})/i;
export function validateText(text: string): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    if (emojiPattern.test(text))
        diagnostics.push({ message: 'El texto contiene emojis. Retíralos antes de guardar, copiar o exportar.', blocking: true });
    if (secretPattern.test(text))
        diagnostics.push({ message: 'Se detectó una posible credencial. Retírala del borrador antes de continuar.', blocking: true });
    return diagnostics;
}
export function validateConfiguration(c: Configuration, knownIds?: ReadonlySet<string>): Diagnostic[] {
    const result = validateText([c.name, c.idea, c.positive, c.negative].join('\n'));
    if ((c.designVersion !== undefined && c.designVersion !== 1) || (c.designOverrides !== undefined && !isDesignOverrides(c.designOverrides)))
        result.push({ message: 'Los ajustes de diseño no son válidos.', blocking: true });
    if (c.sddLanguage !== undefined && !isLocale(c.sddLanguage))
        result.push({ message: 'Idioma del SDD no válido.', blocking: true });
    if (c.version !== 1 || !Number.isSafeInteger(c.revision) || c.revision < 0)
        result.push({ message: 'Versión o revisión de borrador no válida.', blocking: true });
    if (!c.name.trim() || c.name.length > 80)
        result.push({ message: 'El nombre debe tener entre 1 y 80 caracteres.', blocking: true });
    if (!/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(c.slug))
        result.push({ message: 'El identificador debe usar de 1 a 64 letras minúsculas, números o guiones.', blocking: true });
    if (c.idea.length > 20000)
        result.push({ message: 'La idea supera 20.000 caracteres. Acótala para continuar.', blocking: true });
    for (const text of [c.positive, c.negative])
        if (text.split('\n').length > 100 || text.split('\n').some(line => line.length > 500))
            result.push({ message: 'El alcance admite hasta 100 líneas de 500 caracteres.', blocking: true });
    for (const [field, ids] of Object.entries(c.selections)) {
        if (!fields.includes(field as Field) || (knownIds && ids.some(id => !knownIds.has(id) || technologyById.get(id)?.field !== field)))
            result.push({ message: 'La configuración contiene una opción desconocida.', blocking: true });
        if (new Set(ids).size !== ids.length || (singleFields.has(field as Field) && ids.length > 1))
            result.push({ message: 'La configuración contiene opciones duplicadas o varias decisiones en un campo único.', blocking: true });
    }
    return result;
}
export function isConfiguration(value: unknown): value is Configuration {
    if (!value || typeof value !== 'object')
        return false;
    const c = value as Record<string, unknown>;
    return (c.designVersion === undefined || c.designVersion === 1) && (c.designOverrides === undefined || isDesignOverrides(c.designOverrides)) && (c.sddLanguage === undefined || isLocale(c.sddLanguage)) && c.version === 1 && typeof c.revision === 'number' && ['name', 'slug', 'idea', 'positive', 'negative'].every(k => typeof c[k] === 'string') && !!c.selections && typeof c.selections === 'object' && !Array.isArray(c.selections) && Object.values(c.selections).every(ids => Array.isArray(ids) && ids.every(id => typeof id === 'string')) && !!c.origins && typeof c.origins === 'object' && !Array.isArray(c.origins) && Object.keys(c.origins).every(key=>fields.includes(key as Field)) && Object.values(c.origins).every(origin => ['manual', 'preset', 'inference'].includes(String(origin)));
}
export function safeDocumentPath(path: string, slug = 'mi-proyecto'): boolean { return validSlug(slug) && createKitManifest({ slug }).some(d => d.path === path); }
export function escapeMarkdown(text: string): string { return text.replace(/[<>]/g, char => char === '<' ? '&lt;' : '&gt;'); }
