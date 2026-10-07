import type { Selection } from '../domain/models';
export interface Preset {
    id: string;
    label: string;
    description: string;
    selections: Selection;
    variants?: {
        label: string;
        field: keyof Selection;
        options: string[];
    }[];
}
export const presets: Preset[] = [
    { id: 'web-fullstack', label: 'Web fullstack universal', description: 'Next.js 15, PostgreSQL y Prisma', selections: { platform: ['web-ssr'], architecture: ['monolith'], language: ['typescript'], runtime: ['node'], frontend: ['next'], backend: ['prisma'], styling: ['tailwind'], storage: ['postgres'], testing: ['vitest'] } },
    { id: 'client-spa', label: 'SPA reactiva en el cliente', description: 'React 19, Vite y persistencia local', selections: { platform: ['web-spa'], architecture: ['client'], language: ['typescript'], frontend: ['react'], state: ['zustand'], tooling: ['vite'], styling: ['tailwind'], storage: ['localstorage'], auth: ['public'], testing: ['vitest'] } },
    { id: 'systems-cli', label: 'CLI de sistemas de alto rendimiento', description: 'Rust, Clap y Tokio', selections: { platform: ['cli'], architecture: ['client'], language: ['rust'], runtime: ['native'], backend: ['clap', 'tokio'], storage: ['memory'], tooling: ['cargo'], deploy: ['tar'], security: ['dry-run'] } },
    { id: 'modern-api', label: 'API moderna', description: 'Python, FastAPI y PostgreSQL', selections: { platform: ['web-ssr'], architecture: ['decoupled'], language: ['python'], backend: ['fastapi', 'sqlalchemy'], security: ['pydantic'], storage: ['postgres'], testing: ['pytest'], deploy: ['docker'] } },
    { id: 'go-service', label: 'Microservicio y redes en Go', description: 'Go 1.24 con framework y base a elegir', selections: { platform: ['web-ssr'], architecture: ['microservices'], language: ['go'], runtime: ['native'], storage: ['redis'], deploy: ['docker'], testing: ['go-test'] }, variants: [{ label: 'Framework', field: 'backend', options: ['chi', 'gin'] }, { label: 'Base de datos', field: 'storage', options: ['sqlite', 'postgres'] }] },
    { id: 'editorial', label: 'Contenido editorial estático', description: 'Astro 5 y Markdown / MDX', selections: { platform: ['web-spa'], architecture: ['client'], language: ['typescript'], frontend: ['astro'], content: ['markdown', 'mdx'], styling: ['tailwind'], storage: ['fixtures'], deploy: ['github-pages'] } },
    { id: 'security-cli', label: 'Herramienta de seguridad', description: 'Python y límites de actuación explícitos', selections: { platform: ['cli'], architecture: ['local-first'], language: ['python'], backend: ['typer', 'rich', 'scapy', 'requests'], storage: ['memory'], security: ['dry-run', 'scope', 'roe', 'no-secrets'] } },
    { id: 'game-engine', label: 'Motor de juego independiente', description: 'Godot 4 o Rust Bevy', selections: { platform: ['game'], architecture: ['client'], runtime: ['native'], storage: ['memory'], integrity: ['fsm', 'delta', 'audio'] }, variants: [{ label: 'Motor', field: 'frontend', options: ['godot', 'bevy'] }] }
];
export function resolvePreset(preset: Preset, choices: Record<string, string>): Selection {
    const selections = structuredClone(preset.selections);
    for (const variant of preset.variants ?? []) {
        const value = choices[variant.field];
        if (!value || !variant.options.includes(value))
            throw new Error(`Elige ${variant.label.toLowerCase()} antes de aplicar el conjunto.`);
        selections[variant.field] = [...(selections[variant.field] ?? []), value];
        if (value === 'bevy')
            selections.language = ['rust'];
    }
    return selections;
}
