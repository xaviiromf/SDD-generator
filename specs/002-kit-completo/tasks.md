# Tareas propuestas — 002 / Kit SDD completo y adaptable

Fecha: 2026-10-06. Estado: DOCUMENT. Todas las tareas están sin ejecutar; implementación pendiente de instrucciones del usuario. Requisitos: [spec.md](spec.md). Arquitectura e inventario: [plan.md](plan.md).

Las rutas de código son propuestas. Se mantiene la pila aprobada de 001; no se instala nada en esta fase. Cada bloque se verifica antes de marcarlo completado y registra cualquier limitación.

- [ ] T-002-01 — Definir el contrato de documentos y manifiesto completo.
  - RF: RF-002-01, RF-002-04, RF-002-07.
  - Dependencias: ninguna.
  - Archivos previstos: `src/domain/models.ts`, `src/engine/kitManifest.ts`, `src/engine/references.ts`, `src/domain/validation.ts`.
  - Finaliza cuando: 30 rutas base más cuatro activas, identidad estable, formatos MD/TXT, slug validado, rutas únicas y lista permitida derivada de configuración; pruebas de rutas peligrosas y enlaces relativos.

- [ ] T-002-02 — Construir el contexto único de adaptación.
  - RF: RF-002-02, RF-002-03, RF-002-08.
  - Dependencias: T-002-01.
  - Archivos previstos: `src/engine/kitContext.ts`, modelos y validación.
  - Finaliza cuando: configuración efectiva, orígenes, revisión, estado DOCUMENT, tokens aplicables y datos pendientes se comparten sin inventar fechas, entorno, aprobación o inspección; entradas iguales producen contexto igual.

- [ ] T-002-03 — Unificar perfiles de destino, RF, tareas y archivos propuestos.
  - RF: RF-002-04, RF-002-05.
  - Dependencias: T-002-02.
  - Archivos previstos: `src/engine/targetProfile.ts`, `targetTree.ts`, `taskGraph.ts`, `templates/tasks.ts`, `services/setupCommands.ts`.
  - Finaliza cuando: IDs RF/T numerados y un solo grafo; Django apunta a config/apps/manage.py y complementos seleccionados; rutas/mandatos web no se imponen a CLI u otros destinos. Recetas incompletas declaran pendientes; comandos son candidatos y no se ejecutan.

- [ ] T-002-04 — Adaptar las seis plantillas existentes a las rutas y contratos nuevos.
  - RF: RF-002-02, RF-002-03, RF-002-04, RF-002-05.
  - Dependencias: T-002-03.
  - Archivos previstos: plantillas de spec, plan, tasks, constitution, project y orchestrator; referencias comunes.
  - Finaliza cuando: los documentos activos se ubican en la carpeta numerada y usan el mismo contexto/IDs/perfil; ya no quedan enlaces al layout plano ni referencias posicionales necesarias.

- [ ] T-002-05 — Generar raíz, contexto y manuales completos.
  - RF: RF-002-01, RF-002-02, RF-002-03, RF-002-05.
  - Dependencias: T-002-04.
  - Archivos previstos: módulos bajo `src/engine/templates/` para README, AGENTS, TECHNICAL_CONTEXT, SDD_MANUAL y MANUAL-PARA-USUARIO; constitución ya adaptada.
  - Finaliza cuando: seis archivos raíz, nombres exactos, texto español/UTF-8, instrucciones pertinentes al destino y enlaces correctos. Cada documento cumple su función; no añade tecnologías a la pila.

- [ ] T-002-06 — Generar los registros de gobernanza restantes.
  - RF: RF-002-01, RF-002-02, RF-002-03, RF-002-04, RF-002-05.
  - Dependencias: T-002-05.
  - Archivos previstos: módulos de gobernanza bajo `src/engine/templates/`; contexto y perfiles comunes.
  - Finaliza cuando: docs contiene sus diez archivos; arquitectura distingue propuesta de observación, decisiones conservan origen sin aprobación ficticia, estado/trazabilidad apuntan a 001 y verificaciones están no ejecutadas. Exclusiones no se convierten en roadmap autorizado.

- [ ] T-002-07 — Generar las guías de todas las fases.
  - RF: RF-002-01, RF-002-02, RF-002-03, RF-002-04, RF-002-05.
  - Dependencias: T-002-06.
  - Archivos previstos: módulos de prompts bajo `src/engine/templates/`; plantilla de orquestador.
  - Finaliza cuando: prompts contiene índice y 00…07; el orquestador resuelve la especificación activa; DOCUMENT, autorización, implementación, validación, cambios y pausa/reanudación mantienen límites y referencias del marco adaptados al destino.

- [ ] T-002-08 — Generar índice, plantillas reutilizables y registro inicial de validación.
  - RF: RF-002-01, RF-002-03, RF-002-04, RF-002-05.
  - Dependencias: T-002-07.
  - Archivos previstos: módulos de índice, plantillas y validation bajo `src/engine/templates/`.
  - Finaliza cuando: specs contiene índice, cuatro plantillas y cuatro archivos activos; marcadores futuros diferenciados, numeración secuencial documentada y validation activo «No ejecutado», sin resultados ni aceptación simulados.

- [ ] T-002-09 — Compilar y publicar el kit completo atómicamente.
  - RF: RF-002-01, RF-002-02, RF-002-04, RF-002-07.
  - Dependencias: T-002-08.
  - Archivos previstos: `src/engine/compiler.ts`, trabajador, cliente generador, almacén documental.
  - Finaliza cuando: 34 archivos coherentes por revisión, determinismo y límite de 1 MiB; recomposición de slug/stack/alcance sin restos ni revisiones mezcladas; enlaces y grafo comprobados; errores recuperables y resultados obsoletos descartados.

- [ ] T-002-10 — Exportar y copiar mediante el manifiesto de la revisión activa.
  - RF: RF-002-01, RF-002-06, RF-002-07.
  - Dependencias: T-002-09.
  - Archivos previstos: `src/services/zipExport.ts`, `clipboard.ts`, `src/components/export/ExportBar.tsx`.
  - Finaliza cuando: ZIP descomprimido coincide con manifiesto/preview en rutas, contenido y revisión; rechaza extras, faltantes, duplicados y traversal; copias por identidad incluyen el orquestador correcto; tokens siguen siendo exportación independiente.

- [ ] T-002-11 — Navegar todos los documentos con árbol y visor accesibles.
  - RF: RF-002-06, RF-002-08.
  - Dependencias: T-002-10.
  - Archivos previstos: `FileTree.tsx`, `DocumentTabs.tsx`, `uiStore.ts`, estilos necesarios.
  - Finaliza cuando: árbol anidado real y contador dinámico; cualquier archivo visible/copiable; nombres repetidos distinguibles, accesos rápidos habituales, selección estable al cambiar slug, TXT correcto, teclado/foco y adaptación en los tres rangos sin fila de 34 pestañas.

- [ ] T-002-12 — Verificar transición de borradores y caché offline.
  - RF: RF-002-07, RF-002-08.
  - Dependencias: T-002-11.
  - Archivos previstos: `draftStorage.ts`, registro/caché nativa y configuración de build solo si la transición lo requiere.
  - Finaliza cuando: borrador anterior regenera el kit nuevo sin pérdida; caché anterior comunica actualización y no recarga durante edición; instalación actual funciona sin red incluyendo generación, consulta y exportación. No exige modificar el sistema operativo.

- [ ] T-002-13 — Ejecutar regresión completa y medir presupuestos del kit ampliado.
  - RF: RF-002-01…08.
  - Dependencias: T-002-12.
  - Archivos previstos: pruebas unitarias/E2E y fixtures sintéticos; scripts existentes.
  - Finaliza cuando: matriz de perfiles/ocho conjuntos, referencias, RF/tareas/rutas, seguridad, navegación, recuperación y offline comprobados; lint, typecheck, unitarias, build y E2E con resultados reales; 30 kits, 230 eventos/30 revisiones y 30 conjuntos medidos según el plan. Lector real/WebKit pendientes se declaran como tales si no pueden ejecutarse.

- [ ] T-002-14 — Registrar evidencia, cerrar documentación y sincronizar el hito.
  - RF: RF-002-01…08.
  - Dependencias: T-002-13.
  - Archivos previstos: `specs/002-kit-completo/validation.md`, estos documentos, README, índice y docs de estado/decisiones/trazabilidad.
  - Finaliza cuando: evidencia técnica y límites registrados, contrato de seis archivos sustituido explícitamente en documentos vigentes, tareas marcadas según verificación real y commit/push normal autorizado sin secretos. No atribuye aceptación al usuario ni cierra los pendientes manuales originales; no publica un sitio.

## Punto de reanudación

Documentación preparada para revisión. Ninguna T-002 ha comenzado. Siguiente paso: recibir instrucciones del usuario; implementar solo cuando lo autorice explícitamente, siguiendo T-002-01…14. La existencia del plan no revoca los pendientes ni modifica la aplicación entregada de 001.
