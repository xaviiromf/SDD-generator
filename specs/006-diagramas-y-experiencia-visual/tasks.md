# Tareas — 006

Fecha: 2026-10-08. H1 y H2 **autorizados** el 2026-10-08, secuenciales y con commits/push separados. [Requisitos y aceptación](spec.md), [contratos y dominios](plan.md), [evidencia](validation.md).

## Reglas de ejecución

T-006-02…27 autorizadas en esta solicitud; registrar autorización antes de código e instalar exclusivamente Mermaid 12.1.0. Casillas pendientes indican trabajo aún no realizado. No iniciar H2 sin H1 verificado/cerrado y autorización que incluya H2. H5 de 005 y Parte 3 quedan excluidos.

Entrada de cada tarea: AGENTS.md, estado del proyecto y apartado pertinente de spec, máximo tres archivos y en ese orden. Identificar tarea/fase/dominio en PROJECT_STATUS antes de lectura posterior; abrir solo su contrato de plan y las rutas indicadas. Los consumidores pueden leer tipos públicos nombrados, nunca internals del otro dominio. Pruebas específicas previstas aquí son archivos futuros, no lecturas efectuadas. VALIDATE ejecuta verificaciones autorizadas y lee únicamente salidas; correcciones vuelven a IMPLEMENT mediante tarea registrada.

## DOCUMENT y autorización

- [x] T-006-01 — Crear propuesta formal y verificar documentación.
  - Fase/dominio: DOCUMENT / especificaciones y documentación. Dependencias: ninguna.
  - RF: RF-006-01 a RF-006-15; RNF-006-01 a RNF-006-06. CA: CA-006-01 a CA-006-17. Decisiones: D-006-01 a D-006-08.
  - Archivos: esta carpeta, specs/README.md y docs/PROJECT_STATUS.md; lecturas documentales/manifiesto/inventario y fuentes oficiales delimitadas.
  - Cierre: cuatro documentos, enlaces locales e IDs/dependencias válidos, cero emojis y diff correcto; evidencia en validation. Detenerse para revisión. Sin código, instalación, build nuevo, commit ni push.
- [x] T-006-02 — Registrar autorización y versión de dependencia.
  - Fase/dominio: DOCUMENT / especificaciones y documentación. Dependencias: T-006-01 y decisión explícita del usuario.
  - RF: RF-006-15. RNF: RNF-006-02, RNF-006-06. CA: CA-006-17. Decisiones: D-006-02, D-006-08.
  - Archivos: plan/tasks/validation de 006 y docs/PROJECT_STATUS.md; documentación oficial y manifiestos para seleccionar versión exacta propuesta de Mermaid, licencia y compatibilidad.
  - Cierre: autorización identifica H1 y, si corresponde, H2, instalación/versionado de Mermaid y presupuestos. Si versión/dependencia no está autorizada, no avanzar a instalación. No exigir otra confirmación para acciones ya incluidas expresamente en la autorización recibida.

## H1 — Integración y Renderizado de Diagramas Mermaid

- [x] T-006-03 — Concretar contratos canónicos y de proyección.
  - Fase/dominio: IMPLEMENT / núcleo. Dependencias: T-006-02.
  - RF: RF-006-01, RF-006-03, RF-006-15. CA: CA-006-01, CA-006-03, CA-006-14. Decisiones: D-006-01, D-006-04.
  - Rutas: src/domain/diagrams.ts (nuevo), projectDefinition.ts, projectValidation.ts, models.ts, validation.ts, projectLibrary.ts; tests/unit/diagramContracts.test.ts (nuevo). Inventario/contrato público del manifiesto de 34 rutas para fijar documentId/path de arquitectura; registrar en plan antes de plantillas.
  - Cierre: DTO/límites/acciones/error documentados; relaciones opcionales seguras, referencias tipadas y campos pendientes aceptados; borrador antiguo conserva significado; eliminación referenciada rechazada. Tipos y pruebas específicas correctos.
- [x] T-006-04 — Generar arquitectura y proyección de vista previa.
  - Fase/dominio: IMPLEMENT / núcleo. Dependencias: T-006-03.
  - RF: RF-006-01, RF-006-02, RF-006-09. CA: CA-006-01, CA-006-02, CA-006-09. Decisiones: D-006-01, D-006-06.
  - Rutas: src/engine/diagramProjection.ts (nuevo), profileProjection.ts, projectProjection.ts; tipos públicos de diagrams/profiles/projectDefinition; tests/unit/diagramArchitecture.test.ts (nuevo).
  - Cierre: función pura única para kit/mapa, TD de componentes/tecnologías/dependencias, vacíos/diagnósticos y orden estable; no inspeccionar UI ni servicios.
- [x] T-006-05 — Generar entidades y secuencias por RF.
  - Fase/dominio: IMPLEMENT / núcleo. Dependencias: T-006-04.
  - RF: RF-006-01, RF-006-03, RF-006-04. CA: CA-006-03, CA-006-04. Decisiones: D-006-04.
  - Rutas: src/engine/diagramProjection.ts; tipos públicos; tests/unit/diagramFlows.test.ts (nuevo).
  - Cierre: ER con hechos explícitos y secuencia abstracta por RF, flujo feliz/alt/else/excepciones conocidas o pendientes, escapes/IDs válidos; sin llamadas internas ficticias ni secuencias RNF.
- [x] T-006-06 — Integrar trazabilidad y fuentes en las plantillas vigentes.
  - Fase/dominio: IMPLEMENT / núcleo. Dependencias: T-006-05.
  - RF: RF-006-01, RF-006-05, RF-006-15. CA: CA-006-01, CA-006-05. Decisiones: D-006-01, D-006-07.
  - Rutas: src/engine/diagramProjection.ts, compiler.ts, coverage.ts, taskGraph.ts, kitManifest.ts; templates/root.ts, spec.ts, plan.ts, tasks.ts; tests/unit/diagramKit.test.ts (nuevo) y kit.test.ts para regresión de 34 rutas.
  - Cierre: LR basado en enlaces reales/parciales, partición completa, ubicación de arquitectura documentada; spec/plan comparten fuentes, revisión única y aportaciones conservadas; sin leer las demás plantillas.
- [x] T-006-07 — Incorporar Mermaid y verificar separación de módulos.
  - Fase/dominio: IMPLEMENT / integración pública de build. Dependencias: T-006-06 y permiso de instalación/versionado en T-006-02.
  - RF: RF-006-06. RNF: RNF-006-02, RNF-006-06. CA: CA-006-06, CA-006-16, CA-006-17. Decisiones: D-006-02, D-006-03.
  - Rutas: package.json, package-lock.json; vite.config.ts solo si se registra necesidad de ajuste. Contrato de import de renderer en plan; no abrir motor/UI para esta tarea.
  - Cierre: única dependencia directa nueva Mermaid con versión exacta; sin paquetes auxiliares ni CDN. Medición de principal/grafo de módulos se completa con renderer/UI y build final; no declararla cumplida por instalar.
- [x] T-006-08 — Implementar renderer local y política SVG.
  - Fase/dominio: IMPLEMENT / servicios. Dependencias: T-006-07.
  - RF: RF-006-06, RF-006-15. CA: CA-006-06, CA-006-14. Decisiones: D-006-03, D-006-05, D-006-06.
  - Rutas: src/services/diagramRenderer.ts, diagramSvgPolicy.ts, diagramRenderRuntime.ts y diagramFrame.ts (nuevos), diagram-renderer.html; tipo público diagrams.ts; tests/unit/diagramRenderer.test.ts (nuevo).
  - Cierre: import dinámico, parse/render estricto, rechazo de directivas/recursos, allowlist SVG, cola/caché/tokens/límites y errores recuperables; no publicar respuestas antiguas ni registrar fuentes sensibles.
- [x] T-006-09 — Exportar SVG y PNG con APIs locales.
  - Fase/dominio: IMPLEMENT / servicios. Dependencias: T-006-08.
  - RF: RF-006-08. CA: CA-006-08, CA-006-14. Decisiones: D-006-05.
  - Rutas: src/services/diagramExport.ts (nuevo), contratos públicos de renderer/política SVG; tests/unit/diagramExport.test.ts (nuevo); no inspeccionar internals UI.
  - Cierre: SVG autocontenido y PNG sin recorte/recursos externos, revisión/nombres/límites correctos, errores y liberación de recursos. Descargas de navegador se verifican en T-006-15/16.
- [x] T-006-10 — Conectar proyección de mapa por trabajador.
  - Fase/dominio: IMPLEMENT / trabajadores. Dependencias: T-006-09.
  - RF: RF-006-09. CA: CA-006-09. Decisiones: D-006-01, D-006-06.
  - Rutas: src/workers/generator.worker.ts, architecturePreviewClient.ts (nuevo); exports públicos concretados de diagramProjection y DTO diagrams.ts; tests/unit/diagramWorker.test.ts (nuevo).
  - Cierre: mensajes preview con proyecto/revisión/token, una solicitud reemplazable y descarte obsoleto. Consumir la función pública sin inspeccionar sus internals. Compilación del kit no importa renderer DOM.
- [x] T-006-11 — Preservar datos y preparar renderer para offline.
  - Fase/dominio: IMPLEMENT / servicios y offline. Dependencias: T-006-10.
  - RF: RF-006-15. RNF: RNF-006-01. CA: CA-006-01, CA-006-15. Decisiones: D-006-03, D-006-04.
  - Rutas: src/services/draftStorage.ts, libraryValidation.ts, projectImport.ts, projectStorage.ts, offlineRegistration.ts; src/offline/service-worker.js; tipos públicos de diagramas/configuración/biblioteca; tests/unit/diagramContinuity.test.ts (nuevo).
  - Cierre: hechos ER opcionales conservados por persistencia/importación/versiones; antiguos borradores válidos, cuota/conflictos no borran trabajo. Precache estático de chunks propios separado de ejecución de Mermaid; actualización no recarga edición. Registrar transición de subtarea continuidad a offline antes de sus lecturas.
- [x] T-006-12 — Publicar acciones, DTO y selectores.
  - Fase/dominio: IMPLEMENT / integración pública. Dependencias: T-006-11.
  - RF: RF-006-03, RF-006-06, RF-006-09, RF-006-15. CA: CA-006-01, CA-006-09. Decisiones: D-006-06.
  - Rutas: src/store/editorStore.ts, documentStore.ts, uiStore.ts; contratos públicos canónicos/worker/renderer nombrados en plan; tests/unit/diagramStore.test.ts (nuevo).
  - Cierre: acciones de relación transaccionales, publicación de revisión/proyección y selectores granulares; candidata de mapa no escribe proyecto; identidad/revisión no cambian por zoom. Sin lectura de componentes ni compilador.
- [x] T-006-13 — Incorporar bloques Mermaid a DocumentCanvas.
  - Fase/dominio: IMPLEMENT / interfaz y estética. Dependencias: T-006-12.
  - RF: RF-006-06, RF-006-07, RF-006-08. CA: CA-006-06, CA-006-07, CA-006-08. Decisiones: D-006-03, D-006-05.
  - Rutas: src/components/diagrams/ (nuevo), src/components/documents/DocumentCanvas.tsx, DocumentTabs.tsx y DocumentContent.tsx (nuevo), src/styles/app.css; DTO/acciones/API pública del renderer/exportador. No leer servicios internos ni motor.
  - Cierre: carga diferida, estados por bloque, Diagrama/Código, resumen, zoom/pan/ajuste y descarga con foco/teclado; errores preservan lectura/fuente; extracción respeta cercas y no ejecuta HTML.
- [x] T-006-14 — Añadir mapa reactivo y controles mínimos de relaciones ER.
  - Fase/dominio: IMPLEMENT / interfaz y estética. Dependencias: T-006-13.
  - RF: RF-006-03, RF-006-09, RF-006-15. CA: CA-006-03, CA-006-09. Decisiones: D-006-04, D-006-06.
  - Rutas: src/components/profiles/ProfileStudio.tsx y ProfilePanelRuntime.tsx (nuevo), src/components/requirements/ContextInterview.tsx, src/components/diagrams/, src/styles/app.css; tipos/acciones públicas de relaciones y preview.
  - Cierre: mapa al editar antes de aplicar, etiquetas Vista previa/Actualizando, cancelar/foco/candidato inválido; selector de extremos/cardinalidades/identificación y pendientes; no editor gráfico, no lectura de compilador.
- [x] T-006-15 — Preparar pruebas e instrumentación específicas de H1.
  - Fase/dominio: IMPLEMENT / pruebas de integración pública. Dependencias: T-006-14.
  - RF: RF-006-01 a RF-006-09, RF-006-15. CA: CA-006-01 a CA-006-09, CA-006-14 a CA-006-17. Decisiones: D-006-01 a D-006-06.
  - Rutas: tests/unit/diagram*.test.ts, tests/e2e/diagrams.spec.ts y diagramPolicy.spec.ts (nuevos), profiles.spec.ts, performance.spec.ts, kit.spec.ts, library.spec.ts, django.spec.ts, languages.spec.ts, workflow.spec.ts y accessibility.spec.ts; fixtures de esta ampliación dentro de tests, sin contenido de 002. No inspeccionar aplicación.
  - Cierre: parser real de versión fijada/corpus, exportación adversa/descargas, trazas lazy/offline/carreras y medición con mapa activo al volumen de referencia/máximo; pruebas verifican comportamiento observable y contratos, sin espejos de implementación.
- [x] T-006-16 — Validar H1 y presupuestos.
  - Fase/dominio: VALIDATE / salidas e informes. Dependencias: T-006-15.
  - RF: RF-006-01 a RF-006-09, RF-006-15. CA: CA-006-01 a CA-006-09, CA-006-14 a CA-006-17. Decisiones: D-006-08.
  - Lecturas: reportes de comandos/navegador/build/trazas; escrituras: validation.md, estado y trazabilidad verificable. No leer/modificar implementación o pruebas.
  - Cierre: lint/tipos/build/unitarias/regresión Chromium y Firefox, principal <500000 bytes e interacción p95 <16 ms, seguridad/offline/34 rutas correctos; registrar latencia SVG y límites. Fallo vuelve a tarea IMPLEMENT del dominio correspondiente; cero aceptación implícita.
- [x] T-006-17 — Cerrar documentalmente H1.
  - Fase/dominio: DOCUMENT / especificaciones y documentación. Dependencias: T-006-16.
  - RF: RF-006-15. CA: CA-006-17. Decisiones: D-006-08.
  - Rutas: documentos 006, README.md, docs/PROJECT_STATUS.md, docs/TRACEABILITY.md, docs/DECISIONS.md, specs/README.md; solo resultados verificados.
  - Cierre: manual de diagramas/mapa/exportación/offline, contratos finales, decisiones y límites actualizados; revisión/aceptación humana separada. No empezar H2 por marcar casillas.
- [x] T-006-18 — Sincronizar H1 autorizado y habilitar puerta H2.
  - Fase/dominio: DOCUMENT / cierre Git documental y del hito verificado. Dependencias: T-006-17.
  - RF: RF-006-15. CA: CA-006-17. Decisiones: D-006-08.
  - Alcance: diff/status/lista de archivos y resultados; commit de rutas autorizadas y push normal al remoto existente, excluyendo 002 y cambios ajenos. No modificar implementación.
  - Cierre: commit/push confirmados solo si forman parte del hito autorizado, sin despliegue ni reescritura. H2 queda pendiente si no fue autorizado; si ya lo fue, continuar sin solicitar permiso repetido.

## H2 — Dashboard del Proyecto y Visor Enriquecido

- [x] T-006-19 — Definir y proyectar overview y estados documentales.
  - Fase/dominio: IMPLEMENT / núcleo. Dependencias: T-006-18 y autorización de H2.
  - RF: RF-006-10, RF-006-12, RF-006-14. CA: CA-006-10, CA-006-12, CA-006-13. Decisiones: D-006-07.
  - Rutas: src/domain/projectOverview.ts, src/engine/documentStatus.ts (nuevos); compiler.ts, kitManifest.ts, coverage.ts, diagramProjection.ts (límites de partición de arquitectura para regresión del mapa), src/domain/readiness.ts y models.ts; tests/unit/projectOverview.test.ts (nuevo); contratos públicos canónicos/diagramas.
  - Cierre: tabla de aplicabilidad de 34 documentIds y razones de pendiente, contadores definidos y revisión única; validación prevista nunca cuenta como realizada; sin UI.
- [x] T-006-20 — Integrar portada y navegación mediante contratos.
  - Fase/dominio: IMPLEMENT / integración pública. Dependencias: T-006-19.
  - RF: RF-006-10, RF-006-14. CA: CA-006-10, CA-006-13. Decisiones: D-006-03, D-006-07.
  - Rutas: src/store/documentStore.ts, uiStore.ts, editorStore.ts (acción pública applyPreset y publicación de regresión); src/app/App.tsx, StudioLayout.tsx; DTO públicos ProjectOverview/DocumentStatus y contrato de props de portada. No abrir internals de UI/motor.
  - Cierre: DTO publicados con selector granular, montaje diferido de portada y destinos de navegación; raíz no escucha cada ajuste de estética/mapa.
- [x] T-006-21 — Construir dashboard del proyecto.
  - Fase/dominio: IMPLEMENT / interfaz y estética. Dependencias: T-006-20.
  - RF: RF-006-10, RF-006-12. CA: CA-006-10, CA-006-12. Decisiones: D-006-03, D-006-07.
  - Rutas: src/components/dashboard/ (nuevo), src/components/storyteller/IdeaEditor.tsx, src/components/requirements/ContextInterview.tsx y RequirementsEditor.tsx (solo montaje de detalles cerrados para regresión), src/components/diagrams/, src/components/navigation/PanelNavigation.tsx, src/components/configurator/Configurator.tsx, PhaseSection.tsx, TechnologyField.tsx y PresetSelector.tsx (controles y diálogo de conjunto para regresión de presupuesto), src/styles/app.css; DTO/acciones públicas de navegación.
  - Cierre: ficha, métricas/pendientes, arquitectura central reutilizada y accesos directos con foco; vacío/actualización visible, responsivo y sin nuevo documento de kit.
- [x] T-006-22 — Enriquecer visor Markdown.
  - Fase/dominio: IMPLEMENT / interfaz y estética. Dependencias: T-006-21.
  - RF: RF-006-11, RF-006-12, RF-006-13. CA: CA-006-11, CA-006-12, CA-006-14. Decisiones: D-006-05, D-006-07.
  - Rutas: src/components/documents/DocumentCanvas.tsx, DocumentTabs.tsx, DocumentContent.tsx, src/components/projects/ManualSections.tsx (montaje cerrado para regresión de presupuesto) y componentes auxiliares nuevos en documents/; src/styles/app.css; DTO públicos de estado.
  - Cierre: cinco alertas españolas respetando cercas/citas, badges no cromáticos, tablas semánticas con encabezado fijo/overflow; contenido preservado e inerte; sin dependencias adicionales.
- [x] T-006-23 — Enriquecer explorador documental.
  - Fase/dominio: IMPLEMENT / interfaz y estética. Dependencias: T-006-22.
  - RF: RF-006-12, RF-006-14. CA: CA-006-12, CA-006-13. Decisiones: D-006-07.
  - Rutas: src/components/documents/FileTree.tsx, DocumentCanvas.tsx, auxiliares documents/, src/components/navigation/PanelNavigation.tsx, src/styles/app.css; DocumentStatus/árbol/navegación públicos.
  - Cierre: 34 rutas, iconos Lucide por tipo, estados por documento/carpeta, explicación de pendientes, teclado/selección/foco y adaptación lateral/móvil coherentes.
- [x] T-006-24 — Preparar regresión e instrumentación H2.
  - Fase/dominio: IMPLEMENT / pruebas de integración pública. Dependencias: T-006-23.
  - RF: RF-006-10 a RF-006-15. CA: CA-006-10 a CA-006-17. Decisiones: D-006-07, D-006-08.
  - Rutas: tests/e2e/projectDashboard.spec.ts, documentExperience.spec.ts (nuevos); diagrams.spec.ts, performance.spec.ts, accessibility.spec.ts, workflow.spec.ts, kit.spec.ts y library.spec.ts; tests/unit/projectOverview.test.ts y tests/fixtures/visualProject.ts. No inspeccionar aplicación.
  - Cierre: fixtures Markdown mixto/pendientes, navegación/descargas/continuidad, teclado y mediciones con dashboard/mapa activo; regresión H1 incorporada.
- [x] T-006-25 — Validar H2 y regresión completa H1/H2.
  - Fase/dominio: VALIDATE / salidas e informes. Dependencias: T-006-24.
  - RF: RF-006-01 a RF-006-15. CA: CA-006-01 a CA-006-17. Decisiones: D-006-08.
  - Lecturas: resultados, trazas y tamaños; escrituras: validation/estado/trazabilidad y reportes en docs/evidence/006-h2/. No implementación ni archivos de pruebas.
  - Cierre: comandos y recorridos funcionales sin fallos, <500000 bytes y p95 <16 ms, responsive/AA/descargas/offline sin regresión. Omitidos/limitaciones explícitos; fallos vuelven a IMPLEMENT registrado.
- [x] T-006-26 — Consolidar manual y evidencia final de H2.
  - Fase/dominio: DOCUMENT / especificaciones y documentación. Dependencias: T-006-25.
  - RF: RF-006-15. CA: CA-006-17. Decisiones: D-006-08.
  - Rutas: documentos 006, README.md, docs/PROJECT_STATUS.md, docs/TRACEABILITY.md, docs/DECISIONS.md, specs/README.md.
  - Cierre: manual de portada/visor/estados, métricas observadas y límites, enlaces/IDs correctos; Parte 3 excluida, H5 de 005 intacto y aceptación pendiente hasta revisión humana.
- [ ] T-006-27 — Sincronizar H2 autorizado.
  - Fase/dominio: DOCUMENT / cierre del hito verificado. Dependencias: T-006-26.
  - RF: RF-006-15. CA: CA-006-17. Decisiones: D-006-08.
  - Alcance: diff/status/lista de archivos y resultados; commit/push normal del hito autorizado, sin archivos de 002, cambios ajenos, force ni despliegue.
  - Cierre: resultados Git y revisión remota registrados; aceptación del cliente y publicación del sitio son decisiones separadas.

## Estado y próximo paso

T-006-01…18 completadas. H1 sincronizada como 8514ddc y árbol limpio confirmado. T-006-19…26 completadas; T-006-27 pendiente de commit/push exclusivo de H2. Autorización vigente, sin otra confirmación.
