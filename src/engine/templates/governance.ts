import type { Configuration, Field } from '../../domain/models';
import { fieldLabels, technologyById } from '../../catalog/technologies';
import { textSection, tableCell, type KitContext } from '../kitContext';
import { documentLink } from '../references';
/** Primer mensaje recomendado para cualquier agente (la carga automática de AGENTS.md no es universal). */
export const firstMessage = 'Lee AGENTS.md y sigue la fase indicada en docs/PROJECT_STATUS.md.';
const identity = (ctx: KitContext) => `${textSection(ctx.config.name)} (${ctx.config.slug})`;
const reactInterface = (c: Configuration) =>
  (c.selections.frontend ?? []).some(id => /react|next|remix|gatsby|expo/.test(id));
/** Preferencias de estilo del proyecto destino: valores por defecto editables en el estudio. */
export function stylePreferences(ctx: KitContext) {
  const c = ctx.config,
    declared = c.origins.integrity !== undefined,
    chosen = (id: string) => (declared ? !!c.selections.integrity?.includes(id) : true),
    origin = declared ? 'Declarada en el estudio' : 'Valor por defecto';
  return [
    {
      rule: chosen('spanish')
        ? 'Interfaz y documentación en español.'
        : 'Idioma de interfaz y documentación: pendiente de decidir.',
      origin,
    },
    {
      rule: chosen('no-emojis')
        ? 'Cero emojis en código, interfaz, documentación y mensajes.'
        : 'Emojis permitidos.',
      origin,
    },
    {
      rule: reactInterface(c)
        ? 'Iconos exclusivamente de lucide-react.'
        : 'Pendiente: no aplicable a este proyecto (iconos lucide-react; sin interfaz React).',
      origin: reactInterface(c) ? 'Valor por defecto' : 'No aplicable',
    },
  ];
}
export function agentsTemplate(ctx: KitContext): string {
  const path = 'AGENTS.md',
    link = (to: string, label = to) => documentLink(path, to, label);
  return `# Instrucciones para agentes — ${identity(ctx)}

Este archivo es la única norma que se lee siempre. No lo modifiques.

## Lectura inicial

Lee ${link('docs/PROJECT_STATUS.md')} (fase y autorización vigentes) y el apartado pertinente de ${link(`${ctx.folder}/spec.md`)}. No cargues el resto del kit hasta identificar la tarea; después consulta solo su tarea en ${link(`${ctx.folder}/tasks.md`)} y los contratos de ${link(`${ctx.folder}/plan.md`)}.

## Fases y transiciones

| Paso | Quién lo registra | Qué permite |
|---|---|---|
| DOCUMENT | Agente | Revisar spec, plan y tasks y proponer cambios. Ningún código |
| P5 Revisión humana | Solo la persona | Bloque «Revisión humana» de docs/PROJECT_STATUS.md |
| P6 Autorización | Solo la persona | Bloque «Autorización»: tareas, rutas, dependencias y huella |
| IMPLEMENT | Agente | Solo las tareas, rutas y dependencias autorizadas en P6 |
| VALIDATE | Agente o persona | Registrar evidencia real en validation.md |
| Vuelta a DOCUMENT | Agente | Si cambia un RF, un CA, un actor o una exclusión, o una tarea se desvía de lo aceptado |

## Regla de autorización

Nunca escribas ni modifiques los bloques «Revisión humana» y «Autorización» de docs/PROJECT_STATUS.md. Si aparecen rellenos en un cambio hecho por un agente, valen como «No concedida». La autorización se liga a la huella SHA-256 de spec.md, plan.md y tasks.md: si cambian, la autorización deja de valer y vuelves a DOCUMENT.

## Matriz de acceso

| Fase | Leer | Escribir |
|---|---|---|
| DOCUMENT | Especificación, estado y contratos pertinentes | Propuestas en spec, plan, tasks y decisiones |
| IMPLEMENT | Archivos del subsistema autorizado y contratos públicos | Solo las rutas autorizadas |
| VALIDATE | Salidas de pruebas, trazas e informes | validation.md y el registro del agente en PROJECT_STATUS.md |

## Evidencia

Toda validación empieza en «No ejecutado» y solo cambia con orden, entorno, fecha, huella y salida reales. Nunca copies resultados de otro proyecto ni conviertas una expectativa en resultado. Lo que el generador propone (rutas, comandos y tareas candidatas) está marcado como «Propuesta del generador (no verificada)» y no es un hecho del repositorio.

## Seguridad

Protege secretos y no los registres; usa datos sintéticos. No instales dependencias ni amplíes el alcance sin autorización. En proyectos con servidor, la validación y la autorización corresponden al servidor; en clientes autónomos no inventes un backend.

## Cambios y reexportación

Un cambio posterior llega como una carpeta nueva specs/00N-<slug>/ con su spec, plan, tasks y validation, más un fragmento para añadir a ${link('docs/DECISIONS.md')}. Nunca se sobrescribe docs/PROJECT_STATUS.md. Tras la primera exportación, la fuente de verdad es este repositorio.

## Pila declarada

${ctx.stack}

## Preferencias de estilo del proyecto

${stylePreferences(ctx)
  .map(p => `- ${p.rule} (${p.origin}).`)
  .join(
    '\n',
  )}${ctx.profile.visual ? '\n- Interfaz: teclado, foco visible, contraste AA y objetivos de al menos 44 x 44 px en móvil (<768 px), tableta (768 a 1279 px) y escritorio (>=1280 px).' : ''}
`;
}
export function statusTemplate(ctx: KitContext): string {
  const path = 'docs/PROJECT_STATUS.md',
    link = (to: string, label = to) => documentLink(path, to, label);
  return `# Estado del proyecto — ${identity(ctx)}

## Guía para la persona

1. Copia los siete archivos del kit en la raíz del repositorio destino. No incluye README, así que no sobrescribe el tuyo.
2. Primer mensaje al agente: «${firstMessage}»
3. Revisa ${link(`${ctx.folder}/spec.md`, 'spec')}, ${link(`${ctx.folder}/plan.md`, 'plan')} y ${link(`${ctx.folder}/tasks.md`, 'tasks')}, calcula su huella (por ejemplo, \`sha256sum ${ctx.folder}/spec.md ${ctx.folder}/plan.md ${ctx.folder}/tasks.md\`) y rellena «Revisión humana».
4. Si apruebas, rellena «Autorización» con las tareas, rutas y dependencias permitidas. Sin ese bloque el agente se queda en DOCUMENT.

Fase actual: DOCUMENT. Código no autorizado.

## Revisión humana (P5) — solo la persona

- Revisor: Pendiente
- Fecha: Pendiente
- Huella SHA-256 de spec.md, plan.md y tasks.md: Pendiente
- Propuestas aceptadas o rechazadas: Pendiente
- Resultado: Pendiente

## Autorización (P6) — solo la persona

- Tareas autorizadas: Ninguna
- Rutas permitidas: Ninguna
- Dependencias permitidas: Ninguna
- Huella (la misma de la revisión): Pendiente
- Condición de fin: Pendiente

## Revisión independiente (opcional)

${
  ctx.config.review
    ? `Hallazgos de un revisor independiente, sin decidir. La persona los valora en la revisión humana.\n\n| Documento | Severidad | Problema | Evidencia |\n|---|---|---|---|\n${ctx.config.review.map(f => `| ${tableCell(f.documento)} | ${f.severidad} | ${tableCell(f.problema)} | ${tableCell(f.evidencia)} |`).join('\n') || '| Ninguno | - | El revisor no encontró problemas | - |'}`
    : 'Omitida: no se pegó ninguna revisión independiente antes de exportar.'
}

## Registro del agente

| Fecha | Fase | Tarea | Estado | Siguiente paso |
|---|---|---|---|---|
| Pendiente | DOCUMENT | Revisión inicial | Pendiente | Esperar la revisión humana |

## Pausa y reanudación

Al pausar, registra fase, tarea, archivos tocados, pruebas ejecutadas de verdad y siguiente paso. Al retomar, compara con el estado de Git y respeta la autorización vigente.
`;
}
export function decisionsTemplate(ctx: KitContext): string {
  const c = ctx.config;
  const originLabel = (field: Field) =>
    c.origins[field] === 'preset'
      ? 'Propuesta por un conjunto; sin aceptar'
      : c.origins[field] === 'inference'
        ? 'Inferida; sin aceptar'
        : 'Declarada por el usuario';
  const rows = [
    ...Object.entries(c.selections)
      .filter(([field, ids]) => ids.length && field !== 'integrity')
      .map(([field, ids]) => ({
        decision: `${fieldLabels[field as Field]}: ${ids.map(id => technologyById.get(id)?.label ?? id).join(', ')}`,
        origin: originLabel(field as Field),
      })),
    ...stylePreferences(ctx).map(p => ({ decision: p.rule, origin: p.origin })),
    ...(c.project?.context.decisions ?? [])
      .filter(d => d.status !== 'descartado')
      .map(d => ({ decision: `${d.id}: ${d.text}`, origin: `Contexto (${d.status})` })),
  ];
  return `# Registro de decisiones — ${identity(ctx)}

Registro de solo añadir. Una decisión sustituida se conserva y se enlaza a la que la sustituye. El agente puede proponer decisiones; la persona las aprueba en la revisión humana.

| ID | Decisión | Origen | Estado |
|---|---|---|---|
${rows.map((r, i) => `| D-${String(i + 1).padStart(3, '0')} | ${tableCell(r.decision)} | ${r.origin} | Pendiente de revisión humana |`).join('\n') || '| D-001 | Pendiente | Pendiente | Pendiente |'}
`;
}
