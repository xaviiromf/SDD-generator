# Estado del proyecto y punto de reanudación

Fecha: 2026-10-06.

| Campo | Estado |
|---|---|
| Producto | SDD-Studio, SPA estática local y determinista. |
| Autorización | 001 y Django aprobados previamente; ejecución de 002 autorizada expresamente por el usuario. |
| Fase | IMPLEMENTACIÓN de 002 con verificación técnica terminada. |
| Contrato vigente | 34 documentos: 30 archivos base del marco y cuatro activos en specs/001-<slug>/. Sustituye el kit inicial de seis archivos. |
| Implementación | Contexto/manifiesto comunes, perfiles de destino, guías, gobernanza, plantillas, árbol anidado, visor MD/TXT y ZIP coherente. |
| Catálogo/fuentes | 237 opciones, ocho conjuntos, 21 arquetipos; 30 familias OFL locales. |
| Verificación actual | Lint, TypeScript, build, 28 unitarias y 40 pruebas de navegador pasan; dos mediciones omitidas en Firefox. Build raíz y subruta comprobados. |
| Rendimiento de referencia | Entrada p95 1,5 ms; kit 45,6 ms; conjuntos 10,7 ms; ZIP 10,4 ms. Sin garantía universal de FPS. |
| Compatibilidad | Borradores anteriores, actualización de caché sin recargar edición y exportación sin red comprobados en Chromium/Firefox. |
| Trabajo previo | 40/43 tareas de 001 completadas; pendientes T-001-35,38,39 por auditoría manual de accesibilidad. |
| Límites | Lector de pantalla real, ampliación real de navegador y teléfono físico pendientes; límite de WebKit registrado previamente. No se modifican paquetes del sistema. |
| Evidencia de 002 | Conservada solo localmente por instrucción del usuario, sin enlaces públicos a archivos ignorados. |
| Git | main; sincronización mediante push normal a github.com/xaviiromf/SDD-generator. Código y documentación pública, sin archivos de 002 en el árbol seguido. |
| Próximo paso | Revisión del usuario y auditoría manual pendiente; aceptación y publicación separadas. |

## Autorizaciones y preservación

El usuario aprobó documentación/arquitectura/tareas de 001 y autorizó implementación el 2026-10-06. Aprobó después las sustituciones OFL, Zen Kaku Gothic New y limpieza del primer commit de fuentes ITF; el hito corregido 42ccfe4 preservó el padre documental e438cac con autorización específica de force-with-lease. Django fue solicitado e implementado posteriormente.

En la instrucción actual autoriza ejecutar el plan completo 002 y exige excluir todo su directorio de GitHub. Se añade /specs/002-kit-completo/ a .gitignore y se retiran sus tres archivos previamente seguidos, conservando todos los documentos y evidencia nuevos localmente. El commit ee2470b ya contenía la documentación antes de esta instrucción; retirarla del árbol actual no elimina el historial anterior. No se reescribe ese historial sin autorización específica.

Los documentos generados describen el proyecto objetivo; no importan aprobaciones, observaciones ni resultados de pruebas de SDD-Studio. prompt.txt y el marco externo se preservan. No se publica un sitio por esta implementación.
