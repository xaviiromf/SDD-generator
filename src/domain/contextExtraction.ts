import type { ContextKind, ProjectDefinition } from './projectDefinition';
/** Propuesta local de contexto: nunca se escribe sola en el modelo. */
export interface ContextProposal {
  kind: Extract<ContextKind, 'actors' | 'entities' | 'exclusions'>;
  text: string;
  evidence: string;
}
const key = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase('es') + text.slice(1);
const word = '[\\p{L}][\\p{L}\\p{N}-]*';
// Verbos de acción de una persona o un dispositivo, en tercera persona.
const actorVerbs =
  'puede|pueden|debe|deben|registra|registran|crea|crean|consulta|consultan|cancela|cancelan|gestiona|gestionan|revisa|revisan|aprueba|aprueban|descarga|descargan|guarda|guardan|sube|suben|envía|envían|solicita|solicitan|reserva|reservan|marca|marcan|ve|ven|accede|acceden|usa|usan|utiliza|utilizan|aporta|aportan|publica|publican|lee|leen|edita|editan|elimina|eliminan|exporta|exportan|importa|importan|inicia|inician|atiende|atienden|firma|firman|valida|validan';
const notActors = new Set(
  'aplicación app api servicio sistema proceso plataforma herramienta archivo fichero pedido reserva simulación lectura fila filas registro dato datos saldo resultado cli pwa web interfaz pantalla página módulo base función usuario-final'
    .split(' ')
    .map(key),
);
const actorPattern = new RegExp(
  `(?:^|[.;:,]\\s*|\\s)(?:el|la|los|las|cada|un|una)\\s+(${word}(?:\\s+${word})?)\\s+(?:${actorVerbs})\\b`,
  'giu',
);
const entityVerbs =
  'crear|crea|crean|registrar|registra|registran|consultar|consulta|consultan|cancelar|cancela|cancelan|editar|edita|editan|eliminar|elimina|eliminan|gestionar|gestiona|gestionan|guardar|guarda|guardan|listar|lista|listan|reservar|reserva|reservan|marcar|marca|marcan|exportar|exporta|exportan|importar|importa|importan|descargar|descarga|descargan|actualizar|actualiza|actualizan|mover|mueve|mueven|leer|lee|leen|publicar|publica|publican|clasificar|clasifica|clasifican|prestar|presta|prestan';
const skip = new Set(
  'el la los las un una unos unas sus su mis tus de del y e o u ni a al con para por en se no todos todas cada nuevos nuevas nuevo nueva solo sólo solamente también'
    .split(' ')
    .map(key),
);
const notEntities = new Set(
  'datos información cosas elementos contenido forma manera vez'.split(' ').map(key),
);
const entityVerbSet = new Set(entityVerbs.split('|').map(key));
/** Singular aproximado en español para nombres de entidad. */
export function singular(noun: string): string {
  if (/ciones$/i.test(noun)) return noun.replace(/ciones$/i, 'ción');
  if (/ces$/i.test(noun)) return noun.replace(/ces$/i, 'z');
  if (/[dlnrjy]es$/i.test(noun)) return noun.slice(0, -2);
  if (/s$/i.test(noun) && noun.length > 3) return noun.slice(0, -1);
  return noun;
}
const exclusionPattern =
  /\bno\s+(?:incluir|incluye|usar|utilizar|añadir|agregar|implementar|contemplar|requiere|cubrir|crear|generar|desarrollar)\s+([^.;\n]+)/giu;
const determiners = new Set('el la los las un una unos unas su sus'.split(' '));
/**
 * Propone actores, entidades y exclusiones a partir de la idea y el alcance. Heurísticas locales y
 * conservadoras: omiten lo que ya existe en el contexto y nunca inventan reglas.
 */
export function extractContext(
  input: { idea: string; positive: string; negative: string },
  project?: Pick<ProjectDefinition, 'context'>,
): ContextProposal[] {
  const proposals: ContextProposal[] = [];
  const seen = new Set<string>();
  const existing = (kind: ContextProposal['kind']) =>
    (project?.context[kind] ?? []).filter(i => i.status !== 'descartado').map(i => key(i.text));
  const add = (kind: ContextProposal['kind'], text: string, evidence: string) => {
    const normalized = key(text);
    if (normalized.length < 3 || seen.has(`${kind}:${normalized}`)) return;
    if (existing(kind).some(e => e.includes(normalized) || normalized.includes(e))) return;
    seen.add(`${kind}:${normalized}`);
    proposals.push({
      kind,
      text: capitalize(text.trim()),
      evidence: evidence
        .replace(/^[\s.;:,]+/u, '')
        .trim()
        .slice(0, 160),
    });
  };
  const text = `${input.idea}\n${input.positive}`;
  for (const match of text.matchAll(actorPattern)) {
    const phrase = match[1];
    const words = phrase.split(/\s+/).map(key);
    if (notActors.has(words[0]) || words.some(w => skip.has(w))) continue;
    add('actors', phrase, match[0]);
  }
  const tokens = [...text.matchAll(new RegExp(`${word}|[.;:\\n]`, 'gu'))].map(m => m[0]);
  for (let i = 0; i < tokens.length; i++) {
    const before = key(tokens[i - 1] ?? '');
    // Tras un determinante es sustantivo («una reserva»); tras «se» o «no» no introduce objeto.
    if (
      !entityVerbSet.has(key(tokens[i])) ||
      determiners.has(before) ||
      before === 'se' ||
      before === 'no'
    )
      continue;
    for (let j = i + 1; j < tokens.length && j < i + 8; j++) {
      const token = key(tokens[j]);
      if (/^[.;:\n]$/.test(tokens[j])) break;
      const noun = determiners.has(key(tokens[j - 1])) && entityVerbSet.has(token);
      if (!noun && (skip.has(token) || entityVerbSet.has(token))) continue;
      if (!notEntities.has(token) && token.length > 2)
        add(
          'entities',
          singular(tokens[j].toLocaleLowerCase('es')),
          tokens.slice(i, j + 1).join(' '),
        );
      break;
    }
  }
  for (const match of input.idea.matchAll(exclusionPattern))
    for (const item of match[1].split(/,|\s+ni\s+|\s+y\s+/u)) {
      const cleaned = item.trim().replace(/^(?:el|la|los|las|un|una|unos|unas)\s+/iu, '');
      if (cleaned) add('exclusions', cleaned, match[0]);
    }
  for (const line of input.negative.split('\n')) if (line.trim()) add('exclusions', line, line);
  return proposals;
}
