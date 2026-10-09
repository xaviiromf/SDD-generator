# Validación y evidencia — 006

Fecha: 2026-10-08. Fase **DOCUMENT de cierre H1**; H2 autorizado, sin iniciar. [Especificación](spec.md), [plan](plan.md), [tareas](tasks.md) y [estado del proyecto](../../docs/PROJECT_STATUS.md).

## Registro histórico de DOCUMENT

En T-006-01 la solicitud autorizó crear la propuesta formal y detenerse para revisión. Solo se comprobó documentación: enlaces/IDs/dependencias, cobertura del alcance, exclusiones, idiomas, restricciones y diff. No se leyó implementación, no se escribió código, no se instaló Mermaid ni se ejecutó un build o pruebas funcionales de 006. No se realizó commit, push ni despliegue.

Referencias históricas de H4 en [validation de 005](../005-generador-profesional/validation.md): principal 379,12 kB, compartido editorStore 137,37 kB, edición de perfiles p95 1,7 ms, 125 unitarias y 121 recorridos correctos con cinco mediciones omitidas. Estos resultados no verifican ninguna funcionalidad de 006.

## Comprobaciones documentales de T-006-01

| Comprobación | Resultado |
|---|---|
| Cuatro archivos solicitados, español y fase DOCUMENT | Correcto: cuatro propuestas creadas y revisión textual realizada; solo índice/estado adicionales. |
| H1 / 1.A–1.C y H2 / 2.A–2.C; secuencia y puerta de autorización | Correcto: las seis partes están especificadas; H2 depende del cierre de H1 y de autorización. |
| 15 RF, seis RNF, 17 CA, ocho decisiones y 27 tareas | Correcto: conjuntos consecutivos, sin definiciones duplicadas ni referencias desconocidas. Solo T-006-01 marcada. |
| Enlaces relativos/fragmentos, IDs y dependencias existentes/ordenadas | Correcto: 47 enlaces locales con destinos existentes; no hay fragmentos locales nuevos. Las 27 referencias de dependencia apuntan a tareas anteriores, sin ciclos. |
| Cobertura RF -> CA -> tareas y decisiones -> tareas | Correcto: cada RF/RNF tiene CA; cada RF, CA y decisión tiene tareas. La cobertura documental no equivale a pruebas ejecutadas. |
| Parte 3 excluida, 34 documentos, SPA local, <500 kB y <16 ms | Correcto documentalmente: restricciones y exclusiones expresas en spec/plan/tasks; cumplimiento de aplicación pendiente. |
| Cero emojis y formato de diff | Correcto: seis documentos afectados sin emojis, espacios finales ni marcadores de conflicto; `git diff --check` código 0. |
| 002 ignorado y sin archivos seguidos; aplicación/manifiestos intactos | Correcto: `git check-ignore` código 0 y `git ls-files` sin resultados para 002; status contiene solo los seis documentos afectados. |

Auditoría ejecutada con Python estándar, en memoria y sin agregar scripts al repositorio: extracción de enlaces Markdown y resolución de destinos, conjuntos de IDs definidos/referenciados, dependencias numéricas y cobertura. Comprobación de Unicode/espacios/conflictos sobre los seis documentos, incluidas las propuestas aún no seguidas por Git. Resultado: cero errores y código 0. Comprobaciones Git de exclusión/status/diff ejecutadas con código 0; no se ejecutaron comandos de aplicación. La tabla registra únicamente esas observaciones.

## Fuentes técnicas consultadas

Documentación oficial consultada el 2026-10-08 para fundamentar el plan, sin descargar ni instalar paquetes:

- [API de uso Mermaid](https://mermaid.js.org/config/usage.html): parseo/render e inicialización controlada.
- [Configuración Mermaid](https://mermaid.js.org/config/schema-docs/config.html): política de seguridad, claves protegidas y límites.
- [Flowchart](https://mermaid.js.org/syntax/flowchart.html), [secuencias](https://mermaid.js.org/syntax/sequenceDiagram.html) y [ER](https://mermaid.js.org/syntax/entityRelationshipDiagram.html): familias y gramáticas propuestas.
- [Accesibilidad Mermaid](https://mermaid.js.org/config/accessibility.html): títulos y descripción del SVG.
- [Alertas GitHub](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax): cinco tipos de alerta.
- [Canvas toBlob](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob): generación local de PNG y errores de origen.

Estas páginas describen capacidades; no acreditan seguridad del futuro filtro ni la validez de fuentes que aún no se generan. La versión exacta de Mermaid y su compatibilidad se fijan después de revisión y autorización.

## Matriz de validación prevista

**Matriz aprobada en DOCUMENT; resultados H1 se registran debajo. H2 sigue pendiente.** Las pruebas se preparan en IMPLEMENT autorizado; VALIDATE solo ejecuta/lee salidas y registra evidencia.

| Grupo | CA | Escenarios mínimos | Evidencia futura |
|---|---|---|---|
| Motor H1 | CA-006-01 a CA-006-05 | Repetibilidad, cambios de etiqueta/reordenaciones, aliases seguros, vacíos, entidades aisladas, cardinalidad explícita/pendiente, 0/1/100 RF, varias excepciones, RNF, trazabilidad parcial y particionada | Parser real de versión fijada, fuentes/IDs/cobertura y manifiesto de 34 rutas, tamaños de kit. |
| Visor H1 | CA-006-06, CA-006-07 | Primera carga diferida, documento solo texto/código, múltiples bloques, cambio rápido de proyecto/revisión, import fallido/reintento, límites y familias no admitidas | Grafo de build, trazas de módulos, DOM/roles/foco, capturas y errores controlados. |
| Exportación H1 | CA-006-08 | SVG autónomo completo, PNG a distintas escalas, fuente local pendiente, zoom del visor, nombre seguro, error/Blob vacío, tamaños máximos | Archivos descargados, XML SVG filtrado, firma PNG/dimensiones y captura local sin recorte. |
| Mapa H1 | CA-006-09 | Ediciones de componentes/dependencias/tecnologías, formulario no aplicado, candidato inválido, cancelar, proyecto cambiado y respuesta antigua | Revisión/token observado, datos conservados, latencia separada y trazas. |
| Dashboard H2 | CA-006-10 | Proyecto vacío y poblado, revisión pendiente, métricas diferenciadas, arquitectura misma que kit, accesos y retorno de foco | DTO/DOM coherentes y continuidad del proyecto. |
| Visor Pro H2 | CA-006-11, CA-006-12 | Cinco tipos, varias líneas, cercas/citas, tipo desconocido, badges sin color, tabla larga/ancha, sticky y overflow | Fixture de Markdown conservado, DOM semántico, teclado y contraste. |
| Árbol H2 | CA-006-13 | 34 rutas/selección/iconos, hijos pendientes y carpetas agregadas, validación prevista, conflicto manual, teclado y móvil | Correspondencia con manifiesto/ZIP, roles/etiquetas y razones de estado. |
| Seguridad/continuidad | CA-006-14, CA-006-15 | HTML/eventos, scripts, directivas, links/CSS externos, foreignObject, IDs/referencias SVG corruptos, bomba de tamaño; borrador antiguo/relaciones/biblioteca/aportaciones/cuota | Sin ejecución/red externa, errores locales, datos intactos, primera apertura offline tras precache, caché perdida/chunk obsoleto. |
| Rendimiento/calidad | CA-006-16, CA-006-17 | UI con render en curso, máximo de colecciones, formatos/regresión, español/emoji, dependencias y 002 | Build/trazas/p95/resultados de lint, tipos, suites y revisión manual con límites explícitos. |

## Protocolo de presupuestos y regresión

Registrar commit/build, entorno, navegador/versiones, CPU/dispositivo, volumen, caché fría/caliente y comandos exactos con códigos de salida. Medir separado por H1 y H2 y comparar referencia H4 sin reutilizarla como resultado nuevo. No declarar ahorro humano por tiempos de un banco automatizado.

Paquete principal: medir archivo de entrada de producción por bytes UTF-8/salida Vite, **<500000 bytes** sin gzip. Listar también tamaño y compresión de módulos estáticos compartidos, CSS, trabajadores, renderer/subchunks, suma JS inicial y total diferido. Inspeccionar grafo de imports y red: Mermaid fuera del principal y sus imports estáticos; caché/preparación offline no implica ejecución. No medir solo un archivo renombrado para ocultar imports estáticos.

Interacción: al menos 200 muestras por escenario y p95 **<16 ms** para entrada controlada, toggles, zoom/pan y navegación con mapa/dashboard activos y render de fondo. Mantener referencia 10 perfiles/20 componentes/50 tecnologías y biblioteca de 20 proyectos/100 RF, incluidos los nuevos hechos hasta su límite. Publicar método y distribución/máximo: demora de entrada mediante timestamp del evento/Event Timing o traza equivalente, captura/burbujeo y commit React. No excluir el tiempo que un evento espera por render en curso; una medición solo entre handlers sería insuficiente. Registrar renders de áreas ajenas y tareas largas >50 ms; informar por separado pintura y latencia SVG. Si navegador/herramienta no permite medir la demora, declararlo pendiente y no marcar el presupuesto completo como verificado.

Mapa: medir desde último cambio de candidato hasta SVG vigente, excluyendo carga fría solo en la cifra de referencia; publicar carga fría por separado. Objetivo propuesto p95 <=300 ms tras módulos listos y espera reemplazable de 100 ms incluida; comprobar revisión final. Registrar parseo/layout/inserción y CPU. La medición de mapa no sustituye interacción <16 ms. Con render en curso, si edición incumple, volver a IMPLEMENT del dominio registrado.

Generación/ZIP: conservar referencia vigente p95 <=150 ms para generación y <100 ms para ZIP de referencia; informar máximo de 100 RF y kit <=1 MiB por separado. Spec y plan duplican secuencias por requisito: medir tamaño real antes de cerrar, no omitirlas para pasar presupuesto. Excesos preservan datos y se reportan como pendientes.

Recorridos Chromium y Firefox a 320/375/767/768/1279/1280/1440 px; teclado/foco, zoom/scroll, controles >=44 x 44, contraste AA, movimiento reducido y nombres de diagramas/badges/alertas/tablas. Comprobaciones manuales de lector de pantalla, ampliación real y teléfono físico se registran solo si se realizan. Si siguen indisponibles, declararlas pendientes; no afirmar cumplimiento completo por automatización. WebKit mantiene el límite histórico salvo nueva evidencia.

Comandos previstos con herramientas existentes: `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e` y comprobaciones Git de exclusión/diff. Versiones/configuración de ejecución se registran al ejecutarlos. En DOCUMENT no se ejecutaron; los resultados posteriores se registran por hito. Regresión de 005 mantiene motor local, 34 documentos, perfiles/modos, biblioteca/aportaciones, exportaciones, migración, estética/MCP opcional sin nuevos datos y caché segura.

## Puertas y resultado pendiente

H1 cierra solo al observar CA-006-01 a CA-006-09 y CA-006-14 a CA-006-17 con resultados y límites; H2 agrega CA-006-10 a CA-006-13 y repite regresión H1. Fallos de seguridad, pérdida de datos, principal >=500000 bytes o interacción p95 >=16 ms bloquean cierre técnico; no marcar como comprobados ni suplirlos con documentación. Corrección vuelve a IMPLEMENT de una tarea concreta, sin inspeccionar código desde VALIDATE.

El usuario autorizó H1 y H2 completos, Mermaid exacto, commits y push separados a origin/main. T-006-16 verifica H1; H2 no inicia hasta confirmar sincronización limpia de H1. Parte 3 excluida; H5 de 005 permanece pospuesto.

## Ejecución y correcciones observadas de H1

Mermaid 12.1.0 instalado con versión exacta y lockfile. El contrato del kit conserva 34 documentos; la arquitectura se inserta en la ruta real docs/BASE_ARCHITECTURE.md. No se renombran ni agregan documentos del kit. Relaciones ER opcionales, compatibilidad de borradores y proyecciones deterministas pasan las pruebas específicas.

Los primeros recorridos detectaron filtros demasiado estrictos para namespaces, filter/feDropShadow y symbol legítimos; el filtro se corrigió preservando veto de scripts/eventos/foreignObject, recursos externos y referencias inexistentes. El banco adversario público comprueba las tres familias, 11 entradas hostiles y cancelación de respuesta antigua. La primera ejecución completa se interrumpió por selectores pre antiguos y porque el HTML técnico no estaba en precache; se corrigieron ambos antes de repetir regresión completa.

La primera medición de volumen falló: interacción p95 39,9 ms, mapa 1017,6 ms. Contención/ajuste de texto aislados no resolvieron el problema. El ensayo de métricas Canvas y el render Mermaid dentro de Shadow DOM se descartaron; se conservan las métricas SVG nativas. La solución combina runtime local en iframe con DOM propio, SVG filtrado en Shadow DOM abierto, opciones del formulario montadas al abrirlas, viewport previo identificado durante actualización y arquitectura particionada en hasta seis nodos/20 conexiones por parte sin perder relaciones. No se atribuye un hilo separado al iframe. Exportaciones deshabilitadas mientras se muestra una vista anterior.

El banco usa 10 perfiles, 20 componentes, 50 tecnologías, 20 proyectos y 100 RF. Se crea el evento antes de encolarlo mediante MessageChannel, se observa commit React por hook de timestamp y se mide hasta la microtarea siguiente. Se conserva lectura de geometría después y se informa por separado. La espera en cola permanece incluida. Primera ejecución correcta del candidato: 200 entradas p95 8,7 ms, layout posterior 1,5 ms; 200 alternadores 6,5 ms, zoom 1,4 ms y pan 1,8 ms. Mapa: 20 muestras p95 291,6 ms, máximo 328,3 ms. El máximo de interacción fue 184,9 ms y hubo tareas largas de 51–162 ms: p95 no es garantía para cada evento ni ausencia de bloqueos. La regresión final repite mediciones y agrega 200 cambios de documento.

Lint, typecheck, 141 unitarias y build observados con salida 0. Regresión Chromium/Firefox completa en curso; no se declara cierre técnico ni sincronización todavía. Primera apertura offline y descargas SVG/PNG pasan en Chromium tras corregir precache. Responsive del visor pasa en Chromium a 320/375/767/768/1279/1280/1440 px. Datos definitivos de comandos, medidas, módulos y Git se consolidan después de la regresión.


### Medidas del build final de H1 (regresión aún en curso)

Entorno: Linux x86_64, Intel Core i5-1235U (12 CPU lógicas), Node 26.5.0, npm 11.17.0. `npm run lint`, `npm run typecheck`, `npm test` y `npm run build`: códigos 0; 144 unitarias correctas. Los recorridos de navegador siguen en curso.

Archivo `principal-BDseoTN2.js`: 359178 bytes, gzip medido con zlib 113566 bytes. Dependencias estáticas: runtime 979, preload 2071, React 7876 y project-model 136962 bytes. Suma inicial JS 507066 bytes; el umbral aprobado se refiere al archivo principal, no a esa suma, que se publica expresamente. CSS 38283 bytes; trabajador 216666 bytes; entrada técnica de diagramas 3859 bytes; todos los chunks JS suman 6116713 bytes. Mermaid y sus layouts se ejecutan diferidamente; el mayor chunk opcional ELK ocupa 1462930 bytes. La caché estática incluye diagram-renderer.html: precache no equivale a ejecución del renderizador.

Banco final Chromium H1 con volumen de referencia: 200 entradas p50 1,4 / p95 3,5 / máximo 9,4 ms; layout posterior p95 1,6 ms; 200 alternadores p95 6,8 / máximo 10,5 ms; zoom p95 1,4 ms; pan p95 1,4 ms; 200 cambios de documento p95 6,6 / máximo 13,1 ms. Cero commits ausentes; espera de cola p95 0,4 ms incluida. Mapa: 20 actualizaciones p95 262,2 / máximo 271,6 ms. 21 tareas largas de 51–97 ms, publicadas separadamente. Primera vista SVG Chromium 1526 ms con módulo sin ejecutar. Son medidas del banco, no tiempos de participantes ni garantía por evento.


Chromium 153.0.8010.12 y Firefox 155.0, instalados por Playwright 1.63.0. Referencias observadas en la regresión Chromium final: biblioteca (20 proyectos/100 RF) 200 muestras p95 2,7 ms; tecnologías propias 200 muestras p95 1,6 ms; generación 30 muestras p95 54,8 ms; edición p95 2,4 ms; 200 conjuntos con caché preparada p95 14,7 ms; 30 ZIP p95 15,8 ms; 200 ajustes de muestra p95 5,1 ms, 652 commits y cero renders de raíz/cabecera/idea/árbol/madurez/configuración ajenos.

La repetición completa anterior registró 144 recorridos correctos, seis omitidos y dos fallos: conjunto p95 17,1 ms durante arranque con 30 muestras y fuentes offline Firefox antes de completar precache. Se volvió a IMPLEMENT: preparación offline completa antes de medir fuentes/conjuntos, 200 conjuntos y timestamp del evento. La cifra 17,1 ms sigue siendo un resultado de arranque; el resultado caliente no garantiza ese presupuesto durante preparación. Se añadieron guardas de 201 nodos (declaraciones y multiplexación) y participantes; el corpus de 100 RF pasa el filtro y el kit de 100 RF/100 relaciones permanece <=1 MiB. No se borra ni resume como correcto el ensayo fallido.

Auditoría automática de los archivos textuales seguidos/no ignorados: cero emojis; `git diff --check` 0, rama main, remoto origin existente, 002 ignorado y sin archivos seguidos. Aún no hay commit/push H1 ni inicio H2.


### Resultado final T-006-16/17

Los cinco comandos completos finalizaron con código 0: lint, typecheck, 144 unitarias, build y `npm run test:e2e`. Navegador: 146 recorridos correctos, seis omitidos (mediciones de referencia solo Chromium), cero fallos, 7,6 minutos. Firefox completa parser, visor/descargas, vista previa/cancelación, primera apertura offline, siete anchos y filtro adversario; primera vista SVG 1692 ms con módulo sin ejecutar.

H1 queda verificada técnicamente. Manual, decisiones y trazabilidad actualizados en T-006-17. Los límites de lector de pantalla real, ampliación real, teléfono físico y WebKit siguen pendientes; no se atribuye auditoría manual completa ni aceptación humana. Algunos escenarios previstos de inyección de fallo de import/caché perdida no tienen un recorrido automatizado dedicado; el resultado acredita las pruebas realmente ejecutadas, no todos los ensayos posibles. T-006-18 prepara commit y push exclusivo a origin/main; H2 sigue sin iniciar hasta confirmarlos. La matriz futura de H2 permanece pendiente.

Cierre documental T-006-17: 57 enlaces relativos existentes, conjuntos consecutivos de 15 RF/seis RNF/17 CA/ocho D/27 T sin referencias desconocidas; diff sin errores. Confirmación Git del hash/remoto se registra tras push en la apertura del siguiente hito, para no inventar el hash del propio commit.
