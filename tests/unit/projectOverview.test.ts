import { describe, expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { compile } from '../../src/engine/compiler';
import { documentApplicability, groupPending } from '../../src/engine/documentStatus';
describe('portada y estados documentales públicos', () => {
  it('clasifica exactamente las siete rutas y deja la evidencia pendiente', () => {
    const result = compile(emptyConfiguration());
    expect(result.documentStatuses).toHaveLength(7);
    expect(Object.keys(documentApplicability)).toHaveLength(7);
    expect(result.documents.every(d => documentApplicability[d.id])).toBe(true);
    expect(result.documentStatuses?.find(d => d.documentId === 'AGENTS.md')?.state).toBe(
      'sin-pendientes',
    );
    for (const id of ['validation'])
      expect(result.documentStatuses?.find(d => d.documentId === id)?.reasons[0].message).toContain(
        'no ejecutadas',
      );
    expect(result.overview?.counts.rf).toBe(0);
    expect(result.overview?.counts.documentDrafts).toBe(
      result.documentStatuses?.filter(d => d.state === 'borrador').length,
    );
    // «Completo» no existe como estado ni aparece en el kit.
    expect(
      result.documentStatuses?.every(d => ['borrador', 'sin-pendientes'].includes(d.state)),
    ).toBe(true);
    expect(result.documents.filter(d => /\bCompleto\b/.test(d.content)).map(d => d.id)).toEqual([]);
  });
  it('cuenta declaraciones activas sin marcadores, distingue RF/RNF y conserva revisión', () => {
    const c = emptyConfiguration();
    c.revision = 9;
    c.project!.requirements = [
      { ...createRequirement('RF-1'), kind: 'functional' },
      { ...createRequirement('RNF-2'), kind: 'nonfunctional' },
      { ...createRequirement('RF-3'), status: 'descartado' },
    ];
    c.project!.context.entities = [
      { id: 'ENT-1', text: 'Reserva', status: 'confirmado', origin: 'user', references: [] },
    ];
    const result = compile(c);
    expect(result.overview?.counts).toMatchObject({ rf: 1, rnf: 1, components: 0, entities: 1 });
    expect(result.overview?.revision).toBe(9);
    expect(
      result.documentStatuses?.every(
        d => d.revision === 9 && d.pendingCount === new Set(d.reasons.map(r => r.id)).size,
      ),
    ).toBe(true);
    expect(result.overview?.architectureDiagramIds).toEqual(
      result.diagrams?.diagrams.filter(d => d.kind === 'architecture').map(d => d.id),
    );
  });
  it('modo documental explica no aplicabilidad sin certificar validación', () => {
    const c = emptyConfiguration();
    c.project!.mode = 'documentacion';
    c.project!.implementationRequired = false;
    const result = compile(c);
    expect(result.overview?.readiness.configuration.applicable).toBe(0);
    expect(result.documentStatuses?.find(d => d.documentId === 'validation')?.state).toBe(
      'borrador',
    );
    expect(result.documentStatuses?.find(d => d.documentId === 'AGENTS.md')?.state).toBe(
      'sin-pendientes',
    );
  });
});

it('revisión pendiente, conflicto y error fuerzan borrador sin mutar el estado confirmado', async () => {
  const { presentDocumentStatus } = await import('../../src/store/documentStore');
  const base = compile(emptyConfiguration()).documentStatuses!.find(
    s => s.documentId === 'AGENTS.md',
  )!;
  const pending = presentDocumentStatus(base, {
    revision: base.revision + 1,
    pending: true,
    conflict: true,
    error: 'Error local recuperable.',
  });
  expect(pending.state).toBe('borrador');
  expect(pending.pendingCount).toBe(3);
  expect(pending.reasons.map(r => r.id)).toEqual([
    'revision-pendiente',
    'conflicto-manual',
    'generacion-error',
  ]);
  expect(base.state).toBe('sin-pendientes');
});

it('ficha y especificación conservan pendientes aplicables de pila, contexto y relaciones', async () => {
  const { visualProject } = await import('../fixtures/visualProject');
  const c = visualProject();
  c.project!.context.entities[0].status = 'propuesto';
  c.project!.diagramFacts!.entityRelations[0].status = 'pendiente';
  const result = compile(c);
  expect(result.documentStatuses!.find(s => s.documentId === 'spec')?.state).toBe('borrador');
  expect(
    result.documentStatuses!.find(s => s.documentId === 'spec')?.reasons.map(r => r.id),
  ).toEqual(expect.arrayContaining(['contexto-E-1', 'confirmacion-REL-1']));
  expect(result.documentStatuses!.find(s => s.documentId === 'AGENTS.md')?.state).toBe(
    'sin-pendientes',
  );
});
it('muestra el identificador editado aunque la identidad del proyecto sea anterior', () => {
  const c = emptyConfiguration();
  const result = compile({ ...c, slug: 'reservas-taller', name: 'Reservas del taller' });
  expect(c.project?.projectId).toBe('mi-proyecto');
  expect(result.overview?.projectId).toBe('mi-proyecto');
  expect(result.overview?.slug).toBe('reservas-taller');
});
it('agrupa pendientes por categoría, cuenta cada requisito una vez y excluye pasos de proceso', () => {
  expect(
    groupPending([
      'actor-RF-1',
      'excepciones-RF-1',
      'criterios-RF-1',
      'decision-RF-2',
      'configuracion-plataforma',
      'contexto-CTX-1',
      'relaciones-pendientes',
      'composicion-pendiente',
    ]).map(g => [g.id, g.count]),
  ).toEqual([
    ['requisitos', 2],
    ['contexto', 1],
    ['datos', 1],
    ['arquitectura', 1],
    ['configuracion', 1],
  ]);
  const c = emptyConfiguration();
  c.name = 'Reservas del taller';
  c.idea = 'Un taller necesita reservas sin conexión con React, FastAPI y PostgreSQL.';
  c.positive = 'Crear reservas\nCancelar reservas\nVer agenda diaria';
  const overview = compile(c).overview!;
  expect(overview.counts.pending).toBeLessThanOrEqual(15);
  expect(overview.pendingGroups.length).toBeLessThanOrEqual(6);
  expect(overview.processPending).toBeGreaterThan(0);
  expect(overview.counts.pending).toBe(overview.pendingGroups.reduce((s, g) => s + g.count, 0));
});
