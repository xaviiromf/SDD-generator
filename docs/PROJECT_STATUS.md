# Estado del proyecto y punto de reanudación

Fecha: 2026-10-08.

| Campo | Estado |
|---|---|
| Producto | SDD-Studio, SPA estática con motor local determinista y MCP opcional. |
| Autorización | 001, Django, 002 y 003 autorizados previamente. Plan 004 y matriz aprobados el 2026-10-07. H0–H2 de 005, tareas 02…19 y cierre 35 autorizados el 2026-10-08; H3 y H4 autorizados; H5 pospuesto. |
| Fase | DOCUMENT de cierre H4: T-005-25…29 completadas; T-005-35 consolida evidencia y sincroniza. H5 pospuesto. |
| Contrato vigente | 34 documentos: seis raíz, diez docs, nueve prompts, índice, cuatro plantillas y cuatro activos en specs/001-<slug>/. |
| Implementación | Modelo canónico versionado, editor/entrevista, trazabilidad y preparación de 34 documentos; biblioteca local, versiones, respaldos y aportaciones por sección; perfiles JSON, componentes, tecnologías propias, modos y paquetes por tarea; MCP opcional de 1500 ms y diseño avanzado conservados. Español y migración aditiva sin pérdida de textos/decisiones. |
| Catálogo/fuentes | 237 opciones, ocho conjuntos, 21 arquetipos; 30 familias OFL locales. |
| Verificación actual | 125 unitarias, 121 pruebas de navegador correctas, cinco mediciones Firefox omitidas; lint, TypeScript/build correctos; 0 fallos. Evidencia en specs/005-generador-profesional/validation.md. |
| Rendimiento de referencia | Principal 379,12 kB y compartido editorStore 137,37 kB; sandbox 200 ajustes p95 4,8 ms y cero renders ajenos; perfiles al máximo de colecciones p95 1,7 ms; biblioteca con 20 proyectos/100 RF p95 3,5 ms. Banco H2 histórico sin medición de ahorro humano. |
| Compatibilidad | Borradores anteriores, actualización de caché sin recargar edición y exportación sin red comprobados en Chromium/Firefox. |
| Trabajo previo | 40/43 tareas de 001 completadas; pendientes T-001-35,38,39 por auditoría manual de accesibilidad. |
| Límites | Lector de pantalla real, ampliación real de navegador y teléfono físico pendientes; límite de WebKit registrado previamente. No se modifican paquetes del sistema. |
| Evidencia de 002 | Conservada solo localmente por instrucción del usuario, sin enlaces públicos a archivos ignorados. |
| Git | H3 0bb522e sincronizado mediante push normal a origin/main y confirmado con ls-remote. Registro documental de cierre consolidado después. 002 sigue excluido. |
| Próximo paso | Sincronizar cierre H4 y entregar para revisión; H5 sin autorización. |

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
