import { kitEnglish } from './kit.es-en';
import { uiEnglish } from './ui.es-en';
export type Locale = 'es' | 'en';
export const english = { ...kitEnglish, ...uiEnglish };
export function isLocale(value: unknown): value is Locale { return value === 'es' || value === 'en'; }
/** Exact literal lookup, preserving whitespace and every interpolated value. */
export function literal(text: string, locale: Locale = 'es'): string {
    if (locale === 'es') return text;
    return text.split('\n').map(line => {
        const key = line.trim();
        return Object.hasOwn(english, key) ? line.replace(key, english[key]) : line;
    }).join('\n');
}
export function template(locale: Locale = 'es') {
    return (parts: TemplateStringsArray, ...values: unknown[]): string => parts.reduce((result, part, i) => result + literal(part, locale) + (i < values.length ? String(values[i]) : ''), '');
}
// Canonical service/diagnostic messages may contain catalog labels. This lookup is
// only for product UI text; document prose and user inputs use literal/template.
const fragments = Object.keys(english).filter(key => key.length > 1).sort((a, b) => b.length - a.length);
const fragmentPattern = new RegExp(fragments.map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gu');
export function uiText(text: string | undefined, locale: Locale = 'es'): string {
    if (!text || locale === 'es') return text ?? '';
    if (Object.hasOwn(english, text.trim())) return literal(text, locale);
    return text.replace(fragmentPattern, key => english[key]).replace(/\s+o\s+/g, ' or ');
}
