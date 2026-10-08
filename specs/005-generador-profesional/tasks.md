# Tareas — 005

Fecha: 2026-10-08. H0–H2 autorizados formalmente; tareas 02–19 y cierre 35 en alcance. Tareas 20–34 pospuestas. Dependencias indican orden; trabajar por dominio, definir contratos antes de integraciones y verificar antes de marcar completado.

| ID | Hito / dominio | Acción y resultado revisable | Depende de | Evidencia de cierre |
|---|---|---|---|---|
| T-005-01 | DOCUMENT | Crear diagnóstico, requisitos, plan, tareas y registro documental. | Solicitud actual | Enlaces, IDs y restricciones coherentes; cero emojis. |
| T-005-02 | Aprobación | Registrar hitos autorizados y decisiones pendientes del usuario. | 01 | Autorización explícita, sin interpretar silencio como aprobación. |
| T-005-03 | H0 / documentación | Definir entradas y oráculos de los 12 casos del corpus. | 02 | Cada caso con rúbrica y resultado esperado revisable. |
| T-005-04 | H0 / documentación | Evaluar salida actual del producto para el corpus y registrar base. | 03 | Evidencia por caso; faltantes y límites reales. |
| T-005-05 | H0 / documentación | Clarificar vigencia de contratos históricos y exclusiones sustituidas. | 04 | Agentes pueden identificar contrato actual sin perder historial. |
| T-005-06 | H0 / documentación | Fijar límites, protocolo de evaluación con usuarios y esfuerzo de H1/H2. | 04 | Presupuestos y capacidad declarados; falta de participantes registrada. |
| T-005-07 | H1 / núcleo | Definir DTO versionado, IDs, procedencia y referencias públicas. | 05,06 | Casos de nuevo/existente/no visual y datos incompletos serializables. |
| T-005-08 | H1 / núcleo | Implementar validación del modelo y reglas de referencias. | 07 | Límites, duplicados y estados inválidos rechazados sin inventar valores. |
| T-005-09 | H1 / servicios | Implementar migración del borrador actual al nuevo contrato. | 08 | Restauración preserva textos, selecciones, diseño y respaldo. |
| T-005-10 | H1 / integración | Añadir acciones transaccionales y selectores por propiedad. | 08,09 | Revisión consistente, IDs estables y sin suscripción raíz. |
| T-005-11 | H1 / UI | Implementar editor de requisitos y criterios mediante DTO público. | 10 | Crear, modificar, reordenar y eliminar con referencias controladas. |
| T-005-12 | H1 / UI | Añadir entrevista guiada y aplicabilidad progresiva. | 11 | No obliga a API/estética en destino no aplicable; teclado completo. |
| T-005-13 | H2 / núcleo | Proyectar requisitos y decisiones a spec y plan. | 12 | Fidelidad al modelo y pendientes explícitos. |
| T-005-14 | H2 / núcleo | Proyectar tareas y criterios; calcular grafo de cobertura. | 13 | Cada requisito confirmado cubierto o justificado; sin enlaces rotos. |
| T-005-15 | H2 / núcleo | Sincronizar restantes documentos de gobernanza y prompts. | 14 | 34 rutas, IDs coherentes y validación inicial no ejecutada. |
| T-005-16 | H2 / núcleo | Implementar preparación y diagnósticos explicables. | 15 | Cobertura/configuración separada de calidad y revisión semántica. |
| T-005-17 | H2 / UI e integración pública | Presentar revisión, cobertura y exportación de borrador seguro. | 16 | Pendientes visibles; secretos y revisión obsoleta siguen bloqueados. |
| T-005-18 | H2 / VALIDATE | Verificar corpus, migración, regresión, rendimiento y accesibilidad. | 17 | Pruebas/build y mediciones; pendientes manuales diferenciados. |
| T-005-19 | H2 / documentación | Ejecutar comparación automatizada autorizada, registrar tiempos/hallazgos y presentar H2 para revisión. | 18 | Mismos hechos en ambas versiones; tiempos y hallazgos estructurales, sin atribuir ahorro humano. |
| T-005-20 | H3 / núcleo | Definir contrato de proyectos, historial, importación y diferencias. | 19 y H3 autorizado | Límites, retención y resolución de conflictos definidos. |
| T-005-21 | H3 / servicios | Implementar almacenamiento y respaldo/importación validada. | 20 | Recuperación, cuota, formato inválido y sustitución comprobados. |
| T-005-22 | H3 / integración | Conectar proyectos/versiones y preservación de secciones propias. | 21 | Cambios atómicos; sin pérdida de borrador ni añadidos. |
| T-005-23 | H3 / UI | Añadir biblioteca local y comparación/confirmación de diferencias. | 22 | Flujo accesible y cancelación sin sustitución. |
| T-005-24 | H3 / VALIDATE | Verificar continuidad, importación adversa y conflictos. | 23 | Resultados reales y regresión de H2. |
| T-005-25 | H4 / núcleo | Definir perfiles declarativos, metadatos y composición de componentes. | 24 y H4 autorizado | Esquema sin código ejecutable y versiones/fuentes explícitas. |
| T-005-26 | H4 / núcleo | Implementar perfiles, tecnologías propias y aplicabilidad por modo. | 25 | Casos fuera de catálogo, existente y neutral conservan su significado. |
| T-005-27 | H4 / núcleo | Generar contexto e instrucciones por tarea dentro del kit. | 26 | Objetivo, archivos, dependencias, contratos y criterios acotados. |
| T-005-28 | H4 / UI e integración pública | Conectar perfiles propios y estado de soporte al configurador. | 27 | Etiqueta declarada/verificada diferenciada y conflictos explicados. |
| T-005-29 | H4 / VALIDATE | Evaluar 12 casos y utilidad del contexto para agentes. | 28 | Sin pérdida de contenido; contexto acotado y sin lectura masiva obligatoria. |
| T-005-30 | H5 / DOCUMENT | Especificar formatos/versiones/validadores/exportaciones propuestos. | 29 y solicitud de H5 | Alcance adicional concreto para aprobación, manteniendo kit estándar. |
| T-005-31 | H5 / aprobación | Registrar autorización del alcance y dependencias específicas. | 30 | Aprobación explícita antes de instalar o modificar manifiesto. |
| T-005-32 | H5 / núcleo | Implementar proyección de contratos del alcance autorizado. | 31 | Contratos incompletos no se presentan como validados. |
| T-005-33 | H5 / servicios | Añadir exportaciones independientes autorizadas. | 32 | Formato, revisión, rutas y límites correctos. |
| T-005-34 | H5 / VALIDATE | Comprobar formatos y consumidores concretos definidos en 30. | 33 | Interoperabilidad medida y limitaciones registradas. |
| T-005-35 | Transversal / documentación | Consolidar evidencia y sincronizar cada hito de código autorizado. | Validación de cada hito | Push normal; sin 002 ni aceptación/despliegue implícitos. |

Las tareas 17 y 28 se dividen al ejecutarse en presentación UI y conexión de acciones públicas; no autorizan a leer internals del motor. T-005-35 se repite como cierre documental de cada entrega, no pospone todos los commits hasta H5. La implementación de 32–34 se desglosará por formato en T-005-30 antes de autorizarla.

Trazabilidad: RF-01 → 03–06; RF-02 → 07–10; RF-03/04 → 11–12; RF-05/06 → 13–15; RF-07/08 → 16–17; RF-09/10 → 20–24; RF-11/12 → 25–26,28; RF-13 → 27,29; RF-14 → 30–34; RF-15 → 08–09,18,24,29,34–35.

## Estado de ejecución

T-005-01…19 completadas en el alcance autorizado. T-005-19 utiliza la comparación automatizada solicitada por el usuario ante falta de participantes; no declara evaluación humana ni aceptación. T-005-20…34 pospuestas. T-005-35 completada: comprobaciones técnicas, consolidación documental y push normal del hito 84ed6e0 confirmados en PROJECT_STATUS.

| Tareas | Estado y evidencia |
|---|---|
| 01/02 | Documentación revisada; aprobación acotada registrada en PROJECT_STATUS |
| 03…06 | corpus.md, corpus.json y baseline.json; límites y vigencia histórica definidos |
| 07/08 | Modelo público y validación: projectDefinition.test.ts |
| 09 | Migración preservada: projectMigration.test.ts |
| 10 | IDs, transacciones y referencias: projectStore.test.ts |
| 11/12 | Editor/entrevista y recuperación: projectDefinition.spec.ts en Chromium/Firefox |
| 13…15 | Proyección/grafo/34 documentos: projectProjection.test.ts y doce casos de projectCorpus.test.ts |
| 16 | Diagnósticos/calidad: readiness.test.ts; revisión humana siempre pendiente |
| 17 | Grafo, borrador consentido, bloqueo por secreto/ruta: projectDefinition.spec.ts |
| 18 | 76 unitarias, 87 recorridos correctos y 3 omitidos; lint/TypeScript/build y mediciones en validation.md |
| 19 | Banco comparison.json: mismos hechos, tiempos y hallazgos estructurales; cero participantes |
| 20…34 | Pospuestas por el usuario, sin código nuevo ni pruebas atribuidas |
| 35 | Completada: push normal de 84ed6e0 confirmado por Git y ls-remote, sin 002 |

Los límites manuales de accesibilidad y semántica constan en validation.md. Completar verificaciones automáticas no autoriza declarar aceptación ni abrir H3–H5.
