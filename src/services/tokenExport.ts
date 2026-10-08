import type { Locale } from '../i18n/translate';
import type { Archetype } from '../catalog/archetypes';
import { resolveDesign, type EffectiveDesign } from '../domain/design';
import { designCss, designPresentation } from '../domain/designRecipes';
export type TokenFormat = 'css' | 'json' | 'tailwind';
export function exportTokens(input: Archetype | EffectiveDesign, format: TokenFormat, locale: Locale = 'es', tailwindVersion: 3 | 4 = 3): { filename: string; content: string } {
    void locale; // Compatibilidad con llamadas antiguas; salida siempre española.
    const d = 'typography' in input ? input : resolveDesign({ selections: { archetype: [input.id] } })!;
    const css = designCss(d);
    if (format === 'css' || format === 'tailwind' && tailwindVersion === 4) return { filename: 'tokens.css', content: css };
    if (format === 'json') return { filename: 'tokens.json', content: JSON.stringify({ nombre: 'typography' in input ? 'Diseño personalizado' : input.name, colores: d.colors, tipografia: { titulos: d.typography.headingFont, cuerpo: d.typography.bodyFont, codigo: d.typography.monoFont }, botones: d.buttons, tarjetas: d.cards, iconos: d.icons, movimiento: d.motion, acabado: d.baseTexture ?? d.finish.texture, variables: designPresentation(d), recetasCSS: css }, null, 2) };
    return { filename: 'tailwind.config.ts', content: `// Perfil de configuración para Tailwind CSS 3. Guardar e importar el bloque tokens.css incluido abajo.\nexport default { content: ['./src/**/*.{ts,tsx,html}'], theme: { extend: { colors: { fondo: 'var(--background)', superficie: 'var(--surface)', principal: 'var(--accent)', secundario: 'var(--secondary-accent)', texto: 'var(--text)', borde: 'var(--border)' }, fontFamily: { titulos: [${JSON.stringify(d.typography.headingFont)}], cuerpo: [${JSON.stringify(d.typography.bodyFont)}], codigo: [${JSON.stringify(d.typography.monoFont)}] }, borderRadius: { tema: 'var(--radius)' }, transitionDuration: { tema: 'var(--motion-duration)' } } } };\n/* tokens.css\n${css.replaceAll('/*', '').replaceAll('*/', '')}*/\n` };
}
