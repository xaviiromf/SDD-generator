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

## Verificaciones pendientes antes de cerrar tareas

- Inventario ≥201 entradas únicas: requiere auditoría de cobertura; no se acepta completar el conteo mediante alias.
- Licencias y disponibilidad de todas las fuentes: cualquier sustitución necesita revisión explícita.
- Contraste de arquetipos: conservar valores fuente y mostrar fallos; ajustes accesibles requieren decisión visible.
- Compatibilidad de exportaciones Tailwind y variantes de presets: no asumir versiones universales ni seleccionar alternativas simultáneamente.

Estas verificaciones no impiden entregar la documentación. La autorización general ya está registrada. Las sustituciones tipográficas fuera del plan siguen requiriendo revisión específica.

## D-014 — Sustitución tipográfica autorizada

2026-10-06: el usuario autorizó sustituir Neue Montreal por General Sans en A20. Fuente de auditoría: https://pangrampangram.com/products/neue-montreal y https://www.fontshare.com/licenses/itf-ffl. El catálogo y los tokens reflejarán General Sans, sin atribuirle el nombre de la fuente anterior.

## D-015 — Inventario comprobado

215 opciones únicas de las categorías y arquetipos indicados en el prompt; siete fases y alias independientes. Se incluyen las decisiones de integridad y guardrails como opciones, sin añadir frameworks ajenos a la fuente.
