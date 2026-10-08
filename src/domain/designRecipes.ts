import { cardPadding, motionDuration, type EffectiveDesign } from './design';
import { buttonText } from './contrast';
const grain = 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'180\' height=\'180\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' opacity=\'.12\' filter=\'url(%23n)\'/%3E%3C/svg%3E")';
export function designPresentation(d: EffectiveDesign): Record<string, string> {
    let texture: string = d.finish.texture;
    if (d.baseTexture) {
        const id = d.baseArchetypeId;
        texture = id === 'a01' ? 'paper' : id === 'a02' ? 'scanlines' : id === 'a06' ? 'grain' : id === 'a10' ? 'frosted' : 'matte';
    }
    const shadow = d.cards.shadow === 'hard' ? `4px 4px 0 ${d.colors.border}` : d.cards.shadow === 'soft' ? '0 8px 24px #00000022' : 'none';
    const baseShadow: Record<string, string> = { a03: '0 8px 24px #00000012', a05: '4px 4px 0 #000000', a07: `inset 0 1px 0 color-mix(in srgb, ${d.colors.primaryAccent} 20%, transparent)`, a08: `0 0 20px color-mix(in srgb, ${d.colors.primaryAccent} 20%, transparent)`, a12: `0 0 18px color-mix(in srgb, ${d.colors.primaryAccent} 13%, transparent)`, a15: '0 8px 20px #00000033', a17: '0 8px 24px #00000022', a19: `inset 0 1px 0 color-mix(in srgb, ${d.colors.primaryAccent} 20%, transparent)` };
    return {
        '--background': d.colors.background, '--surface': d.colors.surface, '--accent': d.colors.primaryAccent, '--secondary-accent': d.colors.secondaryAccent || 'transparent', '--text': d.colors.text, '--muted': d.muted, '--border': d.colors.border,
        '--font-heading': `'${d.typography.headingFont}', sans-serif`, '--font-body': `'${d.typography.bodyFont}', sans-serif`, '--font-code': `'${d.typography.monoFont}', monospace`,
        '--radius': `${d.buttons.radius}px`, '--button-text': d.buttons.variant === 'solid' ? buttonText(d.colors.primaryAccent, d.colors.surface, d.colors.background) : d.colors.text,
        '--button-background': d.buttons.variant === 'solid' ? d.colors.primaryAccent : 'transparent', '--button-border': d.buttons.variant === 'ghost' ? 'transparent' : d.colors.primaryAccent,
        '--button-shadow': d.buttons.shadowDepth ? `0 ${d.buttons.shadowDepth * 2}px ${d.buttons.shadowDepth * 6}px #00000033` : 'none',
        '--card-border-width': `${d.cards.borderWidth}px`, '--card-padding': `${cardPadding(d.cards.density)}px`, '--card-shadow': d.baseTexture && d.cards.shadow === 'none' ? baseShadow[d.baseArchetypeId ?? ''] ?? shadow : shadow,
        '--icon-stroke': String(d.icons.strokeWidth), '--icon-size': `${d.icons.size}px`, '--motion-duration': `${motionDuration(d.motion.preset)}ms`, '--motion-curve': d.motion.preset === 'spring' ? 'cubic-bezier(.34,1.56,.64,1)' : 'ease-out',
        '--texture': texture === 'grain' || texture === 'paper' ? grain : texture === 'scanlines' ? 'repeating-linear-gradient(0deg,transparent 0 2px,#00000022 2px 3px)' : texture === 'mesh' ? `radial-gradient(at 10% 20%,color-mix(in srgb, ${d.colors.primaryAccent} 20%, transparent),transparent 60%),radial-gradient(at 90% 80%,color-mix(in srgb, ${d.colors.secondaryAccent || d.colors.primaryAccent} 13%, transparent),transparent 60%)` : d.baseArchetypeId === 'a16' && d.baseTexture ? 'repeating-linear-gradient(90deg,transparent 0 31px,#88888811 31px 32px)' : 'none',
        '--surface-blur': texture === 'frosted' ? 'blur(24px)' : 'none',
    };
}
export function designCss(d: EffectiveDesign): string {
    return `/* Parámetros de diseño. Fuentes locales; sin recursos externos. */\n:root {\n${Object.entries(designPresentation(d)).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}\n.sdd-muestra { background: var(--background); color: var(--text); font-family: var(--font-body); background-image: var(--texture); }\n.sdd-muestra h2 { font-family: var(--font-heading); }\n.sdd-muestra code { font-family: var(--font-code); }\n.sdd-tarjeta { border-radius: var(--radius); background: var(--surface); border: var(--card-border-width) solid var(--border); padding: var(--card-padding); box-shadow: var(--card-shadow); backdrop-filter: var(--surface-blur); }\n.sdd-boton { border: 1px solid var(--button-border); color: var(--button-text); background: var(--button-background); border-radius: var(--radius); box-shadow: var(--button-shadow); transition: transform var(--motion-duration) var(--motion-curve), filter var(--motion-duration) var(--motion-curve); min-height: 44px; }\n.sdd-boton:hover, .sdd-boton[data-state="hover"] { filter: brightness(1.08); }\n.sdd-boton:active, .sdd-boton[data-state="active"] { transform: translateY(1px); }\n.sdd-muestra svg { width: var(--icon-size); height: var(--icon-size); stroke-width: var(--icon-stroke); }\n.sdd-boton:focus-visible { outline: 2px solid var(--text); outline-offset: 3px; }\n@supports not (backdrop-filter: blur(1px)) { .sdd-tarjeta { border-radius: var(--radius); background: var(--background); } }\n@media (prefers-reduced-motion: reduce) { .sdd-muestra { --motion-duration: 0ms; } }\n`;
}
