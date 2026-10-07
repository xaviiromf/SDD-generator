# 001 — SDD-Studio: estudio y generador de desarrollo guiado por especificaciones

Fecha: 2026-10-06. Estado: especificación aprobada por el usuario el 2026-10-06. Implementación autorizada: **SÍ**. Aceptación final del producto: pendiente.

## 1. Fuentes y disciplina

- Solicitud del usuario: completar únicamente la Fase 1 (DOCUMENT) y detenerse antes de escribir código.
- Fuente funcional: [prompt.txt](../prompt.txt), preservado sin modificaciones.
- Marco rector: `/home/xavi/Projects/SDDs/SDD-AI-FULLSTACK`; se leyeron `AGENTS.md`, `constitution.md`, `TECHNICAL_CONTEXT.md`, el manual, el orquestador, `01-specify.md`, `02-plan.md`, `03-tasks.md` y sus plantillas.
- La ruta con «Projects SDDs» no existe; la ruta indicada en el prompt sí existe. `01-specification.md` tampoco existe: su equivalente real es `01-specify.md`.
- Los documentos se ubican directamente en `specs/`, como solicita el prompt del proyecto. Se conservan identificadores `RF-001-*` y `T-001-*` del marco. No se modifica el marco externo.
- Ninguna descripción de componentes, pruebas o archivos futuros constituye implementación o autorización. Esta entrega incluye especificación, plan y tareas conjuntamente porque el usuario lo pidió expresamente.

## 2. Necesidad, usuarios y resultado

SDD-Studio convierte una idea escrita en lenguaje cotidiano y decisiones arquitectónicas explícitas en un kit SDD coherente, revisable y listo para entregar a un agente de programación. La generación es local y determinista; no utiliza modelos de IA, claves, servicios remotos ni tokens de API.

Usuarios principales: desarrolladores independientes que necesitan iniciar proyectos con límites claros; arquitectos que comparan alternativas; equipos que requieren requisitos, contratos y tareas trazables. El usuario conserva la responsabilidad de revisar decisiones y completar reglas de negocio.

Historias:

1. Como creador, describo «una aplicación para gestionar reservas» y recibo una estructura documental con dudas visibles sobre persistencia y reglas de negocio.
2. Como desarrollador, selecciono un proyecto CLI en Rust y desaparecen las opciones de CSS y diseño web incompatibles.
3. Como arquitecto, cambio un conjunto predefinido y reviso sus efectos antes de exportar documentos consistentes.
4. Como usuario móvil, configuro, escribo y exporto desde tres pestañas inferiores sin perder mis entradas.
5. Como usuario sin conexión, recupero mi borrador y descargo el kit después de haber cargado y preparado la aplicación para uso sin conexión.

## 3. Alcance y exclusiones

Incluye las siete fases completas del configurador, catálogo de al menos 201 entradas seleccionables distintas, ocho conjuntos predefinidos, 21 arquetipos visuales, detección local de intención, sugerencias de alcance, medidor de madurez, generación de seis documentos, árbol del kit, copia, ZIP, exportación de tokens, comandos de preparación, persistencia del borrador y documentación en español.

La aplicación es una SPA estática. Los servidores, bases de datos, plataformas móviles y herramientas de sistemas que aparecen en el catálogo son **objetivos de los proyectos descritos por el usuario**: no se instalan ni ejecutan dentro de SDD-Studio.

Quedan fuera: backend propio, cuentas o autenticación de SDD-Studio, pagos, colaboración remota, telemetría, llamadas a IA, ejecución de comandos, instalación de paquetes desde el navegador, compilación de aplicaciones generadas y generación de lógica de negocio no aportada. No se promete que abrir `dist/index.html` mediante `file://` permita usar módulos, trabajadores o caché sin un servidor estático.

## 4. Recorrido y jerarquía adaptable

Recorrido principal: escribir la idea; refinar las siete fases y las sugerencias; elegir arquetipo; revisar madurez y documentos; copiar el prompt maestro o descargar el ZIP; abrir el kit en un editor; encargar DOCUMENT al agente; revisar antes de autorizar código.

Recorridos secundarios: comenzar desde un conjunto predefinido; buscar una tecnología; corregir contradicciones; cambiar de documento; exportar únicamente tokens; recuperar un borrador.

| Ancho | Composición y navegación |
|---|---|
| Menos de 768 px | Una columna; navegación inferior fija con «Configuración», «Idea / Prompt» y «Documentos SDD»; respeta el área segura y deja espacio inferior al contenido. |
| 768–1279 px | Dos columnas; selector superior alterna Configuración e Idea a la izquierda; documentos y árbol a la derecha. |
| Desde 1280 px | Tres columnas equilibradas: configurador, idea y documentos. Se prefiere una cuadrícula balanceada; el redimensionado manual no es obligatorio. |

La cabecera muestra identidad y estado de guardado. El panel documental contiene pestañas, árbol, madurez y acciones de exportación. No hay desplazamiento horizontal de página. Las líneas largas de código pueden desplazarse dentro de su visor sin ensanchar la página. Todos los objetivos interactivos miden al menos 44 × 44 px; una pantalla estrecha no elimina acciones.

## 5. Dirección visual

Se propone para el estudio «Precisión suiza para software», con una retícula técnica densa, bordes de 1 px y acento azul contenido. La propuesta requiere revisión; seleccionar un arquetipo para el proyecto generado no altera automáticamente el tema del estudio.

Tokens propuestos para el estudio: fondo `#111215`, superficie `#18191E`, texto `#FFFFFF`, texto secundario `#9CA3AF`, borde `#262830`, acento `#2D5CF6`, radio 6 px; Geist Sans en títulos, Inter en cuerpo y JetBrains Mono en código. Tipografías y licencias deberán validarse y servirse localmente. No se añaden fuentes remotas en tiempo de uso.

Se prohíben plantillas genéricas, degradados violetas usados por defecto, encabezados comerciales vacíos y cuadrículas repetitivas sin función. El arquetipo explícito de cristal violeta permanece disponible como elección deliberada del usuario, no como estilo por defecto. La iconografía de interfaz procede exclusivamente de `lucide-react`; no se usan emojis, imágenes enlazadas ni iconos Unicode decorativos.

## 6. Requisitos funcionales

| ID | Comportamiento requerido |
|---|---|
| RF-001-01 | Mostrar y editar las siete fases, con acordeones jerárquicos y atajos Cmd/Ctrl + 1…7. |
| RF-001-02 | Ofrecer todas las familias y tecnologías enumeradas en la sección 7 y al menos 201 entradas distintas con identificador estable, categoría y compatibilidades; no contar alias como entradas nuevas. |
| RF-001-03 | Filtrar opciones por plataforma, arquitectura y lenguaje; explicar conflictos; impedir exportar combinaciones contradictorias sin corregirlas. Ocultar diseño web para CLI conserva un borrador inactivo y lo excluye del kit. |
| RF-001-04 | Aplicar los ocho conjuntos predefinidos de la sección 8 de forma atómica. Conservar idea y límites del usuario; confirmar antes de sustituir decisiones manuales y permitir cancelar. |
| RF-001-05 | Abrir una paleta con Cmd/Ctrl + K; buscar tecnologías, arquetipos y conjuntos con coincidencias aproximadas y navegar mediante teclado. |
| RF-001-06 | Editar la idea sin interrupciones y analizarla localmente, normalizando acentos, mayúsculas, alias y errores como «pyton» o «tailwnd». |
| RF-001-07 | Aplicar automáticamente coincidencias inequívocas compatibles solo a campos sin decisión manual; mostrar sugerencias ante ambigüedad. Negaciones como «sin Firebase» no activan Firebase. Una selección manual prevalece sobre la inferencia. |
| RF-001-08 | Mostrar sugerencias de alcance explicadas en español, como reservas sin persistencia; aceptar una opción actualiza configuración y kit. Descartar una sugerencia no inventa una decisión. |
| RF-001-09 | Ofrecer los 21 arquetipos exactos del plan, con nombre visible en español, fuentes, muestras, paleta, botón, textura y evaluación real de contraste AA/AAA. |
| RF-001-10 | Generar conjuntamente `specs/spec.md`, `specs/plan.md`, `specs/tasks.md`, `constitution.md`, `docs/PROJECT.md` y `prompts/00-orchestrator.md`, íntegramente en español y con decisiones y límites coherentes. |
| RF-001-11 | Mostrar documentos mediante pestañas, resaltado y copia individual; el contenido pegado por el usuario nunca se interpreta como HTML ejecutable. |
| RF-001-12 | Mantener un árbol accesible de los archivos del kit que coincida exactamente con sus rutas exportadas. Mostrar por separado el árbol propuesto del proyecto objetivo dentro de `plan.md`. |
| RF-001-13 | Calcular madurez de 0–100 % con seis pilares: plataforma, pila tecnológica, almacenamiento, estilo, seguridad y pruebas. «No aplica» justificado cuenta como decisión; contradicciones no cuentan como completas. El porcentaje no certifica viabilidad ni seguridad. |
| RF-001-14 | «Copiar Prompt Maestro» copia el orquestador de la última revisión; ofrece confirmación accesible y selección manual cuando falla el portapapeles. |
| RF-001-15 | «Descargar Kit SDD (.zip)» produce íntegramente en memoria un ZIP con las seis rutas obligatorias, carpetas correctas y contenido de una misma revisión; informa el progreso y los errores sin perder entradas. |
| RF-001-16 | «Exportar Design Tokens» permite descargar `tokens.css`, `tokens.json` o `tailwind.config.ts` cuando corresponda al destino. No ofrece una configuración Tailwind incompatible con su versión. |
| RF-001-17 | «Comando de Setup Rápido» muestra instrucciones del destino seleccionado, copiables y sin ejecución. Identificadores válidos y escapado seguro evitan interpolar texto libre en órdenes de shell. |
| RF-001-18 | Guardar idea y configuración en memoria y, cuando sea posible, en localStorage versionado. Restaurar un borrador válido; explicar restricciones, corrupción o cuota agotada y continuar en memoria. Permitir borrar únicamente el borrador propio previa confirmación. |
| RF-001-19 | Tras una primera carga completa en origen seguro, funcionar y recargarse sin red mediante recursos locales y caché. No enviar idea, configuración ni documentos a servidores; ninguna fuente o motor de resaltado depende de una CDN. |
| RF-001-20 | Aplicar exactamente los tres rangos adaptables de la sección 4 y mantener estado y foco razonable al cambiar paneles. |
| RF-001-21 | Usar español en interfaz, errores, ayudas, guía, README y documentos generados. Nombres de productos, identificadores, rutas y sintaxis de comandos conservan su forma técnica. No hay emojis en artefactos creados ni exportados. |
| RF-001-22 | Emitir una constitución con reglas de integridad, límites y alcance, preservación de comentarios, protección de secretos, errores explícitos, pruebas deterministas y reglas visuales; exigir `--dry-run` por defecto para herramientas con efectos operativos y límites de actuación para seguridad. |
| RF-001-23 | Validar entradas, rutas, borradores y mensajes internos; evitar XSS, traversal e inclusión de secretos aparentes en persistencia, copias y descargas. Mostrar hallazgos y permitir editar el texto; no garantizar detección universal de secretos. |
| RF-001-24 | Proveer teclado completo, semántica, foco visible, gestión de diálogos, anuncios moderados y movimiento reducido; contraste AA en la interfaz. Los arquetipos muestran sus resultados reales aunque fallen AA. |
| RF-001-25 | Mantener edición fluida mediante suscripciones granulares y compilación independiente; objetivos medibles de la sección 11, sin cascadas de render desde React Context. |
| RF-001-26 | Producir `dist/` con `npm run build`, desplegable en alojamiento estático, sin procesos de servidor ni API propia. Admitir la subruta `/SDD-generator/` de GitHub Pages. |
| RF-001-27 | Incluir en README la guía de cuatro pasos, atajos, buenas prácticas de alcance negativo y limitaciones del generador especificadas en la sección 12. |
| RF-001-28 | Incorporar en el orquestador exportado DOCUMENT, parada para revisión, IMPLEMENT solo con autorización y VALIDATE con evidencia; preservar trazabilidad RF/tareas y advertir decisiones pendientes. |
| RF-001-29 | Registrar hitos en Git y sincronizarlos con `https://github.com/xaviiromf/SDD-generator`, preservando historial remoto y archivos locales; no publicar un sitio por el mero hecho de sincronizar el repositorio. |

## 7. Catálogo obligatorio de las siete fases

1. **Plataforma:** web SPA, SSR/fullstack, PWA, extensión Manifest V3; Linux, Windows, macOS, escritorio multiplataforma (Tauri, Electron, Flutter Desktop, Qt/C++); Android/Kotlin, iOS/Swift, Flutter, React Native; CLI, TUI (ncurses, ratatui, bubbletea), daemon/systemd, shell; ESP32, Arduino, Raspberry Pi, ARM bare-metal.
2. **Arquitectura:** cliente autónomo, monolito, cliente/API desacoplados, funciones y edge (Cloudflare Workers, Vercel Edge, AWS Lambda), microservicios y eventos (Pub/Sub, colas, gRPC), prioridad local/P2P con CRDT y sincronización eventual.
3. **Lenguajes y ejecución:** TypeScript, JavaScript, Python, Rust, Go, C++, C, Zig, Java, Kotlin, Swift, Elixir, C#, PHP y Ruby; Node.js, Bun, Deno y binarios nativos. Backend: Express, Fastify, NestJS, Hono, Elysia; FastAPI, Django, Flask, Litestar; Gin, Echo, Fiber, Chi; Axum, Actix-web, Warp; ASP.NET Core, Spring Boot, Quarkus. Web: React 19/18, Next.js App Router, Vue 3, Nuxt, Svelte 5, SvelteKit, Astro, SolidJS, Angular, Qwik, HTML5/ES Modules. Escritorio: Tauri v2, Electron, Flutter Desktop, Slint. Móvil: Flutter, React Native/Expo, SwiftUI, Jetpack Compose.
4. **Persistencia y comunicaciones:** memoria y fixtures; LocalStorage, IndexedDB, OPFS; SQLite, DuckDB, PGlite, RocksDB; PostgreSQL, MySQL, MariaDB; MongoDB, CouchDB, SurrealDB; Redis, Dragonfly, Memcached; Supabase, Firebase, PocketBase, Appwrite. REST/JSON, GraphQL, tRPC, WebSockets, gRPC, SSE y MQTT.
5. **Diseño:** 21 arquetipos de la sección 5 del plan, pares tipográficos, colores, radio, sombras, texturas y formato de tokens. Las tecnologías de estilo enumeradas en el prompt, como Tailwind, deben poder encontrarse.
6. **Seguridad:** sin autenticación, JWT con cookies HttpOnly, sesiones, OAuth2/social, API keys y RBAC; `--dry-run`, alcance/RoE, `.env.example` sanitizado, ocultación de tokens y validación de fronteras con Zod, Valibot o Pydantic según destino; reglas de código y diseño del RF-001-22.
7. **Flujo:** Vite, Cargo, Go Modules, uv, Poetry, Pip, Bun, pnpm, Turborepo; Vitest, Jest, Pytest, Go test, Playwright, Cypress; ESLint, Biome, Prettier, Ruff, Clippy, rustfmt; GitHub Pages, Vercel, Cloudflare Pages/Workers, Docker, VPS/systemd/Compose y binarios .deb/.tar.gz/.exe/.dmg.

El registro también incluye las tecnologías mencionadas en los conjuntos predefinidos y directivas técnicas del prompt. Una auditoría previa a implementar confirmará el conteo de 201 entradas únicas sin rellenarlo con duplicados. Cualquier tecnología adicional ajena a la fuente queda como propuesta para aprobación.

## 8. Ocho conjuntos predefinidos

| Nombre visible | Decisiones de destino |
|---|---|
| Web fullstack universal | Next.js 15 App Router, TypeScript, Tailwind, PostgreSQL, Prisma, Vitest. |
| SPA reactiva en el cliente | React 19, Vite, TypeScript, Tailwind, Zustand, LocalStorage. |
| CLI de sistemas de alto rendimiento | Rust, Cargo, Clap, Tokio, memoria, binario multiplataforma. |
| API moderna | Python, FastAPI, Pydantic v2, PostgreSQL, SQLAlchemy, Pytest, Docker. |
| Microservicio y redes en Go | Go 1.24; elección explícita Chi/Gin y SQLite/PostgreSQL; Redis, Docker, Go test. |
| Contenido editorial estático | Astro 5, Tailwind, Markdown/MDX, sin backend, GitHub Pages. |
| Herramienta de seguridad y pruebas de penetración | Python, Typer, Rich, Scapy, Requests; simulación obligatoria y protección de secretos. |
| Motor de juego independiente | Elección explícita Godot 4 o Rust/Bevy; FSM, delta independiente de fotogramas, buses de audio. |

Las alternativas separadas por barra no se activan todas a la vez. Las versiones mencionadas pertenecen a la fuente, no son afirmaciones sobre la versión más reciente.

## 9. Contratos de información y validación

No hay endpoints HTTP ni contratos de servidor en SDD-Studio. La autoridad de configuración es el estado local validado.

| Modelo | Campos y restricciones |
|---|---|
| Configuración | Versión de esquema, revisión creciente, nombre/identificador del proyecto, plataforma, arquitectura, lenguajes, runtimes, frameworks, almacenamiento, protocolos, estética, seguridad, flujo, alcance positivo y negativo. Cada selección conserva origen manual, conjunto o inferencia. |
| Entrada narrativa | Texto original, texto normalizado para análisis, límites declarados, señales detectadas. No se confunde el análisis con comprensión general del lenguaje. |
| Entrada de catálogo | ID estable, etiqueta española, producto técnico, categoría, alias, condiciones de compatibilidad e incompatibilidad. |
| Inferencia | Regla, rango del texto, candidato, fuerza determinista, explicación y estado aceptado/descartado. No se presenta la fuerza como probabilidad de IA. |
| Arquetipo | ID, nombre español, categoría, seis colores, acentos secundarios si existen, dos fuentes, radio, sombra y textura. |
| Documento | Ruta relativa permitida, contenido Markdown español, revisión, diagnósticos y decisiones pendientes. Los seis documentos comparten revisión. |
| Tarea generada | Identificador secuencial `[T1]`, referencias RF, dependencias, archivos previstos y condición verificable. Dependencias sin ciclos. |
| Borrador | Clave exclusiva de SDD-Studio, versión, fecha local, configuración e idea; no incluye credenciales ni caché de otros sitios. |

Límites propuestos: nombre de 1–80 caracteres; identificador de 1–64 en minúsculas, dígitos y guiones; idea hasta 20.000 caracteres; cada lista de alcance hasta 100 entradas de 500 caracteres; kit objetivo hasta 1 MiB de texto sin comprimir. Los excesos muestran error y preservan el texto para corrección. Estas cotas se revisan con la documentación, no se imponen como decisiones aprobadas.

El texto del usuario puede contener emojis o secretos: conservarlo temporalmente para permitir su corrección, señalar el problema y bloquear guardado/exportación de ese contenido hasta corregirlo. Nunca modificar silenciosamente su significado. Los textos fijos creados por la aplicación cumplen la prohibición desde su origen. Markdown con HTML, enlaces peligrosos o nombres de archivo arbitrarios no se ejecuta ni amplía la lista de rutas permitidas.

## 10. Estados, accesibilidad y recuperación

| Estado | Respuesta observable |
|---|---|
| Inicial/vacío | Invitación en español a describir la idea; documentos estructurales con «Pendiente de definir»; no se inventa un proyecto. |
| Puntero/foco/pulsación | Feedback contenido, foco AA visible, acción seleccionada distinguible además del color. |
| Generación pendiente | Se conserva la revisión anterior con «Actualizando documentos»; se deshabilita exportar una revisión desactualizada. |
| Sin resultados | La paleta explica que no hay coincidencias y permite cambiar la consulta. |
| Conflicto o datos incompletos | Se muestran causas y opciones de resolución; faltantes pueden exportarse como pendientes explícitos, contradicciones no. |
| Error del trabajador | Mensaje y reintento; entrada intacta, sin declarar actualizados los documentos antiguos. |
| Portapapeles/almacenamiento restringido | Copia manual o sesión en memoria con explicación visible. |
| Exportación | Botón ocupado evita duplicados; éxito anunciado; error permite volver a intentar. |
| Sin red | El estudio preparado sigue activo; si faltan recursos, informa que requiere completar la primera carga. |

Acordeones con controles y relaciones semánticas; pestañas con navegación por flechas; paleta y confirmaciones con foco confinado, Escape y retorno al invocador; árbol con flechas y expansión; avisos mediante región viva sin anunciar cada carácter. Cmd/Ctrl + 1…7 se atiende cuando el área Configuración está activa y sin interceptar escritura o combinaciones ajenas; los controles visibles cubren navegadores que reservan esos atajos.

## 11. Aceptación y objetivos de calidad

Los requisitos de rendimiento del prompt son metas exigibles y deben medirse; no se declara que una tecnología garantice 60 FPS. Propuesta de referencia: Chromium estable, portátil de cuatro núcleos y 8 GB o superior, pantalla 60 Hz, compilación de producción; pruebas móviles adicionales registran dispositivo real o emulación. Es necesario aprobar y registrar el entorno antes de aceptar cifras.

| Criterio | Dado / cuando | Resultado y evidencia futura |
|---|---|---|
| CA-01 · RF-01…05 | Recorrer fases, seleccionar CLI y buscar «tailwnd» | Siete fases accesibles; CSS inaplicable excluido; coincidencia Tailwind; inventario ≥201 y ocho conjuntos completos. |
| CA-02 · RF-06…08 | Escribir «reservas en pyton, sin Firebase» | Python inferido si compatible y no manual; Firebase excluido; sugerencia de persistencia visible y aceptable. |
| CA-03 · RF-03/04/07 | Inferencia contradice una decisión manual o conjunto reemplaza selección | Decisión manual preservada; conflicto explicado; confirmación/cancelación conserva coherencia. |
| CA-04 · RF-09/16 | Seleccionar cada arquetipo y exportar tokens | Exactamente 21 fichas; tokens del plan preservados; contraste calculado sin etiquetas falsas; formatos adecuados al destino. |
| CA-05 · RF-10…12/28 | Cambiar configuración y abrir/copiar cada documento | Seis rutas y revisiones coherentes; español; criterios RF, tareas con dependencias y parada DOCUMENT explícita. |
| CA-06 · RF-13 | Resolver los seis pilares, luego introducir un conflicto | Madurez pasa a 100 % con decisiones aplicables y baja al invalidarse un pilar; explicación de puntuación. |
| CA-07 · RF-14/15/17 | Copiar maestro, descargar ZIP y generar preparación | Copia verificable; ZIP descomprimible con rutas exactas; comando seguro mostrado sin ejecutarse. |
| CA-08 · RF-18/19 | Recargar sin red tras primera carga; simular cuota y borrador corrupto | Recursos locales, edición y exportación activas; errores recuperables; ninguna petición de datos del proyecto. |
| CA-09 · RF-20/24 | Usar 375, 767, 768, 1279, 1280 y 1440 px, teclado y zoom 200 % | Layout correcto; sin overflow de página ni acciones ocultas; objetivos ≥44 × 44; foco y lectura accesibles. |
| CA-10 · RF-21/22/23 | Introducir HTML malicioso, rutas externas, emojis o secreto de muestra | HTML inerte; rutas rechazadas; aviso y bloqueo de exportación/persistencia hasta corrección; reglas españolas y sin emojis. |
| CA-11 · RF-25 | Escribir 200 eventos en una idea de 20.000 caracteres con catálogo completo | Trabajo síncrono de entrada p95 <16 ms; ninguna tarea larga >50 ms atribuible a compilación; comparación mediante trazas. |
| CA-12 · RF-25 | Cambiar un conjunto 30 veces y dejar de escribir | Actualización visual de controles p95 <16 ms; kit coherente disponible como objetivo p95 ≤150 ms desde la última edición; se mide aparte de la entrada. |
| CA-13 · RF-15/25 | Exportar 30 kits de referencia de seis documentos y ≤250 KiB | Empaquetado en memoria p95 <100 ms con JSZip, excluyendo diálogo/guardado del sistema; documentar también caso de 1 MiB sin atribuirle ese presupuesto. |
| CA-14 · RF-26 | Ejecutar análisis, pruebas y `npm run build`; servir `dist/` en subruta | Build estático, sin backend, trabajador/caché/rutas de recursos operativos en GitHub Pages. |
| CA-15 · RF-27/29 | Revisar guía e historial del hito | README contiene ambos apartados exigidos; commit y sincronización registrados con evidencia real. |

El índice abreviado RF-01 significa RF-001-01, y así sucesivamente. Las pruebas no se han ejecutado: son criterios previstos para fases autorizadas posteriores.

## 12. README y documentación futura

El README final, íntegramente en español, incluirá «Cómo Utilizar Apropiadamente la Herramienta para Sacarle el Máximo Provecho»: definición conceptual, refinamiento de fases/sugerencias, selección estética/tokens y entrega al agente con revisión DOCUMENT antes de código; búsqueda y atajos; ejemplos de alcance negativo.

«Limitaciones y Alcance del Generador» explicará determinismo local, ausencia de tokens de IA, preparación inicial para recarga sin red, memoria/localStorage, imposibilidad de ejecutar o compilar aplicaciones objetivo, necesidad de juicio humano y reglas de negocio aportadas. No presentará integración cloud ni capacidades de IA inexistentes.

## 13. Supuestos y decisiones pendientes

Propuestas revisables: React 19, Zustand, Web Worker, Radix UI, PrismJS, npm, Vitest, Playwright y ESLint entre las alternativas ya contempladas en el prompt; tema suizo del estudio; límites de entrada; presupuesto de medición; caché nativa mediante service worker. Las versiones exactas de dependencias se resolverán en implementación autorizada, sin modificar los presets versionados de la fuente.

Aspectos que requieren comprobarse antes de cerrar sus tareas: inventario ≥201 sin duplicados; licencia y disponibilidad local de cada fuente; contraste de todas las paletas (algunas combinaciones originales pueden fallar AA); adaptación de tokens a versiones Tailwind diferentes; alternativas de presets que requieren elección. El bloqueo común de toda tarea de código es la autorización explícita del usuario.

## 14. Historial

2026-10-06: primera documentación de alcance completo a partir de `prompt.txt`. Revisión y autorización pendientes. No se ha escrito código de aplicación ni instalado dependencias.

2026-10-06: aprobación formal sin objeciones y autorización de Fase 2. Sustituciones tipográficas posteriores aprobadas en D-014, D-016 y D-017. La aceptación final del producto sigue pendiente.

## RF-30 — Ecosistema Django (ampliación autorizada)

Solicitud explícita del usuario el 2026-10-06: hacer localizable Django e incorporar opciones de API y complementos según su función. Django permanece como framework de servidor Python; se explican los filtros por lenguaje y arquitectura. API: Django REST Framework y Django Ninja. Complementos: Channels, Celery, django-filter, drf-spectacular y django-cors-headers. Identidad: django-allauth y Simple JWT. Persistencia: Django ORM; presentación: plantillas Django; pruebas: pytest-django. Son opciones del proyecto objetivo, sin instalar Django ni servicios en el estudio.

Aceptación: las opciones aparecen en sus fases correspondientes al seleccionar Django con Python y una arquitectura de servidor; drf-spectacular y Simple JWT requieren REST Framework. Cambiar el framework o la API preserva selecciones manuales y muestra incompatibilidades que bloquean exportación. El kit declara las selecciones y propone estructura Django.
