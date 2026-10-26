import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';
function offlineManifest(): Plugin {
  let base = '/SDD-generator/';
  return {
    name: 'sdd-offline',
    configResolved(config) {
      base = config.base;
    },
    generateBundle(_options, bundle) {
      const publicAssets = readdirSync('public/fonts')
        .filter(file => file.endsWith('.woff2') || file === 'fonts.css')
        .map(file => 'fonts/' + file);
      // Precarga el cierre real de dependencias: importaciones estáticas y dinámicas del código
      // propio. El resto de recursos con hash se cachea en el primer uso desde el service worker.
      const own = (chunk: { moduleIds: string[] }) =>
        chunk.moduleIds.some(id => id.includes('/src/') && !id.includes('/node_modules/'));
      const included = new Set<string>();
      const visit = (file: string) => {
        if (included.has(file)) return;
        included.add(file);
        const chunk = bundle[file];
        if (!chunk || chunk.type !== 'chunk') return;
        chunk.imports.forEach(visit);
        if (own(chunk)) chunk.dynamicImports.forEach(visit);
      };
      for (const [file, output] of Object.entries(bundle))
        if (output.type === 'asset' || output.isEntry) visit(file);
      const precache = [
        base,
        base + 'index.html',
        ...[...included].filter(file => file !== 'sw.js').map(file => base + file),
        ...publicAssets.map(file => base + file),
      ];
      const digest = createHash('sha256').update(JSON.stringify(precache));
      for (const file of publicAssets) digest.update(readFileSync('public/' + file));
      for (const file of Object.values(bundle))
        digest.update(file.type === 'chunk' ? file.code : file.source);
      const hash = digest.digest('hex').slice(0, 16);
      const source = readFileSync('src/offline/service-worker.js', 'utf8')
        .replace('/* PRECACHE */ []', JSON.stringify(precache))
        .replace("/* CACHE_NAME */ 'sdd-studio-pendiente'", JSON.stringify('sdd-studio-' + hash));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}
export default defineConfig({
  plugins: [react(), offlineManifest()],
  base: '/SDD-generator/',
  build: {
    rolldownOptions: {
      input: { principal: 'index.html' },
      output: {
        codeSplitting: { groups: [{ name: 'project-model', test: /\/src\/(?:domain|catalog)\// }] },
      },
    },
  },
  test: { include: ['tests/unit/**/*.test.ts'] },
});
