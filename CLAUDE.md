# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Normas vinculantes

AGENTS.md es la fuente normativa: entrada acotada, fases (documentar, implementar, validar), segmentación de dominios, cero emojis, iconos solo de lucide-react, español integral, rangos responsivos y ninguna dependencia nueva sin petición explícita. Este archivo no repite esas reglas; añade comandos y arquitectura. prompt.txt y las carpetas locales ignoradas por Git no se copian a otras rutas.

## Comandos

```bash
npm ci                                            # Node 26 / npm 11 verificados
npm run dev                                       # http://127.0.0.1:5173/SDD-generator/
npm run lint                                      # ESLint (flat config) y prettier --check
npm run format                                    # Prettier sobre todo el código
npm run typecheck                                 # tsc --noEmit, estricto
npm run test                                      # Vitest: tests/unit/**/*.test.ts
npx vitest run tests/unit/kit.test.ts             # un archivo
npx vitest run -t "texto del caso"                # un caso por nombre
npm run build                                     # tsc + vite build; genera dist/ y dist/sw.js
npm run test:e2e                                  # Playwright sobre dist/ (chromium y firefox)
npx playwright test tests/e2e/kit.spec.ts --project=chromium   # un spec
npx playwright test tests/e2e/kit.spec.ts:40 --project=chromium # un caso por línea
npx playwright install chromium firefox           # navegadores, una vez
npm run budget                                    # presupuesto de tamaño sobre dist/ (también en CI)
npm run catalog-report                            # entradas del catálogo con más de 180 días
SDD_VISUAL=1 npx playwright test tests/e2e/visual.spec.ts --project=chromium  # regresión visual
```

Las pruebas de navegador sirven `dist/` con `npm run preview -- --port 4173`, por lo que exigen un `npm run build` previo; reutilizan un servidor ya levantado salvo con `CI=1`. Viewport fijo 1440x1000, un solo worker. WebKit no arranca en el entorno local (faltan libicu74 y libflite1). Las pruebas de rendimiento (tests/e2e/performance.spec.ts y tests/unit/performance.test.ts) miden p95 reales: no se les atribuyen resultados sin ejecutarlas. El umbral del mapa de arquitectura (300 ms) solo se exige con `SDD_PERF_STRICT=1`. La regresión visual solo compara con `SDD_VISUAL=1`, porque el renderizado de fuentes cambia entre máquinas; tras un cambio visual intencionado se actualiza con `--update-snapshots`. La carga externa de la máquina altera los p95: compara contra la base en las mismas condiciones antes de concluir que hay regresión.

## Arquitectura

SPA estática (React 19, TypeScript estricto, Zustand 5, Vite 8 con Rolldown, CSS propio sin framework) sin backend. Todo el valor se calcula en el navegador, sin servicios externos.

### Flujo de datos central

1. `src/store/editorStore.ts` guarda la `Configuration` canónica (src/domain/models.ts): nombre, slug, idea, alcance positivo y negativo, selecciones por campo con su origen (manual, preset o inference), `project` (requisitos y contexto estructurados, src/domain/projectDefinition.ts), `profile` (perfiles y componentes), `designOverrides` y `manualSections`. Cada mutación incrementa `revision`.
2. `src/workers/generatorClient.ts` se suscribe al editor, agrupa cambios en 16 ms y envía la configuración a `src/workers/generator.worker.ts`, que ejecuta `compile()` de src/engine/compiler.ts. Una `Compilation` solo se publica si su `revision` coincide con la actual del editor.
3. `compile()` valida la configuración, calcula diagnósticos de compatibilidad (src/domain/compatibility.ts), crea el `KitContext` (src/engine/kitContext.ts), proyecta los siete documentos desde `src/engine/templates/`, añade los diagramas Mermaid como texto (src/engine/diagramProjection.ts) y deriva cobertura, madurez, preparación (readiness), puntos de control P1 a P6 (src/engine/checkpoints.ts) y estado por documento.
4. `src/store/documentStore.ts` recibe la compilación, reconcilia las aportaciones manuales por sección (src/domain/manualSections.ts) y bloquea la exportación ante conflictos o diagnósticos bloqueantes. Los componentes leen de los stores con selectores por campo.
5. `compile()` también ejecuta el matcher local (src/engine/matcher.ts). Sus inferencias entran por `applyInferences`, que provoca una nueva compilación.

### Interfaz por pasos

`src/store/uiStore.ts` define `Panel` (overview, idea, requirements, config, docs); StudioLayout monta todos los paneles y la clase `active-<panel>` de `.workspace` decide cuál se ve. En pantallas de 768 px o más, el paso activo se muestra junto a la vista previa de documentos; `docs` ocupa el ancho completo. DocumentCanvas mantiene montados explorador, preparación, revisor independiente e índice y los envuelve en `<Activity>` cuando están ocultos: así alternar pasos no reconstruye el árbol y las compilaciones no los renderizan con prioridad alta. Las pruebas de navegador cambian de paso con `goTo` de tests/e2e/navigation.ts. Los avisos se emiten con `notify(texto, tipo)` y el estado de guardado vive en `saveState`.

### Kit de siete documentos

`src/engine/kitManifest.ts` fija AGENTS.md, docs/PROJECT_STATUS.md, docs/DECISIONS.md y `specs/001-<slug>/{spec,plan,tasks,validation}.md`; no hay README. Las plantillas de src/engine/templates/ reciben el `KitContext`: governance.ts (AGENTS, estado y decisiones, con las preferencias de estilo), spec.ts, plan.ts (con la sección «Propuesta del generador (no verificada)»), tasks.ts (T-RF-n-IMP y T-RF-n-VAL, sin requisitos propuestos) y validation.ts (todo «No ejecutado»). El compilador añade a PROJECT_STATUS.md la tabla de puntos de control. `packageKit` (src/services/zipExport.ts) exporta los siete; `packageChange` exporta un cambio como `specs/00N-<slug>/` con fragmentos para DECISIONS.md y AGENTS.md y nunca incluye PROJECT_STATUS.md. tests/unit/kit.test.ts, tests/unit/kitMentions.test.ts y tests/unit/acceptance.test.ts protegen rutas, enlaces, menciones y criterios de aceptación.

### Catálogo

`src/catalog/technologies.ts` declara 237 opciones con `field` (24 campos definidos en src/domain/models.ts), `phase` (1 a 7), alias para el matcher y `requires` para compatibilidad. `presets.ts` (ocho conjuntos y `visibleTechnologyIds`, el catálogo visible: opciones de los conjuntos y lo que requieren; el resto solo aparece si el borrador ya lo tiene), `archetypes.ts` (21 arquetipos con contraste calculado) y `profiles.ts` (perfiles integrados) completan el catálogo. Dominio y catálogo forman el chunk `project-model` configurado en vite.config.ts.

### Persistencia y sin conexión

- Borrador: `src/services/draftStorage.ts` en localStorage, guardado 500 ms después del último cambio y al ocultar la página (App.tsx). Un texto bloqueante no se guarda, pero nunca borra el último borrador válido. Al leerlo, `migrateConfiguration` (src/domain/migration.ts) convierte el alcance de borradores sin modelo estructurado en requisitos pendientes. `validateText` de src/domain/validation.ts bloquea posibles credenciales y avisa (sin bloquear) de los emojis; el tope total del borrador es de 1 MiB.
- Funciones aplazadas: biblioteca, perfiles y aportaciones manuales conservan su código, pero no están en el flujo. La biblioteca no arranca; «Exportar biblioteca» (ProjectLibrary.tsx) descarga lo guardado sin escribir. Las aportaciones solo se muestran si el borrador ya las tiene.
- Sin conexión: el plugin `offlineManifest` de vite.config.ts genera `dist/sw.js` a partir de src/offline/service-worker.js. Precarga el cierre real de dependencias (entradas, importaciones estáticas y dinámicas del código propio), las fuentes y el HTML; el resto de recursos con hash se cachea en el primer uso.

### Diagramas

Los diagramas se muestran como código Mermaid sin renderizar (src/components/diagrams/DiagramView.tsx); no hay renderizador ni dependencia de Mermaid. El mapa de arquitectura (src/components/diagrams/ArchitectureMap.tsx) pertenece a los perfiles aplazados y pide vistas previas al worker con el mensaje `architecture-preview`.

### Asistencia y propuestas

`src/domain/contextExtraction.ts` (reglas locales en español) y `src/domain/assistantExchange.ts` (prompt y validación de la respuesta JSON pegada, esquema `sdd-studio.asistente.v1`) solo producen propuestas. Se aceptan con `acceptContextProposals` y `acceptAssistantRequirements` del editor, con estado «propuesto» y origen `local` o `assistant-accepted`. El revisor independiente (src/domain/reviewExchange.ts y src/components/review/ReviewPanel.tsx, esquema `sdd-studio.revision.v1`) es opcional: guarda sus hallazgos en `config.review` y el kit los muestra en PROJECT_STATUS.md sin decidir nada. Las diferencias entre versiones compilan en un trabajador temporal (`src/workers/compileOnce.ts`) para no duplicar las plantillas en el hilo principal.

### Temas

src/styles/theme.css define cada color como `light-dark(claro, oscuro)`; los valores claros se derivaron una vez de los oscuros (curva de luminosidad OKLab). Un color nuevo se añade como variable en ese archivo, no como hexadecimal en app.css. Las muestras de arquetipo (`.archetype-aNN .archetype-sample`) conservan colores fijos porque representan el proyecto destino.

### Idioma

Interfaz y kit solo en español; los textos se escriben literales, sin capa de traducción. `Locale` e `isLocale` de src/domain/models.ts solo sirven para leer borradores antiguos con `sddLanguage: 'en'`, que se migran a español. Los términos de búsqueda en inglés viven en src/catalog/englishTerms.ts.

## Convenciones del código

- Formato con Prettier (.prettierrc.json); `npm run lint` falla si un archivo no está formateado.
- Textos de interfaz y documentos generados en español y sin emojis; iconos solo de lucide-react. Los textos del usuario se conservan literalmente.
- Toda interacción nueva funciona por teclado, con foco visible, objetivos de 44 x 44 px y en los tres rangos (<768, 768 a 1279 y >=1280 px) definidos en src/styles/app.css.
- Suscripciones Zustand con selectores por campo; la raíz no se suscribe a ajustes de estética y la muestra visual mantiene actualizaciones <16 ms medidas.
- Una propuesta de cambio se redacta y se detiene hasta recibir una petición explícita para implementarla.
