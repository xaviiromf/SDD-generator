import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';
function offlineManifest(): Plugin {
    let base = '/SDD-generator/';
    return { name: 'sdd-offline', configResolved(config) { base = config.base; }, generateBundle(_options, bundle) {
            const publicAssets = readdirSync('public/fonts').filter(file => file.endsWith('.woff2') || file === 'fonts.css').map(file => 'fonts/' + file);
            const precache = [base, base + 'index.html', base + 'diagram-renderer.html', ...Object.keys(bundle).map(file => base + file), ...publicAssets.map(file => base + file)];
            const digest = createHash('sha256').update(JSON.stringify(precache));
            for (const file of publicAssets)
                digest.update(readFileSync('public/' + file));
            for (const file of Object.values(bundle))
                digest.update(file.type === 'chunk' ? file.code : file.source);
            const hash = digest.digest('hex').slice(0, 16);
            const source = readFileSync('src/offline/service-worker.js', 'utf8').replace('/* PRECACHE */ []', JSON.stringify(precache)).replace("/* CACHE_NAME */ 'sdd-studio-pendiente'", JSON.stringify('sdd-studio-' + hash));
            this.emitFile({ type: 'asset', fileName: 'sw.js', source });
        } };
}
export default defineConfig({ plugins: [react(), tailwindcss(), offlineManifest()], base: '/SDD-generator/', build: { rolldownOptions: { input: { principal: 'index.html', diagramas: 'diagram-renderer.html' }, output: { codeSplitting: { groups: [{ name: 'project-model', test: /\/src\/(?:domain|catalog)\// }] } } } }, test: { include: ['tests/unit/**/*.test.ts'] } });
