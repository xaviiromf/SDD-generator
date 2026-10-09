# 006 — Diagramas y experiencia visual de SDD-Studio

Fecha: 2026-10-08. Estado: **aprobada y verificada técnicamente en H1/H2** (2026-10-09); H1 y H2 autorizados el 2026-10-08, Mermaid con versión exacta autorizado. Commits/push separados por hito; H2 solo tras sincronización limpia de H1. Despliegue no autorizado.

[Plan técnico](plan.md), [tareas](tasks.md), [validación y límites](validation.md), [estado del proyecto](../../docs/PROJECT_STATUS.md) y [contratos vigentes de 005](../005-generador-profesional/plan.md).

## Necesidad y resultado

Representar visualmente la arquitectura, entidades, interacciones y trazabilidad del proyecto objetivo, sin abandonar el kit documental determinista ni el trabajo local. Modernizar la consulta mediante una portada ejecutiva, Markdown enriquecido y un explorador accesible. Los diagramas describen lo declarado o pendiente; no certifican implementaciones, pruebas ejecutadas ni corrección semántica.

Dos hitos secuenciales: **H1 — Integración y Renderizado de Diagramas Mermaid** y **H2 — Dashboard del Proyecto y Visor Enriquecido**. H2 solo podrá comenzar después de verificar y cerrar H1 y contar con autorización que incluya H2. No se incorpora un tercer hito.

## Alcance por hito

| Parte | Entrega |
|---|---|
| H1 / 1.A Motor | Generación de `flowchart TD`, `erDiagram`, `sequenceDiagram` y `graph LR` dentro de las rutas existentes del kit de 34 documentos. Contratos de datos explícitos, determinismo y validación sintáctica automatizada. |
| H1 / 1.B Visor | Bloques con cerca de lenguaje `mermaid` en DocumentCanvas: SVG interactivo, carga diferida asíncrona, Diagrama / Código y descarga SVG / PNG. |
| H1 / 1.C Configurador | Mapa de arquitectura en ProfileStudio, reactivo a componentes, dependencias y tecnologías, incluidas ediciones aún no aplicadas como vista previa identificada. |
| H2 / 2.A Dashboard | Portada del proyecto con ficha técnica, métricas, arquitectura y accesos al configurador, requisitos, documentos y preparación. |
| H2 / 2.B Visor Pro | Cinco alertas estilo GitHub, badges de estado accesibles y tablas con encabezados fijos al desplazar. |
| H2 / 2.C Explorador | Árbol lateral de las 34 rutas, iconos Lucide por tipo de archivo y estado completo / borrador con pendientes. |

### Ubicación de los diagramas

Las rutas son del **kit generado**, no archivos nuevos de SDD-Studio. La identidad concreta de `architecture.md` se confirmará contra el manifiesto público vigente durante la tarea de contrato; no se renombra ni se añade una ruta para acomodar el diagrama.

| Documento existente | Contenido exigido |
|---|---|
| `architecture.md` | Arquitectura `flowchart TD`: componentes, tecnologías asignadas y dependencias declaradas; distinguir «depende de» de «utiliza tecnología». |
| `specs/001-<slug>/spec.md` | Un `erDiagram` del modelo de entidades y un `sequenceDiagram` por RF, con camino feliz y alternativas `alt/else`. |
| `specs/001-<slug>/plan.md` | Las mismas entidades e interacciones, proyectadas desde la misma revisión; conservar IDs y semántica de spec. |
| `specs/001-<slug>/tasks.md` | Uno o más bloques `graph LR` de Requisito -> Decisión -> Tarea -> Validación, incluyendo pendientes explícitos y cobertura completa. |
| Otros documentos del manifiesto | Se preservan, sin insertar diagramas decorativos ni crear plantillas nuevas. |

## Requisitos funcionales

| ID | Hito | Requisito verificable |
|---|---|---|
| RF-006-01 | H1 | Generar fuentes Mermaid estables por entrada normalizada, revisión semántica y versión de generador: mismos datos producen fuentes idénticas byte a byte. IDs técnicos derivados de identidades canónicas, sin reloj, azar ni orden accidental. Los 34 documentos permanecen coherentes. |
| RF-006-02 | H1 | Emitir arquitectura TD desde componentes, tecnologías y dependencias del perfil efectivo. Componentes sin tecnología y relaciones sin resolver se señalan; no asignar tecnologías globales a todos ni crear servicios inexistentes. |
| RF-006-03 | H1 | Emitir ER en spec y plan desde entidades y relaciones expresamente declaradas. Cardinalidades, atributos y claves no se deducen de prosa. Entidades aisladas son válidas; relaciones incompletas quedan pendientes fuera de las aristas. Con cero entidades se informa «Entidades por definir» como marcador visual, nunca como entidad de negocio. |
| RF-006-04 | H1 | Emitir una secuencia por RF en ambos documentos, usando actor, comportamiento y excepciones declarados. `alt` representa el flujo feliz y cada `else` una excepción conocida. Si faltan excepciones, la alternativa se etiqueta «Excepciones por definir»; si faltan actor o flujo, se muestra su estado pendiente. No generar secuencias para RNF ni inventar operaciones internas. |
| RF-006-05 | H1 | Proyectar trazabilidad LR desde los mismos enlaces públicos de requisitos, decisiones, tareas y criterios de validación. Distinguir «Validación prevista» de un resultado ejecutado. Decisión/tarea/criterio ausente se representa como pendiente, sin crear un registro confirmado. Particionar grafos grandes manteniendo todas las relaciones y referencias entre bloques. |
| RF-006-06 | H1 | Reconocer cercas Mermaid en el documento visible y renderizar SVG localmente tras carga diferida. Mostrar cargando, listo, error o límite excedido por bloque. Un fallo mantiene fuente, lectura, edición y navegación; no bloquea el kit. Otros bloques y texto siguen disponibles. |
| RF-006-07 | H1 | Alternar Diagrama / Código por bloque, sin cambiar su Markdown. Zoom, desplazamiento y ajustar a vista mediante controles y teclado; respetar foco y movimiento reducido. La vista Código permite seleccionar/copiar la fuente exacta. |
| RF-006-08 | H1 | Descargar directamente SVG autónomo o PNG del bloque vigente mediante acciones locales. Nombre seguro, revisión correcta y mensajes españoles. Exportar el diagrama completo, sin recortarlo al zoom del visor; ningún cambio en ZIP, portapapeles o respaldo existentes. |
| RF-006-09 | H1 | Actualizar el mapa de ProfileStudio al editar componentes, dependencias o tecnologías, sin acción adicional. Identificar la vista previa no aplicada y validar candidatos sin sobrescribir datos confirmados. Descartar respuestas antiguas al cambiar edición o proyecto; cancelar restaura el mapa confirmado. |
| RF-006-10 | H2 | Ofrecer dashboard navegable con nombre, descripción, modo, perfil/tecnologías, estado de preparación, recuentos de RF/RNF y componentes, pendientes, arquitectura central y accesos directos. Todos los datos provienen de una revisión confirmada; mostrar actualización pendiente. No equiparar completitud con aceptación. |
| RF-006-11 | H2 | Interpretar `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]` y `> [!CAUTION]` como alertas semánticas con títulos españoles, icono Lucide y contenido conservado. Dentro de cercas son código; tipos desconocidos permanecen como citas. |
| RF-006-12 | H2 | Mostrar badges de estado como texto e icono, con significado disponible para tecnologías de asistencia y contraste adecuado. Ningún estado depende solo del color; «Completo» no significa «Implementado», «Verificado» ni «Aceptado». |
| RF-006-13 | H2 | Mostrar tablas Markdown con `table`, encabezados asociados y encabezado fijo dentro del contenedor de desplazamiento. En móvil permitir desplazamiento horizontal accesible sin recortar celdas ni bloquear navegación. |
| RF-006-14 | H2 | Mantener árbol de rutas reales con iconos de carpeta, Markdown y texto de lucide-react, selección visible, navegación por teclado y estados completo / borrador con cantidad y explicación de pendientes. Carpetas agregan estados de hijos; abrirlas no modifica documentos. |
| RF-006-15 | H1 y H2 | Preservar selecciones, texto del usuario, borradores, biblioteca/versiones, aportaciones por sección y 34 rutas. Datos adicionales para relaciones ER son opcionales, acotados y migrados de forma aditiva. Markdown, Mermaid y SVG se tratan como entradas no confiables, incluso en aportaciones manuales. |

## Requisitos no funcionales

| ID | Restricción |
|---|---|
| RNF-006-01 | SPA 100 % local, sin backend nuevo, CDN, renderizador remoto, telemetría ni envío de diagramas. MCP existente sigue voluntario y no recibe nuevos datos. Renderizador y recursos se sirven desde el mismo paquete estático local. |
| RNF-006-02 | Paquete JavaScript principal de producción **<500 kB**, en bytes sin compresión, con 1 kB = 1000 bytes. Aprobación bloqueada a partir de 500000 bytes. Publicar también módulos compartidos, coste total inicial y módulos Mermaid diferidos para que particionar no oculte el coste. |
| RNF-006-03 | Interacción de UI **p95 <16 ms** medido: entrada, alternadores, navegación, zoom y actualización de controles con mapa activo, incluyendo demora de entrada y procesamiento hasta commit de UI. No ejecutar parseo, generación ni renderizado completo en el manejador del evento. Registrar por separado latencia hasta SVG actualizado y tareas largas del renderizador. |
| RNF-006-04 | Español integral de interfaz, títulos propios, estados, mensajes y texto generado; cero emojis. Conservar identificadores, palabras de la gramática Mermaid y textos libres del usuario sin traducción inventada. Iconos de UI exclusivamente lucide-react. |
| RNF-006-05 | Móvil <768 px, tablet 768–1279 px y escritorio >=1280 px; teclado, foco visible, contraste AA y objetivos interactivos >=44 x 44 px. Resumen textual de cada diagrama, título/descripcion accesibles y alternativa Código. |
| RNF-006-06 | Límites de configuración, biblioteca y kit vigentes sin ampliación; 002 ignorado y sin archivos seguidos. Sin nuevas bibliotecas salvo Mermaid, que se propone expresamente y cuya instalación necesita autorización. No reinstalar ni alterar paquetes del sistema. |

## Datos, seguridad y estados

La prosa actual no declara cardinalidades ER. Se propone únicamente un campo opcional `ProjectDefinition.diagramFacts`, definido en [plan.md](plan.md), y controles mínimos de relaciones en la entrevista de entidades. No incluye editor gráfico, extracción de reglas de negocio ni generación de SQL. Los borradores sin ese campo conservan sus entidades y muestran relaciones pendientes. Una secuencia puede ser abstracta Actor -> Proyecto cuando no hay pasos internos declarados; nombres de componentes se describen como responsables, sin atribuirles un orden de llamadas ficticio.

El motor genera un subconjunto controlado; el visor admite bloques de las familias acordadas con límites. Prohibir directivas de configuración del documento, callbacks y recursos externos. Renderizar con política estricta y filtrar SVG antes de insertar o descargar. Errores se muestran junto al bloque sin registrar contenido sensible. El detalle se fija antes de programar en [plan.md](plan.md).

«Completo» significa ausencia de pendientes estructurales aplicables a ese documento en la revisión publicada; «Borrador con pendientes» enumera su causa. `validation.md` generado conserva las verificaciones por ejecutar: un grafo, badge o dashboard no puede convertirlas en evidencia. Conflictos manuales, compilación pendiente y diagnósticos se mantienen visibles.

## Criterios de aceptación

| ID | RF / RNF | Evidencia exigida después de IMPLEMENT autorizado |
|---|---|---|
| CA-006-01 | RF-006-01, RF-006-15 | Repeticiones y reordenaciones equivalentes producen fuentes idénticas, IDs/referencias válidos y exactamente 34 rutas; migración y aportaciones sin pérdida. |
| CA-006-02 | RF-006-02 | Arquitectura de varios componentes/tecnologías/dependencias y vacíos se proyecta correctamente; parseo Mermaid real correcto. |
| CA-006-03 | RF-006-03 | ER con entidades aisladas, relaciones completas e incompletas, cardinalidades explícitas y cero entidades: parseo real y ningún vínculo inventado. |
| CA-006-04 | RF-006-04 | Cada RF tiene una secuencia en spec y plan; camino feliz, varias excepciones `alt/else`, ausencia de excepciones/actor y RNF cubiertos; parseo real correcto. |
| CA-006-05 | RF-006-05 | Trazabilidad total y particionada coincide con DTO de cobertura; pendientes visibles, sin resultados ficticios. |
| CA-006-06 | RF-006-06, RNF-006-02 | Grafo de módulos y traza de carga demuestran Mermaid fuera de la entrada principal y sus imports estáticos; carga al primer bloque/mapa visible y ausencia de carga al navegar solo código/texto. |
| CA-006-07 | RF-006-07, RNF-006-05 | Alternador, zoom, pan, ajuste, foco y Código funcionan con teclado y puntero en los tres rangos. Resumen y SVG tienen nombre accesible. |
| CA-006-08 | RF-006-08 | SVG abre como archivo independiente; PNG tiene firma/dimensiones correctas y contenido completo. Exportación local sin red y sin fuentes o imágenes externas. |
| CA-006-09 | RF-006-09 | Ediciones rápidas, cambio de proyecto, cancelar y candidato inválido mantienen el mapa correcto y no aplican cambios por la vista previa. |
| CA-006-10 | RF-006-10 | Ficha, métricas, diagrama y accesos concuerdan con revisión actual y estado pendiente; proyecto sin datos también es navegable. |
| CA-006-11 | RF-006-11 | Las cinco alertas, varias líneas, cercas, citas ordinarias y tipo desconocido conservan contenido y semántica. |
| CA-006-12 | RF-006-12, RF-006-13 | Badges accesibles y tablas con encabezados fijos verificadas a 375/768/1280 px; desplazamiento, contraste y foco correctos. |
| CA-006-13 | RF-006-14 | Árbol de 34 rutas, iconos, agregación de estados y navegación por teclado coherentes con documentos/ZIP. |
| CA-006-14 | RF-006-15, RNF-006-01 | Casos adversos de Markdown/Mermaid/SVG no ejecutan código ni hacen solicitudes externas; errores/límites mantienen lectura y fuente. |
| CA-006-15 | RNF-006-01 | Uso local y offline tras preparar recursos propios, incluida primera apertura Mermaid sin conexión; pérdida de caché y chunk fallido permiten código y reintento. |
| CA-006-16 | RNF-006-02, RNF-006-03 | Build <500000 bytes principal; al menos 200 interacciones por escenario p95 <16 ms, renders ajenos y latencia de render registrados; regresión sin fallos. |
| CA-006-17 | RNF-006-04, RNF-006-05, RNF-006-06 | Auditoría de español/cero emojis, controles, accesibilidad, 002 ignorado/no seguido y dependencias limitadas a lo autorizado. Límites manuales se declaran. |

## Exclusiones y puerta de revisión

**Parte 3 totalmente excluida**: sin exportador a README de GitHub, scripts CLI de issues ni plantillas adicionales de dominio. Tampoco se autoriza H5 de 005, JSON Schema/OpenAPI/AsyncAPI, backend, colaboración remota, servicios de diagramas, editor visual de grafos ni ejecución de aplicaciones objetivo.

La revisión formal fue aprobada el 2026-10-08. Ejecutar H1 y después H2 con verificaciones completas y commits/push separados por hito. Mermaid es la única nueva dependencia directa autorizada. El despliegue no forma parte de la autorización.
