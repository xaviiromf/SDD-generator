# Registro de decisiones

Fecha: 2026-10-06. El usuario aprobó el plan completo y autorizó implementación el 2026-10-06.

## Indicaciones confirmadas por el usuario y su fuente

| ID | Decisión | Evidencia y efecto |
|---|---|---|
| D-001 | Trabajar únicamente en DOCUMENT y detenerse al terminar | Solicitud del usuario; prohibición de escribir código o instalar paquetes hasta autorización posterior. |
| D-002 | Aplicar el marco SDD-AI-FULLSTACK real | El prompt apunta a `/home/xavi/Projects/SDDs/SDD-AI-FULLSTACK`; la ruta con espacio no existe. Se usa `01-specify.md` como guía existente equivalente al nombre ausente. |
| D-003 | Guardar los tres documentos directamente en `specs/` | Rutas explícitas de `prompt.txt` prevalecen sobre el ejemplo de carpeta numerada del marco. Se conservan IDs de especificación 001. |
| D-004 | Mantener la aplicación cliente y determinista | Mandato del prompt: sin backend, APIs de IA, secretos operativos ni tokens; las tecnologías del catálogo pertenecen al destino generado. |
| D-005 | Español, cero emojis y tres rangos responsivos exactos | Reglas del prompt; móviles <768, tablet 768–1279 y escritorio ≥1280; objetivos interactivos ≥44 × 44 px. Fuente inglesa original preservada como entrada del usuario. |
| D-006 | Gestionar Git y sincronizar hitos al remoto indicado | Mandato de `prompt.txt`; conservar historial y evitar push forzado; sincronización documental no implica publicación web. |

## Propuestas aprobadas el 2026-10-06

| ID | Propuesta | Motivo / impacto |
|---|---|---|
| D-007 | React 19, Zustand y Web Worker | Alternativas incluidas en la fuente; aislamiento del editor, compilación fuera del hilo principal y control de revisiones. |
| D-008 | Radix UI, PrismJS, npm, ESLint, Vitest y Playwright | Alternativas permitidas por el prompt; reducir duplicación de soluciones, limitar gramáticas y verificar comportamiento crítico. Versiones exactas pendientes. |
| D-009 | Tema suizo para el estudio, independiente del arquetipo exportado | Identidad técnica deliberada y coherente; suscripción de estética del destino no cambia todo el estudio. |
| D-010 | Service worker nativo, manifiesto de build y fuentes locales | Necesarios para recarga offline tras primera carga; sin librería PWA ni CDN. Derechos tipográficos deben verificarse. |
| D-011 | Límites de entrada y presupuesto reproducible de rendimiento | Idea ≤20.000 caracteres y kit ≤1 MiB como propuesta; p95 de ingreso/controles <16 ms, kit objetivo ≤150 ms y ZIP de referencia <100 ms con límites definidos. |
| D-012 | Visor de Markdown como texto resaltado | Satisface inspección/copias sin introducir parser adicional ni interpretar HTML del usuario. |
| D-013 | Prioridad manual > conjunto > inferencia, con conflictos visibles | Evitar sobrescribir decisiones y mezclar revisiones; reemplazos por conjuntos requieren confirmación dentro del producto. |

## Verificaciones exigidas por el plan

- Inventario ≥201 entradas únicas: requiere auditoría de cobertura; no se acepta completar el conteo mediante alias.
- Licencias y disponibilidad de todas las fuentes: cualquier sustitución necesita revisión explícita.
- Contraste de arquetipos: conservar valores fuente y mostrar fallos; ajustes accesibles requieren decisión visible.
- Compatibilidad de exportaciones Tailwind y variantes de presets: no asumir versiones universales ni seleccionar alternativas simultáneamente.

Estas verificaciones se completaron durante la implementación: véase validation.md. La autorización general y las sustituciones tipográficas específicas quedaron registradas. Los apartados D-014…16 conservan las decisiones intermedias; D-017/18 describen el catálogo final.

## D-014 — Sustitución tipográfica autorizada

2026-10-06: el usuario autorizó sustituir Neue Montreal por General Sans en A20. Fuente de auditoría: https://pangrampangram.com/products/neue-montreal y https://www.fontshare.com/licenses/itf-ffl. El catálogo y los tokens reflejarán General Sans, sin atribuirle el nombre de la fuente anterior.

## D-015 — Inventario comprobado

215 opciones únicas de las categorías y arquetipos indicados en el prompt; siete fases y alias independientes. Se incluyen las decisiones de integridad y guardrails como opciones, sin añadir frameworks ajenos a la fuente.

## D-016 — Familia japonesa concretada

2026-10-06: el usuario aprobó Zen Kaku Gothic New. Se distribuyen localmente las 36 familias seleccionadas, con licencias OFL o ITF del proveedor. General Sans sustituye a Neue Montreal en A20.

## D-017 — Exclusión de fuentes ITF y limpieza autorizada

El usuario aprobó las seis sustituciones OFL y autorizó reconstruir únicamente el primer commit de implementación con --force-with-lease. Se conserva íntegramente el historial documental anterior. Cabinet Grotesk → Space Grotesk; Satoshi → Manrope; Clash Display → Syne; General Sans → Inter; Switzer → Public Sans; Bespoke Serif → Cormorant Garamond. Las licencias ITF descargadas restringen la redistribución y el uso como fuentes seleccionables en herramientas de generación.

## D-018 — Inventario y distribución finales

La auditoría final verifica 225 opciones únicas, siete fases, ocho conjuntos y 21 arquetipos. El inventario incluye las herramientas de estado, primitivas, resaltado y empaquetado mencionadas en el prompt. Se distribuyen 30 familias con licencia OFL, en 60 archivos WOFF2 para los subconjuntos latino y latino extendido; no quedan archivos ITF en los commits alcanzables de main. Las licencias originales se conservan. Versiones exactas de la aplicación fijadas en package-lock.json.

La funcionalidad y las comprobaciones técnicas están terminadas. La tarea de accesibilidad permanece abierta por falta de una sesión con lector de pantalla real; sus tareas dependientes tampoco se dan por cerradas.

## D-019 — Ecosistema Django autorizado

Solicitud del usuario: hacer localizable Django e incorporar sus APIs y complementos. Django ya existía como framework de servidor Python, filtrado por lenguaje/arquitectura. Se aclara la interfaz y se añaden 12 opciones por función: el catálogo pasa de 225 a 237 IDs. Campos opcionales api/addons conservan compatibilidad con borradores previos; los prerrequisitos controlan visibilidad y exportación. No se instalan paquetes Django en el estudio.

Fuentes oficiales consultadas: [DRF](https://www.django-rest-framework.org/), [Django Ninja](https://django-ninja.dev/), [Channels](https://channels.readthedocs.io/en/stable/), [Celery](https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html), [django-filter](https://django-filter.readthedocs.io/en/stable/), [drf-spectacular](https://drf-spectacular.readthedocs.io/en/latest/), [CORS](https://github.com/adamchainz/django-cors-headers), [allauth](https://docs.allauth.org/en/latest/), [Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/en/latest/), [pytest-django](https://pytest-django.readthedocs.io/en/latest/), [plantillas Django](https://docs.djangoproject.com/en/stable/topics/templates/). Versiones y contratos del destino siguen pendientes de definición en cada proyecto generado.

## D-020 — Propuesta de estructura completa, pendiente de revisión

El usuario solicita planificar todos los archivos restantes del kit, mantener la estructura del marco y adaptar contenido al SDD configurado. Autoriza documentación y exige esperar instrucciones después de entregarla. Propuesta detallada en specs/002-kit-completo: 30 archivos base más cuatro activos (34), carpeta 001-<slug>, manifiesto único, contexto común, arquitectura/tareas compartidas y validation inicial no ejecutado. Se preservan la pila, configuración, restricciones y pendientes de 001. El cambio de contrato de seis archivos se aplicará solo después de aprobación e implementación autorizada.

## D-021 — Ejecución de 002 y exclusión del repositorio

El usuario autoriza ejecutar el plan completo y exige ignorar toda su carpeta documental. El contrato vigente pasa a 34 documentos, manteniendo la pila y los límites del estudio. Manifiesto, contexto y perfiles de destino gobiernan generación, navegación y ZIP; decisiones/evidencia del objetivo empiezan pendientes. La carpeta local se retira del índice y se ignora; su presencia en ee2470b precede a esta instrucción y no se elimina mediante una reescritura no autorizada. Los resultados técnicos generales constan en el estado público; documentación detallada de 002 permanece local.

## D-022 — Idiomas independientes autorizados

El usuario solicita dos interruptores en el header: idioma del SDD y de la UI, cada uno español/inglés. Esta instrucción sustituye el idioma único de D-005 y RF-001-21 para el producto y el contenido generado. Confirmó conservar literalmente sus textos; no se agregan traductores externos, APIs ni dependencias.

La UI persiste su preferencia en una clave separada; Configuration añade sddLanguage opcional con migración de borradores previos a es. Cambiar UI no incrementa revisión ni recompila. El renderer traduce exclusivamente fragmentos literales de las plantillas y metadatos controlados; las interpolaciones del usuario permanecen intactas. Las políticas de idioma de constitution/AGENTS/prompts y la decisión de integridad siguen el idioma del kit, aunque la UI sea distinta. Los 34 nombres y rutas del marco no se renombran. Los tokens JSON usan metadatos españoles o ingleses según el kit; variables CSS e identificadores técnicos permanecen estables.

## D-023 — Propuesta 004, español y MCP opcional

2026-10-07: el usuario requiere DOCUMENT y AGENTS.md primero, resumen y parada antes de aplicación. Se proponen cuatro mejoras y contratos de frontera sin paquetes nuevos. Español integral sustituirá los controles ES/EN de D-022 al aprobarse el plan; la app actual sigue en el hito anterior. La transmisión MCP será opcional y explícita; el motor local seguirá siendo completo, con plazo remoto de 1500 ms. No se añade servidor/modelo ni se garantiza precisión por utilizar MCP. Diseño personal y arquetipo se resuelven en un único modelo; navegar en carrusel no selecciona. Criterios y contrato detallados en specs/spec.md y plan.md, apartado 004. Decisiones propuestas pendientes de autorización; se conserva historial y exclusión de 002.

## D-024 — Aprobación y ejecución formal de 004

2026-10-07: el usuario aprueba AGENTS.md, spec, plan, tasks y matriz por dominios, autoriza T-004-04…23 y el push del hito final. Confirma retirar ES/EN y fijar UI/documentación/kits en español conservando datos existentes; esta decisión sustituye D-022 para el producto vigente. D-023 conserva el contexto de planificación anterior, ya autorizado mediante esta decisión.

Se implementa transporte nativo HTTP/SSE sin paquetes nuevos, consentido y acotado a 1500 ms; la inferencia llega al trabajador como DTO validado y el motor mantiene fallback local. La generación de solicitudes evita aceptar resultados anteriores al cambio de preferencias incluso con revisión de borrador idéntica. Diseño efectivo único, tokens y recetas compartidos; carrusel con selección explícita y protección de ajustes. Las comprobaciones con servidores simulados no garantizan precisión de un modelo real. Se mantienen la exclusión de 002, las tareas manuales históricas y la separación entre verificación técnica, aceptación y despliegue.

## D-025 — Alcance 005 aprobado y modelo canónico local

2026-10-08: el usuario autoriza exclusivamente H0, H1 y H2. Se añade ProjectDefinition schemaVersion 1 al borrador actual: requisitos, criterios y contexto con IDs estables, estado, origen y referencias; migración aditiva sin servicios ni paquetes nuevos. La proyección comparte revisión y conserva 34 rutas, validaciones inicialmente no ejecutadas y textos aportados. Cobertura de configuración, calidad estructural y preparación se presentan separadas; revisión humana y autorización de código permanecen explícitas. H3, H4 y H5 siguen pospuestos.

Los límites son 256 KiB de modelo y 1 MiB de kit, cien requisitos y elementos por colección, diez criterios/excepciones por requisito. MCP mantiene idea/exclusiones, activación voluntaria y 1500 ms; los nuevos campos no amplían su transmisión. Borradores incompletos se conservan; referencias inválidas, secretos o rutas inseguras se rechazan. Permitir conflictos tecnológicos para revisión exige consentimiento y conserva los bloqueos de seguridad.

## D-026 — Evaluación técnica sin participantes

El usuario declara que no dispone de participantes y solicita otra manera de medir tiempo y correcciones. Se autoriza un banco automatizado entre el commit anterior y H2 con los mismos hechos de doce casos, generación/ZIP cronometrados y siete comprobaciones estructurales. Los hallazgos pendientes no representan acciones de corrección humanas ni prueban ahorro del 25 %. Método, condiciones y resultados en specs/005-generador-profesional/corpus.md. No se sustituye la aceptación del cliente ni la revisión semántica.

## D-027 — H3 autorizado: continuidad local y conservación explícita

2026-10-08: el usuario autoriza exclusivamente T-005-20…24 y el cierre 35. H4/H5 permanecen pospuestos. Se implementa una biblioteca schemaVersion 1 con hasta 20 proyectos, cinco versiones explícitas por proyecto y presupuesto local de 2 MiB UTF-16; configuraciones de hasta 512 KiB UTF-8 e importación JSON de hasta 2 MiB UTF-8. No se añaden paquetes, servidor ni sincronización de cuentas.

La validación nativa fuera del hilo de UI precede a las escrituras. Una cola por pestaña, comparación del registro anterior y Web Locks donde exista protegen la revisión; sin Web Locks la comprobación y escritura ocurren en el mismo turno, sin prometer exclusión atómica entre procesos. Si cambia la biblioteca en otra pestaña se bloquea la sustitución automática y se conserva la edición. Un registro de procedencia recupera la edición pendiente del proyecto activo o la conserva como copia ante una revisión ajena. El autoguardado no interrumpe acciones de puntero. El respaldo completo no exige guardar antes: incluye la edición activa y permite recuperar datos ante cuota o conflicto.

Importar crea copias por defecto. Sustituir exige comparación y confirmación, conservando otra copia del registro anterior; una cuota insuficiente rechaza toda la operación. Recuperar una versión conserva previamente el borrador como versión explícita. No se purgan proyectos/versiones para hacer espacio. Datos corruptos, campos desconocidos, prototipos peligrosos, referencias inválidas, textos inseguros y formatos incompatibles se rechazan sin borrar el registro original.

Las aportaciones manuales son bloques separados por destino, con texto literal preservado. Un cambio de sección deja la generación pendiente hasta resolver mantener o trasladar al final; nunca se sobrescribe el texto del usuario. El grafo H2 conserva su modelo canónico y no inventa requisitos a partir de notas libres. Verificación y límites reales en specs/005-generador-profesional/validation.md; aceptación humana y despliegue no incluidos.

## D-028 — H4 autorizado: datos declarativos y contexto por tarea

2026-10-08: el usuario autoriza exclusivamente T-005-25…29 y el cierre 35. H5 y adaptadores OpenAPI/AsyncAPI permanecen pospuestos. Configuration.profile schemaVersion 1 es opcional y aditivo: hasta diez perfiles, veinte componentes, cincuenta tecnologías y 128 KiB UTF-8. Las instantáneas de perfiles integrados se conservan con versión/fuentes/fecha; perfiles propios son datos con claves, vocabularios y tamaños acotados, sin evaluación de expresiones ni código ejecutable. No se agregan paquetes ni llamadas automáticas a fuentes.

«Verificada» corresponde solo a estructura/proyección de instantáneas integradas exactas; no verifica una tecnología, implementación ni compatibilidad real. Las declaraciones propias no pueden promoverse a ese estado ni colisionar con IDs del catálogo. Campos pendientes y antigüedad se muestran con incertidumbre. Versiones/fechas declaradas no se sustituyen automáticamente por otras recientes.

Los componentes explicitan responsabilidades, perfil y dependencias acíclicas; los RF usan sus IDs canónicos. La sincronización transaccional conserva referencias y rechaza eliminaciones que las rompan. Si un componente contradice el contexto canónico, la exportación/recuperación segura se bloquean; falta de enlace se mantiene como pendiente. Modo documental desactiva tareas de software sin borrar selecciones; ampliación/migración no propone reinicializar lo existente. Un destino propio no recibe una receta web inferida por defecto.

Se incluyen paquetes por tarea dentro de los 34 archivos: tres entradas como máximo, objetivo, contratos, dominio, archivos permitidos, dependencias, criterios y aprobación explícita. Tareas con archivos de distintos dominios se separan y VALIDATE usa solo reportes. Los paquetes no contienen permisos ni resultados del estudio. UI usa módulos diferidos, selectores de propiedades y fichas con cambios aplicados al guardar; los campos locales pendientes no son parte del respaldo.

La recuperación histórica rechazaba cualquier diagnóstico; con perfiles se corrige a rechazar solo bloqueantes para conservar borradores con advertencias honestas. Evidencia, corpus y límites en specs/005-generador-profesional/validation.md; revisión semántica y aceptación siguen siendo del cliente.


## D-029 — H1 de 006: Mermaid local y revisión explícita

H1/H2, Mermaid exacto 12.1.0 y commits/push separados fueron autorizados el 2026-10-08. H2 exige H1 sincronizado y árbol limpio. Parte 3 queda excluida y H5 de 005 pospuesto. [Decisiones D-006-01…08](../specs/006-diagramas-y-experiencia-visual/plan.md).

Las proyecciones provienen de hechos tipados, con cardinalidades ER explícitas y pendientes honestos; se añaden a cuatro destinos existentes sin ampliar las 34 rutas. El motor no importa Mermaid. El servicio diferido filtra fuentes/SVG, serializa render, acota caché y descarta tokens antiguos. El runtime en iframe local separa DOM/layout, sin atribuirle un hilo de CPU propio; el SVG visible usa Shadow DOM para limitar estilos. Arquitectura dividida en partes legibles conserva nodos/aristas y sus referencias. Ninguna vista previa escribe hasta aplicar; la vista anterior se identifica durante carga y sus exportaciones se suspenden.

La descarga usa SVG filtrado y canvas nativo para PNG, sin paquetes auxiliares. Precache incluye HTML técnico/chunks/fuentes, separado de ejecución. Los ensayos fallidos y tareas largas se conservan en evidencia; p95 <16 ms no garantiza cada evento. Manuales de lector de pantalla/ampliación/teléfono y aceptación humana permanecen pendientes. Sin despliegue ni backend.
