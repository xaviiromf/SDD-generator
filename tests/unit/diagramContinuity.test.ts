import { expect, it } from 'vitest';
import { emptyConfiguration } from '../../src/domain/models';
import { saveDraft, readDraft, draftKey } from '../../src/services/draftStorage';
import { exportBackup, parseBackup } from '../../src/services/projectImport';
it('conserva hechos ER en borrador, respaldo y versión sin modificar textos', () => {
    const c = emptyConfiguration(); c.idea = 'Mi texto original';
    c.project!.context.entities = ['E-1', 'E-2'].map(id => ({ id, text: id, status: 'confirmado' as const, origin: 'user' as const, references: [] }));
    c.project!.diagramFacts = { schemaVersion: 1, entityRelations: [{ id: 'REL-1', fromEntityId: 'E-1', toEntityId: 'E-2', label: 'contiene', fromCardinality: '', toCardinality: '', identifying: null, status: 'pendiente' }] };
    const records = new Map<string, string>(); const storage = { setItem: (k: string, v: string) => { records.set(k, v); }, getItem: (k: string) => records.get(k) ?? null };
    expect(saveDraft(c, storage)).toContain('guardado'); expect(readDraft(storage).config?.project?.diagramFacts).toEqual(c.project!.diagramFacts);
    const date = '2026-10-08T00:00:00.000Z';
    const exported = exportBackup([{ id: 'Proyecto-1', createdAt: date, updatedAt: date, draft: c, versions: [{ id: 'Version-1', label: 'Antes', createdAt: date, configuration: c }] }]);
    expect(exported.ok).toBe(true); if (!exported.ok) return;
    const parsed = parseBackup(exported.value); expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(parsed.value.projects[0].versions[0].configuration).toEqual(c);
    records.set(draftKey, JSON.stringify({ ...c, project: undefined }));
    expect(readDraft(storage).config?.idea).toBe(c.idea);
    expect(readDraft(storage).config?.project?.diagramFacts).toBeUndefined();
});
