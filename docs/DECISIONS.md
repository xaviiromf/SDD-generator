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
