import { literal } from '../i18n/translate';
import { technologies } from '../catalog/technologies';
import { distance, normalize, tokenize } from './tokenizer';
import type { Inference, Technology } from '../domain/models';
const searchable = technologies.map(entry => ({ entry, terms: [entry.id, normalize(entry.label), normalize(literal(entry.label, 'en')), ...entry.aliases.map(normalize)] }));
export function searchTechnologies(query: string): Technology[] {
    const term = normalize(query.trim());
    if (!term)
        return technologies;
    return searchable.map(({ entry, terms }) => ({ entry, score: Math.min(...terms.map(t => t === term ? 0 : t.includes(term) ? 1 : term.length >= 4 && distance(t, term) <= 2 ? 2 : 100)) })).filter(v => v.score < 100).sort((a, b) => a.score - b.score).map(v => v.entry);
}
export function inferTechnologies(text: string): Inference[] {
    const words = tokenize(text);
    const result: Inference[] = [];
    const seen = new Set<string>();
    const seenWords = new Set<string>();
    for (let index = 0; index < words.length; index++) {
        const word = words[index];
        if (word.length < 3 || word.length > 64)
            continue;
        const context = words.slice(Math.max(0, index - 3), index);
        if (context.some(t => ['sin', 'no', 'evitar', 'excluir', 'excepto', 'without', 'avoid', 'exclude', 'except', 'not'].includes(t)))
            continue;
        if (seenWords.has(word))
            continue;
        seenWords.add(word);
        let matches = searchable.filter(item => item.terms.some(t => t === word));
        if (!matches.length && word.length >= 5)
            matches = searchable.filter(item => item.terms.some(t => t.length >= 5 && Math.abs(t.length - word.length) <= 1 && distance(t, word) <= 1));
        if (matches.length !== 1)
            continue;
        const entry = matches[0].entry;
        if (seen.has(entry.id))
            continue;
        seen.add(entry.id);
        result.push({ id: entry.id, field: entry.field, explanation: `Se detectó ${entry.label} en la idea.` });
    }
    if (/\b(?:sin|without|no) backend\b/.test(normalize(text)))
        result.push({ id: 'client', field: 'architecture', explanation: 'Se solicitó funcionamiento sin backend.' });
    return result.sort((a, b) => (a.field === 'language' ? -1 : 0) - (b.field === 'language' ? -1 : 0));
}
