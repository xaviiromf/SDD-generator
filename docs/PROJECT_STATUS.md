# Estado del proyecto y punto de reanudación

| Campo | Estado al 2026-10-06 |
|---|---|
| Producto | SDD-Studio. |
| Fase autorizada | IMPLEMENTACIÓN; autorización explícita del usuario el 2026-10-06. |
| Implementación autorizada | Sí: especificación, arquitectura y T-001-01…39 aprobadas sin objeciones. |
| Trabajo completado | Implementación funcional; 36 de 39 tareas verificadas y completadas. T-001-35,38,39 permanecen abiertas por la auditoría con lector de pantalla real. |
| Documentos activos | [spec.md](../specs/spec.md), [plan.md](../specs/plan.md), [tasks.md](../specs/tasks.md), [validation.md](../specs/validation.md). |
| Código existente | SPA React/TypeScript: configurador, inferencia local, trabajador, 21 arquetipos, seis documentos, exportación y caché offline. |
| Catálogo y fuentes | 225 opciones únicas, ocho conjuntos, 30 familias OFL locales; sustituciones autorizadas registradas en [DECISIONS.md](DECISIONS.md). |
| Archivos preservados | `prompt.txt` sin modificaciones; marco externo utilizado solo por lectura. |
| Verificación técnica | Lint, TypeScript, build y 19 pruebas unitarias pasan. Chromium/Firefox: 32 pruebas pasan y 2 mediciones se omiten en Firefox. |
| Rendimiento de referencia | Entrada p95 1,8 ms; disponibilidad documental p95 46,9 ms; conjuntos p95 13,7 ms; ZIP p95 4,2 ms. Entorno y límites en validation.md. |
| Accesibilidad | Contraste, teclado, foco, semántica y reflujo equivalente comprobados automáticamente. Lector de pantalla y ampliación real del navegador pendientes. |
| Navegadores | Chromium y Firefox verificados. WebKit no inicia por dependencias ausentes del sistema; no se modificaron paquetes externos al proyecto. |
| Git | Rama `main`, remoto `https://github.com/xaviiromf/SDD-generator`. Hito funcional sincronizado mediante push normal; SHA consultable con `git rev-parse HEAD` y `git rev-parse origin/main`. |
| Siguiente paso | Ejecutar auditoría con lector de pantalla real; después cerrar T-001-35,38,39 respetando sus dependencias. |
| Aceptación y publicación | Aceptación del usuario pendiente. Sitio sin publicar. |

## Autorización registrada

El usuario aprobó formalmente spec.md, plan.md y tasks.md sin objeciones y autorizó explícitamente la Fase 2 el 2026-10-06. Alcance: todas las tareas de implementación, verificación por bloques, español, cero emojis y sincronización con el remoto solicitado. No incluye publicar el sitio.

También autorizó concretar Zen Kaku Gothic New, las seis sustituciones OFL y la limpieza del primer commit de implementación. Se reconstruyó ese único commit y se actualizó el remoto con `--force-with-lease`: hito corregido `42ccfe4`, sin archivos ITF y con padre documental `e438cac` preservado. Los siguientes hitos usan push normal.

## Reanudación

La aplicación puede probarse con `npm ci`, `npm run build` y `npm run preview`. Base predeterminada: `/SDD-generator/`. La verificación técnica y la sincronización de T-001-38/39 están realizadas; su cierre formal depende de T-001-35. Ninguna comprobación automática se presenta como lectura asistida real ni como aceptación del usuario.
