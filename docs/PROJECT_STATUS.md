# Estado del proyecto y punto de reanudación

Fecha: 2026-10-08.

| Campo | Estado |
|---|---|
| Producto | SDD-Studio, SPA estática con motor local determinista y MCP opcional. |
| Autorización | 001, Django, 002 y 003 autorizados previamente. Plan 004 y matriz aprobados el 2026-10-07. H0–H2 de 005, tareas 02…19 y cierre 35 autorizados el 2026-10-08; H3–H5 pospuestos. |
| Fase | VALIDATE 005 concluida técnicamente; consolidación documental y sincronización T-005-35. Aceptación pendiente; H3–H5 pospuestos. |
| Contrato vigente | 34 documentos: seis raíz, diez docs, nueve prompts, índice, cuatro plantillas y cuatro activos en specs/001-<slug>/. |
| Implementación | Modelo canónico versionado, editor/entrevista, trazabilidad y preparación de 34 documentos; MCP opcional de 1500 ms y diseño avanzado conservados. Español y migración aditiva sin pérdida de textos/decisiones. |
| Catálogo/fuentes | 237 opciones, ocho conjuntos, 21 arquetipos; 30 familias OFL locales. |
| Verificación actual | 76 unitarias, 87 pruebas de navegador correctas, tres mediciones Firefox omitidas; lint, TypeScript/build correctos; 0 fallos. Evidencia en specs/005-generador-profesional/validation.md. |
| Rendimiento de referencia | Sandbox 200 ajustes p95 6,2 ms y cero renders ajenos en seis áreas; entrada 2,6 ms, generación extensa 43,5 ms; corpus H2 48,0 ms, cien requisitos 68,2 ms. Banco técnico sin medición de ahorro humano. |
| Compatibilidad | Borradores anteriores, actualización de caché sin recargar edición y exportación sin red comprobados en Chromium/Firefox. |
| Trabajo previo | 40/43 tareas de 001 completadas; pendientes T-001-35,38,39 por auditoría manual de accesibilidad. |
| Límites | Lector de pantalla real, ampliación real de navegador y teléfono físico pendientes; límite de WebKit registrado previamente. No se modifican paquetes del sistema. |
| Evidencia de 002 | Conservada solo localmente por instrucción del usuario, sin enlaces públicos a archivos ignorados. |
| Git | Hito previo 53d13c2 sincronizado. T-005-35 pendiente de confirmar push normal de H0–H2. Sin archivos de 002 en el árbol seguido. |
| Próximo paso | Sincronizar T-005-35 y presentar H2 para revisión del cliente; H3–H5 necesitan autorización posterior. Auditoría manual y revisión semántica pendientes. |

## Propuesta 005 — Historial DOCUMENT previo a autorización

2026-10-08: el usuario solicita análisis como líder técnico de un equipo con IA y como cliente, más un plan para revisar. Tarea T-005-01, dominio de documentación, fase DOCUMENT: contratos públicos y evidencia previa, sin leer internals ni modificar aplicación. Diagnóstico, requisitos, plan, tareas y registro en specs/005-generador-profesional/. Se propone priorizar H0–H2 y conservar H3–H5 como evolución secuencial. Ningún hito nuevo de código está autorizado; detenerse al entregar la documentación. No se sincroniza esta propuesta antes de su revisión.

T-005-01 completada documentalmente: enlaces, unicidad de 15 RF/35 tareas, dependencias numéricas, cero emojis y diff correctos. Corpus y mejoras no implementados ni probados; evidencia en specs/005-generador-profesional/validation.md. Próxima tarea T-005-02: registrar instrucciones del usuario.

## Tutorial de túneles MCP

2026-10-07: el usuario solicita añadir INSTRUCCIONES_MCP_TUNNEL.md. Tarea documental del dominio de especificaciones y documentación: tutorial del contrato público, configuración del estudio y clientes Codex, Claude Code, Google Antigravity y Cursor. Se enlaza desde README. Fuentes oficiales contrastadas; la sintaxis de codex mcp add se contrasta también con la ayuda local. No se modifica código ni se instala o despliega un servidor/túnel.

Verificación documental completada: enlaces locales existentes, cinco ejemplos JSON y un TOML válidos, seis bloques Bash revisados mediante bash -n, ausencia de emojis en los tres documentos afectados y git diff --check correcto. Los comandos de configuración no se ejecutaron contra servicios reales; no se repiten pruebas/build de aplicación para esta entrega exclusivamente documental. specs/002-kit-completo/ permanece fuera del árbol seguido. Entrega mediante commit documental y push normal al remoto existente; los resultados de aplicación de 004 permanecen como evidencia histórica independiente.

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

## Autorización 005 acotada

2026-10-08: el usuario aprueba H0 (corpus/rúbrica/base), H1 (modelo, validación, editor/entrevista) y H2 (34 documentos, trazabilidad y preparación). T-005-02 completada tras contrastar esta autorización; T-005-03 activa, dominio documentación. T-005-20…34 pospuestas; importación, multiproyecto, diffs, perfiles extensibles y adaptadores no autorizados. Se mantienen SPA local, español, cero emojis, 34 rutas, separación por dominios y MCP opcional de 1500 ms. No hay procesos ni cambios de código de la ejecución interrumpida. Sin instalaciones nuevas.

T-005-03…06 verificadas: corpus de 12 entradas y oráculos congelados; base real de 12 ZIP de 34 documentos en Chromium sin MCP; rúbrica/límites/protocolo en corpus.md. La presencia literal de criterios del oráculo no es una evaluación de reglas aún no ingresadas. Sin participantes humanos, no se declara ahorro. Contratos históricos aclarados. T-005-07 activa, núcleo: DTO canónico y validación; lecturas limitadas a modelos/validación y contratos del núcleo.

T-005-07/08 verificadas: DTO y acciones documentados; tres pruebas de validación (versiones, duplicados, referencias, límites, secretos, borrador/no código) y TypeScript correctos. T-005-09 activa, servicios: migración aditiva del borrador existente; contratos públicos del dominio, sin leer UI ni compilador.

T-005-09: migración aditiva implementada; verificación específica en curso. T-005-10 preparada para dominio integración pública, acciones únicamente en src/store/editorStore.ts conforme a DTO documentado; sin lectura de internals de motor/UI.

T-005-09/10 verificadas: cinco pruebas de servicios/migración, dos de acciones/referencias/reordenación y TypeScript correctos. T-005-11/12 activas, UI: src/components/requirements/ y montaje en IdeaEditor; consume DTO/acciones documentados, sin leer motor/compilador.

T-005-11/12 verificadas: TypeScript/lint correctos, flujo Chromium de actor/requisito/criterio sin errores de página. UI consume DTO/acciones y mantiene suscripciones granulares. T-005-13 activa, núcleo: proyección a spec/plan y contratos de requisitos/tareas; no leer componentes ni estilos.

T-005-13: proyección literal de spec/plan comprobada. T-005-14/15 activas en núcleo: tareas por RF y criterios, grafo, gobernanza y contexto de revisión en las 34 rutas. Sin ampliar manifiesto ni desarrollar H3–H5.

T-005-14/15: grafo y tareas estables integrados; criterios iniciales No ejecutado, decisiones/contexto compartidos y 34 rutas preservadas. T-005-16 activa en núcleo: calidad estructural, preparación y contradicciones explícitas, sin sustituir revisión semántica ni autorizar código.

T-005-14…16 verificadas: cuatro pruebas de proyección/preparación, TypeScript/lint correctos. T-005-17a activa, UI: revisión y madurez consumen DTO coverage/readiness; no leer núcleo. T-005-17b será integración de exportación mediante diagnóstico público kind=compatibility; los bloqueos de seguridad/revisión permanecen absolutos.

T-005-17a/b verificadas estáticamente: UI de cobertura/calidad/diagnósticos y permiso explícito de borrador con conflictos tecnológicos; datos inseguros y revisión obsoleta bloqueados. Suite completa actual: 63 pruebas unitarias, TypeScript/lint correctos. T-005-18 preparación IMPLEMENT de pruebas específicas de corpus y navegador, dominio tests/integración; luego VALIDATE lee únicamente resultados.

T-005-18 VALIDATE activa: corpus 12/12 y volumen de 100 requisitos pasan; build correcto con aviso del paquete principal de 513,50 kB. Se leen resultados de navegadores y pruebas, sin inspeccionar implementación en esta fase. T-005-19 requerirá revisión humana: no hay participantes disponibles y no se declarará completada esa evaluación.

T-005-18 detecta un fallo de selector de prueba: getByLabel exact sobre select etiquetado no coincide con sus opciones; el reporte confirma control y actor presentes. Se interrumpe la ejecución específica y se vuelve a IMPLEMENT, dominio tests, para usar el nombre accesible del combobox. Corrección de tamaño de bundle en montaje UI de los paneles nuevos, sin nuevas bibliotecas. Luego repetir VALIDATE.

Corrección de T-005-18 en IMPLEMENT, dominio tests/integración: los controles ya funcionan y exportan, pero la comprobación tras recuperación no debe cerrar un acordeón que el navegador conserve abierto. Se audita el estado DOM del editor al cambiar campos antes de ajustar precondiciones. Bundle dividido en paneles diferidos, principal 499,18 kB sin aviso.

T-005-18: diez recorridos específicos de Chromium/Firefox correctos. T-005-19: el usuario declara que no dispone de participantes y solicita otro método para medir tiempos y correcciones. Se sustituye la evaluación humana por comparación automatizada de ambas versiones con idénticos datos ficticios; se medirán generación/ZIP y hallazgos estructurales, sin atribuir ahorro humano. IMPLEMENT activa, dominio tests/integración pública: crear banco reproducible y ampliar consentimiento de exportación; después VALIDATE.

T-005-18/19 pasan a VALIDATE: banco comparativo ejecutado contra builds aislados sin instalación; prueba de consentimiento positivo añadida. Ejecutar regresión completa, lint, TypeScript y build; registrar solo salidas observadas.

Regresión unitaria: 76 pruebas correctas; TypeScript/build correctos, principal 499,18 kB. Lint detecta los globales de Node/navegador del banco .mjs; volver a IMPLEMENT, dominio tests, para declarar sus entornos explícitamente. No afecta a la aplicación. Comparación ejecutada: generación H2 p95 48 ms y máximo cien requisitos p95 68,2 ms; hallazgos estructurales 60→0, sin medición humana.

Lint corregido y correcto. VALIDATE 005: 76 unitarias, TypeScript/build correctos; regresión completa de 90 recorridos en ejecución. T-005-35 DOCUMENT activa en paralelo a la lectura de resultados: actualizar manual, decisiones y evidencia del alcance H0–H2; no declarar cierre ni sincronización hasta completar las verificaciones.

Auditoría: 185 archivos de texto propios sin emojis y 002 ignorado/sin archivos seguidos. diff --check señala dos espacios finales en montajes diferidos. IMPLEMENT T-005-17, UI, corrección exclusiva de formato en IdeaEditor/DocumentCanvas; sin cambios de comportamiento. Se retoma VALIDATE y documentación de cierre.

Cierre técnico 005: 76 unitarias y 87 recorridos correctos; tres mediciones Firefox omitidas, cero fallos. Lint/TypeScript/build, corpus doce casos, volumen y banco comparativo correctos. T-005-02…19 completadas con la alternativa de medición autorizada; revisión humana/aceptación pendientes. T-005-35 consolida documentación y prepara commit/push normal; H3–H5 sin ejecutar.
