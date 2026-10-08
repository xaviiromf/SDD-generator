# Tareas — 001 / SDD-Studio

Estado de la ampliación activa 004: plan y matriz aprobados formalmente el 2026-10-07. T-004-04…23 autorizadas; implementación y verificación técnica final completadas. Aceptación y despliegue pendientes.

Especificación: [spec.md](spec.md). Plan: [plan.md](plan.md). Fecha: 2026-10-06.

Estado: aprobado por el usuario el 2026-10-06. Implementación autorizada: **SÍ**. Las casillas se completarán únicamente con evidencia de verificación. «RF-01» abrevia `RF-001-01`; las dependencias mantienen el identificador completo de tarea.

## Puerta de revisión

Antes de T-001-01: registrar autorización explícita y alcance en `docs/PROJECT_STATUS.md`. Confirmar las alternativas propuestas en `docs/DECISIONS.md`. Una aprobación documental sin permiso de implementación no permite ejecutar estas tareas. Las decisiones particulares del catálogo y las fuentes se resuelven antes de cerrar sus tareas, sin bloquear la documentación.

## Base técnica y dominio

- [x] T-001-01 — Configurar la base React, TypeScript estricto y Vite.
  - RF: RF-25, RF-26.
  - Dependencias: autorización explícita; ninguna tarea previa.
  - Archivos previstos: `package.json`, `package-lock.json`, `index.html`, `tsconfig.json`, `vite.config.ts`, `src/main.tsx`, `src/app/App.tsx`.
  - Finaliza cuando: instalación autorizada y reproducible; una pantalla mínima en español compila a `dist/` sin backend.
- [x] T-001-02 — Definir modelos y validadores de frontera.
  - RF: RF-03, RF-10, RF-18, RF-23.
  - Dependencias: T-001-01.
  - Archivos previstos: `src/domain/models.ts`, `src/domain/validation.ts`, `tests/unit/validation.test.ts`.
  - Finaliza cuando: datos válidos se aceptan; límites, IDs desconocidos, versiones inesperadas y rutas inseguras se rechazan conservando entrada corregible.
- [x] T-001-03 — Auditar y construir el registro de tecnologías.
  - RF: RF-01, RF-02, RF-05.
  - Dependencias: T-001-02.
  - Archivos previstos: `src/catalog/technologies.ts`, `tests/unit/catalog.test.ts`, `docs/DECISIONS.md`.
  - Finaliza cuando: siete fases cubiertas, todas las entradas del prompt presentes y ≥201 IDs distintos; alias no inflan el conteo. Cualquier ampliación ajena a la fuente requiere revisión antes de cerrarla.
- [x] T-001-04 — Implementar compatibilidades y diagnósticos.
  - RF: RF-03, RF-07, RF-22.
  - Dependencias: T-001-03.
  - Archivos previstos: `src/domain/compatibility.ts`, `tests/unit/compatibility.test.ts`.
  - Finaliza cuando: CLI excluye CSS web; runtimes y frameworks incompatibles muestran causas; opciones inactivas no se exportan; no hay cambios silenciosos.
- [x] T-001-05 — Definir los ocho conjuntos predefinidos.
  - RF: RF-04.
  - Dependencias: T-001-04.
  - Archivos previstos: `src/catalog/presets.ts`, `tests/unit/presets.test.ts`.
  - Finaliza cuando: los ocho coinciden con la especificación; variantes Godot/Bevy, Chi/Gin y SQLite/PostgreSQL exigen elección; aplicación atómica preserva narrativa y límites.
- [x] T-001-06 — Implementar madurez con seis pilares.
  - RF: RF-13.
  - Dependencias: T-001-04.
  - Archivos previstos: `src/domain/maturity.ts`, `tests/unit/maturity.test.ts`.
  - Finaliza cuando: fórmula documentada, «No aplica» justificado y almacenamiento en memoria cuentan; pendientes y contradicciones no; puntuación tiene explicación.
- [x] T-001-07 — Separar estado de edición, interfaz y documentos.
  - RF: RF-07, RF-20, RF-25.
  - Dependencias: T-001-02, T-001-04.
  - Archivos previstos: `src/store/editorStore.ts`, `src/store/documentStore.ts`, `src/store/uiStore.ts`.
  - Finaliza cuando: selectores granulares; prioridades manual/conjunto/inferencia; aperturas de menús no compilan ni modifican revisión semántica.

## Motor determinista y generación

- [x] T-001-08 — Construir normalización y coincidencia aproximada.
  - RF: RF-05, RF-06, RF-07.
  - Dependencias: T-001-03.
  - Archivos previstos: `src/engine/tokenizer.ts`, `src/engine/matcher.ts`, `tests/unit/matcher.test.ts`.
  - Finaliza cuando: «pyton» y «tailwnd» funcionan; acentos y mayúsculas son equivalentes; negaciones y empates no producen selecciones falsas.
- [x] T-001-09 — Definir sugerencias de alcance y pilares ausentes.
  - RF: RF-08, RF-13.
  - Dependencias: T-001-04, T-001-08.
  - Archivos previstos: `src/engine/scopeRules.ts`, `tests/unit/scopeRules.test.ts`.
  - Finaliza cuando: reservas sin persistencia genera explicación y opciones compatibles; aceptación cambia el campo correspondiente; descarte no inventa reglas de negocio.
- [x] T-001-10 — Elaborar plantillas de especificación y ficha de proyecto.
  - RF: RF-10, RF-21.
  - Dependencias: T-001-02, T-001-04.
  - Archivos previstos: `src/engine/templates/spec.ts`, `src/engine/templates/project.ts`, `tests/fixtures/`.
  - Finaliza cuando: ambas salidas españolas incluyen alcance positivo/negativo, RF, criterios, pila y pendientes; entradas insuficientes quedan señaladas.
- [x] T-001-11 — Generar plan y árbol del proyecto objetivo.
  - RF: RF-10, RF-12, RF-16.
  - Dependencias: T-001-04, T-001-10, T-001-17.
  - Archivos previstos: `src/engine/templates/plan.ts`, `src/engine/targetTree.ts`.
  - Finaliza cuando: cambios de plataforma y tecnologías modifican rutas propuestas coherentes; el plan incluye contratos, tokens aplicables y pruebas.
- [x] T-001-12 — Generar tareas trazables con dependencias acíclicas.
  - RF: RF-10, RF-28.
  - Dependencias: T-001-11.
  - Archivos previstos: `src/engine/templates/tasks.ts`, `src/engine/taskGraph.ts`, `tests/unit/taskGraph.test.ts`.
  - Finaliza cuando: tareas `[T1]`… con RF, dependencias válidas, archivos y condiciones de fin; no aparecen ciclos ni tareas ya completadas.
- [x] T-001-13 — Generar constitución y orquestador autónomos.
  - RF: RF-10, RF-21, RF-22, RF-28.
  - Dependencias: T-001-10.
  - Archivos previstos: `src/engine/templates/constitution.ts`, `src/engine/templates/orchestrator.ts`.
  - Finaliza cuando: reglas completas en español, simulación por defecto para destinos operativos, límites de actuación y protección de secretos; DOCUMENT se detiene antes de IMPLEMENT y VALIDATE exige evidencia.
- [x] T-001-14 — Integrar compilador puro de los seis documentos.
  - RF: RF-10, RF-12, RF-13, RF-23.
  - Dependencias: T-001-06, T-001-09, T-001-10, T-001-11, T-001-12, T-001-13.
  - Archivos previstos: `src/engine/compiler.ts`, `tests/unit/compiler.test.ts`.
  - Finaliza cuando: igual entrada produce igual contenido; rutas permitidas y revisión única; kits representativos web, CLI, API y juego son consistentes y sin emojis.
- [x] T-001-15 — Implementar trabajador y coordinación por revisión.
  - RF: RF-06, RF-07, RF-10, RF-25.
  - Dependencias: T-001-07, T-001-14.
  - Archivos previstos: `src/workers/generator.worker.ts`, `src/workers/generatorClient.ts`, `tests/unit/generatorClient.test.ts`.
  - Finaliza cuando: entrada no compila en hilo principal; respuestas antiguas se descartan; coalescencia sin cola ilimitada; inferencias no crean bucles; fallo permite reintento y evita exportar contenido viejo.

## Diseño y estructura adaptable

- [x] T-001-16 — Auditar disponibilidad y licencias de tipografías.
  - RF: RF-09, RF-19.
  - Dependencias: autorización explícita; puede preceder al código de estética.
  - Archivos previstos: `docs/DECISIONS.md`, `public/fonts/` y avisos de licencia cuando corresponda.
  - Finaliza cuando: parejas exactas tienen recursos redistribuibles y locales; cada sustitución necesaria está aprobada y no se presenta como fuente original.
- [x] T-001-17 — Definir 21 arquetipos y cálculo de contraste.
  - RF: RF-09, RF-16, RF-24.
  - Dependencias: T-001-02, T-001-16.
  - Archivos previstos: `src/catalog/archetypes.ts`, `tests/unit/archetypes.test.ts`.
  - Finaliza cuando: 21 registros coinciden con colores, fuentes, radios y acabados del plan; contraste contempla alfa, texto de botones, AA y AAA sin afirmar aprobaciones falsas.
- [x] T-001-18 — Crear tokens y estilo distintivo del estudio.
  - RF: RF-20, RF-21, RF-24.
  - Dependencias: T-001-01, T-001-16; aprobación de tema propuesto.
  - Archivos previstos: `src/styles/tokens.css`, `src/styles/app.css`.
  - Finaliza cuando: identidad suiza aprobada, tipografía local, foco visible, AA y movimiento reducido; iconos Lucide; controles de al menos 44 × 44 px.
- [x] T-001-19 — Construir estructura semántica y navegación de paneles.
  - RF: RF-20, RF-24.
  - Dependencias: T-001-07, T-001-18.
  - Archivos previstos: `src/app/StudioLayout.tsx`, `src/components/navigation/PanelNavigation.tsx`.
  - Finaliza cuando: tres rangos exactos, pestañas inferiores móviles, selector en tablet y tres columnas de escritorio; estado preservado y controles ocultos fuera del foco.
- [x] T-001-20 — Construir configurador de siete fases.
  - RF: RF-01, RF-02, RF-03, RF-24.
  - Dependencias: T-001-03, T-001-04, T-001-07, T-001-19.
  - Archivos previstos: `src/components/configurator/Configurator.tsx`, `PhaseSection.tsx`, `TechnologyField.tsx`.
  - Finaliza cuando: todas las fases son editables, filtradas y explicadas; acordeones y atajos funcionan con alternativas visibles; edición por campo no renderiza todo el estudio.
- [x] T-001-21 — Integrar selector de conjuntos y confirmaciones.
  - RF: RF-04, RF-24.
  - Dependencias: T-001-05, T-001-20.
  - Archivos previstos: `src/components/configurator/PresetSelector.tsx`.
  - Finaliza cuando: confirma sustitución manual, resuelve variantes y aplica una transacción; cancelar conserva decisiones e idea; foco vuelve al invocador.
- [x] T-001-22 — Integrar paleta de comandos accesible.
  - RF: RF-05, RF-24.
  - Dependencias: T-001-08, T-001-17, T-001-21.
  - Archivos previstos: `src/components/command/CommandPalette.tsx`.
  - Finaliza cuando: Cmd/Ctrl + K, consulta aproximada, flechas, Enter, Escape y sin resultados cubren tecnologías, arquetipos y conjuntos; foco gestionado correctamente.
- [x] T-001-23 — Integrar editor de idea y sugerencias.
  - RF: RF-06, RF-07, RF-08, RF-23.
  - Dependencias: T-001-09, T-001-15, T-001-19.
  - Archivos previstos: `src/components/storyteller/IdeaEditor.tsx`, `ScopeBadges.tsx`.
  - Finaliza cuando: entradas y negaciones sincronizan inferencias compatibles; decisiones manuales prevalecen; aceptar/descartar sugerencias tiene efecto correcto; errores conservan entrada.
- [x] T-001-24 — Construir estudio estético y fichas de arquetipos.
  - RF: RF-09, RF-24, RF-25.
  - Dependencias: T-001-17, T-001-18, T-001-20.
  - Archivos previstos: `src/components/aesthetics/AestheticStudio.tsx`, `ArchetypeCard.tsx`.
  - Finaliza cuando: 21 fichas muestran pareja exacta, colores, categoría, párrafo, botón, tactilidad y contraste; carga diferida sin bloquear edición.

## Documentos, acciones y persistencia

- [x] T-001-25 — Construir visor documental y resaltado seguro.
  - RF: RF-10, RF-11, RF-21, RF-23, RF-25.
  - Dependencias: T-001-15, T-001-19.
  - Archivos previstos: `src/components/documents/DocumentCanvas.tsx`, `DocumentTabs.tsx`.
  - Finaliza cuando: seis documentos visibles y resaltados sin ejecutar HTML; resaltado memorizado por documento/revisión; estados de actualización y error no ocultan la entrada.
- [x] T-001-26 — Construir árbol del kit y medidor de madurez.
  - RF: RF-12, RF-13, RF-24.
  - Dependencias: T-001-06, T-001-25.
  - Archivos previstos: `src/components/documents/FileTree.tsx`, `MaturityMeter.tsx`.
  - Finaliza cuando: árbol navegable refleja rutas reales del ZIP; porcentaje explica pilares y «No aplica»; navegación por teclado no modifica documentos.
- [x] T-001-27 — Implementar copia individual y prompt maestro.
  - RF: RF-11, RF-14, RF-24.
  - Dependencias: T-001-25.
  - Archivos previstos: `src/services/clipboard.ts`, `src/components/export/ExportBar.tsx`, `src/components/feedback/StatusMessage.tsx`.
  - Finaliza cuando: copia solo revisión vigente, feedback anunciado y fallback manual ante permisos/origen restringido.
- [x] T-001-28 — Implementar exportación ZIP local.
  - RF: RF-15, RF-23, RF-25.
  - Dependencias: T-001-14, T-001-25, T-001-27.
  - Archivos previstos: `src/services/zipExport.ts`, `tests/unit/zipExport.test.ts`.
  - Finaliza cuando: ZIP se descomprime y coincide exactamente con seis documentos actuales; rutas seguras, nombre válido, carga diferida, estado ocupado y recuperación de error.
- [x] T-001-29 — Implementar exportación de tokens por destino.
  - RF: RF-16.
  - Dependencias: T-001-17, T-001-27.
  - Archivos previstos: `src/services/tokenExport.ts`, `tests/unit/tokenExport.test.ts`.
  - Finaliza cuando: CSS/JSON contienen tokens exactos; configuración Tailwind solo se ofrece para perfil compatible; descarga no ejecuta código.
- [x] T-001-30 — Generar preparación segura y copiable.
  - RF: RF-17, RF-22, RF-23.
  - Dependencias: T-001-04, T-001-05, T-001-27.
  - Archivos previstos: `src/services/setupCommands.ts`, `tests/unit/setupCommands.test.ts`.
  - Finaliza cuando: plantillas reflejan destino y herramienta elegidos, identificador validado y escapado seguro; texto libre no se interpola ni se ejecutan órdenes.
- [x] T-001-31 — Implementar guardado y recuperación del borrador.
  - RF: RF-18, RF-23.
  - Dependencias: T-001-02, T-001-07, T-001-23.
  - Archivos previstos: `src/services/draftStorage.ts`, `tests/unit/draftStorage.test.ts`.
  - Finaliza cuando: restauración versionada, cuota y corrupción recuperables, guardado diferido; secretos aparentes/emojis no se guardan; borrado confirmado afecta solo clave propia.
- [x] T-001-32 — Implementar preparación offline y actualización de caché.
  - RF: RF-19, RF-26.
  - Dependencias: T-001-16, T-001-25, T-001-28, T-001-29, T-001-30, T-001-31.
  - Archivos previstos: `src/offline/service-worker.ts`, `src/services/offlineRegistration.ts`, `vite.config.ts`.
  - Finaliza cuando: build emite service worker/manifiesto válido; todos los recursos, fuentes y chunks diferidos se preparan; recarga offline en subruta funciona; actualización conserva edición.

## Verificación, guía y cierre

- [x] T-001-33 — Completar pruebas de regresión del dominio y motor.
  - RF: RF-02…10, RF-12, RF-13, RF-18, RF-21…23, RF-28.
  - Dependencias: T-001-14, T-001-15, T-001-17, T-001-28…31.
  - Archivos previstos: `tests/unit/`, `tests/fixtures/`.
  - Finaliza cuando: casos críticos del plan ejecutados con evidencia; determinismo, prioridades, rutas, borradores y coherencia del kit cubiertos; no se cuentan pruebas sin ejecutar.
- [x] T-001-34 — Verificar recorridos en navegador y sin conexión.
  - RF: RF-01, RF-03…05, RF-08, RF-10…19, RF-28.
  - Dependencias: T-001-20…32.
  - Archivos previstos: `tests/e2e/workflow.spec.ts`, `tests/e2e/offline.spec.ts`.
  - Finaliza cuando: edición, presets, paleta, conflictos, copia, ZIP, tokens y recarga offline pasan; fuentes de 21 arquetipos y revisión exportada comprobadas.
- [ ] T-001-35 — Auditar adaptación y accesibilidad en sus límites.
  - RF: RF-09, RF-20, RF-24.
  - Dependencias: T-001-20…27.
  - Archivos previstos: `tests/e2e/responsive.spec.ts`, `tests/e2e/accessibility.spec.ts`, archivos corregidos según hallazgos.
  - Finaliza cuando: 375/767/768/1279/1280/1440 px, zoom 200 %, teclado, lector, objetivos ≥44 × 44, foco, AA y movimiento reducido verificados; sin overflow de página.
- [x] T-001-36 — Medir y ajustar rendimiento.
  - RF: RF-15, RF-25.
  - Dependencias: T-001-15, T-001-24…32, T-001-34.
  - Archivos previstos: `tests/performance/`, servicios/componentes afectados, `docs/ENVIRONMENT_AND_VERIFICATION.md`.
  - Finaliza cuando: CA-11…13 medidos en entorno aprobado con p95, tamaños y trazas; ingreso/controles <16 ms, kit objetivo ≤150 ms, ZIP referencia <100 ms; incumplimientos se corrigen o quedan pendientes explícitos.
- [x] T-001-37 — Redactar README y guía de uso completa.
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

Autorización explícita recibida el 2026-10-06: especificación, arquitectura y T-001-01…39 aprobadas sin objeciones. Se ejecutan por dependencias y se verifican por bloques.

## Registro de ejecución

| Fecha | Actividad | Resultado |
|---|---|---|
| 2026-10-06 | Lectura de prompt y marco; redacción de especificación, plan, tareas y documentos de soporte | DOCUMENT; sin código, instalaciones ni pruebas de aplicación. |
| 2026-10-06 | Implementación autorizada, verificaciones por bloques, auditoría de licencias y sincronización | 36 tareas originales completadas; T-001-35,38,39 abiertas por revisión de accesibilidad manual pendiente. Evidencia en validation.md. |

## Punto de reanudación

Implementación funcional terminada; 40 de 43 tareas completadas con evidencia. T-001-35 tiene auditoría automática pasada y revisión con lector real pendiente. T-001-38 y T-001-39 tienen comandos y sincronización ejecutados, pero quedan abiertos por esa dependencia formal. No se presenta la aceptación del usuario como realizada.

Evidencia: [validation.md](validation.md). Último bloque: 22 pruebas unitarias, 34 pruebas de navegador (2 mediciones omitidas en Firefox), lint, TypeScript y build con salida 0. Rendimiento: entrada p95 1,6 ms; generación p95 42,9 ms; conjuntos p95 10,3 ms; ZIP p95 3,2 ms. Siguiente paso: auditoría con lector de pantalla real y cierre formal posterior.

## Ampliación autorizada — RF-30

- [x] T-001-40 — Incorporar catálogo Django por función y requisitos. Dependencia: T-001-37. Verificación: IDs únicos, clasificación, enlaces oficiales y compilación TypeScript.
- [x] T-001-41 — Aplicar requisitos entre selecciones y generar estructura Django. Dependencia: T-001-40. Verificación: complementos sin Django/DRF bloqueados; cambios preservan decisiones; kit coherente.
- [x] T-001-42 — Actualizar filtros reactivos, explicación y conteo de búsqueda. Dependencia: T-001-41. Verificación: recorrido visible Python → Django → API → complementos.
- [x] T-001-43 — Verificar ampliación y sincronizar documentación/remoto. Dependencia: T-001-42. Verificación: pruebas unitarias/navegador, lint, TypeScript, build, evidencia y push normal.

La ampliación no cierra los pendientes originales T-001-35,38,39.

Verificación de la ampliación: lint, TypeScript, 22 pruebas unitarias, build y 34 pruebas de navegador con salida 0. Dos mediciones omitidas en Firefox; sync por push normal.

## Contrato sustituido por ampliación 002

Las comprobaciones de seis documentos en T-001-14/24/27 corresponden al hito inicial. La ampliación autorizada reemplaza esa salida por 34 documentos y navegación por manifiesto. Sus tareas y evidencia se conservan solo localmente en la carpeta excluida de Git por el usuario. Los pendientes T-001-35,38,39 mantienen su condición original; no se confunde la verificación automática ampliada con lectura asistida real.

## Ampliación 004 — Implementación autorizada

Fecha: 2026-10-07. RF-004-* son requisitos nuevos de spec.md. La autorización explícita del 2026-10-07 habilita T-004-04…23. AGENTS.md define límites de lectura por fase/dominio. La secuencia siguiente es obligatoria; un fallo se corrige en su dominio antes de continuar, sin marcar resultados pendientes como completados.

- [x] T-004-01 — Crear AGENTS.md con entrada limitada y matriz de acceso.
  - RF: RF-004-01. Dominio: documentación. Dependencias: solicitud actual.
  - Archivos: AGENTS.md. Finaliza cuando: tres archivos de entrada, fases, dominios, prohibición UI/motor y puerta de autorización están documentados; no cambia aplicación.
- [x] T-004-02 — Formalizar ampliación, contratos, tareas y estado.
  - RF: RF-004-01…14. Dominio: documentación. Dependencia: T-004-01.
  - Archivos: specs/spec.md, plan.md, tasks.md; docs/PROJECT_STATUS.md, DECISIONS.md, TRACEABILITY.md y PROJECT.md; specs/README.md.
  - Finaliza cuando: cuatro mejoras y cambios de idioma/privacidad tienen criterios, modelos y pruebas propuestas; coherencia documental verificada; entregar resumen y detenerse.
- [x] T-004-03 — Registrar autorización concreta de implementación.
  - RF: RF-004-01,14. Dominio: documentación. Dependencia: T-004-02 y respuesta explícita del usuario.
  - Archivos: docs/PROJECT_STATUS.md, specs/tasks.md. Finaliza cuando: alcance e IDs autorizados quedan registrados; no inferir permiso de aprobaciones anteriores.
- [x] T-004-04 — Definir contrato y validación del diseño avanzado.
  - RF: RF-004-07,08,10,13. Dominio: núcleo. Dependencia: T-004-03.
  - Archivos: src/domain/design.ts, models.ts, validation.ts; src/catalog/designOptions.ts; tests/unit/design.test.ts.
  - Finaliza cuando: enums, HEX/alfa, números y familias locales se validan; resolución neutro/base/overrides es pura y única; ninguna lectura UI.
- [x] T-004-05 — Definir contrato y normalización de inferencia MCP.
  - RF: RF-004-04,05,13. Dominio: núcleo. Dependencia: T-004-04.
  - Archivos: src/domain/intent.ts, compatibility.ts; tests/unit/intent.test.ts.
  - Finaliza cuando: IDs, confianza, límites, exclusiones, prioridades y DTO de sugerencias se validan sin transporte/red ni lectura UI.
- [x] T-004-06 — Incorporar acciones públicas de diseño y migración de borrador.
  - RF: RF-004-07,12,13. Dominio: integración/servicios. Dependencia: T-004-05.
  - Archivos: src/store/editorStore.ts, src/services/draftStorage.ts, tests/unit/services.test.ts y design.test.ts.
  - Finaliza cuando: set/clear/select/detach son atómicos, revision cambia solo con valores válidos, presets conservan overrides y borradores antiguos recuperan base intacta; no inspeccionar sandbox ni compilador.
- [x] T-004-07 — Integrar diseño efectivo y madurez en núcleo documental.
  - RF: RF-004-10,13. Dominio: núcleo. Dependencia: T-004-06.
  - Archivos: src/domain/maturity.ts, src/engine/kitContext.ts, templates/plan.ts, constitution.ts y metadatos pertinentes; tests/unit/design.test.ts y kit.test.ts.
  - Finaliza cuando: diseño personal completo cuenta sin arquetipo; no visual excluye diseño; plan/constitution declaran todos los parámetros con 34 rutas/revisión coherentes; no leer UI.
- [x] T-004-08 — Exportar tokens y recetas reproducibles del diseño efectivo.
  - RF: RF-004-08,10. Dominio: servicios. Dependencia: T-004-07.
  - Archivos: src/services/tokenExport.ts; tests/unit/services.test.ts y design.test.ts.
  - Finaliza cuando: CSS/JSON/Tailwind usan el DTO efectivo, incluyen fuentes/código, colores, texturas, estados y movimiento; respetan perfil Tailwind y no amplían ZIP.
- [x] T-004-09 — Construir controles avanzados accesibles.
  - RF: RF-004-07,08,14. Dominio: UI. Dependencia: T-004-08.
  - Archivos: src/components/aesthetics/AdvancedDesignPanel.tsx, AestheticStudio.tsx, src/styles/app.css.
  - Finaliza cuando: todos los selectores y colores tienen etiqueta española, HEX temporal corregible y acciones públicas documentadas; adaptan al ancho real sin leer motor/compilador.
- [x] T-004-10 — Construir muestra interactiva, texturas y contraste.
  - RF: RF-004-08,09,14. Dominio: UI. Dependencia: T-004-09.
  - Archivos: src/components/aesthetics/DesignSandbox.tsx, src/styles/app.css; pruebas específicas de diseño.
  - Finaliza cuando: una muestra usa valores efectivos, estados simulados y reales, seis acabados, ratios correctos, CSS/SVG local seguro y movimiento reducido; suscripciones aisladas y sin lectura núcleo.
- [x] T-004-11 — Implementar navegación compacta de 21 arquetipos.
  - RF: RF-004-11,14. Dominio: UI. Dependencia: T-004-10.
  - Archivos: src/components/aesthetics/ArchetypeCarousel.tsx, AestheticStudio.tsx, ArchetypeCard.tsx, src/styles/app.css.
  - Finaliza cuando: ficha única, contador, vuelta circular, flechas/teclado y foco operan sin alterar configuración/revisión; no autoplay ni capturar flechas de inputs.
- [x] T-004-12 — Integrar selección, desactivación y protección de personalización.
  - RF: RF-004-12,13. Dominio: UI/integración pública. Dependencia: T-004-11.
  - Archivos: src/components/aesthetics/ArchetypeCard.tsx, ArchetypeCarousel.tsx y diálogo de selección; tests/e2e/carousel.spec.ts.
  - Finaliza cuando: seleccionar/apagar es explícito, conservar/restablecer/cancelar tiene comportamiento verificable, overrides se preservan al navegar o desactivar y foco vuelve al invocador.
- [x] T-004-13 — Implementar transporte MCP HTTP con transmisión.
  - RF: RF-004-02,03,05,13. Dominio: servicios. Dependencia: T-004-12.
  - Archivos: src/services/mcpClient.ts; tests/unit/mcp.test.ts y servidor simulado de pruebas.
  - Finaliza cuando: initialize/initialized/list/call, JSON/SSE, IDs/sesión/versión, límites de cuerpo y cierre respetan contrato; datos/modelo ajenos nunca se ejecutan.
- [x] T-004-14 — Incorporar compatibilidad SSE heredada y cancelación.
  - RF: RF-004-03,05. Dominio: servicios. Dependencia: T-004-13.
  - Archivos: src/services/mcpClient.ts; tests/unit/mcp.test.ts.
  - Finaliza cuando: detección de transporte, evento endpoint mismo origen, POST de envío, SSE fragmentado/UTF-8 y aborto funcionan dentro de un único plazo, sin reintentos ilimitados.
- [x] T-004-15 — Coordinar inferencias locales/remotas y respuestas vigentes.
  - RF: RF-004-04,05,13. Dominio: servicios/trabajadores. Dependencia: T-004-14.
  - Archivos: src/services/intentCoordinator.ts, src/workers/generatorClient.ts y contrato público de mensajes; pruebas de coordinación.
  - Finaliza cuando: local inmediato, intervalo 300 ms, timeout total 1500 ms, una solicitud vigente, confianza/compatibilidad y cancelación por revisión/URL/apagado tienen resultados deterministas.
- [x] T-004-16 — Integrar inferencias externas en motor puro sin bucles.
  - RF: RF-004-04,05. Dominio: núcleo. Dependencia: T-004-15.
  - Archivos: src/domain/models.ts, src/engine/compiler.ts, matcher.ts, scopeRules.ts, src/workers/generator.worker.ts; tests/unit/intent.test.ts y worker.test.ts.
  - Finaliza cuando: DTO vigente sustituye solo inferencias de la misma idea, respeta manual/conjunto, fallback recompone local y no introduce red en compilador; no leer UI ni internals de transporte.
- [x] T-004-17 — Persistir preferencias MCP separadas y conectar acciones públicas.
  - RF: RF-004-02,06,13. Dominio: integración/servicios. Dependencia: T-004-16.
  - Archivos: src/store/mcpStore.ts, src/services/intentCoordinator.ts, src/app/App.tsx; pruebas de preferencias.
  - Finaliza cuando: URL/enabled/transporte persisten sin token/idea, prueba sin datos del usuario, desconexión limpia sesión y recursos MCP quedan fuera de service worker/ZIP.
- [x] T-004-18 — Construir ajustes y estado MCP del panel Idea.
  - RF: RF-004-02,06,14. Dominio: UI. Dependencia: T-004-17.
  - Archivos: src/components/storyteller/McpStatus.tsx, McpSettings.tsx, IdeaEditor.tsx, src/styles/app.css.
  - Finaliza cuando: aviso de envío y destino preceden activación, badge corresponde al estado válido, modal/prueba son accesibles y errores no interrumpen escritura; solo consume contratos públicos.
- [x] T-004-19 — Migrar UI/kit a español integral.
  - RF: RF-004-14. Dominio: integración pública. Dependencia: T-004-18.
  - Archivos: src/app/App.tsx, StudioLayout.tsx, src/store/uiStore.ts, editorStore.ts, src/components/navigation/LanguageToggles.tsx, src/i18n/; pruebas de migración y servicios.
  - Finaliza cuando: ambos controles ES/EN se retiran, preferencias previas se migran con explicación, no se pierden textos/decisiones y datos viejos no activan UI/kit ingleses.
- [x] T-004-20 — Completar textos españoles de núcleo/exportaciones y guía de usuario.
  - RF: RF-004-10,13,14. Dominio: núcleo/servicios/documentación, por subtareas sin lectura cruzada de internals. Dependencia: T-004-19.
  - Archivos: templates/contexto afectados, src/services/tokenExport.ts y setupCommands.ts, README.md, docs/PROJECT.md, tests/unit/languages.test.ts y tests/e2e/languages.spec.ts.
  - Finaliza cuando: 34 archivos, tokens, preparación, errores y políticas son españoles; tests de 003 sustituidos por migración; guía explica MCP opcional y diseño sin afirmar traducción libre ni conexión real no probada.
- [x] T-004-21 — Preparar y ejecutar regresión de escenarios funcionales.
  - RF: RF-004-01…14. Dominio: pruebas específicas durante IMPLEMENT; reportes durante VALIDATE. Dependencia: T-004-20.
  - Archivos: tests/unit/mcp.test.ts, design.test.ts, tests/e2e/mcp.spec.ts, design.spec.ts, carousel.spec.ts y suites existentes.
  - Finaliza cuando: matriz MCP, carreras, diseño, contraste, carrusel, datos antiguos, seguridad, offline y 34 contenidos/ZIP/copia tienen evidencia; la conexión simulada se distingue del endpoint real.
- [x] T-004-22 — Verificar accesibilidad, adaptación y presupuestos.
  - RF: RF-004-05,09,11,14. Dominio: VALIDATE. Dependencia: T-004-21.
  - Evidencia: salidas de tests/e2e/performance.spec.ts y accesibilidad, trazas y docs/ENVIRONMENT_AND_VERIFICATION.md.
  - Finaliza cuando: 320/375/767/768/1279/1280/1440 px, teclado/foco, AA/movimiento reducido y >=200 ajustes con p95 <16 ms sin renders ajenos se registran; generación <=150 ms, ZIP <100 ms y timeout MCP verificados. Fallos vuelven a tarea IMPLEMENT del dominio correspondiente.
- [ ] T-004-23 — Cerrar evidencia técnica y sincronizar hito autorizado.
  - RF: RF-004-01…14. Dominio: VALIDATE/documentación. Dependencia: T-004-22.
  - Archivos: specs/validation.md, docs/TRACEABILITY.md, PROJECT_STATUS.md, specs/tasks.md e historial Git.
  - Finaliza cuando: lint, TypeScript, unitarias/E2E y build tienen códigos reales, texto sin emojis comprobado, límites manuales honestos, tareas verificadas y push normal sin archivos de 002 ni secretos. Aceptación y despliegue separados.

Puerta actual: implementación autorizada el 2026-10-07; tareas de aplicación y verificaciones se registran individualmente. No instalar dependencias ajenas al plan. Los pendientes históricos T-001-35,38,39 se conservan y no se marcan como cerrados por planificar esta ampliación.

Evidencia final 004 (2026-10-07): lint, TypeScript, 52 unitarias, build y 75 pruebas de navegador correctos; tres mediciones omitidas en Firefox. Muestra de 200 ajustes p95 3,8 ms y seis áreas ajenas sin renders adicionales. T-004-23 registra el push y su comprobación; no se cierran pendientes manuales de 001.
