# Validación y evidencia — 006

Fecha de propuesta: 2026-10-08; cierre técnico: 2026-10-09. Fase **DOCUMENT T-006-27**; H1 sincronizada y H2 verificada, cierre Git pendiente. [Especificación](spec.md), [plan](plan.md), [tareas](tasks.md) y [estado del proyecto](../../docs/PROJECT_STATUS.md).

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

**Matriz aprobada en DOCUMENT; resultados H1 y H2 se registran debajo con sus límites.** Las pruebas se preparan en IMPLEMENT autorizado; VALIDATE solo ejecuta/lee salidas y registra evidencia.

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

## Puertas de cierre

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

T-006-18 observada: commit 8514ddcc25442dedbd8c7c8d5315c6a951bc837f y push normal origin/main código 0, hash remoto idéntico y árbol limpio. H2 comienza únicamente después de esta comprobación.


## Primer banco H2 y correcciones

Lint, tipos, 148 unitarias y build códigos 0. Recorridos específicos: 20 correctos, cinco fallidos y una medición Firefox omitida. Cuatro fallos de alertas se deben a las entidades &gt; que preservan las aportaciones manuales; el visor aún no las interpreta como citas. Navegación de portada con 100 RF: 200 muestras p95 18,7 ms, máximo 28,8 ms, incumple 16 ms; alternador p95 3,2 ms. Se vuelve a IMPLEMENT T-006-20 para conservar el montaje visitado de portada y luego T-006-21/22 para detener actualizaciones de diagrama oculto y decodificar entidades textuales mediante React seguro, sin alterar fuente/exportaciones ni usar HTML activo. No se declara cierre.


### Regresiones intermedias de H2

Tras el primer banco, conservar la portada por sí solo no bastó: navegación p95 21 y luego 29,8 ms. Se añadieron límites memo para configurador, idea, visor y paleta; el banco específico posterior pasó 13 recorridos Chromium, alternador p95 5,8 ms y navegación 4,3 ms. Un intento de tipos falló por la incompatibilidad de un fallback con memo; se corrigió en IMPLEMENT. Los selectores de bloques de código y el origen de red del fixture se corrigieron sin alterar los requisitos. La alternancia inicialmente desmontaba el SVG; ahora lo conserva oculto y el banco observa cero mutaciones del SVG al alternar.

Primera regresión integral H2: lint, tipos, 148 unitarias y build 0; navegador 165 correctas, siete omitidas y seis fallidas en 9,8 minutos. Biblioteca p95 23 ms, navegación documental 16,3 ms y conjuntos 20,2 ms incumplían; la aserción antigua de HTML escapado falló en ambos navegadores y Firefox abrió el árbol antes de publicar sus 34 rutas. Se regresó a IMPLEMENT: callback de enlaces estable, suscripción booleana de revisión vigente y conservación de los dos últimos documentos; HTML sigue inerte pero se muestra literalmente, y el árbol espera el manifiesto antes de expandirse. Una quinta prueba unitaria verifica pendientes de ficha/spec y relaciones, elevando el total a 149.

Banco dirigido posterior: lint/tipos/149 unitarias/build 0; seis recorridos correctos y dos fallidos. Biblioteca p95 2,7 ms y navegación documental 6,6 ms ya correctos. Congelar todo diagrama fuera de viewport produjo cero muestras de actualización del mapa: ensayo inválido y fallido, no aceptación. Se retiró esa congelación; solo portada y documentos explícitamente inactivos conservan su última proyección. El mapa, tras su primera apertura diferida, sigue reaccionando mientras se editan los campos aunque el scroll lo deje fuera de pantalla.

Los siguientes bancos de conjuntos siguieron fallando: p95 total 18 / 18,8 / 25,3 ms. Montar el árbol solo al abrir su explorador no resolvió el presupuesto. El banco de mapa recuperó 19 actualizaciones, p95 291,5 ms, y entrada 2,1, alternador 3,2, zoom/pan 1,3 y navegación 4,8 ms. El dashboard alcanzó alternador 3,2 y navegación 5,7 ms, pero layout forzado posterior de navegación p95 53 ms y máximo 72,8 ms, con 15 tareas largas de 50–84 ms: estos costes no se presentan como interacción, pintura o eventos siempre inferiores a 16 ms.

Traza CDP temporal del conjunto: p95 22 ms, espera 4,6 y manejador 18,1 ms. Localizó recalculados de estilo al eliminar el botón modal enfocado junto a los cambios de decisiones. Se volvió a IMPLEMENT de PresetSelector: resolver selección, liberar foco del botón, cerrar síncronamente el modal y devolver foco al selector sin scroll antes de aplicar. El cierre previo solo había reducido a 16,7 ms (todavía fallido); liberar el foco redujo el banco final dirigido a p95 15,4 ms, espera 3,3 y manejador 12,5; ZIP 30 muestras p95 15 ms. No se mueve trabajo fuera de la interacción para superar el umbral. La instrumentación CDP se retiró antes de la suite final; sus cifras tienen sobrecoste diagnóstico.

Incidencia de protocolo: durante una transición se leyó un fragmento de workflow.spec.ts antes de registrar el regreso desde VALIDATE a IMPLEMENT. Se registró la desviación en PROJECT_STATUS y se corrigió la secuencia; no se afirma cumplimiento perfecto del protocolo de acceso. Incidencia de comando: se intentó npm run test:unit, script inexistente (salida 1); se ejecutó después el comando real npm test, 149 pruebas y salida 0. No se presenta el comando inexistente como ejecutado correctamente.

La regresión final H1/H2 sigue en curso. No hay commit/push de H2 todavía.


### Artefacto candidato de regresión integral H2

Entorno de referencia igual a H1. Comandos reales: npm run lint, npx tsc --noEmit, npm test (149 unitarias), npm run build y npm run test:e2e. Lint, tipos, unitarias y build salidas 0; navegador todavía en curso. La comprobación del script de tipos del proyecto se consolidará antes del cierre.

Principal-C0df49zd.js: 371442 bytes; gzip Python nivel 9: 117216 bytes. Grafo estático: principal, project-model 136962, React 7876, runtime 979 y preload-helper 2071; suma JS inicial 519330 bytes. Presupuesto aprobado del archivo principal <500000 bytes cumplido; la suma inicial supera 500 kB y se informa expresamente. CSS 45804 bytes, trabajador de generación 222745, trabajador de importación 121859, entrada técnica diagramas 3859; todos los JS 6140973 bytes. Mayor módulo opcional ELK 1462935 bytes. Mermaid no pertenece al grafo estático del principal, diagram-renderer.html está precacheado y el renderizador se ejecuta por import dinámico al usarse. Sin nueva dependencia de H2.


### Corrección del conjunto y segunda regresión

La siguiente regresión integral se interrumpió expresamente tras observar p95 17 ms de conjuntos (espera 3,8 y manejador 14,3), con ZIP 15,9 ms. Salida del proceso de navegador -15 por terminación controlada; no hay un resultado integral correcto de ese intento. Los comandos previos lint/tipos/149 unitarias/build habían pasado. Se volvió a IMPLEMENT.

Se investigaron, mediante lecturas delimitadas registradas, TechnologyField y PhaseSection: las fases cerradas no fuerzan montaje de sus controles. La acción pública applyPreset solo publica selecciones/revisión; no se cambió el store ni se abrió el núcleo para diagnosticar este coste. La instrumentación temporal acotó resolución p95 0,2 ms, publicación 0,5 y cierre/foco 10,2. PresetSelector utiliza ahora dialog.showModal nativo, cancelación/Escape y retorno de foco sin desplazamiento. Elimina el portal y su cambio global de pointer-events; no añade dependencias. Un primer banco nativo todavía falló con p95 16,5 ms, y otro instrumentado con 16,6. Se retiró el desenfoque previo, redundante al conservar el contenedor del diálogo nativo, y el banco pasó con p95 15,1 ms, API de cierre 8,6 y foco 0,1; ZIP 10,2.

La prueba nueva de foco falló dos veces en ambos navegadores antes de abrir el diálogo: primero buscó Estilo sin abrir la fase, luego exigió nombre exacto de fase sin su prefijo numérico. Se corrigió el fixture. El recorrido definitivo comprueba ocho Tab/Shift+Tab, rechazo de foco exterior, Escape, conservación de idea/decisiones al cancelar y retorno al selector al aplicar. Pasó en Chromium y Firefox.

Bloques Markdown fuera de pantalla usan content-visibility:auto, con tamaño intrínseco provisional; el DOM semántico y la fuente permanecen. Banco dirigido: siete pruebas correctas, una medición Firefox omitida; alertas/cercas/sticky/contraste/fuente a 375/1280 px y foco modal pasan en ambos motores. Conjuntos p95 15,2 ms, espera 2,9 y manejador 12,5; ZIP 11,8. Esa disposición diferida no redujo perceptiblemente el cierre nativo y no se le atribuye tal efecto. Se retiraron todas las sondas temporales del producto y de la salida de la prueba antes de repetir la suite final.

El candidato final ejecuta npm run lint, npm run typecheck (tsc --noEmit), npm test, npm run build y npm run test:e2e secuencialmente. La comprobación anterior npx tsc --noEmit corresponde al mismo comando del script real; el script también pasa. El resultado integral de esta última ejecución sigue pendiente.


### Ajuste de particiones tras la regresión siguiente

El siguiente intento integral se interrumpió tras dos fallos (salida navegador -15): kit observó innerText de 82 caracteres frente al mínimo 150 porque ese API omite bloques con disposición diferida; el DOM íntegro conserva contenido y se corrigió la aserción a visibilidad del visor más textContent completo. Se mantienen 34 rutas/entradas ZIP y coincidencia exacta de TXT. El mapa, con 19 muestras, obtuvo p95/máximo 309,7 ms, incumpliendo el objetivo 300; interacción p95 2,1, alternador 5,1 y navegación 4,6 sí correctos. Conjunto en ese build pasó p95 14,6 ms (espera 2,9, manejador 11,9), ZIP 11,1; portada alternador 2 y navegación 3,6, layout posterior navegación 20,7, cero mutaciones SVG y cero tareas largas en su banco. No se presenta ese intento como suite integral pasada.

Se volvió a núcleo T-006-19, añadiendo explícitamente la ruta diagramProjection para regresión: arquitectura pasa de seis nodos/20 aristas por parte a cuatro/ocho, sin eliminar ni resumir hechos de las demás partes. Contrato total 200 nodos/250 aristas y fuente 32 KiB por bloque se mantiene. T-006-24 corrige solo la comprobación de texto del visor. Candidato: lint, tipos, 149 unitarias y build 0; banco dirigido parser/kit/mapa, tres correctas y cero fallos. Mapa 20 muestras p95 240,3 y máximo 249,7 ms; entrada p95 2,3, alternador 5,6 (máximo 18,8), zoom 1,4, pan 1,3 y navegación 4,7 (máximo 28,6); tres tareas largas 53–60 ms. El p95 sigue sin garantizar todos los eventos por debajo de 16 ms. La suite íntegra posterior del mismo build está en curso.


### Modalidad, montaje diferido y reanudación del 2026-10-09

Los intentos posteriores de conjuntos siguen registrados en PROJECT_STATUS: cierre agrupado p95 15,9 ms, pero otra integral interrumpida midió 19,4 ms. La traza temporal encontró 577 elementos totales, 85 del documento y 456–457 recalculados al cerrar la modalidad nativa, sin iframe/SVG. No se atribuyó a Mermaid. ManualSections ya difería controles; no requirió cambios. Entrevista y tarjetas de requisitos se montan al abrir por primera vez y se conservan después, incluidos sus borradores locales.

La implementación final sustituye showModal por un diálogo en portal con modalidad gestionada: fondo, aria-modal, ocultación accesible temporal de #root, trampa de Tab/foco, Escape, bloqueo de scroll exterior y restauración de overflow/foco. Publicación, cierre y foco permanecen dentro del commit síncrono medido. El árbol ya preservaba expansión; la hipótesis de que reiniciaba carpetas se descartó. La prueba espera el montaje visible del árbol antes de expandir. Banco dirigido de portal: cinco correctas y una omitida, p95 conjuntos 8,2 ms, ZIP 12,4; ambos navegadores comprueban modalidad/foco y 34 rutas. No hay instrumentación CDP temporal en el candidato final.

La conversación interrumpida conservó cambios, pero perdió registros temporales/procesos del intento integral anterior. No se certifica su terminación. La reanudación guarda evidencia duradera en [docs/evidence/006-h2](../../docs/evidence/006-h2/).

Intento reanudado 01: lint/tipos/149 unitarias/build salidas 0; navegador 172 correctas, siete omitidas y un fallo, 11,4 minutos. Entrada p95 3 ms, alternador 18 ms y mapa 19 muestras p95/máximo 319,7 ms; alternador y mapa incumplen. Portada p95 2,5/4,7 ms, layout posterior de navegación 32,1 ms, una tarea larga de 57 ms. Evidencia completa en [intento-01/checks.json](../../docs/evidence/006-h2/intento-01/checks.json) y [intento-01/e2e.log](../../docs/evidence/006-h2/intento-01/e2e.txt).

Se volvió a IMPLEMENT T-006-21: el SVG completado se reutiliza si fuente/título/descripción/reintento no cambian, aunque cambie la revisión documental; solicitudes nuevas siguen usando revisión/token y cancelación. Alternar conserva SVG y zoom; SvgStage es memo. Inspecciones delimitadas confirmaron descripciones por partición y claves estables; no justificaron otro cambio del núcleo/mapa. Prueba funcional ampliada comprueba zoom 125 % después de Diagrama/Código, estado no ocupado y exportaciones SVG/PNG.

Candidato posterior: lint/tipos/149 unitarias/build salidas 0, tres recorridos dirigidos correctos y una medición Firefox omitida. Entrada 200 muestras p95 2,4/máximo 4,9 ms, alternador 4,9/máximo 13,6, zoom 1,4, pan 1,5; navegación 5/máximo 39,9. Mapa 20 muestras p95 282,7/máximo 304,4 ms; pasa el criterio p95 <=300, no todos los máximos. Layout posterior de entrada 1,7 ms; 18 tareas largas de 53–91 ms. Primera vista SVG sin módulo ejecutado: Chromium 1869 y Firefox 3183 ms, informadas fuera del presupuesto de interacción. [Resultados dirigidos](../../docs/evidence/006-h2/directed.txt). La regresión integral final de este candidato sigue en curso; T-006-25…27 pendientes.


## Resultado final de T-006-25 — H1 y H2

2026-10-09: [comandos y salidas](../../docs/evidence/006-h2/checks.json). npm run lint, npm run typecheck, npm test y npm run build códigos 0; 38 archivos/149 unitarias correctas. npm run test:e2e código 0: integral de 180 casos, 173 correctos y siete mediciones Firefox omitidas, cero fallos en 11,4 minutos. El cierre documental detectó que CA-006-12 exigía un recorrido de tablas dedicado también a 768 px: se añadió ese ancho y ejecutaron sus dos casos nuevos en Chromium/Firefox, ambos correctos; lint/tipos repetidos códigos 0. La aplicación/build permanecieron iguales. Cobertura actual: 175 casos distintos correctos/siete omitidos; no se presenta como una sola ejecución de 182 ni se suman recorridos dirigidos duplicados.

[Build final](../../docs/evidence/006-h2/build.json): principal-DuFInNmx.js 372905 bytes, gzip Python nivel 6 118119. JS estático: principal + project-model 136962 + React 7876 + runtime 979 + preload-helper 2071 = **520793 bytes**. Cumple el presupuesto aprobado del archivo principal <500000; la suma estática supera 500 kB y queda publicada. CSS 46056, generación 222744, importación 121859, entrada técnica diagramas 3859, todos los JS 6142891; mayor módulo diferido ELK 1462935. Mermaid fuera del grafo estático; renderer HTML precacheado. H2 no modifica dependencias.

[Mediciones completas](../../docs/evidence/006-h2/measurements.json), entorno Node 26.5.0/npm 11.17.0, Intel i5-1235U/12 CPU lógicas, Linux x86_64; Playwright 1.63.0. Chromium y Firefox conservan los límites de medición indicados en el protocolo.

| Banco final | Muestras | p95 ms | Máximo / observaciones |
|---|---:|---:|---|
| Entrada con mapa activo | 200 | 2,2 | 5,7; cero commits ausentes, cola p95 0,3 |
| Diagrama/Código en mapa | 200 | 5,6 | 7,3 |
| Zoom / pan | 200 cada uno | 1,8 / 1,7 | 11,5 / 2,5 |
| Navegación documental | 200 | 6 | 36,2; p95 no garantiza todos los eventos <16 |
| Actualización completa de mapa | 20 | 298,3 | 299,3; incluye debounce 100 ms, margen pequeño respecto a 300 |
| Diagrama/Código en portada | 200 | 2,1 | 4,7; cero mutaciones SVG |
| Navegación portada/documentos | 200 | 4,9 | 11,8; cero commits ausentes |
| Biblioteca 20 proyectos/100 RF | 200 | 2,9 | Referencia preservada |
| Tecnologías propias | 200 | 1,9 | Colecciones de referencia |
| Conjuntos | 200 | 11,3 | Espera p95 3,2; manejador 8,2 |
| Muestra visual | 200 | 7,5 | 676 commits; seis áreas ajenas, cero renders |
| Generación / ZIP | 30 cada uno | 51,5 / 17 | Dentro de presupuestos 150/100 |

Método UI: evento creado antes de MessageChannel, espera de cola incluida hasta microtarea posterior al commit React observado. Layout forzado posterior se mide por separado: entrada p95 1,7 ms; portada alternador 6,4 y navegación 30,9/máximo 40,4. No se afirma frame completo/pintura <16 ms. Banco de mapa registra 22 tareas largas de 52–82 ms; portada no registra tareas largas. Primera vista SVG con módulo sin ejecutar: Chromium 1845 ms y Firefox 2717 ms. Estas latencias no se confunden con interacción ni con trabajo fuera del hilo de CPU.

Regresión acredita fuentes Mermaid mediante parser real, 34 rutas/ZIP/TXT, exportaciones SVG/PNG, relaciones y cancelación, borradores/versiones/aportaciones, conflictos seguros y offline preparado. Portada comparte arquitectura/revisión y navegación con foco; alertas/cercas/HTML inerte/fuente exacta, tablas sticky/scroll/contraste y badges se comprueban a 375/768/1280; explorador confirma las 34 rutas, teclado e iconos. Paneles/portada/diagrama cubren 320/375/767/768/1279/1280/1440 px en Chromium/Firefox.

Límites: lector de pantalla real, zoom real de navegador, teléfono físico y WebKit siguen sin verificación nueva; no se atribuye auditoría AA manual completa, aceptación del cliente ni ahorro humano. Los escenarios de import fallido/caché perdida sin recorrido dedicado conservan la limitación declarada de H1. Sin Parte 3, H5, despliegue, backend ni dependencias nuevas de H2. T-006-26 valida documentación; T-006-27 confirma commit/push observado posteriormente.

Cierre documental T-006-26: [auditoría de enlaces/IDs](../../docs/evidence/006-h2/document-audit.json) y [auditoría Unicode](../../docs/evidence/006-h2/emoji-audit.json). Los registros usan .txt para publicarse sin alterar reglas de ignorado. Diff sin errores; 002 ignorado/sin archivos seguidos, manifiestos de dependencias sin cambios en H2. Commit/push exclusivo de H2 pendiente en T-006-27.

Auditorías finales observadas: 85 enlaces locales válidos; 15 RF/seis RNF/17 CA/ocho D/27 T, 27 dependencias anteriores y cero referencias desconocidas. 277 archivos textuales elegibles sin emojis; git diff --check código 0, 002 ignorado/sin archivos seguidos. T-006-26 completada, T-006-27 activa.

Comprobación del índice: primer diff --cached --check detectó espaciado final en registros nuevos (salida 2); se normalizó solo ese formato, conservando resultados. La comprobación final del índice debe pasar antes del commit.
