# Estado del proyecto y punto de reanudación

Fecha: 2026-10-07.

| Campo | Estado |
|---|---|
| Producto | SDD-Studio, SPA estática con motor local determinista y MCP opcional. |
| Autorización | 001, Django, 002 y 003 autorizados previamente. Plan 004 y matriz aprobados formalmente el 2026-10-07; T-004-04…23, español integral y push del hito autorizados. |
| Fase | VALIDATE 004 completada; T-004-01…23 cerradas técnicamente. Aceptación y despliegue pendientes. |
| Contrato vigente | 34 documentos: seis raíz, diez docs, nueve prompts, índice, cuatro plantillas y cuatro activos en specs/001-<slug>/. |
| Implementación | MCP HTTP/SSE con fallback local de 1500 ms; diseño avanzado, muestra aislada y carrusel de 21 estilos; UI y 34 documentos en español, migración sin pérdida de textos/decisiones. |
| Catálogo/fuentes | 237 opciones, ocho conjuntos, 21 arquetipos; 30 familias OFL locales. |
| Verificación actual | Lint, TypeScript, build y 52 unitarias correctos; 75 pruebas de navegador pasan, tres mediciones omitidas en Firefox; 0 fallos/inestables. |
| Rendimiento de referencia | Muestra 200 ajustes p95 3,8 ms; cero renders ajenos en seis áreas; entrada 1,7 ms, generación 36,2 ms, conjuntos 9,6 ms, ZIP 10,7 ms. No garantía universal de FPS. |
| Compatibilidad | Borradores anteriores, actualización de caché sin recargar edición y exportación sin red comprobados en Chromium/Firefox. |
| Trabajo previo | 40/43 tareas de 001 completadas; pendientes T-001-35,38,39 por auditoría manual de accesibilidad. |
| Límites | Lector de pantalla real, ampliación real de navegador y teléfono físico pendientes; límite de WebKit registrado previamente. No se modifican paquetes del sistema. |
| Evidencia de 002 | Conservada solo localmente por instrucción del usuario, sin enlaces públicos a archivos ignorados. |
| Git | Hito d86c589 sincronizado mediante push normal a origin/main; registro documental de cierre consolidado a continuación. Sin archivos de 002 en el árbol seguido. |
| Próximo paso | Revisar el producto con el usuario y atender las auditorías manuales históricas cuando exista el entorno; no hay implementación 004 pendiente. |

## Autorizaciones y preservación

El usuario aprobó documentación/arquitectura/tareas de 001 y autorizó implementación el 2026-10-06. Aprobó después las sustituciones OFL, Zen Kaku Gothic New y limpieza del primer commit de fuentes ITF; el hito corregido 42ccfe4 preservó el padre documental e438cac con autorización específica de force-with-lease. Django fue solicitado e implementado posteriormente.

En la instrucción actual autoriza ejecutar el plan completo 002 y exige excluir todo su directorio de GitHub. Se añade /specs/002-kit-completo/ a .gitignore y se retiran sus tres archivos previamente seguidos, conservando todos los documentos y evidencia nuevos localmente. El commit ee2470b ya contenía la documentación antes de esta instrucción; retirarla del árbol actual no elimina el historial anterior. No se reescribe ese historial sin autorización específica.

Los documentos generados describen el proyecto objetivo; no importan aprobaciones, observaciones ni resultados de pruebas de SDD-Studio. prompt.txt y el marco externo se preservan. No se publica un sitio por esta implementación.

## Ampliación 003 — Idiomas

El usuario solicita y autoriza implementar dos controles independientes en el encabezado para UI y kit SDD en español/inglés. Confirmó conservar literalmente sus textos (nombre, idea y alcance). Especificación, plan y tareas en specs/003-idiomas/. IMPLEMENTACIÓN técnicamente verificada; sin servicios externos ni dependencias nuevas. La exclusión de 002 permanece vigente.

Resultado de 003: 35 unitarias y 50 recorridos de navegador pasan; dos mediciones omitidas en Firefox. Lint, TypeScript, build y diff sin errores. Evidencia y límites en specs/003-idiomas/validation.md; tareas verificadas. UI y visor declaran idiomas independientes, sin llamadas a traducción externa.

## Ampliación 004 — Registro histórico de DOCUMENT anterior a la autorización

El usuario solicita documentación previa y AGENTS.md antes de MCP opcional, reglas de contexto por fases, diseño avanzado y carrusel de 21 arquetipos. AGENTS.md creado primero; spec/plan/tasks actualizados con RF-004-01…14 y T-004-01…23. T-004-01/02 documentales verificadas; tareas de aplicación pendientes. El nuevo mandato de español integral propone retirar controles de idioma y migrar preferencias de 003 sin pérdida de textos. MCP amplía la capacidad local con transmisión opcional de la idea tras activación, manteniendo fallback completo a 1500 ms.

No se escribió código de aplicación ni se instalaron paquetes o ejecutaron pruebas nuevas. La evidencia de 003 sigue siendo el último resultado de aplicación, no de estas propuestas. Esta entrega permanece local para revisión; no se realiza push del nuevo hito antes de aprobación. Se preserva specs/002-kit-completo/ y los límites manuales pendientes.

## Autorización formal de 004

2026-10-07: el usuario aprobó AGENTS.md, especificación, plan, tareas y matriz de acceso. Autoriza T-004-04…23 secuencialmente y confirma retirar ES/EN, fijar español y migrar datos sin pérdida. Se registra T-004-03 como completada. Aplicar cero emojis, MCP opcional con fallback de 1500 ms y sandbox <16 ms medido. Sincronizar el hito con el remoto al pasar pruebas/build; no autoriza despliegue. Tarea activa: T-004-04, dominio núcleo de diseño.

T-004-04/05 verificadas: 6 pruebas de contratos y normalización; TypeScript correcto para diseño. Tarea activa T-004-06, dominio integración/servicios: acciones públicas y migración de borradores.

T-004-06 verificada con 7 pruebas y TypeScript. Tarea activa T-004-07, núcleo: contexto, madurez y documentos del diseño efectivo.

T-004-07 verificada: 10 pruebas de diseño/kit y TypeScript. T-004-08 activa, servicios: exportación desde DTO público.

T-004-08 verificada con 7 pruebas y TypeScript. T-004-09 activa, UI: controles accesibles que consumen contratos públicos de diseño y editor.

T-004-09: controles completos y TypeScript correcto; verificación de interacción y adaptación en T-004-21/22. Tarea activa T-004-10, UI: muestra aislada y contraste usando contratos públicos.

T-004-10: TypeScript correcto; DTO y contraste unitario verificados, interacción y p95 pendientes en T-004-21/22. T-004-11 activa, UI: navegación del carrusel.

T-004-11/12 verificadas: build correcto y prueba Chromium del carrusel (navegación sin selección, cancelar/foco, conservar y desactivar). T-004-13 activa, servicios: transporte HTTP MCP. Fuentes oficiales de transporte/ciclo 2025-11-25 revisadas el 2026-10-07.

T-004-13 verificada: 2 pruebas HTTP/límites y TypeScript. T-004-14 activa, servicios: SSE heredado y aborto.

T-004-14 verificada: 4 pruebas HTTP/SSE, UTF-8 fragmentado y TypeScript. T-004-15 activa, servicios/trabajadores: coordinación y contrato público de snapshot.

T-004-15 verificada: 3 pruebas coordinación/trabajador y TypeScript; espera 300 ms y fallback exacto 1500 ms con reloj controlado. T-004-16 activa, núcleo: consumir snapshot validado sin red.

T-004-16 verificada: 5 pruebas núcleo/trabajador y TypeScript. T-004-17 activa, integración/servicios: preferencias separadas, cliente coordinado y exclusión de caché. El service worker solo precachea rutas estáticas permitidas.

T-004-17 verificada: 8 pruebas servicios/coordinación/trabajador y TypeScript. Preferencias sanitizadas sin idea/token; token solo memoria; MCP fuera del precache. T-004-18 activa, UI: estado y consentimiento en modal.

T-004-18: modal con consentimiento/destino y TypeScript correctos; interacción CORS/estado en T-004-21. T-004-19 activa, integración pública: español fijo y migración.

T-004-19: controles retirados y TypeScript correcto; restauración fuerza español preservando contenido. T-004-20 activa, subtarea núcleo: salida exclusivamente española; después servicios/documentación y pruebas de migración.

T-004-20 verificada: lint correcto, 44 pruebas unitarias y build correctos. Documentación de uso actualizada. T-004-21 activa, pruebas específicas IMPLEMENT. Las comprobaciones de navegador determinarán correcciones necesarias; no se declara cierre todavía.

T-004-21 detectó un fallo de etiqueta exacta en selectores nativos (el nombre incluía opciones). Corrección IMPLEMENT T-004-09, UI: añadir aria-label explícito a cada selector; las pruebas retoman luego.

Ajuste de cobertura T-004-07, IMPLEMENT núcleo: completar metadatos PROJECT, TECHNICAL_CONTEXT y DECISIONS con la misma tabla de diseño; conservar acabados base y resolver ambigüedad de inferencias.

Corrección de controles T-004-09/12, UI: el acabado original se muestra como opción separada y el título del arquetipo deja de ser un botón deshabilitado. Se retoma T-004-21 para pruebas y mediciones.

T-004-21: pruebas detectan ausencia de solicitudes MCP; investigar IMPLEMENT T-004-17 integración/servicios (suscripción de preferencias). Otras pruebas se ajustan a normalización CSS 0s y guardado asíncrono.

Corrección T-004-13 servicios: invocar fetch mediante envoltorio para conservar el receptor del navegador. T-004-21 retoma escenarios reales de transporte y mediciones, sin cambiar dependencias.

T-004-21: escenario SSE con CORS real correcto y diseño 320…1440 correcto. Refinamiento IMPLEMENT T-004-10, UI: aislar árbol/medidor sin cambios de datos; mejorar instrumentación de renders para comprobar que reconoce los componentes medidos.

Ajustes finales IMPLEMENT por dominio: T-004-17 integra eventos online/offline; T-004-06 evita revisiones sin cambio semántico; T-004-04 protege el resolver ante objetos inválidos; T-004-10 simula un respaldo blanco explícito para contraste con fondo alfa. La instrumentación de pruebas reconoce seis áreas y compara estados entre commits.

Refinamiento T-004-04 núcleo y T-004-10 consumidor UI: contraste de botones alfa compuesto sobre tarjeta/fondo reales; texto automático negro/blanco según ese contraste. Verificar con prueba específica antes del build final.

Revisión de carrera en cierre: volver a IMPLEMENT T-004-15, dominio trabajadores/pruebas. Una respuesta de compilación remota en vuelo debe descartarse también al cambiar preferencias MCP sin cambiar revision del borrador. Añadir generación local de solicitudes antes de aceptar resultados y probar ese escenario; después retomar VALIDATE.

T-004-15: 52 unitarias, lint, TypeScript y build correctos tras protección de generación de solicitudes. Casos adicionales MCP: la prueba de tablet debe activar el panel Idea (configuración/idea alternan en ese rango); corrección IMPLEMENT de prueba T-004-21, sin cambio de aplicación. VALIDATE retoma informes.

T-004-22 detecta un fallo de visibilidad del panel Idea a 768 px incluso tras activar navegación. Volver a IMPLEMENT, dominio UI/responsividad T-004-18/22: inspeccionar estilos de tablet y corregir antes de cerrar; no marcar verificación completa.

Cierre técnico T-004-21/22: ejecución completa final de 78 casos, 75 correctos y tres mediciones Firefox omitidas; 52 unitarias, lint, TypeScript y build con código 0. Texto propio sin emojis, diff correcto y 002 sin archivos seguidos. T-004-23: registrar y verificar el push normal del hito autorizado.

T-004-23 completada: push normal de d86c589 confirmado por Git (64d7916..d86c589, main -> main). Se marca el cierre de 004 y se sincroniza este registro documental. 52 unitarias, 75 pruebas de navegador y tres mediciones Firefox omitidas; lint/TypeScript/build correctos. No se despliega ni se declara aceptación o conexión a un modelo externo real.
