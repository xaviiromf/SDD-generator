# Verificación ejecutada — 001 / SDD-Studio

Fecha: 2026-10-06. Implementación autorizada por el usuario. Estado: funcionalidad implementada y verificación técnica ejecutada; cierre formal de accesibilidad pendiente de un lector de pantalla real. Aceptación del usuario: pendiente. No se ha publicado el sitio.

## Entorno y alcance de la evidencia

Linux x86_64; Intel Core i5-1235U; Node 26.5.0; npm 11.17.0. Navegadores Playwright: Chromium 153 y Firefox. Pruebas de interfaz y rendimiento sobre build de producción servido localmente en `/SDD-generator/`. El archivo de bloqueo fija todas las dependencias.

Los resultados describen este equipo y estos escenarios. No certifican una tasa constante de 60 FPS en cualquier dispositivo. La emulación de anchura no sustituye pruebas en un teléfono físico. No se ejecutó un lector de pantalla real.

## Comandos y resultados reales

| Comando / comprobación | Resultado | Código de salida |
|---|---|---|
| `npm run lint` | Sin errores en código y configuración propios; excluye artefactos de build. | 0 |
| `npm run typecheck` | TypeScript estricto sin errores. | 0 |
| `npm run test` | 19 pruebas en 7 archivos; contratos, catálogo, arquitectura, intención, compilación, trabajador, servicios y rendimiento. | 0 |
| `npm run build` | Recursos estáticos en `dist/`; trabajador independiente, exportación diferida y `sw.js`. | 0 |
| `npm run test:e2e` | 32 pruebas pasan; 2 mediciones de rendimiento omitidas en Firefox por usar Chromium como referencia. | 0 |
| `npm run test:e2e -- --project=chromium -g 'presupuestos'` | Refinamiento posterior del escenario: 230 eventos y 30 actualizaciones documentales; pasa. | 0 |
| `npx vite build --base / --outDir dist-root` | Build alternativo en raíz; servido en puerto 4174, recargado sin red, sin errores de página. | 0 |
| Auditoría local de texto | Cero emojis en 85 archivos propios/entrada fuente; se excluyen binarios, dependencias y avisos legales originales. | 0 |
| Auditoría de recursos tipográficos | 60 referencias locales de fuente, ninguna ausente; 30 familias OFL cargadas sin red en ambos navegadores. | 0 |
| Inicio de WebKit descargado | No puede iniciarse: faltan libicu74 y libflite1 en este sistema. | 1 |

El escenario ampliado de generación usa el mismo código de aplicación que la última suite completa. Aumenta la medición de disponibilidad documental a 30 muestras; no modifica la aplicación.

## Cobertura funcional comprobada

- Catálogo: 225 IDs únicos, siete fases, ocho conjuntos y 21 arquetipos; alias independientes. El inventario incorpora las herramientas de estado, primitivas, resaltado y empaquetado mencionadas en el prompt.
- Compatibilidad: CLI excluye opciones visuales activas; frameworks se filtran por lenguaje/plataforma; conflictos y campos incorrectos bloquean exportación. El borrador visual se conserva para volver a web.
- Intención: erratas, acentos, coincidencia determinista y negación. Selecciones manuales prevalecen; un conjunto conserva el arquetipo y su procedencia manual.
- Kit: seis rutas exactas, revisión coherente, salida determinista y española. Cada línea de alcance explícito produce un RF adicional y una tarea asociada; el grafo es acíclico. No se inventan contratos específicos de negocio.
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
| Trabajo síncrono de entrada p95 | 230 eventos; idea próxima a 20.000 caracteres | 1,8 ms | <16 ms |
| Disponibilidad documental p95 | 30 revisiones tras edición | 46,9 ms | ≤150 ms |
| Tareas largas en hilo principal | Escenario de edición y generación | Ninguna >50 ms registrada | Ninguna atribuible a compilación |
| Aplicación de conjunto p95 | 30 cambios, alternando SPA y CLI | 13,7 ms | <16 ms |
| Empaquetado ZIP p95 | 30 kits de referencia, tras carga inicial del módulo | 4,2 ms | <100 ms |
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
