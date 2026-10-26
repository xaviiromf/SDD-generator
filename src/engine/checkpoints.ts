import type { Configuration, Diagnostic, Field } from '../domain/models';
import { fieldLabels } from '../catalog/technologies';
import { validSlug } from './kitManifest';
export type CheckpointId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6';
export interface Checkpoint {
  id: CheckpointId;
  label: string;
  /** P1 a P4 se comprueban en el estudio; P5 y P6 los registra la persona en el repositorio. */
  place: 'estudio' | 'repositorio';
  met: boolean;
  missing: string[];
}
const lines = (text: string) =>
  text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
/** «Sin exclusiones» solo cuenta si va acompañado de un motivo. */
const noExclusions = /^sin exclusiones\s*[:.,-]\s*\S.{3,}/i;
export function evaluateCheckpoints(
  c: Configuration,
  diagnostics: Diagnostic[],
  pillars: { label: string; complete: boolean }[],
): Checkpoint[] {
  const p = c.project;
  const exclusions = [
    ...lines(c.negative),
    ...(p?.context.exclusions.filter(i => i.status !== 'descartado').map(i => i.text.trim()) ?? []),
  ].filter(Boolean);
  const confirmed = p?.requirements.filter(r => r.status === 'confirmado') ?? [];
  const p1 = [
    !c.name.trim() && 'Nombre del proyecto.',
    !validSlug(c.slug) && 'Identificador válido (minúsculas, números y guiones).',
    !c.idea.trim() && 'Idea del proyecto.',
    !lines(c.positive).length && !p?.requirements.length && 'Al menos una línea de alcance.',
    !exclusions.length && 'Al menos una exclusión, o «Sin exclusiones: <motivo>».',
    exclusions.length > 0 &&
      exclusions.every(e => /^sin exclusiones/i.test(e)) &&
      !exclusions.some(e => noExclusions.test(e)) &&
      '«Sin exclusiones» necesita un motivo.',
  ].filter((m): m is string => !!m);
  const p2: string[] = confirmed.length ? [] : ['Al menos un requisito confirmado.'];
  for (const r of confirmed) {
    if (!r.title.trim()) p2.push(`${r.id}: título.`);
    if (!r.behavior.trim()) p2.push(`${r.id}: comportamiento.`);
    if (!r.criteria.some(cr => cr.text.trim())) p2.push(`${r.id}: un criterio observable.`);
  }
  const p3 = Object.entries(c.origins)
    .filter(([field, origin]) => origin !== 'manual' && c.selections[field as Field]?.length)
    .map(
      ([field, origin]) =>
        `Acepta «${fieldLabels[field as Field] ?? field}», que viene de ${origin === 'preset' ? 'un conjunto' : 'una inferencia'}.`,
    );
  if (p?.implementationRequired !== false && p?.mode !== 'documentacion')
    for (const pillar of pillars.filter(pillar => !pillar.complete))
      p3.push(`Define o justifica: ${pillar.label}.`);
  const p4 = diagnostics.filter(d => d.blocking).map(d => d.message);
  const external = 'Lo registra la persona en docs/PROJECT_STATUS.md del repositorio destino.';
  return [
    { id: 'P1', label: 'Idea con alcance y exclusiones', place: 'estudio', missing: p1 },
    { id: 'P2', label: 'Requisitos verificables', place: 'estudio', missing: p2 },
    { id: 'P3', label: 'Decisiones registradas', place: 'estudio', missing: p3 },
    { id: 'P4', label: 'Kit generado sin bloqueos', place: 'estudio', missing: p4 },
    { id: 'P5', label: 'Revisión humana', place: 'repositorio', missing: [external] },
    { id: 'P6', label: 'Autorización delimitada', place: 'repositorio', missing: [external] },
  ].map(checkpoint => ({
    ...(checkpoint as Omit<Checkpoint, 'met'>),
    met: checkpoint.place === 'estudio' && !checkpoint.missing.length,
  }));
}
/** P1 a P4 superados: el proyecto puede pasar a revisión humana fuera del estudio. */
export const readyForReview = (checkpoints: Checkpoint[]) =>
  checkpoints.filter(c => c.place === 'estudio').every(c => c.met);
