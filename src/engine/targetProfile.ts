import { literal, template } from '../i18n/translate';
import type { Configuration } from '../domain/models';
import { styleApplies, webPlatforms } from '../domain/compatibility';
import { validSlug } from './kitManifest';
export interface TargetProfile {
    family: string;
    paths: string[];
    domainFiles: string[];
    storageFiles: string[];
    visual: boolean;
    checks: string[];
    setup: string;
}
export function targetProfile(c: Configuration): TargetProfile {
    if (c.project?.implementationRequired === false) return {family:'Proceso documental sin software',paths:['docs/OPERACION.md'],domainFiles:['docs/OPERACION.md'],storageFiles:[],visual:false,checks:['Revisar criterios y evidencia del proceso con el responsable.'],setup:'# No aplica preparación de código a este trabajo documental.'};
    const languages = c.selections.language ?? [];
    const frontend = c.selections.frontend?.[0];
    const platform = c.selections.platform?.[0];
    const django = c.selections.backend?.includes('django');
    const paths = ['README.md', '.env.example'];
    let family = literal('Destino por concretar', c.sddLanguage);
    let domainFiles = ['src/'];
    let storageFiles = ['src/'];
    let checks = [literal('Definir comandos de construcción y pruebas después de inspeccionar el destino.', c.sddLanguage)];
    let setup = literal('# No hay una receta aprobada para esta combinación. Revisa el plan y define la herramienta antes de preparar código.', c.sddLanguage);
    const slug = validSlug(c.slug) ? c.slug : 'identificador-pendiente';
    if (django) {
        family = 'Django';
        paths.push('pyproject.toml', 'manage.py', 'config/settings.py', 'config/urls.py', 'config/asgi.py', 'config/wsgi.py', 'apps/core/models.py', 'apps/core/views.py', 'apps/core/migrations/', 'tests/test_core.py');
        domainFiles = ['apps/core/views.py', 'apps/core/models.py'];
        storageFiles = ['apps/core/models.py', 'apps/core/migrations/', 'config/settings.py'];
        if (frontend === 'django-templates') paths.push('templates/', 'static/');
        if (c.selections.api?.includes('django-rest-framework')) { paths.push('apps/core/serializers.py', 'apps/core/api/views.py', 'apps/core/api/urls.py'); domainFiles.push('apps/core/api/views.py'); }
        if (c.selections.api?.includes('django-ninja')) { paths.push('config/api.py', 'apps/core/api/schemas.py', 'apps/core/api/router.py'); domainFiles.push('apps/core/api/router.py'); }
        if (c.selections.addons?.includes('django-channels')) paths.push('apps/core/consumers.py', 'apps/core/routing.py');
        if (c.selections.addons?.includes('django-celery')) paths.push('config/celery.py', 'apps/core/tasks.py');
        checks = ['python manage.py check', c.selections.testing?.includes('pytest-django') || c.selections.testing?.includes('pytest') ? 'python -m pytest' : 'python manage.py test'];
        setup = c.selections.tooling?.includes('uv') ? template(c.sddLanguage)`uv init ${slug}\ncd ${slug}\n# Revisa versiones y autoriza instalar Django antes de definir config y apps.` : template(c.sddLanguage)`mkdir ${slug}\ncd ${slug}\npython -m venv .venv\n# Activa el entorno y revisa las versiones del plan antes de instalar Django.`;
    } else if (['tauri', 'electron', 'flutter', 'flutter-desktop', 'qt', 'slint', 'react-native', 'expo', 'swiftui', 'compose', 'godot'].includes(frontend ?? '') || ['game', 'esp32', 'arduino', 'arm', 'raspberry-pi', 'android', 'ios', 'mobile', 'desktop'].includes(platform ?? '')) {
        family = literal('Aplicación nativa / especializada', c.sddLanguage);
        if (frontend === 'tauri') { paths.push('package.json', 'src/main.tsx', 'src-tauri/Cargo.toml', 'src-tauri/src/main.rs', 'tests/'); domainFiles = ['src-tauri/src/main.rs', 'src/main.tsx']; }
        else if (frontend === 'bevy') { family = 'Rust / Bevy'; paths.push('Cargo.toml', 'src/main.rs', 'assets/', 'tests/'); domainFiles = ['src/main.rs']; checks = ['cargo check', 'cargo test']; }
        else if (frontend === 'godot' || (platform === 'game' && !frontend)) { paths.push('project.godot', 'scenes/', 'scripts/', 'audio/', 'tests/'); domainFiles = ['scripts/', 'scenes/']; setup = literal('# Crea el proyecto desde el gestor Godot y revisa las tareas antes de implementar.', c.sddLanguage); }
        else { paths.push('src/', 'tests/'); checks = [literal('Concretar el toolchain seleccionado y las pruebas específicas del dispositivo.', c.sddLanguage)]; }
    } else if (languages.includes('python')) {
        family = 'Python'; paths.push('pyproject.toml', 'src/main.py', 'src/domain/', 'tests/test_main.py'); domainFiles = ['src/main.py', 'src/domain/'];
        if (c.selections.backend?.length) paths.push('src/api/');
        checks = c.selections.testing?.includes('pytest') ? ['python -m pytest'] : [literal('Definir pruebas para el framework Python seleccionado.', c.sddLanguage)];
        setup = c.selections.tooling?.includes('uv') ? `uv init ${slug}\ncd ${slug}\nuv run python --version` : template(c.sddLanguage)`mkdir ${slug}\ncd ${slug}\npython -m venv .venv\n# Activa el entorno según tu sistema antes de instalar dependencias.`;
    } else if (languages.includes('rust')) {
        family = 'Rust'; paths.push('Cargo.toml', 'src/main.rs', 'tests/integration.rs'); domainFiles = ['src/main.rs']; checks = ['cargo check', 'cargo test']; setup = `cargo new --bin ${slug}\ncd ${slug}\ncargo test`;
    } else if (languages.includes('go')) {
        family = 'Go'; paths.push('go.mod', 'cmd/main.go', 'internal/app/', 'internal/app/app_test.go'); domainFiles = ['cmd/main.go', 'internal/app/']; checks = ['go test ./...']; setup = template(c.sddLanguage)`mkdir ${slug}\ncd ${slug}\n# Define la ruta de módulo aprobada antes de go mod init.\ngo version`;
    } else if (webPlatforms.includes(platform ?? '') || ['react', 'react18', 'vue', 'svelte', 'next', 'nuxt', 'sveltekit', 'astro', 'vanilla'].includes(frontend ?? '')) {
        family = 'Web'; paths.push('package.json', 'tests/');
        if (frontend === 'next') { paths.push('app/page.tsx', 'app/layout.tsx'); domainFiles = ['app/page.tsx']; setup = `npx create-next-app@15 ${slug} --ts\ncd ${slug}`; }
        else if (frontend === 'astro') { paths.push('src/pages/index.astro'); domainFiles = ['src/pages/index.astro']; setup = `npm create astro@5 -- ${slug}\ncd ${slug}`; }
        else if (frontend === 'nuxt') { paths.push('app.vue', 'pages/'); domainFiles = ['app.vue', 'pages/']; }
        else if (frontend === 'sveltekit') { paths.push('src/routes/+page.svelte'); domainFiles = ['src/routes/+page.svelte']; }
        else if (['react', 'react18', 'vue', 'svelte', 'vanilla'].includes(frontend ?? '')) {
            const entry = frontend === 'vue' ? 'src/App.vue' : frontend === 'svelte' ? 'src/App.svelte' : frontend === 'vanilla' ? 'src/main.js' : 'src/main.tsx';
            paths.push(entry, 'src/components/', 'src/styles/tokens.css'); domainFiles = [entry, 'src/components/'];
            const viteTemplate = frontend === 'vue' ? 'vue-ts' : frontend === 'svelte' ? 'svelte-ts' : frontend === 'vanilla' ? 'vanilla' : 'react-ts';
            const manager = c.selections.tooling?.includes('pnpm') ? 'pnpm' : c.selections.runtime?.includes('bun') ? 'bun' : 'npm';
            setup = template(c.sddLanguage)`${manager === 'npm' ? 'npm create vite@latest --' : manager + ' create vite'} ${slug} --template ${viteTemplate}\ncd ${slug}\n${manager} install\n# Revisa la versión y el plan antes de implementar.`;
        } else { paths.push('src/'); domainFiles = ['src/']; }
        checks = [literal('Definir scripts de análisis, construcción y pruebas en package.json conforme al framework elegido.', c.sddLanguage)];
        if (c.selections.backend?.length) paths.push('src/api/', 'src/domain/');
    } else { paths.push('src/', 'tests/'); }
    const webEntries: Record<string, string[]> = { react: ['src/main.tsx', 'src/components/'], react18: ['src/main.tsx', 'src/components/'], vue: ['src/App.vue', 'src/components/'], svelte: ['src/App.svelte'], vanilla: ['src/main.js'], next: ['app/page.tsx', 'app/layout.tsx'], nuxt: ['app.vue', 'pages/'], sveltekit: ['src/routes/+page.svelte'], astro: ['src/pages/index.astro'] };
    if (family !== 'Web' && webPlatforms.includes(platform ?? '') && frontend && webEntries[frontend]) {
        const frontendPaths = ['package.json', ...webEntries[frontend], 'src/styles/tokens.css'].map(path => 'frontend/' + path);
        paths.push(...frontendPaths);
        domainFiles.push(...webEntries[frontend].map(path => 'frontend/' + path));
        family += literal(' con interfaz ', c.sddLanguage) + frontend;
        checks.push(literal('Concretar scripts de interfaz en frontend/package.json conforme al framework seleccionado.', c.sddLanguage));
        setup += literal('\n# Preparar frontend/ por separado según el framework, las versiones y las herramientas aprobadas.', c.sddLanguage);
    }
    if (family === 'Rust' || family === 'Go') storageFiles = family === 'Rust' ? ['src/main.rs'] : ['internal/app/'];
    if (!django && c.selections.storage?.some(id => !['memory', 'fixtures'].includes(id))) { const storage = family.startsWith('Go') ? 'internal/storage/' : family.startsWith('Rust') ? 'src/storage/' : family.startsWith(literal('Aplicación nativa / especializada', c.sddLanguage)) ? 'src/' : 'src/storage/'; paths.push(storage); storageFiles = [storage]; }
    if (c.selections.deploy?.includes('docker')) paths.push('Dockerfile');
    if (c.selections.deploy?.includes('compose-deploy')) paths.push('compose.yaml');
    checks.push(...(c.selections.lint ?? []).map(id => template(c.sddLanguage)`Definir configuración y comando de ${id} tras inspección.`));
    const visual = styleApplies(c) && !c.selections.styling?.includes('not-applicable') && platform !== 'daemon';
    return { family, paths: [...new Set(paths)], domainFiles, storageFiles, visual, checks, setup };
}
