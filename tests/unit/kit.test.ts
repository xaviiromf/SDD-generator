import { describe, it, expect } from 'vitest';
import { createKitManifest } from '../../src/engine/kitManifest';
import { relativeReference, brokenReferences } from '../../src/engine/references';
import { kitDocuments } from '../../src/engine/templates/kit';
import { presets, resolvePreset } from '../../src/catalog/presets';
import { createKitContext } from '../../src/engine/kitContext';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
describe('Manifiesto del kit de siete documentos', () => {
  it('fija siete rutas sin README y con identidad estable', () => {
    const a = createKitManifest(emptyConfiguration());
    const b = createKitManifest({ slug: 'reservas' });
    expect(b.map(d => d.path)).toEqual([
      'AGENTS.md',
      'docs/PROJECT_STATUS.md',
      'docs/DECISIONS.md',
      'specs/001-reservas/spec.md',
      'specs/001-reservas/plan.md',
      'specs/001-reservas/tasks.md',
      'specs/001-reservas/validation.md',
    ]);
    expect(b.map(d => d.id)).toEqual(a.map(d => d.id));
    expect(a.some(d => /readme/i.test(d.path))).toBe(false);
    expect(() => createKitManifest({ slug: '../fuera' })).toThrow();
  });
  it('resuelve referencias desde cualquier nivel y detecta destinos ausentes', () => {
    expect(relativeReference('specs/001-reservas/spec.md', 'docs/PROJECT.md')).toBe(
      '../../docs/PROJECT.md',
    );
    expect(
      brokenReferences([{ path: 'README.md', content: '[Plan](specs/001-reservas/plan.md)' }]),
    ).toHaveLength(1);
    expect(
      brokenReferences([
        { path: 'README.md', content: '[Plan](specs/001-reservas/plan.md)' },
        { path: 'specs/001-reservas/plan.md', content: '' },
      ]),
    ).toEqual([]);
  });
});

it('deriva contexto coherente y tareas Django sin imponer rutas web a CLI', () => {
  const django = createKitContext({
    ...emptyConfiguration(),
    slug: 'reservas',
    project: {
      ...emptyConfiguration().project!,
      requirements: [{ ...createRequirement('RF-1'), title: 'Crear reservas' }],
    },
    selections: {
      language: ['python'],
      backend: ['django'],
      api: ['django-ninja'],
      platform: ['web-ssr'],
      architecture: ['monolith'],
    },
  });
  expect(django.profile.paths).toContain('config/api.py');
  expect(django.tasks.map(task => task.id)).toEqual(['T-RF-1-IMP', 'T-RF-1-VAL']);
  expect(django.tasks[0].files).toContain('apps/core/views.py');
  expect(django).toEqual(createKitContext(django.config));
  const cli = createKitContext({
    ...emptyConfiguration(),
    selections: { platform: ['cli'], language: ['rust'], archetype: ['a04'] },
  });
  expect(cli.profile.visual).toBe(false);
  expect(cli.archetype).toBeUndefined();
  expect(cli.profile.paths).toContain('Cargo.toml');
  expect(cli.profile.paths).not.toContain('package.json');
});

it('genera los siete documentos con referencias válidas para ocho conjuntos', () => {
  for (const preset of presets) {
    const choices = Object.fromEntries((preset.variants ?? []).map(v => [v.field, v.options[0]]));
    const ctx = createKitContext({
      ...emptyConfiguration(),
      selections: resolvePreset(preset, choices),
    });
    const docs = kitDocuments(ctx);
    expect(docs).toHaveLength(7);
    expect(docs.every(d => d.content.length > 150 && d.revision === ctx.config.revision)).toBe(
      true,
    );
    expect(brokenReferences(docs)).toEqual([]);
    expect(docs.find(d => d.id === 'validation')?.content).toContain('No ejecutado');
    expect(docs.find(d => d.path === 'docs/PROJECT_STATUS.md')?.content).toContain(
      'Revisión humana (P5) — solo la persona',
    );
    expect(docs.find(d => d.id === 'AGENTS.md')?.content).toContain('Nunca escribas ni modifiques');
    expect(docs.find(d => d.id === 'plan')?.content).toContain(
      'Propuesta del generador (no verificada)',
    );
    expect(docs.map(d => d.content).join('')).not.toMatch(/\/(home|Users)\/[^/\s]+\//);
  }
});

it('recompone slug, stack y alcance sin referencias heredadas y bloquea exportaciones incoherentes', async () => {
  const { compile } = await import('../../src/engine/compiler');
  const { packageKit } = await import('../../src/services/zipExport');
  const first = compile({ ...emptyConfiguration(), slug: 'antes', positive: 'Crear reservas' });
  const second = compile({
    ...emptyConfiguration(),
    slug: 'despues',
    positive: 'Consultar pedidos',
    revision: 5,
  });
  expect(second.documents.every(d => d.revision === 5)).toBe(true);
  expect(second.documents.map(d => d.content).join('')).not.toContain('001-antes');
  expect(second.documents.find(d => d.id === 'spec')?.content).not.toContain('Crear reservas');
  expect(second.diagnostics).toEqual([]);
  await expect(packageKit(first.documents, { slug: 'despues' })).rejects.toThrow();
  await expect(packageKit(second.documents.slice(1), { slug: 'despues' })).rejects.toThrow();
  await expect(
    packageKit(
      second.documents.map((d, i) => (i ? d : { ...d, path: 'docs/no-existe.md' })),
      { slug: 'despues' },
    ),
  ).rejects.toThrow();
  await expect(packageKit(second.documents, { slug: 'despues' })).resolves.toBeInstanceOf(
    Uint8Array,
  );
});

it('adapta familias y combinaciones híbridas sin sustituir herramientas elegidas', () => {
  const hybrid = createKitContext({
    ...emptyConfiguration(),
    selections: {
      platform: ['web-ssr'],
      architecture: ['decoupled'],
      language: ['python', 'typescript'],
      backend: ['django'],
      frontend: ['vue'],
    },
  });
  expect(hybrid.profile.paths).toContain('frontend/src/App.vue');
  expect(hybrid.profile.domainFiles).toContain('apps/core/views.py');
  const bevy = createKitContext({
    ...emptyConfiguration(),
    selections: { platform: ['game'], frontend: ['bevy'], language: ['rust'] },
  });
  expect(bevy.profile.paths).toContain('Cargo.toml');
  expect(bevy.profile.paths).not.toContain('project.godot');
  const unknown = createKitContext({
    ...emptyConfiguration(),
    selections: { platform: ['esp32'], language: ['cpp'] },
  });
  expect(unknown.profile.setup).toContain('No hay una receta aprobada');
  expect(unknown.profile.paths).not.toContain('package.json');
});
it('lo propuesto no entra en tareas ni validación hasta confirmarse', () => {
  const c = emptyConfiguration();
  c.project!.requirements = [
    { ...createRequirement('RF-1'), title: 'Confirmado', status: 'confirmado' },
    { ...createRequirement('RF-2'), title: 'Sugerido', status: 'propuesto', origin: 'local' },
  ];
  const ctx = createKitContext(c);
  expect(ctx.tasks.map(t => t.rf)).toEqual(['RF-1', 'RF-1']);
  const docs = kitDocuments(ctx);
  expect(docs.find(d => d.id === 'validation')!.content).not.toContain('RF-2');
  expect(docs.find(d => d.id === 'spec')!.content).toContain('Estado: propuesto');
  expect(docs.find(d => d.id === 'plan')!.content).toContain(
    '## Propuesta del generador (no verificada)',
  );
});
