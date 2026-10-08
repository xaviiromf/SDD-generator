import { hasProjectContent } from '../../domain/projectDefinition';
import { structuredPlan } from '../projectProjection';
import { designCss } from '../../domain/designRecipes';
import { finishLabels } from '../../catalog/designOptions';
import { literal, template } from '../../i18n/translate';
import type { Configuration } from '../../domain/models';
import { createKitContext, textSection, type KitContext } from '../kitContext';
import { documentLink } from '../references';
export function designTokens(ctx: KitContext): string {
    const d = ctx.design;
    if (!ctx.profile.visual) return 'Estética web: no aplica al destino elegido. Revisar la experiencia operativa pertinente.';
    if (!d) return 'Arquetipo y tokens: pendientes de selección.';
    const groups = { typography: 'Tipografía', colors: 'Colores', finish: 'Acabado', buttons: 'Botones', cards: 'Tarjetas', icons: 'Iconos', motion: 'Movimiento' };
    const values = { headingFont: 'Fuente de títulos', bodyFont: 'Fuente de cuerpo', monoFont: 'Fuente de código', background: 'Fondo', surface: 'Superficie', primaryAccent: 'Acento principal', secondaryAccent: 'Acento secundario', border: 'Borde', text: 'Texto', texture: 'Textura', radius: 'Radio (px)', variant: 'Variante', shadowDepth: 'Profundidad de sombra', borderWidth: 'Ancho del borde (px)', shadow: 'Sombra', density: 'Densidad', strokeWidth: 'Grosor del trazo', size: 'Tamaño (px)', preset: 'Transición' };
    const translated: Record<string,string> = { solid: 'Sólido', outline: 'Contorno', ghost: 'Discreto', none: 'Sin efecto', soft: 'Suave', hard: 'Desplazada', compact: 'Compacta', normal: 'Normal', spacious: 'Amplia', snappy: 'Rápida (100 ms)', fluid: 'Fluida (300 ms)', spring: 'Elástica (300 ms)', ...finishLabels };
    const rows = Object.entries(groups).flatMap(([g,label]) => Object.entries(d[g as keyof typeof groups]).map(([key,value]) => `| ${label} / ${values[key as keyof typeof values]} | ${translated[String(value)] ?? (value || 'Desactivado')} |`));
    return `Base: ${ctx.archetype?.name ?? 'Diseño personalizado'}\n\n| Parámetro | Valor |\n|---|---|\n${rows.join('\n')}\n\nAcabado base: ${d.baseTexture ?? 'Personalizado'}. Texto secundario: ${d.muted}.\n\nArchivo propuesto: tokens.css. Importar en la hoja de estilos; Tailwind CSS 4 consume estas variables CSS. Para Tailwind CSS 3, enlazar colores y fuentes con var(--token) en tailwind.config.ts.\n\n\`\`\`css\n${designCss(d)}\`\`\`\n`;

}
export function planTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
    const path = `${ctx.folder}/plan.md`;
    return template(ctx.config.sddLanguage)`# Plan técnico — ${textSection(c.name, ctx.config.sddLanguage)}\n\nEstado: propuesto. Sin implementación autorizada.\n\n${documentLink(path, `${ctx.folder}/spec.md`, literal('Especificación', ctx.config.sddLanguage))} · ${documentLink(path, 'docs/BASE_ARCHITECTURE.md', literal('Arquitectura', ctx.config.sddLanguage))}\n\n## Pila seleccionada\n\n${ctx.stack}\n\n## Árbol propuesto del proyecto objetivo\n\n\`\`\`text\n${ctx.config.slug}/\n${ctx.profile.paths.map(p => '  ' + p).join('\n')}\n\`\`\`\n\nEstas rutas son propuestas de implementación, no archivos de código incluidos en el kit.\n\n## Módulos y flujo\n\nFamilia: ${ctx.profile.family}. Entrada validada → lógica de dominio → persistencia elegida → respuesta y errores explícitos. Archivos de dominio: ${ctx.profile.domainFiles.join(', ')}. Persistencia: ${ctx.profile.storageFiles.join(', ')}.\n\n## Contratos\n\n${hasProjectContent(ctx.config.project) ? 'Los contratos y datos aportados figuran en el contexto declarado de este plan. Completar sus detalles pendientes antes de implementar.' : 'Entradas, entidades, permisos, endpoints y respuestas: pendientes. En destinos con servidor, autorización y validación corresponden al servidor. Django ORM requiere concretar base de datos; no equivale a un motor de persistencia.'}\n\n## Tokens de diseño\n\n${designTokens(ctx)}\n\n${hasProjectContent(ctx.config.project) ? structuredPlan(ctx) : ''}\n\n## Adaptación y accesibilidad\n\n${ctx.profile.visual ? literal('Si hay interfaz visual: móvil <768 px, tablet 768–1279 px y escritorio ≥1280 px; teclado, foco, AA y objetivos de 44 × 44 px. Revisar contraste real y proponer ajustes explícitos.', ctx.config.sddLanguage) : literal('No se exige adaptación web a este destino. Verificar ayudas, errores, teclado y límites de actuación pertinentes.', ctx.config.sddLanguage)}\n\n## Verificación propuesta\n\n${ctx.profile.checks.map(check => '- ' + check).join('\n')}\n\nHerramientas, versiones y comandos por confirmar tras inspección; nada ejecutado. No inventar evidencia.\n\n## Pendientes\n\nRevisar reglas de negocio, compatibilidades, contratos, versiones y pruebas antes de autorizar código.\n`;
}

export const designMetadata = (ctx: KitContext) => designTokens(ctx).split("\n```css")[0];
