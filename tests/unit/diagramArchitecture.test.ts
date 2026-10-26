import { expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { emptyProfiles } from '../../src/domain/profiles';
import { projectArchitecture, projectContext } from '../../src/engine/diagramProjection';
import { exampleProject } from '../../src/catalog/exampleProject';
import { compile } from '../../src/engine/compiler';
it('proyecta tecnologías asignadas, dependencias y orden estable sin alterar el perfil', () => {
  const c = emptyConfiguration();
  c.profile = emptyProfiles();
  c.profile.components = [
    {
      id: 'C-2',
      name: 'API',
      kind: 'api',
      responsibility: 'Contratos',
      profileId: '',
      dependsOn: ['C-1'],
      technologyIds: ['TEC-1'],
    },
    {
      id: 'C-1',
      name: 'Interfaz',
      kind: 'web',
      responsibility: 'Controles',
      profileId: '',
      dependsOn: [],
      technologyIds: [],
    },
  ];
  c.profile.technologies = [
    {
      id: 'TEC-1',
      name: 'Rust',
      role: 'lenguaje',
      purpose: 'API',
      constraints: [],
      version: '',
      sources: [],
      reviewedAt: '',
      support: 'declarada',
    },
  ];
  const before = JSON.stringify(c);
  const a = projectArchitecture(c);
  expect(a[0].source).toContain('flowchart TD');
  expect(a[0].source).toContain('Depende de');
  expect(a[0].source).toContain('Utiliza tecnología');
  expect(a[0].issues[0].message).toContain('tecnologías por definir');
  expect(JSON.stringify(c)).toBe(before);
  c.profile.components.reverse();
  expect(projectArchitecture(c)[0].source).toBe(a[0].source);
});
it('señala vacíos sin inventar componentes ni perder selecciones globales', () => {
  const c = emptyConfiguration();
  expect(projectArchitecture(c)[0].source).toContain('Arquitectura por definir');
  c.selections.language = ['lang-rust'];
  expect(projectArchitecture(c)[0].source).toContain('selección global');
  expect(projectArchitecture(c)[0].sourceIds).toEqual(['lang-rust']);
  c.selections.storage = ['postgres'];
  const source = projectArchitecture(c)[0].source;
  expect(source).toContain('PostgreSQL · selección global');
  expect(source).not.toMatch(/#\d+;/);
});
it('el contexto del sistema solo aparece con actores declarados y enlaza componentes', () => {
  const c = emptyConfiguration();
  expect(projectContext(c)).toEqual([]);
  const example = exampleProject();
  const [context] = projectContext(example);
  expect(context.kind).toBe('context');
  expect(context.documentIds).toEqual(['plan']);
  expect(context.source).toContain('Recepción del taller (ACT-1)');
  expect(context.source).toContain('-->|"Usa"|');
  expect(context.issues.map(i => i.id)).toEqual(['composicion-contexto']);
  const architecture = compile(example).documents.find(d => d.id === 'plan')!;
  expect(architecture.content).toContain('Contexto del sistema');
});
