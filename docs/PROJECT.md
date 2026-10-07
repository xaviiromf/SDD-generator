# Identidad y alcance del proyecto

Fecha: 2026-10-06. Estado: documentación aprobada e implementación funcional terminada; cierre de auditoría manual y aceptación pendientes.

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
| Pila aprobada e implementada | React 19, Zustand, Web Worker, Radix UI, PrismJS, npm, ESLint, Vitest y Playwright; service worker nativo. |
| Identidad visual implementada | Precisión suiza para software: Geist Sans/Inter, azul #2D5CF6, fondo #111215, bordes técnicos; aprobada por el usuario. |
| Funciones en alcance | Siete fases, 237 opciones únicas verificadas, ocho conjuntos, 21 arquetipos, motor de intención local, 34 documentos, árbol, madurez, copia, ZIP, tokens y comandos de preparación. |
| Exclusiones | Backend propio, cuentas, servicios IA, telemetría, ejecución/compilación del proyecto objetivo y lógica de negocio inventada. |
| Idioma e iconografía | Español integral; cero emojis en artefactos creados/exportados; iconos solo lucide-react. |
| Distribución prevista | `dist/`, alojamiento estático; compatibilidad con GitHub Pages y subruta `/SDD-generator/`. Publicación no realizada. |
| Repositorio solicitado | `https://github.com/xaviiromf/SDD-generator`. |
| Especificación implementada | [spec.md](../specs/spec.md), [plan.md](../specs/plan.md), [tasks.md](../specs/tasks.md). |

Las tecnologías de servidor, sistemas y móviles del catálogo describen proyectos objetivo: no son dependencias operativas del estudio. El usuario debe revisar los documentos generados y autorizar código por separado. Versiones exactas fijadas en package-lock.json; 30 fuentes OFL locales con sustituciones aprobadas. Evidencia y pendientes en specs/validation.md.

La ampliación 002 fue autorizada y reemplaza la exportación mínima por el kit completo. Su documentación detallada permanece local y excluida de Git por instrucción del usuario.
