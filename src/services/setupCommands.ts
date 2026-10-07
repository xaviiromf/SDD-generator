import type { Configuration } from '../domain/models';
export function setupCommands(c: Configuration): string {
    if (!/^[a-z0-9](?:[a-z0-9-]{0,62}[a-z0-9])?$/.test(c.slug))
        throw new Error('Corrige el identificador antes de copiar comandos.');
    const slug = c.slug;
    const languages = c.selections.language ?? [];
    if (languages.includes('rust'))
        return `cargo new --bin ${slug}\ncd ${slug}\ncargo test`;
    if (languages.includes('python'))
        return c.selections.tooling?.includes('uv') ? `uv init ${slug}\ncd ${slug}\nuv run python --version` : `mkdir ${slug}\ncd ${slug}\npython -m venv .venv\n# Activa el entorno según tu sistema operativo antes de instalar dependencias.`;
    if (languages.includes('go'))
        return `mkdir ${slug}\ncd ${slug}\n# Define primero la ruta de módulo aprobada; después ejecuta go mod init.\ngo version`;
    if (c.selections.frontend?.includes('godot'))
        return '# Crea un proyecto Godot 4 desde el gestor y revisa las tareas antes de escribir scripts.';
    const frontend = c.selections.frontend?.[0];
    if (frontend === 'next')
        return `npx create-next-app@15 ${slug} --ts\ncd ${slug}`;
    if (frontend === 'astro')
        return `npm create astro@5 -- ${slug}\ncd ${slug}`;
    const template = frontend === 'vue' ? 'vue-ts' : frontend === 'svelte' ? 'svelte-ts' : frontend === 'vanilla' ? 'vanilla-ts' : 'react-ts';
    const manager = c.selections.tooling?.includes('pnpm') ? 'pnpm' : c.selections.runtime?.includes('bun') ? 'bun' : 'npm';
    return `${manager === 'npm' ? 'npm create vite@latest --' : manager + ' create vite'} ${slug} --template ${template}\ncd ${slug}\n${manager} install\n# Revisa la versión y el plan antes de implementar.`;
}
