import { beforeEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { extractContext, singular } from '../../src/domain/contextExtraction';
import {
  assistantPrompt,
  assistantSchemaVersion,
  parseAssistantResponse,
} from '../../src/domain/assistantExchange';
import { emptyConfiguration } from '../../src/domain/models';
import { useEditorStore } from '../../src/store/editorStore';
import { compile } from '../../src/engine/compiler';
import { projectValidationErrors } from '../../src/domain/projectValidation';
const corpus = JSON.parse(readFileSync('tests/fixtures/corpus.json', 'utf8')) as {
  id: string;
  idea: string;
  actor: string;
}[];
const norm = (t: string) =>
  t
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
describe('extracción local de contexto', () => {
  it('encuentra el actor del corpus cuando aparece en la idea y no propone frases con conjunciones', () => {
    const present = corpus.filter(c => norm(c.idea).includes(norm(c.actor)) || c.id === '08');
    expect(present).toHaveLength(9);
    for (const c of present) {
      const actors = extractContext({ idea: c.idea, positive: '', negative: '' })
        .filter(p => p.kind === 'actors')
        .map(p => norm(p.text));
      expect(
        actors.some(a => a.includes(norm(c.actor))),
        c.id,
      ).toBe(true);
      expect(
        actors.some(a => /\b(y|o|de)$/.test(a)),
        c.id,
      ).toBe(false);
    }
  });
  it('propone entidades en singular, exclusiones literales y omite lo ya declarado', () => {
    const idea =
      'Un taller necesita crear, consultar y cancelar reservas. Los mecánicos marcan trabajos terminados; una reserva atendida se rechaza. No incluir pagos ni sincronización en la nube.';
    const proposals = extractContext({ idea, positive: '', negative: 'Facturación' });
    const by = (kind: string) => proposals.filter(p => p.kind === kind).map(p => p.text);
    expect(by('actors')).toEqual(['Mecánicos']);
    expect(by('entities')).toEqual(['Reserva', 'Trabajo']);
    expect(by('exclusions')).toEqual(['Pagos', 'Sincronización en la nube', 'Facturación']);
    const c = emptyConfiguration();
    c.project!.context.actors = [
      { id: 'A-1', text: 'Mecánicos', status: 'confirmado', origin: 'user', references: [] },
    ];
    expect(
      extractContext({ idea, positive: '', negative: '' }, c.project).some(
        p => p.kind === 'actors',
      ),
    ).toBe(false);
    expect(['ciudades', 'inspecciones', 'luces', 'clientes', 'notas'].map(singular)).toEqual([
      'ciudad',
      'inspección',
      'luz',
      'cliente',
      'nota',
    ]);
  });
});
describe('asistente por copiar y pegar', () => {
  beforeEach(() => useEditorStore.getState().restore(emptyConfiguration()));
  const valid = {
    esquema: assistantSchemaVersion,
    actores: ['Recepción'],
    entidades: ['Reserva'],
    exclusiones: [],
    preguntas: ['¿Cuántos elevadores hay?'],
    requisitos: [
      {
        titulo: 'Crear reservas',
        comportamiento: 'La reserva queda guardada',
        criterios: ['Aparece en la agenda'],
      },
    ],
  };
  it('el prompt incluye idea, esquema y lo ya declarado', () => {
    const c = { ...emptyConfiguration(), idea: 'Reservas del taller', positive: 'Crear reservas' };
    const prompt = assistantPrompt(c);
    expect(prompt).toContain(assistantSchemaVersion);
    expect(prompt).toContain('Reservas del taller');
    expect(prompt).toContain('Crear reservas');
  });
  it('acepta JSON válido, incluso con cerca de código, y rechaza claves, código y secretos', () => {
    const { esquema, ...expected } = valid;
    expect(esquema).toBe(assistantSchemaVersion);
    expect(parseAssistantResponse(JSON.stringify(valid))).toEqual(expected);
    expect(parseAssistantResponse('```json\n' + JSON.stringify(valid) + '\n```')).toEqual(expected);
    const error = (v: unknown) =>
      'error' in (parseAssistantResponse(typeof v === 'string' ? v : JSON.stringify(v)) as object);
    expect(error('no es json')).toBe(true);
    expect(error({ ...valid, esquema: 'otro' })).toBe(true);
    expect(error({ ...valid, extra: [] })).toBe(true);
    expect(error({ ...valid, actores: ['<script>alert(1)</script>'] })).toBe(true);
    expect(error({ ...valid, actores: ['npm install algo'] })).toBe(true);
    expect(error({ ...valid, entidades: ['token=' + 'a1'.repeat(13)] })).toBe(true);
    expect(
      error({ ...valid, requisitos: [{ titulo: 'X', criterios: [], prioridad: 'alta' }] }),
    ).toBe(true);
    expect(error({ ...valid, actores: Array.from({ length: 51 }, (_, i) => `Actor ${i}`) })).toBe(
      true,
    );
    expect(error('x'.repeat(128 * 1024 + 1))).toBe(true);
  });
  it('acepta propuestas con origen registrado y el modelo sigue siendo válido', () => {
    const store = useEditorStore.getState();
    expect(
      store.acceptContextProposals(
        [
          { kind: 'actors', text: 'Recepción' },
          { kind: 'questions', text: '¿Cuántos elevadores hay?' },
        ],
        'assistant-accepted',
      ),
    ).toBe(2);
    expect(useEditorStore.getState().acceptAssistantRequirements(valid.requisitos)).toBe(1);
    const project = useEditorStore.getState().config.project!;
    expect(project.context.actors[0]).toMatchObject({
      text: 'Recepción',
      status: 'propuesto',
      origin: 'assistant-accepted',
    });
    expect(project.requirements[0]).toMatchObject({
      title: 'Crear reservas',
      status: 'propuesto',
      origin: 'assistant-accepted',
    });
    expect(project.requirements[0].criteria[0].text).toBe('Aparece en la agenda');
    expect(projectValidationErrors(project)).toEqual([]);
    const spec = compile(useEditorStore.getState().config).documents.find(d => d.id === 'spec')!;
    expect(spec.content).toContain('Propuesta de asistente externo aceptada');
  });
});
