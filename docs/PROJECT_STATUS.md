# Estado del proyecto y punto de reanudación

Fecha: 2026-10-08.

| Campo | Estado |
|---|---|
| Producto | SDD-Studio, SPA estática con motor local determinista y MCP opcional. |
| Autorización | 001, Django, 002 y 003 autorizados previamente. Plan 004 y matriz aprobados el 2026-10-07. H0–H2 de 005, tareas 02…19 y cierre 35 autorizados el 2026-10-08; H3 y H4 autorizados; H5 pospuesto. 006: H1 y H2 autorizados, Mermaid exacto autorizado; commits y push separados por hito. |
| Fase | DOCUMENT 006 H1: T-006-16/17 verificadas; T-006-18 activa para commit/push exclusivo H1. H2 aún sin iniciar. H4 de 005 implementado, verificado y sincronizado; revisión del cliente pendiente; H5 de 005 pospuesto. |
| Contrato vigente | 34 documentos: seis raíz, diez docs, nueve prompts, índice, cuatro plantillas y cuatro activos en specs/001-<slug>/. |
| Implementación | Modelo canónico versionado, editor/entrevista, trazabilidad y preparación de 34 documentos; biblioteca local, versiones, respaldos y aportaciones por sección; perfiles JSON, componentes, tecnologías propias, modos y paquetes por tarea; MCP opcional de 1500 ms y diseño avanzado conservados. Español y migración aditiva sin pérdida de textos/decisiones. |
| Catálogo/fuentes | 237 opciones, ocho conjuntos, 21 arquetipos; 30 familias OFL locales. |
| Verificación actual | 006 H1: 144 unitarias, 146 pruebas de navegador correctas, seis mediciones Firefox omitidas; lint, tipos/build correctos; 0 fallos. Evidencia en specs/006-diagramas-y-experiencia-visual/validation.md. |
| Rendimiento de referencia | Principal 379,12 kB y compartido editorStore 137,37 kB; sandbox 200 ajustes p95 4,8 ms y cero renders ajenos; perfiles al máximo de colecciones p95 1,7 ms; biblioteca con 20 proyectos/100 RF p95 3,5 ms. Banco H2 histórico sin medición de ahorro humano. |
| Compatibilidad | Borradores anteriores, actualización de caché sin recargar edición y exportación sin red comprobados en Chromium/Firefox. |
| Trabajo previo | 40/43 tareas de 001 completadas; pendientes T-001-35,38,39 por auditoría manual de accesibilidad. |
| Límites | Lector de pantalla real, ampliación real de navegador y teléfono físico pendientes; límite de WebKit registrado previamente. No se modifican paquetes del sistema. |
| Evidencia de 002 | Conservada solo localmente por instrucción del usuario, sin enlaces públicos a archivos ignorados. |
| Git | H4 9a0e46f sincronizado mediante push normal a origin/main y confirmado con ls-remote. Registro documental de cierre consolidado después. 002 sigue excluido. |
| Próximo paso | Confirmar commit/push exclusivo de H1; iniciar H2 solo después de confirmar push y árbol limpio. Revisión de H4 de 005 pendiente; H5 de 005 sin autorización. |

## Propuesta 006 — DOCUMENT

2026-10-08: el usuario solicita propuesta formal en specs/006-diagramas-y-experiencia-visual/ y detenerse en DOCUMENT. T-006-01 activa, dominio especificaciones y documentación: H1 de generación Mermaid, visor SVG interactivo y mapa reactivo; H2 posterior de dashboard, visor enriquecido y explorador. Parte 3 totalmente excluida. Solo documentación, inventario de rutas, manifiestos y fuentes técnicas oficiales; sin lectura de internals, código, instalación, commit, push ni despliegue. Mermaid se propone como dependencia pendiente de autorización expresa; no está instalado por esta solicitud. Los resultados históricos de 005 no validan 006.

T-006-01 completada: [spec](../specs/006-diagramas-y-experiencia-visual/spec.md), [plan](../specs/006-diagramas-y-experiencia-visual/plan.md), [tasks](../specs/006-diagramas-y-experiencia-visual/tasks.md) y [validation](../specs/006-diagramas-y-experiencia-visual/validation.md). 15 RF, seis RNF, 17 CA, ocho decisiones y 27 tareas, IDs y dependencias sin errores; enlaces locales existentes, cero emojis y diff correcto. Solo cambios documentales; 002 ignorado/sin archivos seguidos. H1/H2 propuestos, no implementados ni verificados funcionalmente; presupuesto nuevo no medido. Próximo paso: revisión del usuario y autorización explícita para código y dependencia. Sin commit/push de esta propuesta ni despliegue.

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

T-005-35 completada: push normal 53d13c2..84ed6e0 confirmado por Git; ls-remote devuelve 84ed6e046e61a8972d5c251e3aae83e897abfb0f en refs/heads/main. Árbol de trabajo limpio después del hito, 002 excluido y copia temporal del banco retirada. Se sincroniza este cierre documental, sin despliegue ni aceptación implícita.

## Autorización H3 de 005

2026-10-08: el usuario autoriza exclusivamente T-005-20…24 y cierre T-005-35: biblioteca/versiones locales, respaldo/importación validada, diferencias y adiciones manuales por sección, UI accesible y regresión H2. H4/H5 pospuestos. Presupuesto principal <500 kB, controles/sandbox <16 ms, SPA local, español y cero emojis; 002 excluido. T-005-20 activa, núcleo: src/domain/projectLibrary.ts, manualSections.ts, modelos/validación y pruebas específicas; contratos antes de servicios/UI. Sin dependencias nuevas.

T-005-20 verificada: cuatro pruebas de contratos/diferencias/secciones, TypeScript correcto. Límites/retención y DTO definidos. T-005-21 activa, servicios/trabajadores: almacenamiento CAS, respaldo e importación validada fuera del hilo de UI; pruebas específicas, sin leer componentes/motor.

T-005-21 verificada: ocho pruebas de contratos/servicios, importación adversa, cuota y concurrencia; TypeScript correcto. Trabajador nativo separado del transporte para evitar referencias circulares al empaquetar. T-005-22 activa, integración pública: projectLibraryStore/editorStore/documentStore y App mediante contratos; no leer internals de UI/motor.

Corrección de evidencia intermedia: las ocho pruebas de T-005-21 pasaron, pero TypeScript detectó que el Storage simulado carecía de length/key/clear; corregido el contrato de la prueba. T-005-22 integra transacciones CAS, comparación previa y preservación de aportaciones. Verificación de tipos y continuidad en curso.

T-005-22 verificada: cuatro pruebas de continuidad/importación/CAS/reconciliación y cuatro de servicios, TypeScript correcto. Comparación obsoleta rechazada y estado previo conservado al recuperar/importar. T-005-23 activa, UI: components/projects/, DocumentCanvas, cabecera de StudioLayout y estilos; consume acciones/DTO documentados, sin leer internals del núcleo.

T-005-23: TypeScript/lint/build correctos; principal 453,30 kB, trabajador de importación 112,79 kB y módulos UI separados. T-005-24 preparación IMPLEMENT, dominio pruebas: recorridos de biblioteca, restauración/importación y aportaciones; luego VALIDATE sin lectura de implementaciones.

T-005-24 parcial: 88 unitarias correctas; cuatro recorridos nuevos Chromium pasan. Dos fallos: recarga inmediata anterior al guardado diferido y nombre de sección incorrecto en la prueba. Volver a IMPLEMENT T-005-22 (App/biblioteca): guardar borrador al ocultar/cerrar página y reconciliar recuperación con el proyecto activo; luego corregir selectores de prueba en T-005-24. No se declara validación completa.

Revisión final de conflictos antes de VALIDATE completa: IMPLEMENT T-005-20/21, núcleo/servicios, rechazar credenciales en metadatos de respaldo y serializar escrituras con Web Locks cuando esté disponible. T-005-22 registra procedencia de la edición para distinguir recuperación inmediata de una biblioteca actualizada por otra pestaña; no sustituir una revisión ajena al recargar. Sin cambios de alcance ni dependencias.

T-005-20…22: procedencia de cierre y recuperación como copia ante revisión ajena integrada. T-005-23/24 IMPLEMENT: ajustar cancelación durante confirmación y retorno de foco, ampliar casos de cuota/seguridad; después regresión final.

IMPLEMENT T-005-20 (núcleo): revisión final de invariantes de activeId/revision y evitar parsear secciones cuando no existen aportaciones. T-005-24 amplía pruebas de continuidad y mide interfaz con biblioteca poblada; luego VALIDATE.

Regresión previa a cierre: lint correcto; una prueba de cuota usa nombre de helper incorrecto (memory en lugar de memoryStorage), causando fallo de prueba y TypeScript. Corregido en IMPLEMENT T-005-24, dominio tests; repetir unitarias y build antes de navegador completo. No hay fallo de cuota atribuido al producto.

T-005-24 pasa a VALIDATE: ejecutar salidas de regresión completa H2/H3 y medir corpus/límites/rendimiento. No se inspecciona implementación en esta fase; cualquier corrección vuelve a tarea/domain registrado.

T-005-24: todos los recorridos H3 Chromium pasan; biblioteca con veinte proyectos/cien RF mide p95 3,4 ms. Verificación adicional de recuperación: IMPLEMENT T-005-22, exportar respaldo debe ser lectura sin exigir escritura previa cuando se agota cuota o hay conflicto entre pestañas; añadir prueba antes de ajustar el adaptador. La regresión ya iniciada continúa contra su build aislado, sin cambiar dist en vuelo.

T-005-22: la prueba adicional reprodujo bloqueo del respaldo completo al fallar cuota. Corregido: exportación de solo lectura sobre instantánea validada con edición activa, sin exigir escribir biblioteca. La prueba conserva historial y textos; verificarla y repetir recorridos afectados tras terminar la regresión en curso.

Regresión completa intermedia: 101 correctas, cuatro mediciones Firefox omitidas y un fallo Firefox al crear un proyecto después de guardar una versión. Volver a IMPLEMENT T-005-22/24 (integración/pruebas): reproducir la transición y conservar diagnóstico antes de corregir; no atribuir el fallo a un selector sin evidencia.

Reproducción: tres repeticiones Firefox de continuidad pasan; captura de estados no muestra rechazo del modelo. Se identifica una posible carrera: el guardado automático puede deshabilitar el botón entre eventos de puntero; se añade una prueba con trabajador retrasado para comprobarla. IMPLEMENT T-005-22: separar estado ocupado de acciones explícitas y guardado en segundo plano, manteniendo cola/CAS. Añadir prueba de interacción durante autoguardado y volver a verificar Firefox.

T-005-22: prueba de clic con trabajador retrasado pasa en Chromium/Firefox; autoguardado no deshabilita acciones. 94 unitarias correctas, lint/TypeScript/build correctos. Prueba offline adicional detecta selector ambiguo (tres role=status); corregir en IMPLEMENT tests T-005-24 hacia aviso .notice y verificar ese flujo antes de la regresión final.

Última revisión IMPLEMENT T-005-20/24: conservar el orden de varias aportaciones al mismo destino y comprobar encabezados dentro de cercas de código; contratos de fidelidad, sin cambiar UI ni manifiesto. Después build/pruebas y VALIDATE final.

T-005-24 VALIDATE final: 94 unitarias, lint y TypeScript/build correctos; offline H3 correcto en Chromium/Firefox y clic con autoguardado retrasado correcto. Se ejecuta regresión completa final de H2/H3 sobre el último build; no modificar implementación ni archivos de pruebas en vuelo.

T-005-24 completada: regresión final de 112 casos, 108 correctos y cuatro mediciones Firefox omitidas; cero fallos. 94 unitarias, lint y TypeScript/build correctos. Principal 453,60 kB; p95 de edición con 20 proyectos/100 RF 3,4 ms y sandbox estético 4,2 ms. T-005-35 DOCUMENT activa: consolidar manual, decisiones, trazabilidad y evidencia de H3 antes del commit/push normal. No leer ni modificar implementaciones en este cierre.

Auditoría de cierre H3: 200 archivos de texto propios sin emojis; enlaces locales afectados existentes y git diff --check correcto. 002 ignorado y sin archivos seguidos. Pruebas y build finales completos; preparar commit de H3 y push normal al remoto existente, sin aceptación ni despliegue.

T-005-35 H3 completada: push normal a6f0e5f..0bb522e, código 0. ls-remote confirma 0bb522efa9a72e8a243cda28ea30aba57460f8a5 en refs/heads/main; árbol limpio tras sincronizar el código. Se registra este cierre documental en un commit posterior. T-005-20…24 verificadas; H4/H5 permanecen pospuestos. Sin despliegue, aceptación implícita ni reescritura de historial.

## Autorización H4 de 005

2026-10-08: el usuario autoriza exclusivamente T-005-25…29 y cierre 35. Perfiles declarativos JSON, metadatos, componentes, tecnologías propias, modos nuevo/ampliación/migración/documentación y contexto acotado por tarea en las 34 rutas. H5 pospuesto. T-005-25 activa, núcleo: contratos en src/domain/ y src/catalog/profiles.ts, validación y pruebas específicas. Definir contratos antes de integración/UI; sin dependencias nuevas, código ejecutable en perfiles ni ampliación de datos MCP. Presupuesto principal <500 kB e interacción/sandbox <16 ms; 002 excluido.

T-005-25 verificada: cinco pruebas de contratos H4 y TypeScript correctos. Esquemas, metadatos, cuotas, referencias/ciclos, JSON puro y verificación reservada definidos. T-005-26 activa, núcleo: aplicabilidad y proyección de perfiles/componentes/tecnologías, modos y diagnósticos; targetProfile/compiler/readiness y pruebas específicas. Sin UI ni estilos.

T-005-26 verificada: 22 pruebas de contratos/proyección/corpus y TypeScript correctos. Modo documental conserva selecciones y elimina preparación de código; destino propio permanece sin receta web, composición y metadatos proyectados. T-005-27 activa, núcleo: taskGraph/targetTasks, agentContext y plantillas de agentes/guías; instrucciones acotadas dentro de las 34 rutas. No UI ni estilos.

T-005-27: paquetes y matriz incorporados al kit, máximo tres entradas, tareas de dominios separados y dependencias finales actualizadas. Una prueba histórica Django esperaba una tarea mezclada; ajustada para verificar núcleo y servicio por separado. Los contratos/paquetes y corpus pasan. T-005-28a activa, integración pública: editorStore, pruebas de acciones y contratos públicos de profiles; no leer internals del motor ni UI. Posteriormente T-005-28b montará el panel UI diferido.

T-005-27 verificada: 26 pruebas de kit/paquetes/proyección/corpus y TypeScript correctos. T-005-28a verificada: 14 pruebas de acciones/continuidad, modo y referencias; TypeScript correcto. Componente canónico y perfil sincronizados en una revisión, eliminación referenciada rechazada. T-005-28b activa, UI: src/components/profiles/, montaje diferido en configurador y app.css; leer solo controles/UI y DTO públicos documentados, sin núcleo interno ni compilador.

Verificación estática T-005-28b: TypeScript correcto, lint detecta la representación de caracteres de control en la expresión regular de profiles.ts. IMPLEMENT T-005-25, núcleo: sustituir exclusivamente esa comprobación por códigos de caracteres sin cambiar la política; después retomar UI y verificación. No se marca el bloque UI completado todavía.

Corrección de T-005-25 aplicada sin alterar política; lint correcto. Se retoma T-005-28b UI: panel de perfiles/componentes/tecnologías y JSON con confirmación, módulos diferidos. TypeScript y build correctos. T-005-29 preparación IMPLEMENT, dominio pruebas/integración pública: añadir escenarios de H4, continuidad de perfiles, corpus y rendimiento; posteriormente VALIDATE solo salidas.

T-005-29 parcial: doce casos H4 pasan; nueve recorridos nuevos pasan y una medición Firefox se omite. Dos fallos de selectOption: el reporte muestra los combobox accesibles presentes, pero getByLabel exact incluye el texto de sus opciones. IMPLEMENT tests: usar nombre accesible de combobox y repetir. Antes de la regresión final, T-005-25 refina contrato público de diagnósticos a mode/implementationRequired y evita IDs propios que colisionen con catálogo; T-005-28b reduce suscripción a esas propiedades para no renderizar el panel al editar RF ajenos. Sin cambios de alcance.

Refinamiento de contratos aplicado en núcleo. IMPLEMENT T-005-28b activa para sustituir lectura de project completo por selectores mode/implementationRequired y conservar las fichas durante edición de requisitos; después regresar a pruebas T-005-29.

T-005-29 detecta un fallo real de continuidad: tras exportar y recargar, el modo vuelve a nuevo en ambos navegadores. Se vuelve a IMPLEMENT T-005-28c, servicios: draftStorage/projectMigration y validación pública de perfiles; auditar recuperación del campo nuevo antes de cambiar comportamiento. T-005-28a revisará conservación de identidad de profile al modificar RF; T-005-27 revisará separación de VALIDATE de las rutas de implementación. Correcciones registradas antes de cambiar de dominio.

Causa de continuidad localizada en readDraft: trataba cualquier diagnóstico como inválido, incluidas las nuevas advertencias no bloqueantes de perfiles. Se cambia a rechazar solo diagnósticos bloqueantes y se añaden pruebas de recuperación segura. IMPLEMENT T-005-28a, integración: conservar referencia de profile cuando un cambio de RF no altera componentes, sin copiarlo/publicarlo innecesariamente.

Refinamiento de integración aplicado. IMPLEMENT T-005-27, núcleo: las tareas de VALIDATE conservan exclusivamente rutas de reportes, incluso al provenir de un destino con archivos de varios dominios; no se transforman en tareas de lectura de código.

Continuidad corregida y verificada: 124 unitarias, lint/TypeScript/build correctos; once recorridos H4 correctos y una medición Firefox omitida. Revisión final IMPLEMENT T-005-28b: permitir Enter en listas por líneas antes de guardar. T-005-26 añade diagnóstico de incoherencia entre componente y contexto canónico, conservando borradores pendientes; T-005-29 comprueba ese caso y amplía la medición con perfiles/componentes/tecnologías al máximo de colecciones antes de la regresión completa.

UI de listas corregida. IMPLEMENT T-005-26, núcleo: validar correspondencia cuando existe un componente canónico con el mismo ID; si falta, declarar enlace pendiente. El DTO de perfiles puede importarse separado, y setProfileConfiguration lo conecta transaccionalmente.

Se vuelve a IMPLEMENT T-005-29, pruebas/integración pública: verificar listas multilínea con teclado y rendimiento al máximo de las colecciones H4; no inspeccionar internals adicionales.

T-005-28 completada: controles, modos y proyección/continuidad verificados; perfiles declarados no se confunden con validación real. T-005-29 pasa a VALIDATE: 125 unitarias, lint y TypeScript/build correctos; trece recorridos nuevos correctos y una medición Firefox omitida. Se ejecuta regresión completa final H2/H3/H4 sobre el último build, sin modificar implementación ni pruebas en vuelo. Paquete principal 379,12 kB, compartido editorStore 137,37 kB; edición con 10 perfiles/20 componentes/50 tecnologías p95 1,6 ms. El presupuesto principal se refiere a ese paquete, no a la suma de recursos.

T-005-35 DOCUMENT activa para consolidar contratos, manual y trazabilidad mientras VALIDATE lee únicamente salidas de la regresión. No se declara la suite completa ni sincronización hasta observar su resultado final.

T-005-29 completada: regresión final 126 casos, 121 correctos y cinco mediciones Firefox omitidas, cero fallos; 5,1 minutos. 125 unitarias, lint y TypeScript/build correctos. T-005-35 DOCUMENT final: consolidar y sincronizar H4. Auditoría: 213 archivos de texto sin emojis, 15 RF/35 tareas, corpus H4 doce casos con 34 documentos/tres entradas/separación de dominios y respaldo; diff correcto, 002 ignorado/sin archivos seguidos y manifiestos sin cambios.

Auditoría del contenido H4: el encabezado histórico de tasks.md decía «Tareas de implementación» también para procesos documentales. IMPLEMENT T-005-27, núcleo: cambiar exclusivamente a «Tareas del proyecto», manteniendo fases, dependencias y paquetes. Verificar corpus y build tras ese ajuste de texto; la regresión funcional completa anterior se conserva como evidencia.

Ajuste de encabezado T-005-27 verificado: 28 pruebas de corpus H2/H4 y paquetes correctas, TypeScript/build correctos; tamaños finales conservados. Se retorna a DOCUMENT T-005-35. Enlaces locales afectados existentes y diff correcto; preparar commit/push normal de H4, sin H5 ni 002.

T-005-35 H4 completada: push normal 46bccaf..9a0e46f, código 0. ls-remote confirma 9a0e46f93f4d8fa8b43074d8ffea3bf21d32b697 en refs/heads/main y árbol limpio tras el push del código. Se registra este cierre documental en un commit posterior. T-005-25…29 verificadas; H5 permanece pospuesto. Sin aceptación implícita, despliegue ni reescritura de historial.

## Autorización formal de 006

2026-10-08: el usuario aprueba íntegramente H1 y H2, tareas T-006-02…27, y autoriza instalar Mermaid con versión exacta. Exige commit/push exclusivo H1 en T-006-18 y después commit/push exclusivo H2 en T-006-27, ambos mediante push normal a origin/main. H2 solo inicia tras confirmar sincronización limpia de H1. Parte 3 y H5 de 005 excluidos; <500000 bytes principal, interacción p95 <16 ms, español, cero emojis y 002 ignorado/sin seguimiento. Sin despliegue. T-006-02 DOCUMENT completada: Mermaid 12.1.0, licencia MIT, Node >=22.12.0 según npm/oficial; instalación en T-006-07. T-006-03 IMPLEMENT activa, núcleo: contratos y hechos ER opcionales; sin leer UI ni servicios.

T-006-03 verificada: cuatro pruebas de contrato y TypeScript correctos. Arquitectura del kit en docs/BASE_ARCHITECTURE.md; diagramFacts opcional y respaldo compatibles. T-006-04 IMPLEMENT activa, núcleo: proyección pura de arquitectura/perfiles.

T-006-04 verificada: seis pruebas de contratos/arquitectura y TypeScript correctos. T-006-05 IMPLEMENT activa, núcleo: ER y secuencias, sin lectura de UI/servicios.

T-006-05: ocho pruebas de contratos/arquitectura/ER/secuencia correctas y TypeScript verificado. T-006-06 IMPLEMENT activa, núcleo: trazabilidad y publicación de diagramas en las 34 rutas existentes, mediante compiler y DTO compartido.

T-006-06: el banco de cien RF detectó partes de trazabilidad sin leyenda propia de validación pendiente. Corregida la descripción accesible de cada parte; TypeScript correcto. Repetir las pruebas de núcleo antes de incorporar Mermaid.

T-006-06 verificada: dieciséis pruebas del núcleo/kit correctas; fuentes compartidas, 34 rutas y partición de cien RF sin pérdida. T-006-07 IMPLEMENT activa, integración de build: instalar Mermaid exacto 12.1.0 según autorización y conservar import diferido.

T-006-07: Mermaid 12.1.0 instalado con versión exacta y lockfile; Node 26.5.0 compatible. npm informa dos vulnerabilidades de severidad baja; no se aplica actualización fuera del plan. Medición final de módulos pendiente. T-006-08 IMPLEMENT activa, servicios: renderer y política SVG, sin lectura de UI/motor.

T-006-08: política de fuentes y tipos verificados; parser/SVG real pendiente en navegador T-006-15/16. Refuerzo de namespaces y rechazo previo de imágenes/iconos externos para evitar red antes del filtro. T-006-09 IMPLEMENT activa, servicios: exportación SVG/PNG local.

T-006-09: nombres/límites tipados, dos pruebas de servicios y TypeScript correctos; descargas SVG/PNG reales pendientes de navegador. T-006-10 IMPLEMENT activa, trabajadores: mensajes de mapa mediante export público projectArchitecture(Configuration), sin inspeccionar motor.

T-006-10 verificada: prueba de agrupación/descarte de respuestas correcta, TypeScript correcto tras concretar la frontera unknown del mensaje. API pública startArchitecturePreview/ArchitecturePreviewClient.request/dispose; espera 100 ms, revisión/proyecto/token. T-006-11 IMPLEMENT activa, servicios de continuidad y después offline.

T-006-11 continuidad verificada: borrador/respaldo/versiones y modelo anterior pasan, TypeScript correcto; los servicios conservan datos por contrato sin cambios adicionales. T-006-11 offline activa; revisión del adaptador público de precache en vite.config.ts bajo retorno puntual T-006-07 (integración build), para confirmar inclusión de todos los chunks diferidos.

T-006-11 offline: el precache público de build incluye todos los artefactos del bundle, incluidos imports diferidos; no requiere cambiar service worker ni config. Primera apertura sin red se verificará en navegador. T-006-12 IMPLEMENT activa, integración pública: acciones de relaciones y selectores de Compilation.diagrams; no leer UI/motor.

T-006-12 verificada: acciones de relación, revisión atómica y rechazo de eliminación referenciada pasan; TypeScript correcto. T-006-13 IMPLEMENT activa, interfaz/estética: bloques Mermaid, interacción y descarga mediante contratos públicos. Prohibida lectura de internals de servicios/motor.

Concreción T-006-13 UI: DocumentCanvas monta DocumentTabs; este archivo contiene el texto visible. Añadirlo como adaptador UI del visor autorizado y crear DocumentContent para separar cercas Mermaid, sin ampliar funcionalidades H2 ni leer otros dominios.

T-006-13: visor con cercas seguras, bloques visibles diferidos, Diagrama/Código, controles y descarga conectado; TypeScript correcto. T-006-14 IMPLEMENT activa, UI: ProfileStudio, mapa de candidato y relaciones en ContextInterview, sin motor/servicios internos. Validación real de renderer pendiente.

Lint de integración detecta dos escapes regex redundantes en diagramProjection y diagramSvgPolicy. Retornos IMPLEMENT T-006-06 (núcleo) y T-006-08 (servicios), correcciones exclusivas de sintaxis sin abrir internals ajenos; después retomar T-006-14 UI. No se declara lint final correcto hasta repetir.

T-006-14: mapa reactivo de componentes/tecnologías sin aplicar, descarte explícito y controles ER conectados; TypeScript y lint correctos. T-006-15 IMPLEMENT activa, pruebas de integración pública: parser real, SVG/PNG, offline, carreras, responsividad y rendimiento. No inspeccionar implementación; correcciones volverán a tarea de dominio registrada.

Build H1 correcto en tipos/lint pero principal 512,48 kB: incumple RNF-006-02, cierre bloqueado. Volver a IMPLEMENT T-006-10 trabajadores: separar cliente de preview en src/workers/architecturePreviewClient.ts para no importar coordinador/store/MCP desde la UI diferida. Después T-006-14 UI cambiará solo el import público y T-006-15 el consumidor de prueba. Sin ampliar dependencia ni alcance.

La separación del cliente de preview reduce principal a 511,49 kB pero sigue fuera de presupuesto. T-006-07 IMPLEMENT integración build activa: concretar codeSplitting de modelo/catálogo compartido en vite.config.ts, con tamaños iniciales totales visibles; no leer internals ni ocultar renderer en principal.

T-006-15: parser Mermaid real pasa; SVG del visor/mapa no aparece y el recorrido móvil no encuentra navegación Documentos. Volver a IMPLEMENT T-006-08 servicios para diagnosticar filtro SVG por API pública en navegador local; después corregir selector de prueba en T-006-15. Build aislado actual permanece sin modificar mientras termina el recorrido iniciado.

Diagnóstico T-006-08: Mermaid 12 añade filter/feDropShadow SVG, que la allowlist rechazaba; no es foreignObject ni HTML. Permitir exclusivamente ese filtro nativo sin feImage, namespaces y URLs protegidos. Namespacing de IDs de hijos por instancia y título/desc accesibles; dos diagramas no comparten IDs DOM. T-006-15 retoma selectores (Documentos SDD) y desplazamiento real para activar lazy.

T-006-15: se añaden pruebas públicas SVG adversarias en tests/e2e/diagramPolicy.spec.ts y mediciones de interacción con mapa activo en diagrams.spec.ts; se adapta la lectura de texto de kit.spec.ts al contenedor con varios bloques. La prueba de política abre únicamente el módulo público documentado mediante Vite de desarrollo, sin inspeccionar internals.

T-006-15 detecta diferencias en el contrato de retorno del banco SVG y bloqueo de estilos de secuencia. Se vuelve a IMPLEMENT T-006-08 / servicios para comprobar contrato público y filtro por familias; H2 permanece cerrado.

T-006-08: el filtro CSS admite combinadores de descendencia directa dentro del ID raíz, manteniendo veto de recursos externos, hermanos y estilos fuera del SVG. T-006-15: bancos ajustados al retorno público sanitizedSvg y a declaraciones ER separadas, y selector de SVG excluye iconos Lucide.

T-006-08: se admite symbol SVG inerte usado por los actores de sequenceDiagram; use sigue limitado a referencias internas comprobadas. Se retoma IMPLEMENT T-006-15 para verificar las tres familias y presupuestos.

IMPLEMENT T-006-04 / núcleo: revisar el resumen textual de relaciones para que la alternativa accesible incluya conexiones además de nodos. Solo diagramProjection.ts y contrato DiagramDefinition; sin UI/servicios.

T-006-04/05: las descripciones textuales añaden extremos/conexiones y cardinalidades ER explícitas; sourceIds incorpora IDs reales de relaciones además de entidades. Se retoma T-006-15.

T-006-15, banco de volumen real: 200 muestras; interacción p95 39,9 ms (cola 26,9 ms), mapa p95 1017,6 ms, tareas largas 83–718 ms. No supera puerta H1. IMPLEMENT T-006-08 / servicios: aislar layout del contenedor de render para reducir recálculo global; posteriormente T-006-14 / UI para contención del formulario. No se acepta ni sincroniza este resultado.

IMPLEMENT T-006-14 / interfaz: revisar únicamente clases/layout de ProfileStudio.tsx y estilos de sus filas; contratos de mapa ya disponibles.

T-006-14: contención de layout/estilos en fichas y bloques Mermaid; fichas fuera de pantalla usan content-visibility:auto conservando controles y navegación. T-006-15 repite exactamente el banco 10/20/50, 20 proyectos y 100 RF.

La contención no supera el banco (p95 56,5 ms y mapa 1288,7 ms); se conserva como ensayo fallido. IMPLEMENT T-006-08 / servicios: consultar configuración pública Mermaid para evitar cálculo repetido de ajuste de texto; la alternativa Shadow DOM del contenedor no funciona con render() y no se incorpora.

T-006-08: perfil CPU público muestra coste dominante de medición/ajuste de texto Mermaid, no parser/filtro. Se desactiva markdownAutoWrap mediante configuración pública y se restaura el contenedor original. T-006-14 revierte content-visibility por coste observado. T-006-15 enfoca/desplaza el campo antes de entradas, como interacción real, manteniendo mapa ya cargado y cola de eventos medida.

El ajuste de texto tampoco supera el banco (interacción p95 54,3 ms y mapa 1450,6 ms). IMPLEMENT T-006-08 / servicios y T-006-07 / build: trasladar el runtime Mermaid a un documento iframe local persistente con DOM aislado, comunicación tipada y cancelación, manteniendo import diferido y filtrado. Nuevas rutas previstas: diagram-renderer.html, src/services/diagramFrame.ts y diagramRenderRuntime.ts; no backend, paquetes ni documento de kit nuevo. El objetivo es aislar recálculos de layout, no afirmar un hilo separado.

El DOM aislado reduce algunos recálculos pero no supera el banco (p95 69,7 ms, mapa 969,6 ms). IMPLEMENT T-006-08 / servicios: optimizar exclusivamente medidas de longitud de etiquetas flowchart mediante Canvas 2D nativo en el iframe técnico, con misma fuente efectiva y caché por estilo controlado; conservar getBBox nativo y métricas nativas en ER/secuencias. Sin dependencias adicionales; comprobar equivalencia de medidas antes de aceptar.

IMPLEMENT T-006-04 / núcleo: particionar arquitectura en grupos legibles de hasta 12 nodos/20 conexiones, conservando todas las identidades y relaciones en las partes; límites de seguridad 200/250 permanecen. IMPLEMENT T-006-14 / UI: montar opciones de dependencias/tecnologías solo al abrir su details; conservar selecciones del borrador. Estas opciones cerradas estaban reconciliándose en cada tecla.

Tarea activa IMPLEMENT T-006-04 / núcleo: aplicar partición conservadora de arquitectura.

Tarea activa IMPLEMENT T-006-14 / interfaz: aplicar apertura diferida de opciones.

Tarea activa IMPLEMENT T-006-15 / pruebas: repetir mismo volumen y conservar evidencia de ensayos fallidos.

IMPLEMENT T-006-08 / servicios: el ensayo de longitudes Canvas no aporta mejora suficiente (522,5 ms para 70 nodos) y se revierte; se preservan todas las métricas SVG nativas. IMPLEMENT T-006-15: comprobar particiones legibles y formularios con opciones diferidas sin alterar el volumen ni umbrales.

IMPLEMENT T-006-14 / interfaz: comprobar identidad/revisión por parte del mapa para evitar regenerar partes sin cambios.

T-006-14 confirma revisión base estable por parte, sin regenerar SVG inalterados. Tarea activa IMPLEMENT T-006-15 / pruebas: banco de volumen con partes y opciones diferidas.

Partición y opciones diferidas reducen mediana a 2,9 ms, pero p95 20,4 ms y mapa 379,3 ms aún fallan. IMPLEMENT T-006-13 / interfaz: encapsular únicamente el SVG ya filtrado en Shadow DOM abierto para impedir recálculo de estilos de toda la interfaz al insertar cada SVG; Mermaid sigue calculándose en su documento técnico. Se preservan roles, teclado, descarga y fuente.

T-006-13 aplica Shadow DOM abierto exclusivamente a SVG filtrado. Tarea activa IMPLEMENT T-006-15 / pruebas: leer contenido vectorial observable dentro del shadowRoot y medir finalización de inserción mediante data-svg-ready.

Shadow DOM aislado mantiene cola p95 2,3 ms pero interacción p95 16,6 ms y mapa tardío. IMPLEMENT T-006-13 / UI: conservar el viewport anterior durante actualización con aviso explícito, aria-busy y exportaciones deshabilitadas, evitando desmontar y reconstruir toda la sección cada vez; la señal de SVG listo cambia por SVG efectivo.

IMPLEMENT T-006-04 / núcleo: ajustar grupos de arquitectura a 8 nodos para lectura móvil y margen de latencia, preservando relaciones completas.

IMPLEMENT T-006-15 / pruebas: repetir banco sin cambiar datos/umbrales; la finalización se observa tras insertar el SVG efectivo en su raíz aislada.

El banco estable sigue fallando (p95 17,1 ms con layout forzado, mapa 315,5 ms). IMPLEMENT T-006-04 / núcleo: grupos de arquitectura de hasta 6 nodos.

IMPLEMENT T-006-15 / pruebas: separar cola + commit React de layout/pintura, según protocolo aprobado; mantener lectura de geometría después del tiempo de commit y registrar su distribución, sin ocultar trabajo ni eliminarlo del banco. Hook de commit solo observa timestamps, sin leer internals.

IMPLEMENT T-006-13 / interfaz: revisar imports del visor para reducir también suma JS inicial, además del archivo principal; mantener texto/código exactos. No se contabiliza Mermaid como import inicial.

T-006-13: el resaltado sencillo de cuatro tokens del visor pasa a separación nativa y React, preservando fuente/clases y evitando cargar Prism en la entrada del visor. Los errores de render eliminan la vista anterior para no declararla vigente. Se retoma IMPLEMENT T-006-15.

T-006-15, candidato: 200 entradas con hook de commit y cola real del evento p95 8,7 ms; 200 alternadores 6,5 ms, zoom 1,4 ms, pan 1,8 ms; mapa 20 muestras p95 291,6 ms (máximo 328,3 ms). Tareas largas persisten y se publican; p95 no implica límite para cada evento. Se amplía navegación a 200 cambios y responsive a 320/375/767/768/1279/1280/1440 px.

Tarea activa VALIDATE T-006-16: ejecutar lint, tipos, build, 141 unitarias previstas y regresión Chromium/Firefox, leer únicamente salidas/mediciones. Un fallo vuelve a IMPLEMENT registrado.

T-006-16: lint/tipos/build sin errores y 141 unitarias correctas. Regresión interrumpida tras detectar selectores pre ambiguos en Django/idiomas y ausencia de diagram-renderer.html en precache emitido; no se acepta esta ejecución parcial. Principal 359145 bytes, suma estática inicial 507033 bytes: Mermaid no es estático, pero se reduce también la suma inicial. IMPLEMENT T-006-07 / build: agregar explícitamente HTML técnico al precache del plugin, como index.html.

IMPLEMENT T-006-14 / interfaz: separar ProfilesPanelRuntime.tsx del wrapper ProfileStudio.tsx y cargarlo únicamente al abrir el configurador; mismo estado/borrador/contratos, fallo recuperable local. Esta nueva ruta es auxiliar del mismo subsistema autorizado.

IMPLEMENT T-006-15 / pruebas: adaptar únicamente aserciones documentales pre ambiguas de Django/idiomas y localizar otras aserciones equivalentes por símbolo antes de ampliar lectura. No inspeccionar aplicación.

T-006-15 adapta Django/idiomas/workflow al contenedor documental, manteniendo aserciones de contenido. TXT conserva su pre único. Se retoma VALIDATE T-006-16 con códigos de salida explícitos y ejecución completa secuencial.

T-006-16: Chromium funcional/seguridad/offline/responsive sin fallos; el banco de navegación falla por seleccionar también los README de prompts/specs (4 destinos en vez de 2). IMPLEMENT T-006-15 / pruebas: usar rutas raíz exactas y publicar métricas antes de medir navegación. No cambia aplicación ni umbrales; regresión Firefox continúa sobre el mismo build.

T-006-15 corrige destinos raíz exactos. Banco completo correcto: entrada p95 2,9 ms, alternador 4,9 ms, zoom/pan 1,2 ms, navegación 6,3 ms (200 por caso); mapa 20 muestras p95 250,4 ms, máximo 274,3 ms. RNF conserva trazabilidad sin secuencia funcional (unitaria específica correcta). Se retoma VALIDATE T-006-16, repitiendo todas las verificaciones sobre pruebas finales.

IMPLEMENT T-006-15 / pruebas: ampliar comprobación pública del límite de nodos a declaraciones sin etiqueta y conexiones múltiples, antes de cerrar seguridad. Solo prueba del contrato validateDiagramSource, sin inspección de aplicación.

T-006-15 detecta que el límite lexical no cuenta nodos sin etiqueta y agrupaciones con &: unitaria nueva falla antes del cierre. IMPLEMENT T-006-08 / servicios: corregir cómputo preventivo de identidades; solo diagramSvgPolicy.ts y su contrato. El build/regresión en curso corresponden a la versión anterior y no validan esta corrección.

T-006-08 amplía conteo preventivo a operandos & (incluyendo Unicode), actores/participantes con alias y declaraciones compactas separadas por punto y coma; no cambia renderer ni SVG permitido. IMPLEMENT T-006-15: verificar límites y todas las fuentes del kit de 100 RF antes de regenerar build.

T-006-16 del build previo: 144 recorridos correctos, seis omitidos y dos fallos: conjunto p95 17,1 ms con 30 muestras durante arranque; fuentes offline Firefox usa serviceWorker.ready sin esperar preparación completa. IMPLEMENT T-006-15 / pruebas: accessibility.spec.ts espera aviso de caché completa; performance.spec.ts prepara caché y mide 200 conjuntos con timestamp del evento. Se conserva medición anterior como arranque, sin relajar 16 ms. Nuevas guardas de nodos y corpus máximo pasan las tres pruebas específicas.

Se retoma VALIDATE T-006-16 para lint/tipos/144 unitarias/build y regresión completa sobre guardas y pruebas finales.

T-006-16 final: lint/tipos/build/unitarias/e2e códigos 0; 144 unitarias y 146 recorridos correctos, seis mediciones Firefox omitidas. Se activa DOCUMENT T-006-17: manual, decisiones, trazabilidad y evidencia observada; después T-006-18 sincronización exclusiva H1.

T-006-17 completada: manual README, decisiones D-029 y trazabilidad H1; T-006-18 activa, documental/Git sin cambios de código. H2 sigue sin iniciar.
