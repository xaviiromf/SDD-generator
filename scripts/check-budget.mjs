/* global console */
// Presupuesto de tamaño del build. Ejecutar tras `npm run build`.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import process from 'node:process';

const assets = readdirSync('dist/assets');
const size = file => statSync(`dist/assets/${file}`).size;
const find = prefix => assets.find(f => f.startsWith(prefix) && f.endsWith('.js'));
const sw = readFileSync('dist/sw.js', 'utf8');
const precache = [...sw.matchAll(/"[^"]*\/assets\/([^"]+)"/g)].reduce(
  (sum, m) => sum + size(m[1]),
  0,
);

const budgets = [
  ['principal (JS)', size(find('principal-')), 400_000],
  ['project-model (JS)', size(find('project-model-')), 120_000],
  ['generator.worker (JS)', size(find('generator.worker-')), 200_000],
  ['projectImport.worker (JS)', size(find('projectImport.worker-')), 80_000],
  [
    'principal (CSS)',
    size(assets.find(f => f.startsWith('principal-') && f.endsWith('.css'))),
    70_000, // la paleta por tema añade unas 160 variables; comprimido ronda 13 KB.
  ],
  // cierre real de dependencias (antes 6,19 MB); las fuentes se cuentan aparte.
  ['precarga del service worker', precache, 2_500_000],
];

let failed = false;
for (const [name, bytes, limit] of budgets) {
  const ok = bytes <= limit;
  failed ||= !ok;
  console.log(`${ok ? 'OK  ' : 'FALLA'} ${name}: ${bytes} bytes (límite ${limit})`);
}
process.exit(failed ? 1 : 0);
