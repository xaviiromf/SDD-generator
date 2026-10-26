import { structuredPlan } from '../projectProjection';
import { designCss } from '../../domain/designRecipes';
import { finishLabels } from '../../catalog/designOptions';
import type { Configuration } from '../../domain/models';
import { createKitContext, textSection, type KitContext } from '../kitContext';
import { documentLink } from '../references';
import { catalogReviewedAt } from '../../catalog/review';
export function designTokens(ctx: KitContext): string {
  const d = ctx.design;
  if (!ctx.profile.visual)
    return 'Estética web: no aplica al destino elegido. Revisar la experiencia operativa pertinente.';
  if (!d) return 'Arquetipo y tokens: pendientes de selección.';
  const groups = {
    typography: 'Tipografía',
    colors: 'Colores',
    finish: 'Acabado',
    buttons: 'Botones',
    cards: 'Tarjetas',
    icons: 'Iconos',
    motion: 'Movimiento',
  };
  const values = {
    headingFont: 'Fuente de títulos',
    bodyFont: 'Fuente de cuerpo',
    monoFont: 'Fuente de código',
    background: 'Fondo',
    surface: 'Superficie',
    primaryAccent: 'Acento principal',
    secondaryAccent: 'Acento secundario',
    border: 'Borde',
    text: 'Texto',
    texture: 'Textura',
    radius: 'Radio (px)',
    variant: 'Variante',
    shadowDepth: 'Profundidad de sombra',
    borderWidth: 'Ancho del borde (px)',
    shadow: 'Sombra',
    density: 'Densidad',
    strokeWidth: 'Grosor del trazo',
    size: 'Tamaño (px)',
    preset: 'Transición',
  };
  const translated: Record<string, string> = {
    solid: 'Sólido',
    outline: 'Contorno',
    ghost: 'Discreto',
    none: 'Sin efecto',
    soft: 'Suave',
    hard: 'Desplazada',
    compact: 'Compacta',
    normal: 'Normal',
    spacious: 'Amplia',
    snappy: 'Rápida (100 ms)',
    fluid: 'Fluida (300 ms)',
    spring: 'Elástica (300 ms)',
    ...finishLabels,
  };
  const rows = Object.entries(groups).flatMap(([g, label]) =>
    Object.entries(d[g as keyof typeof groups]).map(
      ([key, value]) =>
        `| ${label} / ${values[key as keyof typeof values]} | ${translated[String(value)] ?? (value || 'Desactivado')} |`,
    ),
  );
  return `Base: ${ctx.archetype?.name ?? 'Diseño personalizado'}\n\n| Parámetro | Valor |\n|---|---|\n${rows.join('\n')}\n\nAcabado base: ${d.baseTexture ?? 'Personalizado'}. Texto secundario: ${d.muted}.\n\nArchivo propuesto: tokens.css. Importar en la hoja de estilos; Tailwind CSS 4 consume estas variables CSS. Para Tailwind CSS 3, enlazar colores y fuentes con var(--token) en tailwind.config.ts.\n\n\`\`\`css\n${designCss(d)}\`\`\`\n`;
}
export function planTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
  const path = `${ctx.folder}/plan.md`;
  return `# Plan técnico — ${textSection(c.name)}

Estado: propuesto. Sin implementación autorizada.

${documentLink(path, `${ctx.folder}/spec.md`, 'Especificación')} · ${documentLink(path, `${ctx.folder}/tasks.md`, 'Tareas')}

## Pila seleccionada

${ctx.stack}

El catálogo de SDD-Studio se revisó el ${catalogReviewedAt}; las versiones citadas pueden haber cambiado: verifícalas en las fuentes oficiales.

## Contratos y fronteras

Entradas, entidades, permisos, endpoints y respuestas de cada RF: completar tras inspeccionar el repositorio. En destinos con servidor, la autorización y la validación corresponden al servidor.

${structuredPlan(ctx)}

## Tokens de diseño

${designTokens(ctx)}

## Adaptación y accesibilidad

${ctx.profile.visual ? 'Si hay interfaz visual: móvil <768 px, tablet 768–1279 px y escritorio ≥1280 px; teclado, foco, AA y objetivos de 44 × 44 px. Revisar contraste real y proponer ajustes explícitos.' : 'No se exige adaptación web a este destino. Verificar ayudas, errores, teclado y límites de actuación pertinentes.'}

## Propuesta del generador (no verificada)

Todo lo de esta sección sale de una receta del generador para la familia «${ctx.profile.family}». No describe el repositorio destino: el agente la contrasta tras inspeccionarlo y registra las diferencias como decisiones.

Árbol candidato:

\`\`\`text
${ctx.config.slug}/
${ctx.profile.paths.map(p => '  ' + p).join('\n')}
\`\`\`

Rutas candidatas de dominio: ${ctx.profile.domainFiles.join(', ')}. Persistencia candidata: ${ctx.profile.storageFiles.join(', ')}.

Comprobaciones candidatas, ninguna ejecutada:

${ctx.profile.checks.map(check => '- ' + check).join('\n')}
`;
}

export const designMetadata = (ctx: KitContext) => designTokens(ctx).split('\n```css')[0];
