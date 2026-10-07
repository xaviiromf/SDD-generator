# Estado del proyecto y punto de reanudación

| Campo | Estado al 2026-10-06 |
|---|---|
| Producto | SDD-Studio. |
| Fase actual autorizada | DOCUMENT para 002; preparar plan y esperar instrucciones. IMPLEMENTACIÓN de 001 fue autorizada previamente. |
| Implementación autorizada | 001 y ampliación Django autorizadas previamente; 002 no autorizada. |
| Trabajo completado | Implementación funcional; 40 de 43 tareas (36 originales y cuatro de la ampliación Django) verificadas y completadas. T-001-35,38,39 permanecen abiertas por la auditoría con lector de pantalla real. |
| Documentos activos | [spec.md](../specs/spec.md), [plan.md](../specs/plan.md), [tasks.md](../specs/tasks.md), [validation.md](../specs/validation.md). |
| Código existente | SPA React/TypeScript: configurador, inferencia local, trabajador, 21 arquetipos, seis documentos, exportación y caché offline. |
| Catálogo y fuentes | 237 opciones únicas, ocho conjuntos, 30 familias OFL locales; sustituciones autorizadas registradas en [DECISIONS.md](DECISIONS.md). |
| Archivos preservados | `prompt.txt` sin modificaciones; marco externo utilizado solo por lectura. |
| Verificación técnica | Lint, TypeScript, build y 22 pruebas unitarias pasan. Chromium/Firefox: 34 pruebas pasan y 2 mediciones se omiten en Firefox. |
| Rendimiento de referencia | Entrada p95 1,6 ms; disponibilidad documental p95 42,9 ms; conjuntos p95 10,3 ms; ZIP p95 3,2 ms. Entorno y límites en validation.md. |
| Accesibilidad | Contraste, teclado, foco, semántica y reflujo equivalente comprobados automáticamente. Lector de pantalla y ampliación real del navegador pendientes. |
| Navegadores | Chromium y Firefox verificados. WebKit no inicia por dependencias ausentes del sistema; no se modificaron paquetes externos al proyecto. |
| Git | Rama `main`, remoto `https://github.com/xaviiromf/SDD-generator`. Hito funcional sincronizado mediante push normal; SHA consultable con `git rev-parse HEAD` y `git rev-parse origin/main`. |
| Siguiente paso | Esperar revisión e instrucciones del usuario sobre [plan de 002](../specs/002-kit-completo/plan.md). Auditoría manual de 001 continúa pendiente. |
| Aceptación y publicación | Aceptación del usuario pendiente. Sitio sin publicar. |

## Autorización registrada

El usuario aprobó formalmente spec.md, plan.md y tasks.md sin objeciones y autorizó explícitamente la Fase 2 el 2026-10-06. Alcance: todas las tareas de implementación, verificación por bloques, español, cero emojis y sincronización con el remoto solicitado. No incluye publicar el sitio.

También autorizó concretar Zen Kaku Gothic New, las seis sustituciones OFL y la limpieza del primer commit de implementación. Se reconstruyó ese único commit y se actualizó el remoto con `--force-with-lease`: hito corregido `42ccfe4`, sin archivos ITF y con padre documental `e438cac` preservado. Los siguientes hitos usan push normal.

## Reanudación

La aplicación puede probarse con `npm ci`, `npm run build` y `npm run preview`. Base predeterminada: `/SDD-generator/`. La verificación técnica y la sincronización de T-001-38/39 están realizadas; su cierre formal depende de T-001-35. Ninguna comprobación automática se presenta como lectura asistida real ni como aceptación del usuario.

Ampliación RF-30 solicitada y autorizada el 2026-10-06: Django localizable, APIs y complementos clasificados, dependencias verificadas y estructura del destino actualizada. T-001-40…43 verificadas; pendientes originales preservados.

## Propuesta 002 — kit completo y adaptable

Solicitud del usuario el 2026-10-06: preparar un plan para todos los archivos restantes del kit, preservar estructura y adaptar contenido a su SDD; entregarlo para revisión y esperar instrucciones. Documentos: [spec](../specs/002-kit-completo/spec.md), [plan](../specs/002-kit-completo/plan.md), [tasks](../specs/002-kit-completo/tasks.md).

Se proponen 30 archivos base del marco más cuatro de una especificación activa numerada (34 documentos). Los tres documentos activos actuales se trasladarían dentro del ZIP; registros de validación empezarían sin ejecuciones. Ninguna tarea T-002 está ejecutada. La aplicación actual y su evidencia permanecen en 001; no se modifican código ni dependencias en DOCUMENT. El trabajo de 002 se detiene al entregar la documentación.

Comprobación documental ejecutada con Python y salida 0: los 30 archivos del marco están cubiertos, el inventario propuesto tiene 34 rutas únicas, ocho RF y 14 tareas sin ciclos; enlaces locales válidos y ausencia de emojis. `git diff --check` termina con salida 0. No se ejecutaron pruebas de aplicación para 002 ni se escribió código.
