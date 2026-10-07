import type { Archetype } from '../catalog/archetypes';
export type TokenFormat = 'css' | 'json' | 'tailwind';
export function exportTokens(a: Archetype, format: TokenFormat): {
    filename: string;
    content: string;
} {
    const colors = { background: a.background, surface: a.surface, accent: a.accent, text: a.foreground, muted: a.muted, border: a.border };
    const css = ':root {\n' + Object.entries(colors).map(([key, value]) => `  --${key}: ${value};`).join('\n') + `\n  --font-heading: '${a.heading}';\n  --font-body: '${a.body}';\n  --radius: ${a.radius}px;\n}\n`;
    if (format === 'css')
        return { filename: 'tokens.css', content: css };
    if (format === 'json')
        return { filename: 'tokens.json', content: JSON.stringify({ nombre: a.name, colores: colors, tipografia: { titulos: a.heading, cuerpo: a.body }, radio: a.radius, acabado: a.texture }, null, 2) };
    return { filename: 'tailwind.config.ts', content: `// Perfil de configuración para Tailwind CSS 3. Importar tokens.css en los estilos.\nexport default { content: ['./src/**/*.{ts,tsx,html}'], theme: { extend: { colors: ${JSON.stringify(Object.fromEntries(Object.keys(colors).map(key => [key, `var(--${key})`])), null, 2)}, fontFamily: { heading: [${JSON.stringify(a.heading)}], body: [${JSON.stringify(a.body)}] }, borderRadius: { theme: '${a.radius}px' } } } };\n` };
}
