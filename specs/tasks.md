# Tareas — 001 / SDD-Studio

Especificación: [spec.md](spec.md). Plan: [plan.md](plan.md). Fecha: 2026-10-06.

Estado: propuestas para revisión. Implementación autorizada: **NO**. Todas las casillas de implementación permanecen pendientes. Solo se han creado documentos. «RF-01» abrevia `RF-001-01`; las dependencias mantienen el identificador completo de tarea.

## Puerta de revisión

Antes de T-001-01: registrar autorización explícita y alcance en `docs/PROJECT_STATUS.md`. Confirmar las alternativas propuestas en `docs/DECISIONS.md`. Una aprobación documental sin permiso de implementación no permite ejecutar estas tareas. Las decisiones particulares del catálogo y las fuentes se resuelven antes de cerrar sus tareas, sin bloquear la documentación.

## Base técnica y dominio

- [ ] T-001-01 — Configurar la base React, TypeScript estricto y Vite.
  - RF: RF-25, RF-26.
  - Dependencias: autorización explícita; ninguna tarea previa.
  - Archivos previstos: `package.json`, `package-lock.json`, `index.html`, `tsconfig.json`, `vite.config.ts`, `src/main.tsx`, `src/app/App.tsx`.
  - Finaliza cuando: instalación autorizada y reproducible; una pantalla mínima en español compila a `dist/` sin backend.
- [ ] T-001-02 — Definir modelos y validadores de frontera.
  - RF: RF-03, RF-10, RF-18, RF-23.
  - Dependencias: T-001-01.
  - Archivos previstos: `src/domain/models.ts`, `src/domain/validation.ts`, `tests/unit/validation.test.ts`.
  - Finaliza cuando: datos válidos se aceptan; límites, IDs desconocidos, versiones inesperadas y rutas inseguras se rechazan conservando entrada corregible.
- [ ] T-001-03 — Auditar y construir el registro de tecnologías.
  - RF: RF-01, RF-02, RF-05.
  - Dependencias: T-001-02.
  - Archivos previstos: `src/catalog/technologies.ts`, `tests/unit/catalog.test.ts`, `docs/DECISIONS.md`.
  - Finaliza cuando: siete fases cubiertas, todas las entradas del prompt presentes y ≥201 IDs distintos; alias no inflan el conteo. Cualquier ampliación ajena a la fuente requiere revisión antes de cerrarla.
- [ ] T-001-04 — Implementar compatibilidades y diagnósticos.
  - RF: RF-03, RF-07, RF-22.
  - Dependencias: T-001-03.
  - Archivos previstos: `src/domain/compatibility.ts`, `tests/unit/compatibility.test.ts`.
  - Finaliza cuando: CLI excluye CSS web; runtimes y frameworks incompatibles muestran causas; opciones inactivas no se exportan; no hay cambios silenciosos.
- [ ] T-001-05 — Definir los ocho conjuntos predefinidos.
  - RF: RF-04.
  - Dependencias: T-001-04.
  - Archivos previstos: `src/catalog/presets.ts`, `tests/unit/presets.test.ts`.
  - Finaliza cuando: los ocho coinciden con la especificación; variantes Godot/Bevy, Chi/Gin y SQLite/PostgreSQL exigen elección; aplicación atómica preserva narrativa y límites.
- [ ] T-001-06 — Implementar madurez con seis pilares.
  - RF: RF-13.
  - Dependencias: T-001-04.
  - Archivos previstos: `src/domain/maturity.ts`, `tests/unit/maturity.test.ts`.
  - Finaliza cuando: fórmula documentada, «No aplica» justificado y almacenamiento en memoria cuentan; pendientes y contradicciones no; puntuación tiene explicación.
- [ ] T-001-07 — Separar estado de edición, interfaz y documentos.
  - RF: RF-07, RF-20, RF-25.
  - Dependencias: T-001-02, T-001-04.
  - Archivos previstos: `src/store/editorStore.ts`, `src/store/documentStore.ts`, `src/store/uiStore.ts`.
  - Finaliza cuando: selectores granulares; prioridades manual/conjunto/inferencia; aperturas de menús no compilan ni modifican revisión semántica.

## Motor determinista y generación

- [ ] T-001-08 — Construir normalización y coincidencia aproximada.
  - RF: RF-05, RF-06, RF-07.
  - Dependencias: T-001-03.
  - Archivos previstos: `src/engine/tokenizer.ts`, `src/engine/matcher.ts`, `tests/unit/matcher.test.ts`.
  - Finaliza cuando: «pyton» y «tailwnd» funcionan; acentos y mayúsculas son equivalentes; negaciones y empates no producen selecciones falsas.
- [ ] T-001-09 — Definir sugerencias de alcance y pilares ausentes.
  - RF: RF-08, RF-13.
  - Dependencias: T-001-04, T-001-08.
  - Archivos previstos: `src/engine/scopeRules.ts`, `tests/unit/scopeRules.test.ts`.
  - Finaliza cuando: reservas sin persistencia genera explicación y opciones compatibles; aceptación cambia el campo correspondiente; descarte no inventa reglas de negocio.
- [ ] T-001-10 — Elaborar plantillas de especificación y ficha de proyecto.
  - RF: RF-10, RF-21.
  - Dependencias: T-001-02, T-001-04.
  - Archivos previstos: `src/engine/templates/spec.ts`, `src/engine/templates/project.ts`, `tests/fixtures/`.
  - Finaliza cuando: ambas salidas españolas incluyen alcance positivo/negativo, RF, criterios, pila y pendientes; entradas insuficientes quedan señaladas.
- [ ] T-001-11 — Generar plan y árbol del proyecto objetivo.
  - RF: RF-10, RF-12, RF-16.
  - Dependencias: T-001-04, T-001-10, T-001-17.
  - Archivos previstos: `src/engine/templates/plan.ts`, `src/engine/targetTree.ts`.
  - Finaliza cuando: cambios de plataforma y tecnologías modifican rutas propuestas coherentes; el plan incluye contratos, tokens aplicables y pruebas.
- [ ] T-001-12 — Generar tareas trazables con dependencias acíclicas.
  - RF: RF-10, RF-28.
  - Dependencias: T-001-11.
  - Archivos previstos: `src/engine/templates/tasks.ts`, `src/engine/taskGraph.ts`, `tests/unit/taskGraph.test.ts`.
  - Finaliza cuando: tareas `[T1]`… con RF, dependencias válidas, archivos y condiciones de fin; no aparecen ciclos ni tareas ya completadas.
- [ ] T-001-13 — Generar constitución y orquestador autónomos.
  - RF: RF-10, RF-21, RF-22, RF-28.
  - Dependencias: T-001-10.
  - Archivos previstos: `src/engine/templates/constitution.ts`, `src/engine/templates/orchestrator.ts`.
  - Finaliza cuando: reglas completas en español, simulación por defecto para destinos operativos, límites de actuación y protección de secretos; DOCUMENT se detiene antes de IMPLEMENT y VALIDATE exige evidencia.
- [ ] T-001-14 — Integrar compilador puro de los seis documentos.
  - RF: RF-10, RF-12, RF-13, RF-23.
  - Dependencias: T-001-06, T-001-09, T-001-10, T-001-11, T-001-12, T-001-13.
  - Archivos previstos: `src/engine/compiler.ts`, `tests/unit/compiler.test.ts`.
  - Finaliza cuando: igual entrada produce igual contenido; rutas permitidas y revisión única; kits representativos web, CLI, API y juego son consistentes y sin emojis.
- [ ] T-001-15 — Implementar trabajador y coordinación por revisión.
  - RF: RF-06, RF-07, RF-10, RF-25.
  - Dependencias: T-001-07, T-001-14.
  - Archivos previstos: `src/workers/generator.worker.ts`, `src/workers/generatorClient.ts`, `tests/unit/generatorClient.test.ts`.
  - Finaliza cuando: entrada no compila en hilo principal; respuestas antiguas se descartan; coalescencia sin cola ilimitada; inferencias no crean bucles; fallo permite reintento y evita exportar contenido viejo.

## Diseño y estructura adaptable

- [ ] T-001-16 — Auditar disponibilidad y licencias de tipografías.
  - RF: RF-09, RF-19.
  - Dependencias: autorización explícita; puede preceder al código de estética.
  - Archivos previstos: `docs/DECISIONS.md`, `public/fonts/` y avisos de licencia cuando corresponda.
  - Finaliza cuando: parejas exactas tienen recursos redistribuibles y locales; cada sustitución necesaria está aprobada y no se presenta como fuente original.
- [ ] T-001-17 — Definir 21 arquetipos y cálculo de contraste.
  - RF: RF-09, RF-16, RF-24.
  - Dependencias: T-001-02, T-001-16.
  - Archivos previstos: `src/catalog/archetypes.ts`, `tests/unit/archetypes.test.ts`.
  - Finaliza cuando: 21 registros coinciden con colores, fuentes, radios y acabados del plan; contraste contempla alfa, texto de botones, AA y AAA sin afirmar aprobaciones falsas.
- [ ] T-001-18 — Crear tokens y estilo distintivo del estudio.
  - RF: RF-20, RF-21, RF-24.
  - Dependencias: T-001-01, T-001-16; aprobación de tema propuesto.
  - Archivos previstos: `src/styles/tokens.css`, `src/styles/app.css`.
  - Finaliza cuando: identidad suiza aprobada, tipografía local, foco visible, AA y movimiento reducido; iconos Lucide; controles de al menos 44 × 44 px.
- [ ] T-001-19 — Construir estructura semántica y navegación de paneles.
  - RF: RF-20, RF-24.
  - Dependencias: T-001-07, T-001-18.
  - Archivos previstos: `src/app/StudioLayout.tsx`, `src/components/navigation/PanelNavigation.tsx`.
  - Finaliza cuando: tres rangos exactos, pestañas inferiores móviles, selector en tablet y tres columnas de escritorio; estado preservado y controles ocultos fuera del foco.
- [ ] T-001-20 — Construir configurador de siete fases.
  - RF: RF-01, RF-02, RF-03, RF-24.
  - Dependencias: T-001-03, T-001-04, T-001-07, T-001-19.
  - Archivos previstos: `src/components/configurator/Configurator.tsx`, `PhaseSection.tsx`, `TechnologyField.tsx`.
  - Finaliza cuando: todas las fases son editables, filtradas y explicadas; acordeones y atajos funcionan con alternativas visibles; edición por campo no renderiza todo el estudio.
- [ ] T-001-21 — Integrar selector de conjuntos y confirmaciones.
  - RF: RF-04, RF-24.
  - Dependencias: T-001-05, T-001-20.
  - Archivos previstos: `src/components/configurator/PresetSelector.tsx`.
  - Finaliza cuando: confirma sustitución manual, resuelve variantes y aplica una transacción; cancelar conserva decisiones e idea; foco vuelve al invocador.
- [ ] T-001-22 — Integrar paleta de comandos accesible.
  - RF: RF-05, RF-24.
  - Dependencias: T-001-08, T-001-17, T-001-21.
  - Archivos previstos: `src/components/command/CommandPalette.tsx`.
  - Finaliza cuando: Cmd/Ctrl + K, consulta aproximada, flechas, Enter, Escape y sin resultados cubren tecnologías, arquetipos y conjuntos; foco gestionado correctamente.
- [ ] T-001-23 — Integrar editor de idea y sugerencias.
  - RF: RF-06, RF-07, RF-08, RF-23.
  - Dependencias: T-001-09, T-001-15, T-001-19.
  - Archivos previstos: `src/components/storyteller/IdeaEditor.tsx`, `ScopeBadges.tsx`.
  - Finaliza cuando: entradas y negaciones sincronizan inferencias compatibles; decisiones manuales prevalecen; aceptar/descartar sugerencias tiene efecto correcto; errores conservan entrada.
- [ ] T-001-24 — Construir estudio estético y fichas de arquetipos.
  - RF: RF-09, RF-24, RF-25.
  - Dependencias: T-001-17, T-001-18, T-001-20.
  - Archivos previstos: `src/components/aesthetics/AestheticStudio.tsx`, `ArchetypeCard.tsx`.
  - Finaliza cuando: 21 fichas muestran pareja exacta, colores, categoría, párrafo, botón, tactilidad y contraste; carga diferida sin bloquear edición.

## Documentos, acciones y persistencia

- [ ] T-001-25 — Construir visor documental y resaltado seguro.
  - RF: RF-10, RF-11, RF-21, RF-23, RF-25.
  - Dependencias: T-001-15, T-001-19.
  - Archivos previstos: `src/components/documents/DocumentCanvas.tsx`, `DocumentTabs.tsx`.
  - Finaliza cuando: seis documentos visibles y resaltados sin ejecutar HTML; resaltado memorizado por documento/revisión; estados de actualización y error no ocultan la entrada.
- [ ] T-001-26 — Construir árbol del kit y medidor de madurez.
  - RF: RF-12, RF-13, RF-24.
  - Dependencias: T-001-06, T-001-25.
  - Archivos previstos: `src/components/documents/FileTree.tsx`, `MaturityMeter.tsx`.
  - Finaliza cuando: árbol navegable refleja rutas reales del ZIP; porcentaje explica pilares y «No aplica»; navegación por teclado no modifica documentos.
- [ ] T-001-27 — Implementar copia individual y prompt maestro.
  - RF: RF-11, RF-14, RF-24.
  - Dependencias: T-001-25.
  - Archivos previstos: `src/services/clipboard.ts`, `src/components/export/ExportBar.tsx`, `src/components/feedback/StatusMessage.tsx`.
  - Finaliza cuando: copia solo revisión vigente, feedback anunciado y fallback manual ante permisos/origen restringido.
- [ ] T-001-28 — Implementar exportación ZIP local.
  - RF: RF-15, RF-23, RF-25.
  - Dependencias: T-001-14, T-001-25, T-001-27.
  - Archivos previstos: `src/services/zipExport.ts`, `tests/unit/zipExport.test.ts`.
  - Finaliza cuando: ZIP se descomprime y coincide exactamente con seis documentos actuales; rutas seguras, nombre válido, carga diferida, estado ocupado y recuperación de error.
- [ ] T-001-29 — Implementar exportación de tokens por destino.
  - RF: RF-16.
  - Dependencias: T-001-17, T-001-27.
  - Archivos previstos: `src/services/tokenExport.ts`, `tests/unit/tokenExport.test.ts`.
  - Finaliza cuando: CSS/JSON contienen tokens exactos; configuración Tailwind solo se ofrece para perfil compatible; descarga no ejecuta código.
- [ ] T-001-30 — Generar preparación segura y copiable.
  - RF: RF-17, RF-22, RF-23.
  - Dependencias: T-001-04, T-001-05, T-001-27.
  - Archivos previstos: `src/services/setupCommands.ts`, `tests/unit/setupCommands.test.ts`.
  - Finaliza cuando: plantillas reflejan destino y herramienta elegidos, identificador validado y escapado seguro; texto libre no se interpola ni se ejecutan órdenes.
- [ ] T-001-31 — Implementar guardado y recuperación del borrador.
  - RF: RF-18, RF-23.
  - Dependencias: T-001-02, T-001-07, T-001-23.
  - Archivos previstos: `src/services/draftStorage.ts`, `tests/unit/draftStorage.test.ts`.
  - Finaliza cuando: restauración versionada, cuota y corrupción recuperables, guardado diferido; secretos aparentes/emojis no se guardan; borrado confirmado afecta solo clave propia.
- [ ] T-001-32 — Implementar preparación offline y actualización de caché.
  - RF: RF-19, RF-26.
  - Dependencias: T-001-16, T-001-25, T-001-28, T-001-29, T-001-30, T-001-31.
  - Archivos previstos: `src/offline/service-worker.ts`, `src/services/offlineRegistration.ts`, `vite.config.ts`.
  - Finaliza cuando: build emite service worker/manifiesto válido; todos los recursos, fuentes y chunks diferidos se preparan; recarga offline en subruta funciona; actualización conserva edición.

## Verificación, guía y cierre

- [ ] T-001-33 — Completar pruebas de regresión del dominio y motor.
  - RF: RF-02…10, RF-12, RF-13, RF-18, RF-21…23, RF-28.
  - Dependencias: T-001-14, T-001-15, T-001-17, T-001-28…31.
  - Archivos previstos: `tests/unit/`, `tests/fixtures/`.
  - Finaliza cuando: casos críticos del plan ejecutados con evidencia; determinismo, prioridades, rutas, borradores y coherencia del kit cubiertos; no se cuentan pruebas sin ejecutar.
- [ ] T-001-34 — Verificar recorridos en navegador y sin conexión.
  - RF: RF-01, RF-03…05, RF-08, RF-10…19, RF-28.
  - Dependencias: T-001-20…32.
  - Archivos previstos: `tests/e2e/workflow.spec.ts`, `tests/e2e/offline.spec.ts`.
  - Finaliza cuando: edición, presets, paleta, conflictos, copia, ZIP, tokens y recarga offline pasan; fuentes de 21 arquetipos y revisión exportada comprobadas.
- [ ] T-001-35 — Auditar adaptación y accesibilidad en sus límites.
  - RF: RF-09, RF-20, RF-24.
  - Dependencias: T-001-20…27.
  - Archivos previstos: `tests/e2e/responsive.spec.ts`, `tests/e2e/accessibility.spec.ts`, archivos corregidos según hallazgos.
  - Finaliza cuando: 375/767/768/1279/1280/1440 px, zoom 200 %, teclado, lector, objetivos ≥44 × 44, foco, AA y movimiento reducido verificados; sin overflow de página.
- [ ] T-001-36 — Medir y ajustar rendimiento.
  - RF: RF-15, RF-25.
  - Dependencias: T-001-15, T-001-24…32, T-001-34.
  - Archivos previstos: `tests/performance/`, servicios/componentes afectados, `docs/ENVIRONMENT_AND_VERIFICATION.md`.
  - Finaliza cuando: CA-11…13 medidos en entorno aprobado con p95, tamaños y trazas; ingreso/controles <16 ms, kit objetivo ≤150 ms, ZIP referencia <100 ms; incumplimientos se corrigen o quedan pendientes explícitos.
- [ ] T-001-37 — Redactar README y guía de uso completa.
  - RF: RF-21, RF-27, RF-28.
  - Dependencias: T-001-32, T-001-34.
  - Archivos previstos: `README.md`, `docs/PROJECT.md`, `docs/ENVIRONMENT_AND_VERIFICATION.md`.
  - Finaliza cuando: ambos apartados exigidos, cuatro pasos, atajos, alcance negativo, límites deterministas y preparación offline; todo español y sin emojis.
- [ ] T-001-38 — Ejecutar análisis, pruebas y build estático.
  - RF: RF-21, RF-23, RF-26.
  - Dependencias: T-001-33…37.
  - Archivos previstos: scripts/configuraciones, `specs/validation.md` durante fase autorizada.
  - Finaliza cuando: lint, typecheck, pruebas unitarias/E2E y build ejecutados con códigos de salida reales; inspección en raíz/subruta; auditoría de idioma y emojis de artefactos propios. Fuente original preservada se distingue de documentación creada.
- [ ] T-001-39 — Registrar evidencia y sincronizar hito final.
  - RF: RF-29 y todos los criterios de aceptación.
  - Dependencias: T-001-38.
  - Archivos previstos: `specs/validation.md`, `docs/PROJECT_STATUS.md`, `docs/TRACEABILITY.md`, `specs/tasks.md`, historial Git.
  - Finaliza cuando: RF vinculados a evidencia real, pendientes transparentes, commit/push sin secretos ni historia forzada; aceptación del usuario sigue separada de verificaciones automáticas. No incluye despliegue del sitio.

Las expresiones T-001-20…32 en dependencias incluyen todos los IDs del intervalo; no son tareas nuevas. El orden de trabajo es topológico: T-001-16/17 preceden a T-001-11 aunque pertenezcan al bloque visual. Las tareas pueden dividirse si se mantiene trazabilidad; no se requiere trabajo de subagentes.

## Autorización de implementación

Pendiente. Registrar fecha, mensaje y tareas aprobadas únicamente cuando el usuario lo autorice. No se ha aprobado ninguna elección propuesta por el mero hecho de documentarla.

## Registro de ejecución

| Fecha | Actividad | Resultado |
|---|---|---|
| 2026-10-06 | Lectura de prompt y marco; redacción de especificación, plan, tareas y documentos de soporte | DOCUMENT; sin código, instalaciones ni pruebas de aplicación. |

## Punto de reanudación

Última acción: documentación entregada para revisión. Siguiente paso: recibir revisión y autorización explícita antes de ejecutar T-001-01 u otra tarea de implementación. Las cifras de rendimiento, accesibilidad y build están pendientes de medición. La aceptación visual del usuario permanece pendiente.
