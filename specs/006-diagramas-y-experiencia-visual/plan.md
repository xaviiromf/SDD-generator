# Plan técnico — 006

Fecha: 2026-10-08. **Aprobado: H1 y H2 secuenciales, commits/push separados**. [Especificación](spec.md), [tareas](tasks.md), [evidencia](validation.md) y [AGENTS.md](../../AGENTS.md).

## Base, decisiones y límites de lectura

Base del DOCUMENT inicial: [contratos de 005](../005-generador-profesional/plan.md), [evidencia H4](../005-generador-profesional/validation.md), [flujo general](../plan.md) y manifiesto de dependencias existente. En ese DOCUMENT inicial no se leyeron implementaciones del motor, UI ni pruebas. Las rutas siguientes son inventario existente o propuestas de archivos nuevos, no descripciones de internals inspeccionados.

H4 registra 379,12 kB de principal, 137,37 kB de editorStore compartido y ProfileStudio diferido de 15,28 kB; edición con colecciones máximas p95 1,7 ms. Son referencias históricas, no evidencia de Mermaid ni garantía de margen del conjunto inicial. Mermaid aún no figuraba en las dependencias de esa base; H1 instaló la versión autorizada 12.1.0.

| ID | Decisión propuesta | Consecuencia |
|---|---|---|
| D-006-01 | Fuente Mermaid en el motor local; renderer en servicio separado, ambos mediante DTO públicos. | Compilar/exportar Markdown no importa Mermaid ni depende del DOM. |
| D-006-02 | Paquete npm `mermaid` con versión exacta y lockfile al autorizar instalación; sin CDN ni paquetes de pan/zoom/captura. | La versión y API se contrastan en la tarea documental de autorización; no instalar por esta propuesta. |
| D-006-03 | Import dinámico del renderer y componentes visibles; reutilizar una sola carga por sesión. | Preserva principal <500 kB y permite fallar por bloque sin perder edición. |
| D-006-04 | Datos explícitos y migración aditiva para relaciones ER; ninguna cardinalidad inferida. | Borradores antiguos siguen válidos con relaciones por definir. |
| D-006-05 | Mermaid estricto, etiquetas sin HTML y SVG filtrado para UI/exportación. | Interacción implementada por controles propios, sin callbacks `click` del documento. |
| D-006-06 | Revisión/token en cada proyección, cola de render serializada y fuente única compartida. | Evita carreras entre canvas, mapa y dashboard y descarta resultados antiguos. |
| D-006-07 | Estados documentales derivados de pendientes aplicables, no de porcentaje global ni de una lista de tareas marcada. | El dashboard/explorador no atribuye pruebas ni aceptación al proyecto objetivo. |
| D-006-08 | H2 depende del cierre verificado de H1; regresión y evidencia separadas por hito. | Un fallo de bundle, seguridad o interacción impide iniciar H2. |

## Contratos públicos propuestos

Estos contratos se concretan en T-006-03 antes de consumidores. No se deduce permiso de lectura de una importación. Un consumidor lee este contrato y el archivo público de tipos expresamente permitido, sin abrir el generador.

### Datos canónicos y relaciones ER

Se conservan `Configuration.project`, `Configuration.profile`, IDs, revisión y colecciones documentadas por 005. Campo opcional `ProjectDefinition.diagramFacts`: `{schemaVersion:1, entityRelations:[...]}`. Relación: `{id, fromEntityId, toEntityId, label, fromCardinality, toCardinality, identifying, status}`. Cardinalidades: `cero-uno`, `uno`, `cero-muchos`, `uno-muchos` o vacío pendiente; `identifying` es booleano o null pendiente. Estado usa el vocabulario canónico de 005. IDs únicos, extremos del tipo entidad existentes; relaciones descartadas no se proyectan. Una relación válida pero incompleta puede guardarse y genera pendientes, no una arista ER falsa.

Máximo 100 relaciones y 64 KiB UTF-8 del campo, incluidos en los 512 KiB vigentes de configuración; no se amplía ningún límite de 005. Migración aditiva: ausente equivale a relaciones aún no declaradas; conserva íntegros requisitos/textos/selecciones/versiones/aportaciones. Validar explícitamente respaldo, restauración y biblioteca. Eliminar una entidad referenciada requiere desvincular, nunca borrado en cascada. Controles de relación en ContextInterview usan acciones públicas, sin analizar prosa. No se añaden atributos/claves ficticios ni un diseñador de bases de datos.

### Proyección de diagramas

`DiagramProjection` propuesto: `{schemaVersion:1, projectId, revision, diagrams, issues}`. Cada `DiagramDefinition`: `{id, kind, documentIds, source, title, description, sourceIds, issues, part}`. `kind`: `architecture`, `entities`, `sequence`, `traceability`; `part` indica índice/total cuando se divide. ID del diagrama independiente de posición y de texto de etiqueta; `sourceIds` conserva identidades canónicas y permite auditar origen. IDs DOM del SVG son específicos de la instancia visible; no sustituyen los IDs del modelo.

`Compilation` añade proyección opcional de diagramas y, en H2, `ProjectOverview` / `DocumentStatus[]`, sin sustituir documentos, coverage o readiness. Los generadores de plantillas consumen `DiagramDefinition.source`; mapa y dashboard consumen esa misma proyección de arquitectura. No extraer métricas de HTML o de texto renderizado.

`ArchitecturePreviewRequest`: `{projectId, baseRevision, previewToken, candidateProfile}`; respuesta con mismas identidades, diagrama/diagnósticos y estado válido/incompleto/inválido. El trabajador usa la misma función pura de arquitectura que la compilación. Estado de formulario local de ProfileStudio se proyecta sin guardar; al aplicar se usa la acción transaccional vigente de perfil. Validación fallida mantiene formulario y mapa anterior identificado como desactualizado; no fabrica una revisión confirmada.

### Renderer y exportación

Servicio público propuesto `renderDiagram({instanceId, source, revision, token, theme})`: resultado `{sanitizedSvg, width, height, title, description}` o error tipado `carga`, `sintaxis`, `seguridad`, `limite`, `obsoleto`. No expone objeto Mermaid ni configuración global mutable a la UI. Inicialización y parse/render en servicio, después del import dinámico; `startOnLoad:false`, `securityLevel:'strict'`, etiquetas HTML deshabilitadas y límites protegidos. La API oficial permite parseo y render asíncronos; una promesa no demuestra ausencia de trabajo costoso en el hilo principal. [Uso de la API Mermaid](https://mermaid.js.org/config/usage.html).

`exportDiagram({sanitizedSvg, format, basename, revision, scale})` produce Blob local. SVG conserva viewBox, namespaces, título/descripción y estilos autocontenidos, sin referencias externas. PNG: rasterizar el SVG completo con APIs nativas, fondo legible y escala acotada; esperar fuentes locales y decodificación, tratar errores y liberar object URLs. No capturar el contenedor HTML. Límite propuesto de 4096 px por lado y 16 millones de píxeles; reducción uniforme explícita, sin recorte. [Canvas toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob).

### Dashboard y estados documentales

`ProjectOverview`: `{projectId, revision, name, description, mode, profiles, technologies, counts, readiness, architectureDiagramId, navigationTargets}`. `counts` separa RF/RNF, componentes, entidades y pendientes; descarta registros con estado descartado y especifica qué cuenta. No calcula ahorro humano, cobertura de pruebas real ni porcentajes de ejecución sin evidencia.

`DocumentStatus`: `{documentId, revision, state, pendingCount, reasons}`; `state`: `completo` o `borrador`. Razones derivadas de issues aplicables al documento y campos/documentos pendientes, incluidas validaciones por ejecutar. Duplicados por ID cuentan una vez; conflictos manuales y compilación pendiente se muestran como avisos separados y fuerzan borrador del documento afectado. Documentos sin aplicabilidad se explican y no acumulan pendientes ficticios. T-006-19 fija tabla de aplicabilidad de las 34 identidades antes de implementar sus consumidores. Un documento de validación no pasa a completo porque la estructura tenga todas sus secciones.

## H1 / 1.A — Motor determinista

1. Normalizar entidades, componentes, tecnologías, requisitos y enlaces desde los DTO vigentes. Resolver discrepancias de perfil/contexto mediante diagnósticos existentes; no sobrescribir decisiones.
2. Construir IDs Mermaid con prefijo por tipo y codificación estable del ID canónico; evitar colisiones, palabras reservadas y dependencia del índice visible. Orden estable por IDs y por posición declarada de criterios/excepciones cuando esta es semántica. Escapar etiquetas por gramática, preservando el texto original en el documento y el modelo.
3. Arquitectura: componentes y tecnologías con leyenda de aristas; dependencias dirigidas componente -> dependencia. La configuración tradicional sin componentes explícitos se describe como vista global de tecnologías, con composición pendiente, sin presentarla como arquitectura de servicios confirmados.
4. ER: entidades declaradas; aristas únicamente con extremos/cardinalidades/identificación completos. Entidades aisladas y marcador de vacío con leyenda «pendiente», sin registro canónico ni efecto en métricas. La gramática ER distingue cardinalidad e identificación. [Sintaxis ER oficial](https://mermaid.js.org/syntax/entityRelationshipDiagram.html).
5. Secuencia: actor declarado y participante abstracto del proyecto; RF context/behavior forman solicitud/respuesta de alto nivel. Componentes enlazados se anotan como responsables, sin orden interno deducido. `alt Flujo esperado` y `else <excepción declarada>`; sin excepciones, rama «Excepciones por definir» y diagnóstico. Evitar transformar prosa en actores o múltiples llamadas; incompletitud visible. [Alternativas de secuencia](https://mermaid.js.org/syntax/sequenceDiagram.html).
6. Trazabilidad: RF -> decisiones enlazadas -> tareas vinculadas -> criterios/validaciones previstas. No formar productos cartesianos que atribuyan una decisión a una tarea ajena. Si la cobertura vigente no contiene relación decisión-tarea, conservar enlaces parciales y declarar ese tramo pendiente; no inferirlo. Nodos visuales pendientes llevan IDs de presentación propios y nunca cuentan como decisiones/tareas reales.
7. Incluir cercas Mermaid en secciones estables de las plantillas existentes, sin alterar claves de adiciones manuales silenciosamente. Spec y plan reutilizan las fuentes; architecture/tasks proyectan la misma revisión. Exportar Markdown y ZIP conserva fuentes, sin incluir binarios PNG/SVG ni archivos nuevos.

Validación sintáctica del subconjunto mediante el parser real de la versión fijada en pruebas específicas. No importar Mermaid al generador para validar cada pulsación. Las entradas manuales se validan al renderizar. Formar corpus de caracteres reservados (`end`, comillas, corchetes, dos puntos, saltos de línea), IDs parecidos, Unicode permitido, datos mínimos y límite de 100 RF. No afirmar que las futuras fuentes son válidas sin esas pruebas. [Escape en flowcharts](https://mermaid.js.org/syntax/flowchart.html).

## H1 / 1.B y 1.C — Visor y mapa

DocumentCanvas identifica bloques visibles; `MermaidBlock` se monta diferido solo al solicitar Diagrama. Import Mermaid al primer diagrama visible en canvas, mapa o dashboard, compartiendo una promesa. Navegación por texto y vista Código no dispara el import. Mapas visibles lo solicitan automáticamente; ocultos no. Código siempre utilizable. Memoria de modo/zoom por bloque y revisión; no escribir fuente al alternar.

Interactividad mediante controles React y transformaciones de la vista: acercar, alejar, ajustar y mover. Teclado equivalente al puntero, sin secuestrar flechas fuera del área de diagrama ni impedir desplazamiento de la página. Resumen textual de nodos/enlaces, `title`/`desc` y nombre accesible; no hacer miles de nodos SVG focables. [Accesibilidad Mermaid](https://mermaid.js.org/config/accessibility.html).

Suscripciones Zustand granulares con comparación superficial para DTO compuestos. Raíz y cabecera no se suscriben a cambios de mapa/zoom; ProfileStudio conserva estado de candidato local. Agrupar proyecciones con espera de 100 ms reemplazable y mostrar «Actualizando mapa»; objetivo p95 <=300 ms desde último cambio hasta SVG para escenario de referencia tras cargar módulos. Es presupuesto propuesto de mapa, distinto de interacción p95 <16 ms, de compilación <=150 ms y de carga inicial; se mide y se informa por separado.

### Render, límites y seguridad

Una cola por servicio serializa parse/render para evitar configuración global concurrente; como máximo una petición pendiente reemplazable por instancia. Priorizar bloque visible/mapa activo, invalidar al cambiar proyecto/revisión/tema y limpiar DOM temporal al terminar. Abort/token evita publicar resultado antiguo, sin afirmar que cancela CPU ya ejecutándose. Caché LRU por fuente/version/tema, hasta 20 SVG y 2 MiB; revocar URL al sustituir y desmontar.

Límites por bloque: 32 KiB UTF-8 de fuente, 200 nodos/participantes y 250 aristas/mensajes; el servicio compara además longitud con límite de Mermaid. Generación divide arquitectura/ER/trazabilidad en bloques deterministas si hace falta, replica nodos frontera y muestra referencias/leyenda. Secuencias siguen siendo una por RF; exceso se diagnostica y requiere reducir datos antes de renderizar, preservando fuente. No truncar documentos ni ocultar pendientes para pasar límites. Kit combinado <=1 MiB; desbordamiento sigue el diagnóstico vigente y conserva borrador.

Admitir para renderizado flowchart/graph, ER y secuencia; otras familias muestran Código con explicación. Rechazar frontmatter/directivas de configuración, `click`, enlaces, HTML, imágenes, scripts, importaciones y referencias externas de bloques aportados. Mantener claves de seguridad/límites protegidas por initialize. Filtrar SVG por allowlist de elementos/atributos; permitir marcadores/gradientes/referencias locales `#id` verificadas, rechazar scripts, eventos, foreignObject, URL externas y CSS no permitido. Comprobar IDs duplicados/referencias internas y namespace antes de insertar/descargar; ante fallo conservar Código. No usar regex como único filtro SVG ni interpolar el SVG sin validar. [Configuración de seguridad y límites](https://mermaid.js.org/config/schema-docs/config.html).

Si el render de Mermaid genera tareas largas, diferir con scheduler no las elimina: medir CPU y trazas. T-006-15 debe registrar una corrección IMPLEMENT por dominio si la actividad del mapa incumple p95 <16 ms. Si la versión elegida requiere aislamiento adicional o dependencia de sanitización, detener la ampliación de dependencias y documentar alternativa para autorización; no relajar la política para cerrar H1.

Offline: artefactos y fuentes locales, sin CDN. Incluir los chunks propios Mermaid y sus imports dinámicos en el precache estático existente, sin ejecutarlos/cargarlos como módulos en arranque. Preparación offline solo se declara completa cuando esos artefactos están disponibles; comprobar primera apertura offline después de preparar la caché. Descarga en segundo plano para caché se distingue de import/ejecución del renderer y su coste se informa. Caché perdida/chunk fallido mantiene Código y permite reintento; no forzar recarga ni perder formulario.

## H2 — Portada, visor enriquecido y explorador

Dashboard diferido dentro de la SPA, accesible desde navegación pública; no crear documento número 35 ni modificar contenido README del kit. Reutiliza el componente de diagrama H1 y ProjectOverview. Seleccionar acceso directo enfoca destino y conserva proyecto/edición. En móvil los paneles conservan pestañas actuales; el árbol puede ser panel desplegable con retorno de foco, sin superponer controles al documento.

Markdown se procesa por bloques, respetando cercas antes de citas/tablas; HTML crudo permanece inerte. No añadir parser Markdown externo por conveniencia: extensión acotada del contrato de visor, con fixtures de escapes y contenido mixto. Alertas se basan en los cinco tipos documentados por [GitHub](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax): «Nota», «Consejo», «Importante», «Advertencia», «Precaución». Tipos desconocidos son citas; no convertir alertas estáticas en interrupciones `role=alert` automáticas.

Badges: vocabulario español y semántica de D-006-07, texto siempre visible y explicación de pendientes disponible por teclado. Tablas con thead/th/scope, sticky en contenedor propio, fondo opaco/contraste, ancho y overflow manejables. FileTree conserva identidades del manifiesto y selección; iconos de carpeta/archivo MD/TXT y estado de hijos agregado sin usar extensión como señal de completitud. Si se usa `role=tree`, implementar sus teclas y foco completo; de lo contrario lista anidada con botones y semántica coherente, sin roles incompletos.

## Dominios y archivos previstos

Rutas nuevas son propuestas de 006, no permiso para leerlas en DOCUMENT. Durante IMPLEMENT solo abrir las rutas de la tarea activa y contratos públicos nombrados. Las pruebas específicas se acotan a la responsabilidad del dominio.

| Dominio | Rutas autorizables mediante tareas | Responsabilidad |
|---|---|---|
| Núcleo / contrato H1 | Nuevo `src/domain/diagrams.ts`; existentes projectDefinition.ts, projectValidation.ts, models.ts, validation.ts y projectLibrary.ts | Tipos, hechos ER, límites, referencias y diagnóstico público. |
| Núcleo / motor H1 | Nuevo `src/engine/diagramProjection.ts`; compiler.ts, projectProjection.ts, coverage.ts, taskGraph.ts, kitManifest.ts y plantillas root.ts, spec.ts, plan.ts, tasks.ts | Generación, ubicación de arquitectura por identidad, fuentes compartidas y trazabilidad sin relaciones falsas. No abrir otras plantillas. |
| Servicios / continuidad H1 | draftStorage.ts, libraryValidation.ts, projectImport.ts, projectStorage.ts | Migración/restauración/importación de hechos opcionales sin pérdidas, mediante los tipos públicos; no se presupone un archivo de migración independiente. |
| Servicios / render y exportación H1 | Nuevos `src/services/diagramRenderer.ts`, diagramExport.ts, diagramSvgPolicy.ts | Import Mermaid, parse/render, filtro SVG, caché/cola, Blob y PNG. |
| Trabajadores / H1 | generator.worker.ts, generatorClient.ts | Mensajes/revisión para proyección de mapa mediante export público puro; no incluir renderer DOM en trabajador generador. |
| Offline / H1 | offlineRegistration.ts y `src/offline/service-worker.js` | Preparar recursos propios diferidos, actualizaciones de caché seguras. |
| Integración pública / H1 | editorStore.ts, documentStore.ts; uiStore.ts; tipos públicos de diagramas | Acciones de relación, selectores de proyección y tokens; sin importar renderer estáticamente. |
| UI / H1 | Nuevos `src/components/diagrams/`; DocumentCanvas.tsx, ProfileStudio.tsx, ContextInterview.tsx; `src/styles/app.css` | Bloques/mapa interactivos y campos ER; solo DTO/acciones públicas. |
| Núcleo / H2 | Nuevos `src/domain/projectOverview.ts`, `src/engine/documentStatus.ts`; compiler.ts, kitManifest.ts, coverage.ts, readiness.ts | Overview y estados por documento/pendiente desde contratos de datos. |
| Integración pública / H2 | documentStore.ts, uiStore.ts, `src/app/StudioLayout.tsx`, App.tsx | Publicar DTO y montar portada/navegación diferida sin internals de UI/motor. |
| UI / H2 | Nuevos `src/components/dashboard/`, DocumentCanvas.tsx, FileTree.tsx, PanelNavigation.tsx, `src/styles/app.css` | Portada, alertas, badges/tablas y explorador; contratos H1/H2. |
| Documentación / ambos | Esta carpeta, specs/README.md, docs/PROJECT_STATUS.md; al cierre README.md y docs/TRACEABILITY.md/DECISIONS.md | Estado, autorización y evidencia, sin importar datos de 002. |

La adaptación de migración se acota a los servicios de continuidad nombrados; los validadores de datos se adaptan en la tarea de núcleo. Cambios de empaquetado, si el build los necesita, deben registrarse en T-006-07 con `vite.config.ts` y manifiestos como dominio de integración de build; no conceden acceso a otros módulos. No hay trabajo delegado ni paralelismo entre dominios de implementación en esta propuesta.

## Secuencia y puertas

| Puerta | Tareas | Condición |
|---|---|---|
| DOCUMENT actual | T-006-01 | Cuatro documentos, enlaces/IDs/estados verificables; entregar y detenerse. |
| Autorización | T-006-02 | Registrar aprobación de hito(s), dependencia Mermaid/versión y límites; sin presumir aprobación por silencio. |
| H1 / contratos y motor | T-006-03…06 | Tipos y ubicaciones concretados, generación/corpus/parser real y 34 documentos sin pérdidas. |
| H1 / servicios e integración | T-006-07…12 | Renderer, SVG/PNG, preview, migración, store y offline por contratos. |
| H1 / UI y cierre | T-006-13…18 | Canvas/mapa/editor, pruebas y mediciones, seguridad/bundle/regresión correctos. H1 cerrado técnicamente con evidencia; aceptación humana separada. |
| H2 / datos y UI | T-006-19…23 | Solo tras H1 cerrado y H2 autorizado; overview/estados, integración, portada, visor y árbol. |
| H2 / cierre | T-006-24…27 | Regresión H1/H2, presupuestos/AA, documentación y sincronización autorizada. |

Cada hito ejecuta lint, tipos, build, unitarias específicas/regresión y recorridos de Chromium/Firefox. VALIDATE lee solo salidas y escribe reportes; cualquier corrección requiere volver a IMPLEMENT con tarea/domain registrada, luego repetir comprobaciones afectadas. Aplicar [protocolo de medición](validation.md). Sin despliegue; commit/push normal únicamente de hitos autorizados tras verificaciones, preservando la exclusión de 002.

## Riesgos para revisión

| Riesgo | Resolución prevista |
|---|---|
| Mermaid y sus submódulos aumentan tamaño/coste inicial | Import diferido verificable y publicación de todos los tamaños; fallo del límite bloquea cierre. |
| Render asíncrono bloquea CPU y mapa retrasa edición | Cola/token, límites, medición con mapa activo; registrar corrección sin atribuir <16 ms al render total. |
| ER o secuencia parecen confirmar hechos inventados | Relaciones tipadas explícitas y vista abstracta; pendientes/leyendas, texto original y revisión humana. |
| SVG inseguro o PNG incompleto por CSS/fuentes | Política estricta, allowlist, archivo autocontenido y pruebas de descarga/adversas reales. |
| Diagramas repetidos exceden kit de 1 MiB | Medir referencia/máximo; no eliminar RF ni duplicados exigidos de spec/plan; conflicto visible y revisión si no cabe. |
| Vista previa publica datos no guardados | Token local, estado «Vista previa», acción Aplicar vigente y cancelar sin escritura. |
| Badges atribuyen implementación o aceptación | Estado estructural por documento, pendientes de validación visibles y terminología explícita. |
| Ampliación rompe aportaciones, biblioteca o caché | Migración opcional, pruebas de conflicto/restauración y primera apertura offline. |

Mermaid 12.1.0 fue autorizada e instalada en H1; la autorización recibida sustituye la condición documental inicial. H5 de 005 y Parte 3 continúan fuera de alcance.

## Autorización T-006-02

H1 y H2 autorizados el 2026-10-08 junto con instalación de Mermaid exacto 12.1.0 (MIT, Node >=22.12.0). Referencias: registro npm y [uso oficial](https://mermaid.js.org/config/usage.html). Instalar en T-006-07. Ningún código H2 antes de commit/push H1 confirmado y árbol limpio. No se requiere confirmar de nuevo las acciones ya autorizadas.

## Contrato concretado T-006-03

Architecture del manifiesto vigente tiene documentId/path `docs/BASE_ARCHITECTURE.md`; no existe `architecture.md` literal. Se incorpora allí el flowchart TD conservando las 34 rutas y la identidad histórica. `Compilation.diagrams` publica DiagramProjection; tipos en src/domain/diagrams.ts. ProjectDefinition.diagramFacts opcional se valida junto a referencias globales; ocupa los límites existentes de proyecto/configuración. Sin campos nuevos obligatorios ni datos MCP.

## API pública concretada T-006-10

startArchitecturePreview(receive, fail) devuelve ArchitecturePreviewClient con request(ArchitecturePreviewRequest) y dispose(). Respuesta ArchitecturePreviewResult; trabajador aislado del transporte MCP, espera reemplazable 100 ms y descarte por proyecto/revisión/token. renderDiagram(RenderRequest), cancelDiagram(instanceId), downloadDiagram(DiagramDownload) son APIs de servicios; componentes consumen estas funciones y sus DTO sin leer internals.

## Acciones públicas T-006-12

editorStore añade addDiagramRelation(), updateDiagramRelation(id, Partial<Omit<EntityRelation,id>>) y removeDiagramRelation(id), con revisión transaccional y errores en projectError. ContextInterview usa config.project.context.entities y diagramFacts.entityRelations mediante selectores propios; eliminar entidad referenciada se rechaza. documentStore publica Compilation.diagrams junto a la revisión combinada, conservando DTO al reconciliar aportaciones. ProfileStudio usa config.profile / projectId / revision y startArchitecturePreview, sin estado de preview global ni escritura automática.

Concreción de montaje T-006-13: DocumentCanvas delega contenido visible a DocumentTabs.tsx, adaptador UI expresamente incluido. DocumentContent.tsx separa cercas y conserva texto seguro; enriquecer Markdown corresponde exclusivamente a H2.

Refinamiento de módulos H1: API pública startArchitecturePreview/ArchitecturePreviewClient se traslada a src/workers/architecturePreviewClient.ts (T-006-10). UI de mapa y prueba específica consumen ese módulo, sin acceso al coordinador general ni sus stores.

### Aislamiento de layout concretado T-006-08

El banco de volumen detectó bloqueo por mediciones SVG en el documento principal. El runtime diferido se monta en diagram-renderer.html, un iframe técnico local persistente con su propio DOM; diagramFrame.ts atiende mensajes del padre y diagramRenderRuntime.ts conserva parser, filtro, LRU y cola. diagramRenderer.ts mantiene la API pública de H1. El iframe se crea al solicitar el primer diagrama; las dos entradas HTML y todos sus chunks se incluyen en preparación offline. No es una segunda interfaz, backend ni documento del kit. No se atribuye aislamiento de CPU/hilo al iframe: se repite la medición real.


### Contratos finales y cierre de H1

`RenderRequest` incluye instanceId/source/revision/token/theme/title/description. `RenderedDiagram` devuelve sanitizedSvg, width, height, title y description. `downloadDiagram` recibe estos datos y formato/nombre/revisión; filtra de nuevo antes de exportar. Cola/LRU de 20 entradas y 2 MiB; fuente <=32 KiB, SVG <=2 MiB, 200 nodos/250 conexiones, PNG <=4096 px por lado/16 millones de píxeles. Código y SVG no modifican documentos.

ProfileStudio monta diferidamente ProfilePanelRuntime; opciones de conexiones se montan al abrir su ficha. La proyección de arquitectura produce partes de hasta seis nodos/20 conexiones legibles, preservando todos los hechos entre partes. DocumentTabs monta DocumentContent/DiagramView: texto seguro y cercas intactas en H1, Markdown enriquecido pendiente de H2. Las revisiones de candidato no re-renderizan partes sin cambios.

T-006-16/17 verificadas: lint, tipos, 144 unitarias, build y 146 recorridos correctos; seis mediciones Firefox omitidas. Principal 359178 bytes; JS inicial estático 507066 bytes publicado por separado. T-006-18 confirmó commit 8514ddcc25442dedbd8c7c8d5315c6a951bc837f, push normal y árbol limpio antes de iniciar H2. Evidencia y límites en validation.md.


## Contrato H2 concretado T-006-19

Aplicabilidad: guías `prompts/*`, manuales, AGENTS, constitution, índice specs y cuatro plantillas son contenido reutilizable; pendientes del proyecto no se imputan a una plantilla. README/PROJECT: nombre, descripción y requisitos declarados. TECHNICAL_CONTEXT y BASE_ARCHITECTURE: configuración (no aplica software en modo documental), componentes/contratos y diagnósticos de arquitectura. BASE_OBSERVATIONS: preguntas/supuestos; DECISIONS: decisiones declaradas. ROADMAP/tasks/TRACEABILITY: requisitos y enlaces efectivos; spec/plan: preparación global, contexto y diagramas respectivos. PROJECT_STATUS: preparación y autorización aún pendiente. ENVIRONMENT_AND_VERIFICATION, SDD_VALIDATION, VERIFICATION y validation: evidencia por realizar, nunca completos por generación. Cada identidad del manifiesto tiene grupo explícito; una identidad no reconocida queda borrador por aplicabilidad pendiente.

`DocumentStatus.reasons` usa `{id,message}`; deduplicación por ID, revisión de configuración. Campo `applicability` explica alcance. `ProjectOverview` incluye también architectureDiagramIds (todas las partes), counts.rf/rnf/components/entities/technologies/pending/documentDrafts/documentComplete; technology y profile son listas `{id,name}`. Métricas solo declaraciones activas, componentes por unión de IDs perfil/contexto y tecnologías únicas seleccionadas/declaradas; no cuenta marcadores visuales. navigationTargets usa documentId o panel idea/configuration. Validación/aceptación no se deducen de ninguna métrica.


### Contrato de integración T-006-20

Panel añade `overview` manteniendo `config` inicial. StudioLayout monta ProjectDashboard con import dinámico solo al abrir Portada; conserva el montaje de los paneles existentes. Portada consume `useDocumentStore` con selectores propios de overview/diagrams/pending/conflicts/error y revisión actual desde editorStore; muestra explícitamente la revisión confirmada mientras espera. `openOverviewTarget(OverviewTarget)` selecciona documento/panel y enfoca el título de destino tras el commit. La API pública `presentDocumentStatus(base,{revision,pending,conflict,error})` devuelve un estado visual derivado, deduplica razones y fuerza borrador por generación pendiente/conflicto/error; no persiste ni modifica la compilación. Los consumidores leen DTO/acciones públicas, sin abrir internals del store/motor.

Corrección T-006-20: portada permanece montada tras primera visita para reutilizar SVG/controles al navegar. Mientras está oculta retiene la última proyección visible; al volver muestra la revisión vigente, sin renderizar automáticamente sus nuevas fuentes en segundo plano.

T-006-20 añade límites memoizados en los adaptadores públicos Configurator/IdeaEditor/DocumentCanvas/CommandPalette: cambiar panel no re-renderiza sus formularios/Markdown; cada consumidor conserva sus suscripciones y acciones propias.


Refinamientos de H2: README/PROJECT incluyen preparación aplicable de ficha/pila/requisitos; spec/plan incluyen confirmación de contexto y relaciones, además de diagnósticos. Los campos pendientes del documento no se ocultan por tener nombre/idea. El visor retiene como máximo dos documentos visitados, con contenido original y navegación estable; solo la vista activa participa de foco/lectura. Las vistas explícitamente inactivas conservan SVG y difieren nuevas fuentes hasta su activación. En escritorio, ocultar paneles conserva su anchura/layout para evitar recalcular cien formularios al volver. Se registran por separado commit, layout y tareas largas.

Corrección de visibilidad: la pausa explícita afecta portada oculta y documentos inactivos. El mapa ya abierto mantiene su proyección reactiva incluso al desplazar el formulario fuera de vista; la primera carga sigue exigiendo un bloque visible. No se confunde mapa cerrado con scroll del configurador abierto.


### Contratos y cierre técnico final de H2

Arquitectura limita cada partición a cuatro nodos/ocho conexiones, dentro de los límites generales 200/250 y 32 KiB; conserva todos los hechos y nodos frontera. MermaidBlock reutiliza un resultado completado mientras fuente/título/descripción/reintento no cambien; cambiar revisión actualiza metadatos y nombres de exportación. Las solicitudes de fuentes nuevas mantienen revisión/token/cancelación. Diagrama/Código conserva zoom y SVG.

DocumentContent utiliza Markdown semántico React sin HTML activo, con cercas anidadas preservadas, cinco alertas, enlaces admitidos y tablas con encabezados sticky/overflow. La disposición de bloques fuera de pantalla se difiere mediante content-visibility:auto, conservando DOM/fuente. FileTree separa estructura de selectores de estado; el explorador cerrado se monta al abrir. Entrevista y tarjetas de requisitos difieren controles hasta la primera apertura y los conservan después.

PresetSelector conserva un diálogo en portal y gestiona modalidad mediante fondo, aria-modal, ocultación temporal de root, trampa de foco/Tab/Escape y restauración de overflow/foco; publicación/cierre/foco son síncronos y se miden dentro del commit. No agrega dependencias ni cambia decisiones al cancelar.

T-006-25 verificada: lint/tipos/149 unitarias/build sin errores; integral 173 recorridos correctos/siete omitidos y complemento tablet dos correctos. Principal 372905 bytes, JS estático total 520793 informado; p95 de controles <16 ms, mapa 298,3 ms, layout/tareas largas separados. Evidencia y límites manuales en validation.md. T-006-27 registra la sincronización efectiva tras observarla.
