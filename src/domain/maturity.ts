import { compatibilityDiagnostics, styleApplies } from './compatibility';
import type { Configuration, Field } from './models';
export function calculateMaturity(c: Configuration) {
  const diagnostics = compatibilityDiagnostics(c);
  const valid = (field: Field) => !!c.selections[field]?.length && !diagnostics.some(d => d.field === field);
  const pillars = [
    { label: 'Plataforma', complete: valid('platform') },
    { label: 'Pila tecnológica', complete: valid('language') && valid('architecture') && (valid('frontend') || valid('backend') || ['cli','shell','daemon','esp32','arduino','arm','raspberry-pi'].includes(c.selections.platform?.[0] ?? '')) },
    { label: 'Almacenamiento', complete: valid('storage') },
    { label: 'Estilo', complete: !styleApplies(c) || (valid('styling') && valid('archetype')) },
    { label: 'Seguridad', complete: valid('auth') || valid('security') },
    { label: 'Pruebas', complete: valid('testing') }
  ];
  return { score: Math.round(pillars.filter(p => p.complete).length * 100 / 6), pillars };
}
