# Plan de evolución profesional de SDD-Studio

Fecha: 2026-10-08. Estado: H0–H3 aprobados, implementados y verificados el 2026-10-08 con dependencias existentes. Cierre documental y sincronización H3 completados; H4 autorizado, implementado, verificado y sincronizado; H5 pospuesto; no se autoriza despliegue. [Requisitos](spec.md), [tareas](tasks.md) y [verificación documental](validation.md).

## 1. Dictamen como líder técnico y cliente

Usaría el producto como punto de partida para acordar decisiones y entregar un kit ordenado a un equipo con IA. Para adoptarlo como herramienta habitual, exigiría además requisitos de negocio estructurados, continuidad entre revisiones y evidencia de que las tareas cubren lo solicitado.

La mejora de mayor valor es profundizar la especificación y su trazabilidad. El catálogo y la estética ya ofrecen amplitud; añadir más opciones sin mejorar el contenido no demuestra que el proyecto sea más implementable.

La aspiración de universalidad debe basarse en un núcleo extensible: cualquier caso puede describirse, un perfil orienta los casos conocidos y los desconocidos conservan preguntas explícitas. Un catálogo cerrado no puede anticipar todas las tecnologías ni todas las reglas de todos los dominios.

## 2. Base del análisis y límites

Evaluación documental de README, requisitos, contratos públicos del plan, inventario de rutas y evidencia de 004. No se inspeccionaron internals ni se ejecutó una nueva auditoría de UI, motor o servidor real. Las capacidades y cifras siguientes proceden de la evidencia previa; las carencias inferidas requieren validación en H0. No se presenta una encuesta comercial ni un análisis competitivo ejecutado.

La ampliación 004 reporta 52 pruebas unitarias y 75 recorridos de navegador aprobados, con tres mediciones omitidas en Firefox. Sandbox p95 3,8 ms y generación documental p95 36,2 ms en el entorno de referencia. Persisten revisiones manuales de accesibilidad, teléfono físico y una limitación de WebKit. Fuentes: [estado](../../docs/PROJECT_STATUS.md) y [evidencia](../validation.md).

## 3. Fortalezas, debilidades y oportunidades

| Hallazgo | Evidencia o nivel de certeza | Efecto para el equipo y el cliente | Acción |
|---|---|---|---|
| Generación local y trabajo sin red | Documentado y probado en escenarios de 004. | Reduce dependencia de servicios y permite preparar proyectos privados localmente. | Preservar el núcleo local en todas las entregas. |
| Kit de 34 archivos y revisión coherente | Contrato de manifiesto, visor, copia y ZIP; regresión documentada. | Entrega reproducible y recorrido compartido con agentes. | Mantener rutas y mejorar contenido con una fuente estructurada única. |
| Prioridades manual/conjunto/inferencia | Contrato y pruebas de compatibilidad. | El cliente conserva control sobre decisiones. | Extender procedencia a requisitos, reglas y revisiones. |
| Catálogo amplio y personalización visual | 237 opciones, ocho conjuntos, 21 estilos y 30 familias locales. | Buen punto de partida para destinos conocidos y diseño concreto. | Añadir extensiones declarativas, sin usar la cantidad como medida de calidad. |
| Separación por dominios y trabajador | Arquitectura y evidencia de rendimiento. | Base para mantener respuesta fluida y contexto acotado. | Mantener contratos entre subsistemas y tareas delimitadas. |
| Requisitos del negocio poco estructurados | README declara que no comprende reglas arbitrarias; el contrato prioriza idea/configuración. | Riesgo de documentos extensos con decisiones operativas aún pendientes. | Editor de actores, reglas, excepciones y criterios verificables. |
| Madurez basada en seis pilares | Fórmula documentada y advertencia sobre sus límites. | Puede confundirse configuración completa con preparación para implementar. | Separar cobertura, calidad y bloqueos explicables. |
| Universalidad limitada por perfiles conocidos | Catálogo finito y reglas locales; amplitud real fuera de perfiles no evaluada. | Proyectos atípicos pueden terminar con aproximaciones o pendientes insuficientemente precisos. | Capacidades genéricas, tecnologías propias y estado de soporte visible. |
| Continuidad de proyecto y edición avanzada sin evidencia suficiente | Contrato público describe recuperación de un borrador, no un ciclo completo de versiones/importación. | Hipótesis de fricción para equipos que iteran o gestionan varios proyectos. | H0 valida necesidad; H3 añade versiones, respaldo y diferencias. |
| MCP operativo con simulación, precisión externa no medida | Evidencia distingue transporte de servidor/modelo real. | El cliente necesita saber cuándo una sugerencia mejora el trabajo. | Evaluar proveedor concreto con corpus, privacidad y presupuesto de 1500 ms. |
| Documentación histórica mezcla contratos antiguos y actuales | En el plan inicial aún aparece una salida de seis documentos y exclusiones de red, sustituidas posteriormente. | Lectura de agentes potencialmente contradictoria. | Notas de vigencia y contratos actuales inequívocos, preservando historial. |
| Accesibilidad/compatibilidad manual pendientes | Pendientes T-001-35,38,39 y límite de WebKit registrados. | Condiciona adopción por usuarios y dispositivos diversos. | Completar con entorno real; no dar emulación por aceptación manual. |

Oportunidades de producto: ofrecer especificaciones útiles para proyectos existentes, APIs sin interfaz, automatizaciones, datos, dispositivos y sistemas con varios componentes; reducir retrabajo mediante trazabilidad; facilitar revisión del cliente sin exponer todo el vocabulario técnico; exportar contexto por tarea para el equipo con IA. Son propuestas de valor, no demanda comercial ya demostrada.

## 4. Qué significa ser adaptable

Separar cuatro dimensiones que hoy pueden confundirse: **dominio** del negocio, **capacidades** requeridas, **decisiones técnicas** y **modo de trabajo**. Por ejemplo, reservas es un dominio; persistencia y auditoría son capacidades; Django/PostgreSQL son decisiones; mantener una aplicación existente es un modo de trabajo.

Un mismo proyecto puede tener varios componentes: aplicación móvil, API y tarea de datos. El modelo debe representar componentes y relaciones sin forzarlos a una única pila. En H1 se define el contrato; H4 incorpora perfiles de composición. El soporte se muestra como perfil revisado, configuración propia o pendiente de revisión técnica.

Los modos propuestos son proyecto nuevo, ampliación de proyecto existente, migración y diagnóstico/documentación. Cada uno solicita entradas distintas: un cambio existente requiere contexto y límites de modificación, no reescribir toda la arquitectura. Los procesos sin software pueden documentarse mediante un perfil neutral; las tareas de código se declaran no aplicables. Ese perfil se valida con el caso 12 antes de anunciar cobertura.

## 5. Arquitectura propuesta y responsabilidades

```text
Idea y respuestas del cliente
        -> modelo versionado del proyecto
        -> validación / diagnósticos / decisiones
        -> perfiles y reglas de aplicabilidad
        -> proyección documental en trabajador
        -> 34 documentos de una revisión + contexto por tarea

MCP opcional -> sugerencias tecnológicas -> revisión/aceptación
Respaldo local -> importación validada -> comparación -> confirmación
```

### Modelo canónico

ProjectDefinition contiene schemaVersion, projectId, revision y referencias a versiones de perfiles/catálogo. Agrupa componentes, actores, capacidades, requisitos, reglas, entidades, contratos, decisiones, supuestos, preguntas, exclusiones y criterios de aceptación. Un requisito enlaza reglas, componentes y criterios mediante IDs estables, separados de su posición visible.

Procedencia registra entrada del usuario, conjunto, regla local o sugerencia MCP aceptada; estado distingue propuesto, confirmado, pendiente y descartado. No se guarda el token MCP, sesiones ni credenciales de proveedores. Fechas de historial son metadatos de persistencia, no entradas variables de la compilación determinista.

Migración aditiva primero: recuperar el esquema actual como una versión compatible, conservar textos literales y selecciones existentes. Nunca extraer reglas mediante heurísticas y presentarlas como confirmadas. Las propuestas derivadas de texto necesitan revisión. Un modelo incompleto debe poder persistirse y exportarse como borrador seguro.

### Calidad y trazabilidad

El trabajador proyecta el mismo modelo a spec, plan, tasks, constitution, prompts y gobernanza. Agregar un criterio o cambiar una decisión actualiza referencias y tareas afectadas sin perder IDs. Una tabla de cobertura muestra requisitos sin tareas o sin criterios, referencias rotas y decisiones pendientes.

El evaluador produce diagnósticos por regla, origen y gravedad. Diferencia cobertura de campos aplicables, calidad estructural y bloqueos de preparación. La preparación se explica mediante una lista de condiciones, no un número mágico. La calidad semántica necesita revisión humana; una frase formalmente completa puede seguir siendo incorrecta.

El ZIP estándar conserva 34 archivos. Contexto por tarea y representaciones de contratos se incluyen en los documentos existentes. Un exportador independiente de respaldo no altera el manifiesto del kit. Cualquier archivo adicional de contratos queda para el alcance específico de H5.

### Persistencia y revisión

H3 define almacenamiento local apropiado tras medir volumen; no se decide instalar una biblioteca ni adoptar IndexedDB sin contrastar necesidad. Respaldo JSON versionado y límites de importación explícitos. No importar ZIP o directorios arbitrarios en esta primera propuesta.

El usuario compara revisiones y confirma sustituciones. Las ampliaciones manuales por sección se guardan como datos separados y se combinan con el contenido generado; los conflictos se muestran antes de publicar la nueva revisión. No hacer modificaciones invisibles de Markdown generado.

### Perfiles y contratos interoperables

Perfiles como datos declarativos, con identificador, versión, procedencia, capacidades, preguntas, compatibilidades y aplicabilidad. Validar tamaños, claves y expresiones permitidas; no ejecutar código de paquetes. La tecnología propia recibe el estado «Declarada por el usuario», no «Verificada» por haber sido añadida.

Se propone JSON Schema como vocabulario de intercambio del modelo, OpenAPI para contratos HTTP y AsyncAPI para eventos cuando correspondan. Son estándares distintos y no deben confundirse con generación de código o validación semántica. Antes de H5 se fijarán versiones, herramientas compatibles y alcance de validación. Referencias oficiales: [JSON Schema](https://json-schema.org/specification), [OpenAPI 3.1.1 como referencia versionada](https://spec.openapis.org/oas/v3.1.1.html), [AsyncAPI 3.0.0 como referencia versionada](https://www.asyncapi.com/docs/reference/specification/v3.0.0).

El diseño de revisión y procedencia toma como referencia la documentación de supervisión humana y medición de riesgos del [AI RMF de NIST](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/). Esto orienta controles del producto; no certifica cumplimiento.

### Dominios y rutas concretadas

| Dominio | Responsabilidad / rutas y alcance | Contrato compartido |
|---|---|---|
| Núcleo | src/domain/projectDefinition.ts, projectValidation.ts y readiness.ts; src/engine/projectProjection.ts, requirements.ts, coverage.ts y plantillas afectadas | Esquema, IDs, revisión, diagnósticos y resultados de generación. |
| Catálogo, dentro del núcleo | H4: src/domain/profiles.ts y src/catalog/profiles.ts; perfiles versionados y metadatos | Perfiles declarativos y lista de IDs permitidos versionada. |
| UI | H1/H2: src/components/requirements/, review/ y estilos; H3: src/components/projects/ | Props, DTO y acciones públicas documentadas; sin leer compilador. |
| Servicios | H1: src/services/draftStorage.ts; H3: src/services/projectStorage.ts, projectImport.ts y trabajador de validación | Respaldo, migración, límites, cancelación y revisiones. |
| Integración | Adaptadores concretos en src/store/ y src/app/, nombrados por tarea | Acciones transaccionales y selectores superficiales; sin acceso masivo a internals. |
| Documentación | specs/005-generador-profesional/, documentación vigente y guías afectadas | Requisitos, contratos, fuentes, pruebas y autorización. |

Las rutas de H1/H2 se concretaron durante las tareas de contrato antes de abrir sus subsistemas; las rutas H3 se concretaron en los contratos añadidos al final de este plan. Las rutas H4 se concretaron en su contrato al final de este plan. Solo H5 sigue propuesto y sin implementación. Cada tarea cambia de dominio de forma registrada, conforme a AGENTS.md.

## 6. Entregas secuenciales y puertas de salida

| Hito | Entrega y beneficio | Dependencia | Verificación antes de cierre |
|---|---|---|---|
| H0 / P0 | Corpus, auditoría documental y base de aceptación. Evita medir solo cantidad de archivos. | Aprobación del plan; entorno del producto. | Registrar los 12 escenarios actuales y sus límites; diferenciar lectura documental de pruebas ejecutadas. |
| H1 / P0 | Modelo de negocio y editor de requisitos. El cliente declara reglas y excepciones. | H0; contrato y migración. | Requisitos válidos/incompletos, IDs estables, destinos no visuales y restauración sin pérdida. |
| H2 / P0 | Kit trazable y preparación explicable. Primera entrega funcional propuesta. | H1. | Cobertura, referencias, coherencia de 34 archivos, pendientes, exportación y regresión. |
| H3 / P1 | Varios proyectos, respaldo, historial y diferencias. Permite iteración. | H2; límites de almacenamiento definidos. | Importación adversa, recuperación, conflictos y preservación de ediciones. |
| H4 / P1 | Perfiles extensibles, proyectos existentes y contexto por tarea. Amplía destinos. | H2/H3; esquema de perfiles. | Perfil propio sin código ejecutable; composición de componentes; contexto limitado y fuentes/versiones. |
| H5 / P2 | Contratos interoperables y posibles exportaciones específicas. Reduce interpretación técnica. | H4; especificación adicional de formatos. | Validadores del formato elegido, aplicabilidad, datos pendientes y compatibilidad de consumidores. |

Recomendación: aprobar primero H0–H2 como entrega acotada y validar su utilidad con usuarios antes de autorizar H3–H5. La aprobación puede cubrir el conjunto, pero H5 mantiene su definición de formatos como puerta previa; aceptar una hoja de ruta no instala dependencias ni concede acceso a servicios.

No se fija una fecha comercial sin ejecutar H0. Los principales costes son migración del modelo, sincronización de 34 proyecciones y conflictos de edición. Al terminar H0 se estiman esfuerzo y capacidad del equipo con resultados, sin tratar una conjetura como compromiso.

## 7. Corpus de aplicabilidad y criterios de éxito

| Caso | Destino / modo | Qué debe demostrar |
|---|---|---|
| 01 | Reservas web con Django | Roles, cancelación, persistencia y exclusión de pagos. |
| 02 | PWA local sin servidor | Trabajo offline, almacenamiento y ausencia de backend inventado. |
| 03 | API sin interfaz | Contratos y errores; estética declarada no aplicable. |
| 04 | CLI Rust de archivos | Entrada/salida, errores y simulación de operaciones con efectos. |
| 05 | Aplicación de escritorio | Límites de sistema y empaquetado, sin asumir web. |
| 06 | Aplicación móvil con API | Componentes y responsabilidades distintas, conectividad parcial. |
| 07 | Proceso de datos por lotes | Entradas, transformaciones, calidad y reejecución. |
| 08 | Sistema de eventos/dispositivos | Mensajes, restricciones de entorno y fallos de comunicación. |
| 09 | Servicio de aprendizaje automático | Datos, evaluación y límites del modelo aportados por el usuario. |
| 10 | Ampliación de aplicación existente | Preservación, interfaces actuales y tareas de cambio acotadas. |
| 11 | Tecnología/protocolo fuera de catálogo | Declaración propia, preguntas y estado de soporte honesto. |
| 12 | Proceso operativo sin código | Actores, reglas y evidencias; implementación de software no aplicable. |

Cada caso tendrá entradas ficticias congeladas, oráculo revisado y rúbrica sobre fidelidad, completitud de lo declarado, trazabilidad, aplicabilidad y claridad de pendientes. Añadir variantes con contradicciones, requisitos incompletos, secretos aparentes, límites de tamaño y cambio de perfil. Separar los escenarios locales de una evaluación optativa con servidor/modelo MCP real.

Condiciones de salida de H2: todos los casos del corpus representables sin perder información suministrada; cero referencias rotas y cero reglas de negocio inventadas aceptadas en el corpus revisado; cada RF confirmado con al menos un criterio y una tarea o justificación explícita de no aplicabilidad; ZIP estándar con las mismas 34 rutas y revisión. Estos criterios son objetivos propuestos, todavía no comprobados.

Eficiencia: el protocolo inicial proponía tres participantes y un objetivo de reducción del 25 %. El 2026-10-08 el usuario informó que no dispone de participantes y autorizó otro método. T-005-19 compara automáticamente la versión anterior y H2 con los mismos doce casos y hechos declarados, midiendo generación, empaquetado ZIP y hallazgos estructurales pendientes. Publicar muestras, mediana, p95 y condiciones. La inserción automatizada de datos excluye el esfuerzo de entrevista y edición humana; no demuestra el objetivo del 25 %, usabilidad ni aceptación del cliente. La revisión semántica continúa pendiente.

Rendimiento: conservar p95 <16 ms para controles/sandbox y <=150 ms para generación con el escenario de referencia; medir además el máximo de datos estructurados que se acuerde en H1. Mantener límite de kit de 1 MiB y establecer límites de entidades/requisitos/importación tras H0, antes de programar. No prometer escala ilimitada.

Accesibilidad: completar pendientes manuales cuando exista el entorno; mantener pruebas en límites 767/768/1279/1280 y objetivos de 44 px. Registrar WebKit y dispositivos reales por separado. Calidad y seguridad: repetir pruebas necesarias de migración, importación, coherencia y flujo del kit; no etiquetar el proyecto generado como probado porque pase el generador.

## 8. Riesgos y decisiones para revisión

| Riesgo | Tratamiento previsto |
|---|---|
| Configurador excesivamente complejo | Dos entradas: guiada por necesidades y avanzada; campos condicionados y revelado progresivo. |
| Modelo demasiado grande para la primera entrega | H1/H2 priorizan negocio, IDs y cobertura; perfiles/importación avanzada van después. |
| Pérdida de borradores o añadidos | Migración con respaldo y restauración; diferencias y confirmación explícita. |
| Confianza falsa en documentos formales | Procedencia, pendientes y criterios visibles; revisión humana y límites del detector. |
| Catálogo o perfiles desactualizados | Versiones y fuentes declaradas; revisión controlada, sin actualización silenciosa. |
| Crecimiento del contexto para agentes | Paquetes por tarea, límites por dominio y medición del texto entregado. |
| Inferencia externa lenta o imprecisa | MCP conserva contrato y fallback; evaluación concreta antes de prometer mejora. |
| Dependencias y nuevos formatos no definidos | Contratos primero; propuesta específica de instalación/exportación antes de H5. |

La revisión debe decidir qué hitos autorizar, si el perfil neutral sin software se mantiene en H4 y qué formatos concretos merecen H5. Mi recomendación es conservar toda la visión y ejecutar H0–H2 primero. Al recibir instrucciones, se registra exactamente el alcance aprobado y se avanza por las tareas; hasta entonces se detiene el trabajo al terminar DOCUMENT.

## Contrato público concretado en T-005-07

H1/H2 añade Configuration.project de forma opcional para compatibilidad histórica. ProjectDefinition usa schemaVersion:1, projectId estable, revision, nextId monotónico, mode (nuevo/ampliacion/migracion/documentacion), implementationRequired y colecciones requirements/context. Context incluye components, actors, capabilities, processes, entities, rules, decisions, assumptions, questions, exclusions y contracts; cada entrada tiene id, text, status (propuesto/confirmado/pendiente/descartado), origin (user/preset/local/mcp-accepted) y references. Requisito: id, title, kind (functional/nonfunctional), status/origin, actorId, context, behavior, priority (alta/media/baja), exceptions, criteria [{id,text}], ruleIds/componentIds/decisionIds/contractIds. Referencias deben apuntar a elementos existentes del tipo correspondiente. Criterios tienen IDs globalmente únicos. Los IDs no dependen del orden visible.

Vacíos y estados pendientes se conservan; una estructura inválida, duplicados, referencias rotas o límite excedido bloquean restauración/compilación segura. La preparación marca criterios/actores/contexto incompletos sin bloquear la exportación de borrador seguro. implementationRequired=false solo se fija explícitamente para trabajo documental sin código; no se infiere de texto. No se desarrollan perfiles de H4 ni formatos de H5.

Acciones públicas del editor: addProjectItem(kind), updateProjectItem(kind,id,patch), removeProjectItem(kind,id), addRequirement(), updateRequirement(id,patch), removeRequirement(id), moveRequirement(id,direction), addCriterion(requirementId), updateCriterion(requirementId,id,text), removeCriterion(requirementId,id), updateProject(patch). Eliminación con referencias se rechaza y explica; el usuario desvincula explícitamente antes. Publicación atómica con revisión de configuración; generación copia esa revisión a project.revision. No enviar project al servicio MCP.

Compilation añade coverage/readiness opcionales. Coverage contiene enlaces {requirementId,taskId,criterionIds,decisionIds,contractIds,applicable} y referencias rotas. Readiness contiene configuration y quality (complete/applicable), issues {id,source,message,severity}, estado borrador/listo-para-revision y condiciones de preparación. La revisión semántica y aceptación no se infieren. UI consume únicamente esos DTO y las acciones públicas. src/store/editorStore.ts y src/store/documentStore.ts son adaptadores nombrados de T-005-10/17; la persistencia existente se adapta en src/services/draftStorage.ts (T-005-09), sin implementar multiproyecto.


## Resultado de H0–H2

Implementación y verificación técnica completadas el 2026-10-08; método de evaluación T-005-19 sustituido por banco automatizado a petición del usuario. Evidencia en validation.md y corpus.md. La revisión semántica y aceptación siguen pendientes. En ese cierre H3–H5 no estaban ejecutados; H3 se autorizó e implementó posteriormente conforme al contrato siguiente. La recomendación de aprobación anterior se conserva como contexto histórico, ya resuelta para H0–H2.


## Contrato H3 autorizado: T-005-20…24

Persistencia: localStorage con biblioteca serializada atómica bajo `sdd-studio:biblioteca:v1`, independiente de la clave histórica del borrador. Máximo veinte proyectos, cinco versiones explícitas por proyecto y 2 MiB de representación UTF-16 por biblioteca. Configuración por instantánea: máximo 512 KiB UTF-8. Al alcanzar cuota/retención se rechaza el cambio sin borrar historial; eliminación es explícita. El borrador activo se guarda con espera de 800 ms y al cambiar proyecto; las versiones se crean por acción expresa. No se guarda un ZIP ni 34 documentos en cada versión: basta configuración y adiciones.

Biblioteca schemaVersion 1: revision, activeId y projects. Proyecto: id independiente del slug, createdAt/updatedAt ISO, draft Configuration y versions. Versión: id estable, label y createdAt, configuration. Fechas de metadatos nunca se inyectan en documentos deterministas. Migrar el borrador histórico una sola vez y conservar su clave. Si una biblioteca existente diverge de un borrador no representado en sus proyectos/versiones, preservarlo como proyecto recuperado antes de cambiar la edición; si falla la persistencia, no sustituir la edición. Compare-and-swap del valor almacenado y eventos storage evitan sobrescrituras silenciosas entre pestañas.

Respaldo JSON: format `sdd-studio-backup`, schemaVersion 1 y projects, sin sesiones/credenciales MCP. Exportar un proyecto o todos; importación limitada a 2 MiB UTF-8, claves permitidas, profundidad 50, IDs únicos, versiones/fechas, configuración/diseño/modelo y textos seguros. Rechazar esquemas desconocidos, claves de prototipo, rutas ajenas, referencias rotas, emojis o secretos aparentes. No aceptar ZIP ni código ejecutable. Leer/validar/comparar no escribe almacenamiento; confirmar permite copia con nuevo ID o sustitución explícita conservando respaldo del estado anterior. Cancelar mantiene estado y almacenamiento idénticos.

Configuration.manualSections es opcional, migración aditiva: hasta cincuenta adiciones, total 128 KiB UTF-8, id, documentId del manifiesto, sectionKey, title, text y baseContent. Texto hasta 10000 caracteres, base hasta 40000. Se añaden aportaciones separadas, nunca se edita directamente el bloque generado. La clave de sección deriva de encabezado normalizado (ID de RF estable cuando exista); `documento` añade al final. Regenerar conserva adiciones. Si cambia o desaparece la sección base, publicar queda pendiente y exportación bloqueada por revisión hasta resolver: conservar aportación en la sección nueva o moverla al final. Cancelar no acepta la nueva revisión. No borrar texto automáticamente ni resolver por heurística. El contenido combinado sigue limitado a 1 MiB y los bloqueos de seguridad permanecen absolutos.

Diferencias públicas: entradas {path,before,after,kind}, total y máximo 200 entradas mostradas, sin ocultar el recuento restante. Comparar configuración por campos e IDs; revisión/metadatos se muestran aparte. UI siempre presenta origen/destino antes de reemplazar o recuperar una versión.

Adaptadores nombrados de T-005-22: src/store/projectLibraryStore.ts (acciones initialize/save/open/create/delete/export/prepareImport/confirmImport/prepareRestore/confirmRestore y pendingComparison/error); src/store/editorStore.ts (restore validado y acciones de adiciones); src/store/documentStore.ts (pendingCompilation/manualConflicts y confirmación mediante DTO). src/app/App.tsx monta inicialización diferida y acceso a biblioteca sin suscribir raíz; componentes de proyectos consumen estos contratos, nunca internals del compilador. T-005-23 incluye montajes diferidos en IdeaEditor/DocumentCanvas y estilos. Servicios publican read/writeLibrary, exportBackup y parseBackup; rechazos contienen mensajes españoles, no contenido sensible.

Refinamiento T-005-21: análisis/importación y validación/serialización de biblioteca mediante trabajador dedicado nativo, sin dependencias. readLibrary/writeLibrary son asíncronos; CAS se verifica inmediatamente antes de setItem, después del trabajo externo al hilo UI. Sin Worker disponible, validación local conservadora como recuperación; informar fallo de trabajador sin escribir datos inválidos.

Montajes UI concretados T-005-23: src/app/StudioLayout.tsx integra el acceso diferido a biblioteca; DocumentCanvas integra aportaciones/conflictos también con carga diferida. documentStore expone generatedCompilation (texto base), pendingCompilation y manualConflicts; documentSections/reconcileDocuments son contratos públicos de manualSections. El editor manual usa el texto base, nunca captura una sección ya combinada.

Conflictos entre pestañas: Web Locks serializa la comprobación CAS y escritura donde esté disponible; alternativa conservadora CAS en el mismo turno si no hay Web Locks. Una instantánea auxiliar de edición, `sdd-studio:edicion:v1`, guarda configuración y referencia a proyecto/revisión de biblioteca (hasta 512 KiB de configuración); no forma parte del respaldo exportado. Se actualiza tras escrituras y al cerrar. Solo recuperar sobre el proyecto activo cuando esa procedencia coincide; en caso de divergencia conservar la edición como proyecto nuevo sin sobrescribir una revisión ajena. El límite de 2 MiB corresponde a la biblioteca, aparte de las claves de borrador/continuidad.

## Cierre técnico H3

T-005-20…24 ejecutadas secuencialmente con cambios de dominio registrados. La biblioteca usa localStorage, validación en un trabajador nativo y comparación previa a toda activación/recuperación/importación. El respaldo es una lectura de instantáneas validadas; no depende de disponer de cuota para guardar. La procedencia de la edición distingue una recuperación normal de cambios hechos por otra pestaña. El autoguardado no deshabilita las acciones de usuario.

Se preservan las 34 rutas y el motor de H2. Las aportaciones se reconcilian mediante DTO públicos antes de publicar una generación; la resolución nunca elimina el texto del usuario. Evidencia de importación adversa, cuota, conflictos, continuidad, funcionamiento sin red, accesibilidad automatizada y presupuesto de rendimiento en [validation.md](validation.md). Sin nuevos paquetes, H4/H5 ni despliegue.

## Contrato H4 autorizado: T-005-25…29

Configuration.profile es opcional y aditivo, schemaVersion 1: profiles (hasta diez instantáneas declarativas), components (hasta veinte) y technologies (hasta cincuenta). Máximo 128 KiB UTF-8 del conjunto; se conservan los límites de configuración/biblioteca de H3 y el kit de 1 MiB. Un borrador anterior sin profile conserva su significado. ProjectDefinition.mode mantiene nuevo/ampliacion/migracion/documentacion; documentación implica implementationRequired=false. Un cambio de modo no borra tecnologías, diseño, requisitos ni aportaciones: los conflictos de aplicabilidad se muestran.

Perfil: id, version declarada, name, description, sources [{label,url HTTPS sin credenciales}], reviewedAt (fecha ISO o vacío pendiente), support (declarada/verificada), appliesTo (modos), componentKinds, capabilities, questions, constraints y sections. Solo claves conocidas, datos JSON y vocabularios finitos; listas/textos acotados, sin campos de código, CSS, comandos, plantillas ejecutables ni evaluación de expresiones. Rechazar marcadores de código/comandos en declaraciones. Las fuentes no se consultan automáticamente. Verificada se reserva a instantáneas integradas e inmutables contrastadas por pruebas del generador; no acredita compatibilidad real de versiones, seguridad o adecuación del proyecto objetivo. Un perfil propio siempre es Declarada por el usuario.

Componente: id, name, kind (web/movil/api/cli/escritorio/datos/dispositivo/servicio/documental/otro), responsibility, profileId (o vacío pendiente), dependsOn y technologyIds. Referencias locales válidas, IDs únicos, sin ciclos ni dependencia consigo mismo. Cada componente delimita responsabilidad e interfaces: no se inventa implementación especializada ni se aplica una única tecnología global a todos. Las selecciones tradicionales describen decisiones globales; las tecnologías de cada componente quedan explícitas en el modelo. Un RF puede enlazar el ID de componente mediante el contexto canónico; no se duplica automáticamente un RF.

Tecnología propia: id, name, role (lenguaje/framework/base-datos/protocolo/herramienta/otro), purpose, constraints, version, sources y reviewedAt; support siempre declarada. IDs independientes de catálogo; no entran en Levenshtein, MCP, selectores de catálogo ni reglas de compatibilidad desconocidas. Mostrar incertidumbre y pendientes de protocolo/versiones/fuentes. El catálogo conserva sus identidades técnicas, sin certificar tecnologías por inclusión.

Rutas núcleo T-005-25/26: src/domain/profiles.ts, src/catalog/profiles.ts, models.ts, validation.ts, projectLibrary.ts y projectValidation.ts para referencias de componentes; diagnósticos públicos derivados de profile. T-005-27: src/engine/profileProjection.ts y agentContext.ts, plantillas/perfiles de destino pertinentes, usando los DTO; preservar manifiesto de 34 archivos. T-005-28a integración: src/store/editorStore.ts expone setProfileConfiguration y acciones de modo/colecciones con validación previa y revisión única; biblioteca/migración consumen isConfiguration sin perder el campo opcional. T-005-28b UI: src/components/profiles/, montaje diferido en configuración y estilos. Consumo exclusivo de DTO, perfiles integrados y acciones públicas; no leer internals del motor.

Cada paquete de tarea declara ID/objetivo, dominio, tres entradas como máximo (AGENTS.md, estado del proyecto y apartado de spec), dependencias, contratos, archivos permitidos para la ejecución, criterios y puerta de aprobación. Entrada limitada no prohíbe lectura posterior de los archivos explícitamente permitidos de la tarea. No exigir recorrer todos los documentos. Separar UI, núcleo, servicios y tareas de integración; software fuera de catálogo permanece pendiente de rutas/contratos específicos. DOCUMENT lee solo documentación, IMPLEMENT subsistema aislado autorizado, VALIDATE solo resultados; una corrección vuelve a IMPLEMENT con tarea registrada. Paquetes dentro de tasks.md y guías existentes; no crear más archivos de kit ni importar autorizaciones/evidencia del estudio al proyecto generado.

Contrato de integración T-005-28: setProfileConfiguration valida formato y seguridad, publica una sola revisión y sincroniza por ID los componentes con context.components para permitir enlaces de RF. Rechaza eliminar un componente referenciado; no elimina silenciosamente requisitos. setWorkMode actualiza mode/implementationRequired sin borrar datos; el control histórico de implementación usa esa misma semántica. UI usa DTO públicos y acciones; panel diferido profiles/ con listas accesibles para perfiles, componentes/dependencias y tecnologías, importación/exportación de ProfileConfiguration JSON validado (128 KiB), sin paquetes adicionales. La importación de un perfil exige confirmación previa a sustituir la configuración de perfiles y conserva requisitos/diseño/aportaciones; no importa código ni consultas remotas.

Refinamiento de continuidad T-005-28c: src/services/draftStorage.ts recupera configuraciones con advertencias no bloqueantes; solo rechaza errores bloqueantes. profileMigration.test.ts confirma perfiles/modo y conservación del registro inválido. La ficha usa selectores de mode/implementationRequired; editar RF ajenos conserva identidad de profile. Una divergencia de responsabilidad/dependencias con un componente canónico existente bloquea persistencia/exportación; un enlace ausente queda pendiente.
