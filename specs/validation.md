# Verificación ejecutada — 001 / SDD-Studio

Fecha: 2026-10-06. Implementación autorizada por el usuario. Estado: funcionalidad implementada y verificación técnica ejecutada; cierre formal de accesibilidad pendiente de un lector de pantalla real. Aceptación del usuario: pendiente. No se ha publicado el sitio.

## Entorno y alcance de la evidencia

Linux x86_64; Intel Core i5-1235U; Node 26.5.0; npm 11.17.0. Navegadores Playwright: Chromium 153 y Firefox. Pruebas de interfaz y rendimiento sobre build de producción servido localmente en `/SDD-generator/`. El archivo de bloqueo fija todas las dependencias.

Los resultados describen este equipo y estos escenarios. No certifican una tasa constante de 60 FPS en cualquier dispositivo. La emulación de anchura no sustituye pruebas en un teléfono físico. No se ejecutó un lector de pantalla real.

## Comandos y resultados del hito previo 001/Django

| Comando / comprobación | Resultado | Código de salida |
|---|---|---|
| `npm run lint` | Sin errores en código y configuración propios; excluye artefactos de build. | 0 |
| `npm run typecheck` | TypeScript estricto sin errores. | 0 |
| `npm run test` | 22 pruebas en 8 archivos; contratos, catálogo, arquitectura, intención, compilación, trabajador, servicios y rendimiento. | 0 |
| `npm run build` | Recursos estáticos en `dist/`; trabajador independiente, exportación diferida y `sw.js`. | 0 |
| `npm run test:e2e` | 34 pruebas pasan; 2 mediciones de rendimiento omitidas en Firefox por usar Chromium como referencia. | 0 |
| `npm run test:e2e -- --project=chromium -g 'presupuestos'` | Refinamiento posterior del escenario: 230 eventos y 30 actualizaciones documentales; pasa. | 0 |
| `npx vite build --base / --outDir dist-root` | Build alternativo en raíz; servido en puerto 4174, recargado sin red, sin errores de página. | 0 |
| Auditoría local de texto | Cero emojis en 86 archivos propios/entrada fuente; se excluyen binarios, dependencias y avisos legales originales. | 0 |
| Auditoría de recursos tipográficos | 60 referencias locales de fuente, ninguna ausente; 30 familias OFL cargadas sin red en ambos navegadores. | 0 |
| Inicio de WebKit descargado | No puede iniciarse: faltan libicu74 y libflite1 en este sistema. | 1 |

La suite completa se repitió tras incorporar RF-30. Incluye 230 eventos y 30 muestras de disponibilidad documental; los valores de rendimiento de este informe corresponden a esa pasada. La comprobación alternativa en raíz y las capturas visuales corresponden al hito previo; la ampliación no cambia rutas de alojamiento.

## Cobertura funcional comprobada

- Catálogo: 237 IDs únicos, siete fases, ocho conjuntos y 21 arquetipos; alias independientes. El inventario incorpora las herramientas de estado, primitivas, resaltado y empaquetado mencionadas en el prompt.
- Compatibilidad: CLI excluye opciones visuales activas; frameworks se filtran por lenguaje/plataforma; conflictos y campos incorrectos bloquean exportación. El borrador visual se conserva para volver a web.
- Intención: erratas, acentos, coincidencia determinista y negación. Selecciones manuales prevalecen; un conjunto conserva el arquetipo y su procedencia manual.
- Kit del hito previo: seis rutas exactas, revisión coherente, salida determinista y española. Cada línea de alcance explícito produce un RF adicional y una tarea asociada; el grafo es acíclico. No se inventan contratos específicos de negocio.
- Trabajador: coalescencia, descarte de revisiones antiguas, inicialización fallida y reintento sin perder la idea. La actualización de la vista previa se agenda fuera del manejador de edición.
- Exportación: ZIP descomprimido y contrastado con documentos; rutas y revisiones inválidas rechazadas. Tokens conservan valores y perfil de versión; comandos validan el identificador y solo se muestran.
- Persistencia: recuperación válida, corrupción, versión desconocida, cuota y secretos sintéticos. Borrado propio confirmado; portapapeles denegado ofrece copia manual.
- Sin conexión: preparación inicial, recarga, trabajador, carga de las 30 fuentes y descarga mediante módulos diferidos funcionan con la red desactivada.
- Diseño adaptable: 375, 767, 768, 1279, 1280 y 1440 px; navegación inferior móvil, dos paneles tablet y tres columnas desktop. Sin overflow horizontal de página; botones visibles con objetivos de al menos 44 × 44 px.
- Accesibilidad automática: contraste AA del estudio, foco de paleta, navegación del árbol, semántica accesible del navegador, movimiento reducido y reflujo equivalente a ampliación 200 %. Las muestras de arquetipos informan honestamente cuando su paleta original falla AA.
- Seguridad: HTML presentado como texto; secretos sintéticos y emojis bloqueados; rutas fuera de la lista permitida y comandos con identificador peligroso rechazados.

## Rendimiento medido

Referencia: Chromium de producción, portátil indicado, sin grabación de trazas en los benchmarks. Las pruebas funcionales conservan trazas al fallar. La carga inicial y el guardado del sistema se separan del empaquetado.

| Métrica | Muestras / tamaño | Resultado | Presupuesto |
|---|---|---|---|
| Trabajo síncrono de entrada p95 | 230 eventos; idea próxima a 20.000 caracteres | 1,6 ms | <16 ms |
| Disponibilidad documental p95 | 30 revisiones tras edición | 42,9 ms | ≤150 ms |
| Tareas largas en hilo principal | Escenario de edición y generación | Ninguna >50 ms registrada | Ninguna atribuible a compilación |
| Aplicación de conjunto p95 | 30 cambios, alternando SPA y CLI | 10,3 ms | <16 ms |
| Empaquetado ZIP p95 | 30 kits de referencia, tras carga inicial del módulo | 3,2 ms | <100 ms |
| Caso ZIP de aproximadamente 1 MiB | 1.048.200 bytes de texto sintético | Empaquetado y descompresión verificados en prueba unitaria | Sin aplicar el presupuesto del kit de referencia |

La optimización final separa la invalidación del panel documental del evento del editor y evita recalcular el fondo del estudio al cerrar la confirmación de un conjunto. El resaltado usa una gramática Markdown mínima y memoizada.

## Evidencia visual

- [Estudio en escritorio](../docs/evidence/estudio-escritorio.png).
- [Estudio en móvil](../docs/evidence/estudio-movil.png).

Se inspeccionaron visualmente las capturas de escritorio y móvil: retícula técnica, tipografías diferenciadas, estados, contraste y jerarquía. Las capturas contienen únicamente datos sintéticos.

## Pendientes y límites del cierre

1. **T-001-35:** la parte automática pasa; falta ejecutar la revisión con un lector de pantalla real y verificar ampliación real del navegador. No hay lector instalado. El reflujo equivalente sí se comprobó; no se presenta como una sesión de lectura asistida real.
2. **T-001-38 y T-001-39:** comandos técnicos y sincronización se realizan, pero su cierre formal depende de T-001-35. Permanecen sin marcar como completadas para conservar las dependencias aprobadas.
3. WebKit: prueba pendiente por dependencias del sistema; no se instalaron ni modificaron paquetes externos al proyecto para sortearla.
4. Aceptación visual del usuario y publicación del sitio: pendientes y separadas de pruebas automáticas.

## Git y fuentes

La autorización está registrada en `docs/PROJECT_STATUS.md`. Las sustituciones OFL y la limpieza del primer commit de implementación fueron aprobadas explícitamente por el usuario y documentadas en D-017. El commit corregido `42ccfe4` conserva como padre `e438cac`, manteniendo la documentación previa. Los hitos posteriores se sincronizan mediante push normal; no contienen fuentes ITF ni secretos.

El SHA final es consultable con `git log -1` y `git rev-parse origin/main`. La igualdad de HEAD y origin/main se comprueba al terminar. Este documento no atribuye aceptación al usuario ni convierte pendientes en resultados positivos.

## Regresión Django — RF-30

Se verificaron filtros por lenguaje y arquitectura, aparición de APIs/complementos al seleccionar Django, DRF como requisito de Simple JWT y drf-spectacular, conservación de conflictos y bloqueo de exportación. El kit declara las opciones y propone manage.py, configuración, modelos, migraciones, plantillas, API DRF/Ninja y Channels/Celery según selección. Borradores previos siguen válidos sin los nuevos campos opcionales.

`npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` y `npm run test:e2e` terminan con salida 0. El primer recorrido nuevo falló por buscar el nombre del acordeón sin su prefijo numérico; se corrigió el localizador y la suite completa posterior pasó (34 pruebas, dos omitidas). No se cambió el comportamiento del producto para acomodar esa prueba. Fuentes oficiales del inventario: D-019 en docs/DECISIONS.md.

## Hito actual — kit completo

Implementación 002 autorizada posteriormente. Salida vigente: 34 documentos por manifiesto, especificación activa numerada y todos los archivos del marco. Lint, TypeScript/build y 28 pruebas unitarias en nueve archivos pasan. Suite completa Chromium/Firefox: 40 pruebas pasan y dos mediciones omitidas, salida 0. Verificados TXT, navegación/ZIP de los 34 documentos, cambios de slug, perfiles híbridos, borrador anterior y actualización desde service worker previo sin recargar edición; exportación offline. Build alternativo raíz también comprobado en Chromium sin red.

Mediciones actuales p95: entrada 1,5 ms, kit 45,6 ms (30 revisiones), conjuntos 10,7 ms, ZIP 10,4 ms (30 muestras tras preparación). Ninguna tarea larga registrada en el escenario. Caso sintético máximo actualizado: 1.047.200 bytes, empaquetado/descompresión comprobados. Auditoría de texto: 101 archivos propios/entrada sin emojis. Capturas de escritorio/móvil actualizadas e inspeccionadas.

La evidencia detallada de 002 se conserva localmente fuera del seguimiento Git por instrucción explícita del usuario. La carpeta previamente subida se retira del árbol remoto actual; el historial anterior no se reescribe. Los pendientes manuales originales y la aceptación/publicación continúan separados de estos resultados técnicos.

## Hito actual — idiomas independientes

Implementación 003 solicitada por el usuario, con confirmación de preservar sus textos. UI y kit admiten ES/EN de forma independiente; el catálogo, mensajes, plantillas de los 34 documentos y políticas del destino siguen su selección correspondiente. Visor, copia, ZIP, comentarios de preparación y metadatos de tokens coherentes; rutas e identificadores preservados.

Lint, TypeScript, build y 35 unitarias pasan. Suite completa Chromium/Firefox: 50 pruebas pasan y dos mediciones omitidas, salida 0. Referencia p95: ingreso 1,3 ms; generación española 39 ms, inglesa 54,7 ms; conjuntos 10,9 ms; ZIP 9,5 ms. Ninguna tarea larga en la referencia española. Matriz de cuatro combinaciones, recarga/offline, datos de usuario, teclado y ancho 320 px comprobados. Evidencia detallada en [003-idiomas/validation.md](003-idiomas/validation.md). Los pendientes manuales, aceptación y publicación siguen separados.

## Ampliación 004 — Implementación autorizada y evidencia técnica

Fecha: 2026-10-07. Plan, AGENTS.md y cambio a español integral aprobados formalmente por el usuario. Implementación secuencial T-004-04…20 realizada; T-004-21/22 verifican los escenarios y T-004-23 registra la sincronización. No se añaden dependencias, servidor propio ni modelo de IA.

La aplicación elimina ambos controles ES/EN y migra borradores/preferencias conservando nombre, idea, alcance, selecciones y personalización. Los 34 documentos, copia, ZIP, tokens y preparación usan español. Los textos escritos por el usuario permanecen literales. Los identificadores y nombres técnicos conservan su forma.

### Resultados y método de referencia

- Lint y TypeScript: código de salida 0.
- Vitest: 52 pruebas en 13 archivos, código 0; incluye descarte de compilación remota anterior al apagar MCP aunque no cambie la revisión del borrador.
- Build de producción: código 0; aplicación 492,56 kB / 159,06 kB gzip, trabajador 169,77 kB, CSS 29,83 kB / 7,34 kB gzip. Exportaciones ZIP diferidas.
- Navegadores: 75 pruebas pasan en una ejecución completa Chromium/Firefox de 78 casos; 0 fallos, 0 inestables, código de salida 0 (178,92 s). Tres mediciones se reservan a Chromium por ser el entorno de referencia.
- Exploración de diseño y paneles: 320, 375, 767, 768, 1279, 1280 y 1440 px, sin desbordamiento. Teclado, foco, movimiento reducido y fuentes locales sin conexión verificados. El modal MCP se comprueba además a 320/768/1280 px; tablet requiere activar el panel Idea conforme a su navegación.

| Medición Chromium sobre producción | Muestras | p95 | Presupuesto |
|---|---|---|---|
| Ajuste hasta mutación de estilos y lectura de estilo calculado | 200 | 3,8 ms | <16 ms |
| Evento de edición de idea cercana a 20.000 caracteres | 230 | 1,7 ms | <16 ms |
| Disponibilidad de revisión documental | 30 | 36,2 ms | <=150 ms |
| Aplicación de conjuntos | 30 | 9,6 ms | <16 ms |
| Empaquetado ZIP tras preparación inicial | 30 | 10,7 ms | <100 ms |

La instrumentación React identifica seis áreas y compara propiedades/estado entre commits: raíz, cabecera, idea, árbol documental, medidor y campos tecnológicos. Ninguna presenta renders adicionales durante los 200 ajustes; los controles, muestra y documentos cuyo contenido cambia sí se actualizan. No hay tareas largas en el escenario de edición. La medición describe actualización de estilos, no una garantía universal de frecuencia de pantalla o FPS.

### MCP y límites de la verificación

HTTP JSON, respuestas SSE, transporte heredado, autodetección tras 405, fragmentación UTF-8, líneas múltiples, negociación de versión/sesión/herramienta, límites de 128 KiB y respuestas incompatibles se verifican con transporte simulado. Un servidor HTTP/SSE local de pruebas verifica CORS real, credencial en cabecera, ausencia de idea durante prueba de conexión y apagado sin nuevos envíos. Se comprueban 401/403/500, IDs desconocidos, confianza inválida, compatibilidad, prioridades, exclusiones, propuestas y respuestas obsoletas. El plazo total de 1500 ms y espera de 300 ms se verifican con reloj controlado; el navegador también prueba respuesta demorada, fallback, desconexión y vuelta a conexión.

El token queda exclusivamente en memoria; preferencias persistidas contienen enabled/endpoint/transport. No hay datos MCP en ZIP ni en el precache. La conexión a un servidor/modelo externo del usuario y su precisión semántica real no se han evaluado: requieren endpoint y configuración concretos. La confianza declarada por el servidor no equivale a precisión calibrada.

### Diseño, regresión y exclusiones

Contratos rechazan opciones, claves, familias no locales y valores inválidos. Resolver neutro/base/personalización compartido por muestra, plan, constitution y tokens; acabados base se conservan hasta elegir una textura propia. HEX parcial permanece en el campo, alfa se compone para contraste y botones se evalúan sobre su tarjeta/fondo. CSS/SVG propios sin recursos remotos; seis acabados, fuentes de código, estados, sombras, densidad, iconos y movimiento forman parte de la salida. Tailwind 4 usa CSS y Tailwind 3 su perfil explícito con recetas. El ZIP conserva exactamente 34 archivos.

El carrusel muestra una ficha, navega sin aplicar, conserva ajustes al cancelar o desactivar y devuelve foco; cambiar de base pide conservar/restablecer/cancelar. Se mantiene regresión de Django, incompatibilidades, portapapeles denegado, datos corruptos, secretos, HTML como texto, trabajador y caché offline.

Se conservan pendientes T-001-35,38,39: lector de pantalla real, ampliación real del navegador y teléfono físico. WebKit mantiene la limitación del entorno ya registrada. La emulación y revisión de capturas no sustituyen aceptación humana; no se despliega el sitio. `specs/002-kit-completo/` continúa ignorado y sin archivos seguidos por Git. Escaneo de texto propio: cero emojis; `git diff --check` correcto.

Comandos finales: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` y `PLAYWRIGHT_JSON_OUTPUT_NAME=test-results/final-results.json npx playwright test --reporter=list,json`, todos con código 0. El informe final contiene expected=75, skipped=3, unexpected=0 y flaky=0. El fallo previo de la prueba de modal en tablet se corrigió activando Idea antes de abrir ajustes; la ejecución final completa ya usa esa precondición.

Sincronización autorizada: commit de implementación d86c589 enviado mediante push normal a origin/main. T-004-23 cerrada y registro documental de cierre enviado después. 002 continúa ignorado, sin archivos seguidos ni incluidos en estos commits.


## Evidencia vigente de 005

La entrega de requisitos estructurados, trazabilidad y preparación H0–H2 se verifica en [005-generador-profesional/validation.md](005-generador-profesional/validation.md). Resultados nuevos: 76 unitarias, 87 pruebas de navegador correctas y tres mediciones Firefox omitidas; TypeScript/lint/build correctos. Corpus y banco automatizado sin participantes se documentan por separado. Los resultados anteriores se conservan como historial.
