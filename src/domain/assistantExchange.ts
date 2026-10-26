import type { Configuration } from './models';
import { isDeclaration } from './profiles';
import { validateText } from './validation';
/** Asistente externo por copiar y pegar: sin red, sin claves y con validación local. */
export const assistantSchemaVersion = 'sdd-studio.asistente.v1';
export const assistantLimits = {
  bytes: 128 * 1024,
  items: 50,
  criteria: 10,
  title: 500,
  text: 2000,
} as const;
export interface AssistantRequirement {
  titulo: string;
  comportamiento: string;
  criterios: string[];
}
export interface AssistantResponse {
  actores: string[];
  entidades: string[];
  exclusiones: string[];
  preguntas: string[];
  requisitos: AssistantRequirement[];
}
const listKeys = ['actores', 'entidades', 'exclusiones', 'preguntas'] as const;
/** Instrucciones para cualquier asistente: solo datos JSON, sin inventar decisiones. */
export function assistantPrompt(c: Configuration): string {
  const requirements = c.project?.requirements.filter(r => r.status !== 'descartado') ?? [];
  const context = (kind: 'actors' | 'entities' | 'exclusions') =>
    c.project?.context[kind]
      .filter(i => i.status !== 'descartado' && i.text.trim())
      .map(i => `- ${i.text}`)
      .join('\n') || '- (ninguno)';
  return `Actúa como analista de requisitos. Lee la idea y propone elementos para completar su especificación. Responde solo con un objeto JSON válido, sin texto adicional ni bloques de código, con esta forma exacta:

{
  "esquema": "${assistantSchemaVersion}",
  "actores": ["persona o sistema que interactúa"],
  "entidades": ["dato que el sistema guarda o gestiona"],
  "exclusiones": ["algo que queda fuera del alcance"],
  "preguntas": ["duda que el responsable debe resolver"],
  "requisitos": [{ "titulo": "acción breve", "comportamiento": "resultado esperado", "criterios": ["resultado observable y comprobable"] }]
}

Reglas: escribe en español; no inventes reglas de negocio, tecnologías ni cifras que la idea no permita deducir; si algo no se sabe, formúlalo como pregunta; como máximo ${assistantLimits.items} elementos por lista y ${assistantLimits.criteria} criterios por requisito; textos sin código, comandos ni enlaces; no repitas lo que ya está declarado.

Nombre del proyecto: ${c.name}

Idea:
${c.idea.trim() || '(sin idea)'}

Qué debe hacer:
${c.positive.trim() || '(sin declarar)'}

Qué queda fuera:
${c.negative.trim() || '(sin declarar)'}

Ya declarado. Actores:
${context('actors')}
Entidades:
${context('entities')}
Exclusiones:
${context('exclusions')}
Requisitos:
${requirements.map(r => `- ${r.id}: ${r.title || r.behavior || 'por definir'}`).join('\n') || '- (ninguno)'}
`;
}
const text = (v: unknown, max: number) =>
  typeof v === 'string' &&
  v.trim().length > 0 &&
  isDeclaration(v.trim(), max) &&
  !validateText(v).length;
/**
 * Valida la respuesta pegada: tamaño, JSON, esquema, solo claves declaradas, límites y textos
 * declarativos sin código, comandos, emojis ni posibles credenciales.
 */
export function parseAssistantResponse(raw: string): AssistantResponse | { error: string } {
  if (new TextEncoder().encode(raw).length > assistantLimits.bytes)
    return { error: 'La respuesta supera 128 KiB.' };
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*\n?/i, '')
    .replace(/\n?```\s*$/, '');
  let data: unknown;
  try {
    data = JSON.parse(cleaned);
  } catch {
    return { error: 'La respuesta no es JSON válido. Pide al asistente solo el objeto JSON.' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data))
    return { error: 'La respuesta debe ser un objeto JSON.' };
  const value = data as Record<string, unknown>;
  if (value.esquema !== assistantSchemaVersion)
    return { error: `Falta el esquema «${assistantSchemaVersion}».` };
  const unknown = Object.keys(value).filter(
    k => k !== 'esquema' && k !== 'requisitos' && !(listKeys as readonly string[]).includes(k),
  );
  if (unknown.length) return { error: `Claves no admitidas: ${unknown.join(', ')}.` };
  const result: AssistantResponse = {
    actores: [],
    entidades: [],
    exclusiones: [],
    preguntas: [],
    requisitos: [],
  };
  for (const key of listKeys) {
    const list = value[key] ?? [];
    if (!Array.isArray(list) || list.length > assistantLimits.items)
      return { error: `«${key}» debe ser una lista de hasta ${assistantLimits.items} textos.` };
    if (!list.every(item => text(item, assistantLimits.text)))
      return { error: `«${key}» contiene textos vacíos, demasiado largos o con código.` };
    result[key] = list.map(item => (item as string).trim());
  }
  const requirements = value.requisitos ?? [];
  if (!Array.isArray(requirements) || requirements.length > assistantLimits.items)
    return {
      error: `«requisitos» debe ser una lista de hasta ${assistantLimits.items} elementos.`,
    };
  for (const item of requirements) {
    if (!item || typeof item !== 'object' || Array.isArray(item))
      return { error: 'Cada requisito debe ser un objeto.' };
    const r = item as Record<string, unknown>;
    if (Object.keys(r).some(k => !['titulo', 'comportamiento', 'criterios'].includes(k)))
      return { error: 'Un requisito contiene claves no admitidas.' };
    const criteria = r.criterios ?? [];
    if (
      !text(r.titulo, assistantLimits.title) ||
      (r.comportamiento !== undefined &&
        r.comportamiento !== '' &&
        !text(r.comportamiento, assistantLimits.text)) ||
      !Array.isArray(criteria) ||
      criteria.length > assistantLimits.criteria ||
      !criteria.every(c => text(c, assistantLimits.text))
    )
      return { error: 'Un requisito tiene título, comportamiento o criterios no válidos.' };
    result.requisitos.push({
      titulo: (r.titulo as string).trim(),
      comportamiento: typeof r.comportamiento === 'string' ? r.comportamiento.trim() : '',
      criterios: (criteria as string[]).map(c => c.trim()),
    });
  }
  return result;
}
