# Identidad y alcance del proyecto

Fecha: 2026-10-06. Estado: propuesto para revisión; aplicación no implementada.

| Campo | Detalle |
|---|---|
| Producto | SDD-Studio, generador local de desarrollo guiado por especificaciones. |
| Directorio de trabajo | `/home/xavi/Projects/SDD-generator`. |
| Marco rector | `/home/xavi/Projects/SDDs/SDD-AI-FULLSTACK`, utilizado por lectura. |
| Fuente de requisitos | [prompt.txt](../prompt.txt), preservado. |
| Usuarios | Desarrolladores independientes, arquitectos y equipos que entregan especificaciones a agentes. |
| Objetivo | Generar kits SDD coherentes en español sin backend ni consumo de tokens de IA. |
| Arquitectura requerida | SPA estática cliente, determinista, con memoria/localStorage y preparación para uso sin conexión. |
| Pila indicada en la fuente | React 19/18, TypeScript estricto, Vite, Tailwind, Zustand o Signals, lucide-react, primitivas accesibles, resaltado ligero, JSZip y FileSaver. |
| Alternativas propuestas para revisión | React 19, Zustand, Web Worker, Radix UI, PrismJS, npm, ESLint, Vitest y Playwright; service worker nativo. |
| Identidad visual propuesta | Precisión suiza para software: Geist Sans/Inter, azul #2D5CF6, fondo #111215, bordes técnicos; pendiente de aprobación. |
| Funciones en alcance | Siete fases, ≥201 entradas únicas por auditar, ocho conjuntos, 21 arquetipos, motor de intención local, seis documentos, árbol, madurez, copia, ZIP, tokens y comandos de preparación. |
| Exclusiones | Backend propio, cuentas, servicios IA, telemetría, ejecución/compilación del proyecto objetivo y lógica de negocio inventada. |
| Idioma e iconografía | Español integral; cero emojis en artefactos creados/exportados; iconos solo lucide-react. |
| Distribución prevista | `dist/`, alojamiento estático; compatibilidad con GitHub Pages y subruta `/SDD-generator/`. Publicación no realizada. |
| Repositorio solicitado | `https://github.com/xaviiromf/SDD-generator`. |
| Especificación activa | [spec.md](../specs/spec.md), [plan.md](../specs/plan.md), [tasks.md](../specs/tasks.md). |

Las tecnologías de servidor, sistemas y móviles del catálogo describen proyectos objetivo: no son dependencias operativas del estudio. El usuario debe revisar los documentos generados y autorizar código por separado. Las versiones exactas de paquetes y las licencias de fuentes se resolverán antes de sus tareas de implementación.
