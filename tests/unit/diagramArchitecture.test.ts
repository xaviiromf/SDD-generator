import { expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { emptyProfiles } from '../../src/domain/profiles';
import { projectArchitecture } from '../../src/engine/diagramProjection';
it('proyecta tecnologías asignadas, dependencias y orden estable sin alterar el perfil', () => {
    const c = emptyConfiguration(); c.profile = emptyProfiles();
    c.profile.components = [{ id: 'C-2', name: 'API', kind: 'api', responsibility: 'Contratos', profileId: '', dependsOn: ['C-1'], technologyIds: ['TEC-1'] }, { id: 'C-1', name: 'Interfaz', kind: 'web', responsibility: 'Controles', profileId: '', dependsOn: [], technologyIds: [] }];
    c.profile.technologies = [{ id: 'TEC-1', name: 'Rust', role: 'lenguaje', purpose: 'API', constraints: [], version: '', sources: [], reviewedAt: '', support: 'declarada' }];
    const before = JSON.stringify(c); const a = projectArchitecture(c);
    expect(a[0].source).toContain('flowchart TD'); expect(a[0].source).toContain('Depende de'); expect(a[0].source).toContain('Utiliza tecnología');
    expect(a[0].issues[0].message).toContain('tecnologías por definir'); expect(JSON.stringify(c)).toBe(before);
    c.profile.components.reverse(); expect(projectArchitecture(c)[0].source).toBe(a[0].source);
});
it('señala vacíos sin inventar componentes ni perder selecciones globales', () => {
    const c = emptyConfiguration(); expect(projectArchitecture(c)[0].source).toContain('Arquitectura por definir');
    c.selections.language = ['lang-rust']; expect(projectArchitecture(c)[0].source).toContain('selección global');
    expect(projectArchitecture(c)[0].sourceIds).toEqual(['lang-rust']);
});
