import type { Configuration, GeneratedDocument } from './models';
import { validateText } from './validation';
/**
 * Revisor independiente por copiar y pegar: opcional, sin red. Solo aporta hallazgos; no
 * decide ni aprueba. La persona los valora en la revisión humana (P5).
 */
export const reviewSchemaVersion = 'sdd-studio.revision.v1';
export const reviewLimits = { bytes: 128 * 1024, items: 50, text: 2000 } as const;
const severities = ['alta', 'media', 'baja'] as const;
export interface ReviewFinding {
  documento: string;
  severidad: (typeof severities)[number];
  problema: string;
  evidencia: string;
}
const keys = ['documento', 'severidad', 'problema', 'evidencia'];
export function reviewPrompt(c: Configuration, documents: GeneratedDocument[]): string {
  return `Actúa como revisor independiente de una especificación. No conoces el razonamiento con el que se generó. Busca contradicciones, requisitos sin criterio observable, criterios que no se pueden comprobar, menciones a archivos que no existen, decisiones sin motivo y cualquier texto que afirme algo que no está verificado. No propongas decisiones ni apruebes nada.

Responde solo con un objeto JSON válido, sin texto adicional, con esta forma exacta:

{
  "esquema": "${reviewSchemaVersion}",
  "hallazgos": [{ "documento": "ruta del documento", "severidad": "alta | media | baja", "problema": "qué está mal", "evidencia": "cita breve del texto" }]
}

Reglas: escribe en español; como máximo ${reviewLimits.items} hallazgos; textos sin código, comandos ni enlaces; si no encuentras problemas, devuelve una lista vacía.

Textos originales de la persona.

Idea:
${c.idea.trim() || '(sin idea)'}

Qué debe hacer:
${c.positive.trim() || '(sin declarar)'}

Qué queda fuera:
${c.negative.trim() || '(sin declarar)'}

${documents.map(d => `=== ${d.path} ===\n${d.content}`).join('\n\n')}
`;
}
const text = (v: unknown) =>
  typeof v === 'string' &&
  v.trim().length > 0 &&
  v.length <= reviewLimits.text &&
  !validateText(v).some(d => d.blocking);
export function isReviewFindings(value: unknown, paths?: string[]): value is ReviewFinding[] {
  return (
    Array.isArray(value) &&
    value.length <= reviewLimits.items &&
    value.every(
      f =>
        !!f &&
        typeof f === 'object' &&
        Object.keys(f).every(k => keys.includes(k)) &&
        text(f.documento) &&
        (!paths || paths.includes(f.documento)) &&
        severities.includes(f.severidad) &&
        text(f.problema) &&
        text(f.evidencia),
    )
  );
}
/** Valida la respuesta pegada: tamaño, JSON, esquema, claves, documentos del kit y textos seguros. */
export function parseReviewResponse(
  raw: string,
  paths: string[],
): ReviewFinding[] | { error: string } {
  if (new TextEncoder().encode(raw).length > reviewLimits.bytes)
    return { error: 'La respuesta supera 128 KiB.' };
  let data: unknown;
  try {
    data = JSON.parse(
      raw
        .trim()
        .replace(/^```(?:json)?\s*\n?/i, '')
        .replace(/\n?```\s*$/, ''),
    );
  } catch {
    return { error: 'La respuesta no es JSON válido. Pide al revisor solo el objeto JSON.' };
  }
  if (!data || typeof data !== 'object' || Array.isArray(data))
    return { error: 'La respuesta debe ser un objeto JSON.' };
  const value = data as Record<string, unknown>;
  if (value.esquema !== reviewSchemaVersion)
    return { error: `Falta el esquema «${reviewSchemaVersion}».` };
  if (Object.keys(value).some(k => k !== 'esquema' && k !== 'hallazgos'))
    return { error: 'La respuesta solo admite «esquema» y «hallazgos».' };
  if (!isReviewFindings(value.hallazgos, paths))
    return {
      error: `Cada hallazgo necesita documento del kit, severidad (alta, media o baja), problema y evidencia, sin código ni credenciales; máximo ${reviewLimits.items}.`,
    };
  return value.hallazgos;
}
