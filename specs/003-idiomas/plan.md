# Plan — 003

Mantener React, Zustand, worker y exportación local sin dependencias nuevas. Usar catálogos de traducción explícitos y renderizado de fragmentos estáticos que preserve interpolaciones del usuario. UI con preferencia propia; idioma del SDD en Configuration, migrando borradores previos a es. Los templates y el contexto reciben ese idioma; las instrucciones de idioma del destino deben coincidir con él.

Añadir dos controles semánticos independientes al header y adaptar su disposición en móvil. Localizar mensajes del generador y servicios al mostrarlos con el idioma de UI. La búsqueda acepta nombres de catálogo en ambos idiomas. Mantener referencias, 34 rutas y selección activa.

Verificar con TypeScript, ESLint, Vitest, build y Playwright Chromium/Firefox, incluyendo la matriz de idiomas, ZIP/copia, migración, accesibilidad y rendimiento existente. Registrar resultados reales y sincronizar fuente y documentación pública con el remoto, conservando excluido specs/002-kit-completo/.
