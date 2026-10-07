# Trazabilidad prevista

Fecha: 2026-10-06. Implementación funcional existente. Evidencia: 22 pruebas unitarias y 34 recorridos de navegador pasan; véase [validation.md](../specs/validation.md). Auditoría con lector real pendiente.

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
| RF-21 | T10, T13, T18, T25, T33, T37, T38 | UI, templates, README | Español y ausencia de emojis; CA-05/10/15. |
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

## Ampliación 002 — trazabilidad propuesta

Estado DOCUMENT; ninguna implementación o prueba de esta ampliación ejecutada. Inventario y responsabilidades por archivo: [plan](../specs/002-kit-completo/plan.md).

| Requisito | Tareas propuestas | Verificación prevista | Estado |
|---|---|---|---|
| RF-002-01 | T-002-01,05…10,13,14 | 30 rutas base más cuatro activas, ZIP descomprimido y estructura | Propuesto |
| RF-002-02 | T-002-02,04…09,13 | Cambios de configuración, determinismo y revisión común | Propuesto |
| RF-002-03 | T-002-02,04…08,13 | Estados honestos, decisiones por origen, guías y registros | Propuesto |
| RF-002-04 | T-002-01,03,04,06…09,13 | Numeración, IDs, referencias y grafo | Propuesto |
| RF-002-05 | T-002-03…08,13 | Matriz de destinos; Django y complementos | Propuesto |
| RF-002-06 | T-002-10,11,13 | Árbol, visor, copia, teclado y foco | Propuesto |
| RF-002-07 | T-002-01,09,10,12,13 | Rutas, límites, ZIP, trabajador y offline | Propuesto |
| RF-002-08 | T-002-02,11…13 | Borradores previos, prioridades y transición | Propuesto |
