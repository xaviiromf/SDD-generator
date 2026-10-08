# 005 — Generador profesional, adaptable y verificable

Fecha: 2026-10-08. Fase: cierre DOCUMENT de T-005-35. Estado: H0–H3 implementados y verificados técnicamente tras autorizaciones del 2026-10-08. T-005-20…24 completadas; sincronización H3 pendiente en este registro. Aceptación pendiente. H4/H5 pospuestos.

Plan y diagnóstico: [plan.md](plan.md). Secuencia: [tasks.md](tasks.md). Evidencia: [validation.md](validation.md).

## Objetivo y alcance de la promesa

Convertir SDD-Studio en una herramienta con la que un cliente y un equipo asistido por IA puedan acordar qué construir, identificar incertidumbres, justificar decisiones y entregar trabajo verificable. La eficacia se evalúa sobre la calidad de las especificaciones y su utilidad durante la implementación; la eficiencia, sobre tiempo de preparación, retrabajo, contexto requerido y respuesta de la interfaz.

«Aplicable a cualquier caso de uso» se traduce en poder representar un dominio desconocido mediante capacidades, requisitos y contratos propios, sin exigir que su tecnología esté en el catálogo. No significa garantizar una arquitectura correcta para cualquier sistema, generar conocimiento especializado inexistente o certificar cumplimiento. La cobertura especializada se amplía mediante perfiles revisados; cuando falte, debe declararse.

Usuarios: cliente que define necesidades; líder que revisa alcance y viabilidad; arquitecto que compara alternativas; agente que ejecuta tareas delimitadas; persona que valida resultados. El mismo usuario puede desempeñar varios roles, sin añadir cuentas a la aplicación.

## Reglas que se conservan

Español para interfaz y contenido propio, cero emojis, Lucide, funcionamiento local, SPA estática y decisiones manuales prioritarias. Conservar textos del usuario, fuentes autorizadas, borradores, diseño personalizado, catálogo existente y las 34 rutas del kit predeterminado. No incorporar backend, colaboración remota, ejecución de comandos ni dependencias nuevas implícitamente.

MCP sigue siendo opcional: autorización de envío, credencial en memoria, contrato vigente y fallback total de 1500 ms. Su entrada no se amplía a datos estructurados, archivos ni kit mediante esta propuesta. Sandbox <16 ms y generación en trabajador mantienen sus presupuestos de referencia. specs/002-kit-completo/ permanece ignorado y no se utiliza como fuente de esta propuesta.

## Requisitos y alcance aprobado

| ID | Prioridad / hito | Comportamiento y aceptación |
|---|---|---|
| RF-005-01 | P0 / H0 | Definir corpus de 12 escenarios y rúbrica antes de modificar el motor. Documentar resultado esperado, faltantes y errores; no atribuir resultados a pruebas no ejecutadas. Resolver contradicciones documentales históricas con notas de vigencia, preservando aprobaciones y evidencia. |
| RF-005-02 | P0 / H1 | Modelo versionado de proyecto con capacidades, actores, procesos, entidades, reglas, requisitos funcionales/no funcionales, exclusiones, decisiones, supuestos y preguntas. Cada elemento tiene ID estable y procedencia explícita; vacío significa pendiente, nunca respuesta inventada. |
| RF-005-03 | P0 / H1 | Editor estructurado y entrevista guiada local, con campos opcionales y preguntas condicionadas al destino. Permitir comenzar desde idea o requisitos sin elegir tecnología. No obligar a declarar diseño, API o autenticación donde no corresponda. |
| RF-005-04 | P0 / H1 | Cada requisito puede registrar actor/contexto, comportamiento, reglas, excepciones, prioridad y criterios observables. Permitir borradores incompletos y explicar faltantes. Un caso «cancelar reserva» incluye condición, resultado y escenarios de rechazo aportados por el usuario. |
| RF-005-05 | P0 / H2 | Proyectar una única revisión del modelo a los 34 documentos, con contenido pertinente al destino. Mantener IDs y referencias tras editar/reordenar, sin duplicar RF ni presentar tareas como ejecutadas. Campos sin definir aparecen como pendientes. |
| RF-005-06 | P0 / H2 | Trazabilidad requisito → decisión/contrato → tarea → criterio de validación. Detectar referencias rotas y requisitos sin cobertura. Un criterio enlazado no cuenta como prueba ejecutada; los resultados empiezan «No ejecutado». |
| RF-005-07 | P0 / H2 | Separar cobertura de configuración, calidad documental y preparación para implementar. Mostrar criterios, aplicabilidad, incertidumbres y bloqueos; no convertir un porcentaje en certificado de seguridad, viabilidad o aceptación. |
| RF-005-08 | P0 / H2 | Detectar contradicciones conocidas entre alcance positivo/negativo, decisiones y contratos, con explicación y origen. Informar límites del análisis semántico; no prometer detección universal. Exportar borrador documental explícito con pendientes permitidos, conservando bloqueo por secretos, rutas inválidas o incoherencia de revisión. |
| RF-005-09 | P1 / H3 | Guardar varios proyectos locales, exportar/importar respaldo estructurado y recuperar versiones. Migrar borrador actual sin perder texto, selecciones, overrides ni referencias. Importaciones se validan y muestran diferencias antes de sustituir datos. |
| RF-005-10 | P1 / H3 | Permitir edición estructurada y ampliaciones manuales por sección con resolución de diferencias al regenerar. No perder añadidos ni sobrescribir decisiones silenciosamente; evitar un editor libre paralelo que contradiga el modelo. |
| RF-005-11 | P1 / H4 | Perfiles declarativos para destinos y dominios, con capacidades, aplicabilidad, preguntas, reglas y secciones; permitir tecnologías propias con ID, función, restricciones y estado de verificación. Sin JavaScript, CSS, shell ni instrucciones ejecutables en paquetes de perfiles. |
| RF-005-12 | P1 / H4 | Registrar fuente, versión declarada y fecha de revisión de tecnologías/perfiles. Mostrar antigüedad e incertidumbre sin llamadas automáticas de actualización. Versionar perfiles y conservar el que produjo cada proyecto. |
| RF-005-13 | P1 / H4 | Producir instrucciones de agentes por tarea con objetivo, archivos permitidos, contratos, dependencias, criterios y puerta de aprobación. Entrada máxima de tres archivos y separación de dominios según AGENTS. No depender de un agente específico ni cargar automáticamente todo el kit. |
| RF-005-14 | P2 / H5 | Especificar adaptadores optativos de contratos HTTP, eventos y datos; distinguir contrato validado, borrador y no aplicable. Primero incrustar representaciones en documentos existentes. Exportaciones independientes y cambios al manifiesto requieren el alcance aprobado de H5. |
| RF-005-15 | P0 transversal | Validar migración, importación, referencias, tamaños y seguridad de texto con casos adversos; preservar offline y presupuestos de rendimiento con límites definidos antes de implementar. Pruebas del producto y evidencia del proyecto generado permanecen separadas. |

## Alcance de entregas

H0 establece evidencia y elimina ambigüedad de la documentación vigente. H1/H2 constituyen la primera entrega funcional verificada técnicamente: mejores requisitos y kit trazable. H3 añade continuidad local. H4 aporta extensibilidad y entrega a agentes. H5 requiere especificación adicional de formatos, versiones, validadores y exportaciones antes de su implementación.

No se incluyen ejecución autónoma de código, agentes alojados, servidor de IA propio, marketplace, cuentas, pagos, sincronización entre equipos ni garantías regulatorias. Esas necesidades se evaluarían con clientes después de medir el uso de las entregas locales.

## Ejemplo de resultado esperado

Entrada: «Un taller registra y cancela reservas; no acepta pagos». El usuario declara quién cancela, cuándo se permite, qué ocurre con una reserva ya atendida y dónde se conservan datos. El sistema asigna IDs, muestra lo no contestado, genera requisitos con criterios y enlaza tareas de implementación/validación. No inventa una política de cancelación ni activa pagos.

Objetivo de extensibilidad especializada de H4, aún pospuesto. Entrada fuera de catálogo: «Instrumento científico con protocolo propietario». El usuario describe capacidades, interfaz, formatos y restricciones propias. Se conserva el dominio, se registran preguntas técnicas y no se genera un frontend web por defecto. Validar el instrumento sigue requiriendo conocimiento y entorno del proyecto objetivo.
