import { it, expect } from 'vitest';
import { inferTechnologies, searchTechnologies } from '../../src/engine/matcher';
import { scopeSuggestions } from '../../src/engine/scopeRules';
import { emptyConfiguration } from '../../src/domain/models';
it('detecta erratas y respeta negaciones', () => {
    const ids = inferTechnologies('reservas en pyton con tailwnd, sin Firebase').map(i => i.id);
    expect(ids).toContain('python');
    expect(ids).toContain('tailwind');
    expect(ids).not.toContain('firebase');
    expect(searchTechnologies('tailwnd')[0].id).toBe('tailwind');
    expect(inferTechnologies('sin backend').some(i => i.id === 'client')).toBe(true);
});
it('propone persistencia y evita opciones incompatibles', () => {
    const c = { ...emptyConfiguration(), idea: 'Reservas', selections: { architecture: ['client'] } };
    expect(scopeSuggestions(c)[0].options).not.toContain('supabase');
    expect(scopeSuggestions({ ...c, selections: { storage: ['memory'] } })).toEqual([]);
});

import { intentInferences, normalizeIntent } from '../../src/domain/intent';
it('normaliza MCP y conserva prioridades, exclusiones y umbral', () => {
    const result = normalizeIntent({ matches: [{ id: 'python', confidence: .9, reason: 'Python' }, { id: 'react', confidence: .6, reason: '' }], missingScopes: [] });
    expect(intentInferences(result, emptyConfiguration()).map(i => i.id)).toEqual(['python']);
    expect(intentInferences(result, { ...emptyConfiguration(), negative: 'python' })).toEqual([]);
    expect(intentInferences(result, { ...emptyConfiguration(), origins: { language: 'manual' } })).toEqual([]);
    expect(() => normalizeIntent({ matches: [{ id: 'desconocido', confidence: 1, reason: '' }], missingScopes: [] })).toThrow();
    expect(() => normalizeIntent({ matches: [{ id: 'python', confidence: NaN, reason: '' }], missingScopes: [] })).toThrow();
});
import { compile } from '../../src/engine/compiler';
import { intentFingerprint } from '../../src/domain/intent';
it('el compilador usa solo inferencia remota vigente y recupera el motor local completo', () => {
    const c = { ...emptyConfiguration(), idea: 'Python para reservas' };
    const snapshot = { fingerprint: intentFingerprint(c), result: normalizeIntent({ matches: [{ id: 'typescript', confidence: .95, reason: '' }], missingScopes: [] }) };
    expect(compile(c, snapshot).inferences.map(i => i.id)).toEqual(['typescript']);
    expect(compile({ ...c, idea: 'Python' }, snapshot).inferences.map(i => i.id)).toContain('python');
    expect(compile(c).inferences.map(i => i.id)).toContain('python');
});
