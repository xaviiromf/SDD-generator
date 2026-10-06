import { it, expect } from 'vitest';
import { inferTechnologies, searchTechnologies } from '../../src/engine/matcher';
import { scopeSuggestions } from '../../src/engine/scopeRules';
import { emptyConfiguration } from '../../src/domain/models';
it('detecta erratas y respeta negaciones', () => {
  const ids = inferTechnologies('reservas en pyton con tailwnd, sin Firebase').map(i => i.id);
  expect(ids).toContain('python'); expect(ids).toContain('tailwind'); expect(ids).not.toContain('firebase');
  expect(searchTechnologies('tailwnd')[0].id).toBe('tailwind');
  expect(inferTechnologies('sin backend').some(i => i.id === 'client')).toBe(true);
});
it('propone persistencia y evita opciones incompatibles', () => {
  const c = { ...emptyConfiguration(), idea:'Reservas', selections:{ architecture:['client'] } };
  expect(scopeSuggestions(c)[0].options).not.toContain('supabase');
  expect(scopeSuggestions({ ...c, selections:{ storage:['memory'] } })).toEqual([]);
});
