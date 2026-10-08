# Trazabilidad prevista

Fecha: 2026-10-06. Implementación funcional existente. Evidencia: 35 pruebas unitarias y 50 recorridos de navegador pasan; véase [validation.md](../specs/validation.md). Auditoría con lector real pendiente.

«RF-01» abrevia `RF-001-01`; «T01» abrevia `T-001-01`. Los criterios CA se definen en [spec.md](../specs/spec.md).

| Requisito | Tareas | Archivos/componentes implementados | Verificación ejecutada o pendiente |
|---|---|---|---|
| RF-01 | T03, T20, T34 | Configurator, PhaseSection | Siete fases y atajos; CA-01/09. |
| RF-02 | T03, T20, T33 | catalog/technologies | Cobertura e IDs ≥201; CA-01. |
| RF-03 | T02, T04, T20, T34 | compatibility, TechnologyField | Filtrado, conflictos, CLI sin CSS; CA-01/03. |
| RF-04 | T05, T21, T34 | presets, PresetSelector | Ocho conjuntos, atomicidad, cancelación; CA-01/03. |
| RF-05 | T03, T08, T22, T34 | matcher, CommandPalette | Búsqueda aproximada y teclado; CA-01/09. |
| RF-06 | T08, T15, T23 | tokenizer, IdeaEditor | Erratas y edición fluida; CA-02/11. |
| RF-07 | T04, T07, T08, T15, T23 | editorStore, matcher | Negación, prioridades, no bucles; CA-02/03. |
| RF-08 | T09, T23, T34 | scopeRules, ScopeBadges | Aceptar/descartar persistencia; CA-02. |
| RF-09 | T16, T17, T24, T35 | archetypes, ArchetypeCard | 21 fichas, licencias y contraste; CA-04/09. |
| RF-10 | T10…15, T25, T33, T34 | templates, compiler, DocumentCanvas | Seis rutas y revisión consistente; CA-05. |
| RF-11 | T25, T27, T34 | DocumentTabs, clipboard | Visor inerte y copia; CA-05/07/10. |
| RF-12 | T11, T14, T26, T33 | targetTree, FileTree | Árbol del kit igual a ZIP; CA-05/07. |
| RF-13 | T06, T09, T14, T26, T33 | maturity, MaturityMeter | Fórmula y pilares aplicables; CA-06. |
| RF-14 | T27, T34 | clipboard, ExportBar | Prompt actual y fallback; CA-07. |
| RF-15 | T28, T34, T36 | zipExport | Descompresión y p95; CA-07/13. |
| RF-16 | T11, T17, T29, T34 | tokenExport | Tokens exactos y formato compatible; CA-04/07. |
| RF-17 | T30, T34 | setupCommands | Identificadores y copia sin ejecutar; CA-07/10. |
| RF-18 | T02, T31, T33, T34 | draftStorage | Cuota, corrupción, restauración; CA-08/10. |
| RF-19 | T16, T32, T34 | fonts, service-worker | Recarga y exportación sin red; CA-08. |
| RF-20 | T07, T18, T19, T35 | StudioLayout, PanelNavigation | Límites 767/768/1279/1280; CA-09. |
| RF-21 | T10, T13, T18, T25, T33, T37, T38 | UI, templates, README | Idioma de UI/kit según RF-003; ausencia de emojis; CA-05/10/15. |
| RF-22 | T04, T13, T30, T33 | constitution, orchestrator | Guardrails por destino; CA-10. |
| RF-23 | T02, T14, T23, T25, T28, T30, T31, T33, T38 | validation y servicios | XSS, traversal, secretos sintéticos; CA-10. |
| RF-24 | T17…22, T24, T26, T27, T35 | Primitivas, árbol y estilos | Teclado, foco, AA, zoom; CA-09. |
| RF-25 | T01, T07, T15, T24, T25, T28, T36 | Stores, worker y exportación | Trazas y presupuestos; CA-11/12/13. |
| RF-26 | T01, T32, T38 | Vite, base y build | dist/ en raíz y subruta; CA-14. |
| RF-27 | T37 | README | Dos apartados y cuatro pasos; CA-15. |
| RF-28 | T12, T13, T33, T34, T37 | taskGraph, orchestrator | DOCUMENT y autorización posterior; CA-05. |
| RF-29 | T39; sincronización documental de Fase 1 | Git y documentos de estado | SHA remoto e historial preservado; CA-15. |
| RF-30 | T40…43 | Catálogo, modelos, compatibilidad, TechnologyField, Configurator, targetTree | tests/unit/django.test.ts y tests/e2e/django.spec.ts; Django, prerrequisitos, kit y conflictos. |

Las rutas abreviadas corresponden a `src/components/`, `src/domain/`, `src/catalog/`, `src/services/` y `src/engine/`; todas existen. Las pruebas se encuentran en `tests/unit/` y `tests/e2e/`. RF-24 está verificado automáticamente, con lector real pendiente en T-001-35. RF-29 tiene sincronización ejecutada y cierre formal pendiente por dependencia T-001-38. Los demás resultados y sus límites se enlazan en validation.md; no equivalen a aceptación del usuario.

## Ampliación 002 — trazabilidad técnica

Implementación autorizada; evidencias detalladas locales excluidas de Git. Inventario y responsabilidades por archivo: plan local excluido de Git.

| Requisito | Tareas propuestas | Verificación prevista | Estado |
|---|---|---|---|
| RF-002-01 | T-002-01,05…10,13,14 | 30 rutas base más cuatro activas, ZIP descomprimido y estructura | Verificado automáticamente; límites manuales pendientes |
| RF-002-02 | T-002-02,04…09,13 | Cambios de configuración, determinismo y revisión común | Verificado automáticamente; límites manuales pendientes |
| RF-002-03 | T-002-02,04…08,13 | Estados honestos, decisiones por origen, guías y registros | Verificado automáticamente; límites manuales pendientes |
| RF-002-04 | T-002-01,03,04,06…09,13 | Numeración, IDs, referencias y grafo | Verificado automáticamente; límites manuales pendientes |
| RF-002-05 | T-002-03…08,13 | Matriz de destinos; Django y complementos | Verificado automáticamente; límites manuales pendientes |
| RF-002-06 | T-002-10,11,13 | Árbol, visor, copia, teclado y foco | Verificado automáticamente; límites manuales pendientes |
| RF-002-07 | T-002-01,09,10,12,13 | Rutas, límites, ZIP, trabajador y offline | Verificado automáticamente; límites manuales pendientes |
| RF-002-08 | T-002-02,11…13 | Borradores previos, prioridades y transición | Verificado automáticamente; límites manuales pendientes |

La ampliación pasa pruebas de manifiesto, referencias, perfiles, ocho conjuntos, ZIP, seguridad y revisión en tests/unit/kit.test.ts; navegación completa, TXT, ZIP, borrador anterior y actualización offline en tests/e2e/kit.spec.ts. Evidencia detallada de 002 se conserva solo localmente por mandato del usuario; no se atribuye aceptación ni lectura asistida real.

## Ampliación 003 — Idiomas independientes

| Requisito | Tareas | Implementación | Evidencia |
|---|---|---|---|
| RF-003-01 | T-003-02,04 | i18n, componentes UI, App, búsqueda | Mensajes, fases, catálogo, diálogos, errores y lang; languages.spec.ts |
| RF-003-02 | T-003-03,04 | Templates, kitContext, targetProfile, tokens | 34 contenidos bilingües, ocho conjuntos, Django, ZIP y copia; languages.test.ts/languages.spec.ts |
| RF-003-03 | T-003-01,04 | uiStore, editorStore, Configuration | Cuatro combinaciones, revisión independiente, recarga y offline |
| RF-003-04 | T-003-03,04 | Renderer literal/template y metadatos | Textos incluso coincidentes con traducciones preservados; rutas y referencias iguales |
| RF-003-05 | T-003-01,02,04 | Validación, restauración, LanguageToggles y CSS | Borradores antiguos, idioma inválido, teclado, almacenamiento restringido y ancho 320 px |

Resultados reales de la ampliación en specs/003-idiomas/validation.md. No se atribuye revisión con lector de pantalla real.

## Ampliación 004 — Trazabilidad de implementación y verificación

| Requisitos | Tareas | Verificación ejecutada |
|---|---|---|
| RF-004-01 | T-004-01…03 | AGENTS, matriz de acceso, puerta de revisión y estado |
| RF-004-02,03,05,06 | T-004-13…18,21…23 | MCP simulado HTTP/SSE/heredado, timeout, carreras, configuración, privacidad y estado |
| RF-004-04 | T-004-05,15,16,21 | IDs, confianza, compatibilidad, prioridad manual y recomposición local |
| RF-004-07,08,09,10 | T-004-04,06…10,20…23 | Todos los controles, resolución única, ratios reales, <16 ms y kit/tokens coherentes |
| RF-004-11,12 | T-004-06,11,12,21,22 | 21 posiciones, navegación sin commit, selección/desactivación y ajustes preservados |
| RF-004-13,14 | T-004-04…23 | Migración, español, cero emojis, offline, límites, accesibilidad, 34 rutas y Git |

El usuario aprobó formalmente la planificación y autorizó implementación el 2026-10-07. Los bloques funcionales están implementados y su evidencia se registra en specs/validation.md, apartado 004. El cierre Git se registra por separado al sincronizar el hito; no se atribuye aceptación ni conexión a un modelo externo real.

Evidencia concreta: tests/unit/design.test.ts (contratos, acciones, kit/tokens y alfa), intent.test.ts (DTO/umbrales/prioridad/fallback), mcp.test.ts (HTTP/SSE y preferencias), coordinator.test.ts (300/1500 ms y cancelación), worker.test.ts (cola y generación de solicitudes); tests/e2e/design.spec.ts, carousel.spec.ts, mcp.spec.ts, languages.spec.ts y performance.spec.ts, más regresión de kit/Django/offline/accesibilidad. Los informes de ejecución, presupuestos y limitaciones están en specs/validation.md.

## Ampliación 005 — H0, H1 y H2

| Requisitos | Tareas | Evidencia específica |
|---|---|---|
| RF-005-01 | T-005-03…06 | corpus.md, fixtures/corpus.json y baseline.json; vigencia histórica aclarada |
| RF-005-02 | T-005-07…10 | projectDefinition, projectMigration y projectStore.test.ts: formato, IDs, referencias, límites y migración |
| RF-005-03/04 | T-005-11/12 | projectDefinition.spec.ts: actor, requisito, criterio, recuperación y proceso sin código |
| RF-005-05/06 | T-005-13…15 | projectProjection y projectCorpus.test.ts: 34 documentos, determinismo, grafo y criterios No ejecutado |
| RF-005-07/08 | T-005-16/17 | readiness.test.ts y projectDefinition.spec.ts: pendientes, contradicciones conocidas, consentimiento y bloqueos seguros |
| RF-005-15, parte H0–H2 | T-005-08/09/18/19/35 | Regresión, corpus, volumen y banco comparison.json; evidencia en validation.md de 005 |
| RF-005-09…14 | T-005-20…34 | Pospuestos por el usuario, sin implementación ni verificación nueva |

La evaluación técnica de tiempos/hallazgos fue autorizada ante falta de participantes. No verifica revisión semántica, esfuerzo humano ni aceptación; la migración H1 conserva el borrador actual sin desarrollar multiproyecto o importación de H3.
