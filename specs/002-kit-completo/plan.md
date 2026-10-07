# Plan de implementación — 002 / Kit SDD completo y adaptable

Fecha: 2026-10-06. Estado: **propuesto para revisión; código no autorizado**. Requisitos: [spec.md](spec.md). Ejecución futura: [tasks.md](tasks.md).

## 1. Resultado previsto

La aplicación mantendrá su arquitectura cliente y exportará la estructura completa de SDD-AI-FULLSTACK, con contenido generado en español a partir del SDD configurado. El marco externo se utiliza como referencia documental, no como dependencia local o de red de la aplicación distribuida.

El kit inicial contendrá **34 archivos: los 30 del marco y cuatro documentos de una especificación activa**. El ZIP actual de seis archivos se sustituirá al aprobar e implementar esta ampliación. No habrá dos estructuras de exportación simultáneas ni documentos activos duplicados.

## 2. Estructura exacta de salida

`<slug>` corresponde al identificador de proyecto que ya existe en el formulario. La numeración inicial de la especificación será 001; en el ejemplo, `001-mi-proyecto`. No se necesita un campo nuevo ni se acepta una ruta libre introducida por el usuario.

```text
<slug>/                                 carpeta de trabajo tras extraer el ZIP
├── README.md
├── AGENTS.md
├── constitution.md
├── TECHNICAL_CONTEXT.md
├── SDD_MANUAL.md
├── MANUAL-PARA-USUARIO.txt
├── docs/
│   ├── PROJECT.md
│   ├── BASE_ARCHITECTURE.md
│   ├── BASE_OBSERVATIONS.md
│   ├── DECISIONS.md
│   ├── ENVIRONMENT_AND_VERIFICATION.md
│   ├── PROJECT_STATUS.md
│   ├── ROADMAP.md
│   ├── TRACEABILITY.md
│   ├── SDD_VALIDATION.md
│   └── VERIFICATION.md
├── prompts/
│   ├── README.md
│   ├── 00-orchestrator.md
│   ├── 01-specify.md
│   ├── 02-plan.md
│   ├── 03-tasks.md
│   ├── 04-implement.md
│   ├── 05-validate.md
│   ├── 06-changes.md
│   └── 07-resume-pause.md
└── specs/
    ├── README.md
    ├── _templates/
    │   ├── spec.md
    │   ├── plan.md
    │   ├── tasks.md
    │   └── validation.md
    └── 001-<slug>/
        ├── spec.md
        ├── plan.md
        ├── tasks.md
        └── validation.md
```

Las rutas dentro del ZIP son relativas a su raíz, como en el kit actual; `<slug>/` representa la carpeta de extracción, no un prefijo duplicado. Entradas de directorio creadas por JSZip no cuentan como documentos. Se conservan nombres, mayúsculas y extensión TXT del marco. Las rutas planas `specs/spec.md`, `specs/plan.md` y `specs/tasks.md` desaparecen del ZIP futuro.

## 3. Responsabilidad y adaptación de cada archivo

Los archivos base conservan la finalidad del marco. El texto común expresa reglas; los apartados específicos se generan desde configuración efectiva, sin reemplazos globales de cadenas ni copia de resultados de esta aplicación.

| Ruta de salida | Contenido y especialización prevista |
|---|---|
| `README.md` | Árbol completo, proyecto, pila declarada, entrada por el orquestador, documentos activos y orden DOCUMENT/revisión/IMPLEMENT/VALIDATE. |
| `AGENTS.md` | Instrucciones permanentes, lectura inicial, stack elegido y límites del destino; alcance autorizado pendiente. Seguridad de servidor solo si corresponde; diseño/accesibilidad según interfaz. |
| `constitution.md` | Guardrails aprobados del estudio adaptados al destino: español, cero emojis, herramientas elegidas, autorización, secretos, errores, simulación operativa y no inventar evidencia. |
| `TECHNICAL_CONTEXT.md` | Plataforma, topología, lenguajes, frameworks, APIs, complementos, datos, protocolos, identidad, responsabilidades y restricciones. Incertidumbres explícitas. |
| `SDD_MANUAL.md` | Flujo completo, cómo usar cada prompt, revisión, autorización delimitada, ejecución, validación, cambios y reanudación; ejemplos con rutas y tecnologías del destino. |
| `MANUAL-PARA-USUARIO.txt` | Guía breve en texto: extraer, abrir carpeta, entregar orquestador, revisar, autorizar y retomar; no exige npm para destinos Python/Rust/Go. |
| `docs/PROJECT.md` | Nombre, propósito, alcance, exclusiones, pila, arquetipo/tokens aplicables y especificación activa; decisiones seleccionadas, no implementación aprobada. |
| `docs/BASE_ARCHITECTURE.md` | Arquitectura objetivo propuesta, módulos, árbol de código y límites de confianza; arquitectura real pendiente de inspección. El encabezado distingue ambos estados. |
| `docs/BASE_OBSERVATIONS.md` | Sin observaciones verificadas del repositorio objetivo. Lista de inspección pertinente al destino; nunca importa hallazgos del repositorio SDD-generator. |
| `docs/DECISIONS.md` | Decisiones de configuración con origen manual/conjunto/inferencia y alternativas conocidas; aprobación formal pendiente. No inventa quién confirmó, fecha, justificación o commit. |
| `docs/ENVIRONMENT_AND_VERIFICATION.md` | Entorno pendiente de inspección; herramientas elegidas y comandos candidatos por receta. Las versiones/compatibilidades y ejecución se revisan antes de usar. |
| `docs/PROJECT_STATUS.md` | DOCUMENT, especificación activa, sin código autorizado, tareas propuestas, evidencia no ejecutada, pendientes y siguiente paso de revisión. |
| `docs/ROADMAP.md` | Sin ampliaciones autorizadas. El alcance negativo se referencia como exclusión; no se convierte automáticamente en trabajo futuro. |
| `docs/TRACEABILITY.md` | RF → tareas → rutas propuestas → verificaciones previstas; estados propuestos/no ejecutados y criterios observables. |
| `docs/SDD_VALIDATION.md` | Checklist de consistencia del kit y validación funcional, adaptado al destino; inicialmente sin auditoría técnica ejecutada. |
| `docs/VERIFICATION.md` | Registro vacío de ejecuciones con campos para comando, entorno, salida y evidencia; referencia al validation activo. |
| `prompts/README.md` | Índice de ocho prompts, propósito, orden y límites de autorización; enlaces relativos correctos. |
| `prompts/00-orchestrator.md` | Lectura de AGENTS, constitución, contexto, estado e índice; determina fase, usa guías específicas y resuelve la especificación activa. |
| `prompts/01-specify.md` | Requisitos, usuarios, alcance, datos/contratos pendientes y criterios; dirección visual solamente cuando aplique. |
| `prompts/02-plan.md` | Arquitectura, rutas, contratos, persistencia, seguridad, tokens y verificación según selección; propuestas antes de código. |
| `prompts/03-tasks.md` | Tareas atómicas con IDs numerados, RF, dependencias, archivos y criterio de finalización; no presupone `src/` para todos los destinos. |
| `prompts/04-implement.md` | Requiere autorización explícita y registro de alcance; ejecuta por dependencias, verifica por bloques y conserva trabajo previo. |
| `prompts/05-validate.md` | Ejecuta únicamente verificaciones pertinentes/autorizadas; registra resultados reales en validation, verification y trazabilidad. |
| `prompts/06-changes.md` | Gestiona cambios pequeños en la especificación activa o crea la siguiente numerada para funcionalidades nuevas; conserva decisiones sustituidas. |
| `prompts/07-resume-pause.md` | Guarda/lee estado, tarea, permisos, evidencia y siguiente paso; no reconstruye trabajo completado ni interpreta DOCUMENT como autorización de código. |
| `specs/README.md` | Índice con la especificación 001, estado DOCUMENT, rutas válidas y código no autorizado; explica numeración e IDs. |
| `specs/_templates/spec.md` | Plantilla reutilizable con marcadores explícitos para una futura funcionalidad; contextualiza el destino y no replica la necesidad inicial como requisito futuro. |
| `specs/_templates/plan.md` | Esqueleto de planificación pertinente a la plataforma, stack y capas; rutas futuras por definir, tokens seleccionados como contexto. |
| `specs/_templates/tasks.md` | Formato atómico con IDs de la futura especificación, RF, dependencias, archivos y finalización; ninguna tarea ejecutada. |
| `specs/_templates/validation.md` | Plantilla de evidencia con verificaciones pertinentes, entorno y resultados vacíos; identificador futuro por completar. |
| `specs/001-<slug>/spec.md` | Idea, alcance, exclusiones, RF numerados, contratos pendientes y criterios de la necesidad configurada. |
| `specs/001-<slug>/plan.md` | Pila, módulos, rutas propuestas, datos, límites de seguridad, tokens y estrategia de pruebas coherentes. |
| `specs/001-<slug>/tasks.md` | Desglose numerado del alcance inicial; todas las rutas salen de la misma arquitectura propuesta. |
| `specs/001-<slug>/validation.md` | Registro inicial «No ejecutado» para esa especificación; verificaciones propuestas y espacios de evidencia. No contiene resultados positivos ni aceptación. |

Los archivos de registro son útiles desde el primer ZIP aunque no haya evidencia. «Pendiente de inspección», «Propuesto», «No ejecutado» y «No aplica» se usan según corresponda. Ningún archivo implica autorización por existir. Si el usuario no configuró algo, se documenta la falta de definición.

## 4. Modelo de generación e integración técnica

### 4.1. Contexto único del kit

Crear un contexto derivado de la configuración validada/effectiveConfiguration: identidad, revisión, especificación activa, plataforma, arquitectura, selecciones/orígenes, alcance, RF, criterios, tareas, rutas del destino, tokens aplicables y verificaciones candidatas.

No duplica datos en almacenes independientes. No consulta fecha actual, sistema, Git o red para inventar metadatos. Fecha, entorno, commit y autor de aprobación quedan pendientes si no fueron aportados. La revisión y versión del contrato del kit permiten detectar resultados obsoletos; la fase del proyecto generado siempre comienza en DOCUMENT.

### 4.2. Manifiesto y referencias

Proponer `src/engine/kitManifest.ts` como fuente única de identidad, ruta, categoría, título, formato y orden de los 34 documentos. El contrato distingue documentos base, plantillas reutilizables y especificación activa. La identidad del documento activo permanece estable aunque cambie el slug; su ruta se recalcula.

Actualizar `src/domain/models.ts`, `src/domain/validation.ts`, `src/engine/compiler.ts` y consumidores que actualmente usan documentPaths, posiciones o la constante seis. Las rutas autorizadas se derivan de un manifiesto construido desde configuración validada; no se confía en una lista arbitraria suministrada como si fuera autorizada. Comprobar unicidad, inventario, revisión, tamaño y referencias internas antes de exportar.

Una función compartida de referencias compone rutas relativas desde el documento de origen, incluidas las de `specs/_templates/` y la carpeta activa. Los vínculos futuros usan marcadores inequívocos de plantilla y no se tratan como enlaces a archivos existentes. No se referencia `/home/xavi/...` en el kit exportado.

### 4.3. Plantillas y especialización

Mantener las plantillas existentes de spec, plan, tasks, constitution, project y orchestrator, ajustadas al nuevo contrato. Añadir módulos propuestos bajo `src/engine/templates/` por responsabilidad: raíz/manuales, gobernanza docs, prompts por fase, plantillas reutilizables y validation inicial. Proponer `src/engine/kitContext.ts` y `src/engine/references.ts` para los datos y referencias comunes.

Revisar los 30 documentos fuente por su finalidad, traducir/adaptar contenido y registrar procedencia. No copiar ejemplos como decisiones reales ni introducir una licencia de redistribución inexistente. No modificar el marco externo. No convertir los documentos operativos en un README repetido bajo distintos nombres.

### 4.4. Arquitectura del destino y tareas

Proponer `src/engine/targetProfile.ts` como descripción común de módulos, archivos, verificaciones y comandos candidatos; reutilizada por targetTree, tasksTemplate, plan, arquitectura, trazabilidad, contexto y setupCommands. Las recetas no ejecutan nada ni añaden tecnologías a las selecciones.

| Destino | Adaptación requerida |
|---|---|
| Django | manage.py, config, apps, modelos/migraciones; DRF/Ninja/plantillas/Channels/Celery solo si seleccionados. RF y tareas apuntan a esas rutas; ORM exige concretar base de datos. |
| Python API u otro Python | Rutas y capas Python pertinentes al framework; pytest/uv/poetry/pip solo según decisiones. Si falta contrato/receta, pendiente explícito. |
| Web SPA/fullstack/contenido | Entradas y convenciones del framework elegido; responsabilidades cliente/servidor y build real por determinar. Evitar imponer React a Vue/Svelte o Next. |
| Rust/Go/CLI/TUI/daemon/shell | Archivos y pruebas del lenguaje/plataforma; simulación cuando corresponda. No imponer diseño web ni tests responsivos a destinos no visuales. |
| Escritorio/móvil/juego/embebidos | Capas, toolchain y pruebas pertinentes a las tecnologías elegidas; APIs/rutas exactas desconocidas se dejan pendientes. No extrapolar un scaffold web. |

El catálogo completo puede declarar opciones aunque no exista una receta específica. La cobertura de contenido nunca se suplirá con comandos, versiones, endpoints o archivos inventados. Las familias se seleccionan por plataforma/arquitectura y las recetas concretas por tecnologías explícitas; las combinaciones incompatibles continúan bloqueadas.

Migrar los identificadores generados a `RF-001-01` y `T-001-01`, incluyendo referencias en criterios, dependencias y trazabilidad. Centralizar la lista de requisitos/tareas para evitar versiones diferentes en los documentos. Corregir los destinos que hoy combinan rutas Django con tareas genéricas `src/`.

## 5. Cambios previstos en la aplicación

| Área existente | Cambio propuesto |
|---|---|
| `src/domain/models.ts` y `validation.ts` | Documentos por identidad/ruta/formato; contrato de manifiesto y rutas seguras dinámicas. Configuración existente compatible; especificación 001 derivada sin campos obligatorios nuevos. |
| `src/engine/compiler.ts` y plantillas | Generar los 34 archivos desde un contexto/revisión; validar referencias, IDs, grafo y tamaño antes de publicar. |
| `src/engine/targetTree.ts`, `taskGraph.ts`, `services/setupCommands.ts` | Compartir arquitectura del destino y verificaciones candidatas; eliminar rutas genéricas inconsistentes. |
| `src/workers/generator.worker.ts` y `generatorClient.ts` | Mantener coalescencia/descarte de resultados antiguos; publicar el kit completo atómicamente. |
| `src/store/uiStore.ts` | Selección por identidad estable, no índice; recuperación segura cuando cambie la ruta. No se promete editar documentos manualmente. |
| `src/components/documents/FileTree.tsx` | Árbol real de todos los niveles: raíz, docs, prompts, specs, plantillas y especificación activa; conteo calculado del manifiesto. |
| `src/components/documents/DocumentTabs.tsx` | Visor del documento seleccionado, accesos rápidos a spec/plan/tasks/constitution/PROJECT/orquestador y selector para cualquier archivo; evitar 34 pestañas en una fila. |
| `src/components/export/ExportBar.tsx`, `services/clipboard.ts` | Copiar documento activo o prompt por identidad; validar compilación antes de copia. Mostrar formato TXT/MD correctamente. |
| `src/services/zipExport.ts` | Empaquetar exactamente el manifiesto de la revisión seleccionada; rechazar rutas extra, faltantes y repetidas. |
| Persistencia/offline/estilos | Borradores existentes intactos; caché nativa cubre los recursos nuevos emitidos. Ajustar solo estilos de navegación/visor necesarios. |
| README y documentación de 001/002 | Explicar estructura nueva, uso completo y estados; registrar sustitución del contrato de seis documentos al aprobarlo. |

La interfaz mantiene español, iconos lucide-react, tres rangos responsivos y objetivos de 44 px. El árbol permite flechas, Home/End, expandir/contraer, Enter y foco visible. Los archivos con el mismo nombre se distinguen por su carpeta. Solo se resalta el documento visible; TXT se presenta como texto sin interpretar HTML. El contador y las acciones provienen del mismo manifiesto utilizado por el ZIP.

## 6. Transición y compatibilidad

1. Conservar la configuración versionada actual; derivar la estructura nueva al regenerar. No eliminar borradores al actualizar.
2. Reemplazar el contrato fijo de seis rutas por el manifiesto de 34; actualizar todos los consumidores y pruebas que dependían de posiciones o nombres planos.
3. Mantener las acciones habituales y la exportación separada de tokens. Los tokens no alteran el inventario obligatorio del kit.
4. Mantener la política offline: actualización disponible informada, sin recarga automática mientras se edita. Verificar actualización desde una caché anterior, no solo una instalación limpia.
5. No reescribir los ZIP ya descargados ni la documentación histórica 001 del repositorio de la aplicación. Informar el cambio de formato en README y decisiones.

## 7. Orden de implementación tras aprobación

| Bloque | Entrega verificable | Tareas |
|---|---|---|
| A | Contrato/manifiesto y contexto de generación | T-002-01…02 |
| B | Perfil de destino, RF/tareas y adaptación de las seis plantillas existentes | T-002-03…04 |
| C | Raíz/manuales, gobernanza, prompts, índices y plantillas restantes | T-002-05…08 |
| D | Compilación completa y exportación coherente/segura | T-002-09…10 |
| E | Navegación/acciones y actualización compatible/offline | T-002-11…12 |
| F | Regresión, rendimiento, evidencia y sincronización | T-002-13…14 |

No se marca una tarea completada antes de ejecutar su comprobación. T-002-14 entrega evidencia técnica y conserva cualquier auditoría manual no realizada como pendiente. La aceptación del usuario y la publicación siguen separadas.

## 8. Verificación prevista

- Comparar las 30 rutas base con un inventario revisado del marco y verificar cuatro rutas activas; inspeccionar el ZIP descomprimido con 34 archivos, ignorando entradas de directorio.
- Verificar todos los enlaces relativos, identidad de especificación, IDs y grafo; distinguir marcadores reutilizables de rutas reales.
- Probar los ocho conjuntos, las familias de destino y combinaciones manuales. Incluir Django con DRF, Ninja, plantillas, Channels y Celery; sin complementos ajenos o rutas src contradictorias.
- Modificar idea, slug, alcance, stack, seguridad y arquetipo: recomposición coherente de todas las referencias afectadas, sin revisiones mezcladas ni sobreescritura de decisiones manuales.
- Verificar ausencia de autorizaciones/evidencia inventadas, caminos locales de esta máquina, imposición de frameworks y contenido de otro repositorio.
- ZIP, copia y visor: mismo contenido/ruta/revisión; TXT, secretos sintéticos, emojis, traversal, archivos omitidos/extra y tamaño superior al límite.
- Borradores anteriores, carga restringida, caché anterior, recarga/exportación sin red, trabajador reiniciado y actualización durante edición.
- Chromium/Firefox y los seis anchos existentes; árbol anidado, foco, teclado, contraste y lector de pantalla real cuando esté disponible. Conservar el límite conocido de WebKit si sigue faltando soporte del sistema.
- Medir 30 kits completos de referencia, 230 eventos/30 revisiones y 30 cambios de conjunto; límite 1 MiB, entrada/controles p95 <16 ms, generación ≤150 ms, ZIP <100 ms. Diferenciar empaquetado de carga inicial y guardado.
- Ejecutar lint, TypeScript, unitarias, build y E2E; registrar salidas reales en `specs/002-kit-completo/validation.md` únicamente durante la implementación/verificación autorizada.

## 9. Riesgos y decisiones para revisión

Mayor volumen de texto puede aumentar compilación, resaltado y ZIP; se mitiga compartiendo contexto, usando el trabajador y resaltando solo la selección. Más navegación exige un árbol accesible y acceso rápido a documentos habituales. La adaptación a tecnologías poco definidas debe mostrar pendientes, sin producir scaffolds falsos.

Decisiones propuestas: inventario inicial de 34 documentos; carpeta `001-<slug>` derivada del campo actual; validation incluido pero no ejecutado; sustitución del kit mínimo como única salida; un proyecto/especificación activa inicial por exportación; conservación de 1 MiB y presupuestos vigentes. Ninguna de estas decisiones autoriza escribir código antes de la revisión del usuario.

## 10. Estado de esta entrega

Se redactan especificación, plan y tareas, y se actualizan índice, estado, decisiones y trazabilidad. No se modifican fuentes de la aplicación, dependencias o el marco externo. Las pruebas y métricas de 001 son históricas y no validan esta ampliación. Tras entregar este plan se espera la instrucción del usuario.
