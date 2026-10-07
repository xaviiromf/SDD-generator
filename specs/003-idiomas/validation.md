# Validación — 003 Idiomas independientes

Fecha: 2026-10-06. Implementación solicitada y autorizada por el usuario. Textos propios preservados por confirmación explícita. Verificación técnica terminada; no implica aceptación del usuario ni publicación.

| Comando / comprobación | Resultado real |
|---|---|
| npm run lint | Salida 0; sin errores |
| npm run typecheck | Salida 0; TypeScript estricto |
| npm run test | Salida 0; 35 pruebas, diez archivos |
| npm run build | Salida 0; build estático en subruta |
| npm run test:e2e | Salida 0; 50 pruebas pasan en Chromium/Firefox; dos mediciones omitidas en Firefox |
| git diff --check | Salida 0 |

## Criterios comprobados

- RF-003-01: siete fases, catálogo, arquetipos, diálogos, estados, errores, búsqueda y nombres accesibles en inglés; español previo conserva los recorridos de regresión. lang y título de página cambian con UI.
- RF-003-02: los 34 documentos de ocho conjuntos cambian su contenido propio al inglés, conservando rutas y referencias válidas. Django/plantillas/API y familias CLI/nativas usan sus instrucciones apropiadas. Constitution, AGENTS, manuales y prompts exigen el idioma elegido. ZIP del navegador coincide con los 34 contenidos del visor; copia del maestro coincide con el archivo. Comentarios de preparación y metadatos JSON/Tailwind de tokens traducidos.
- RF-003-03: es/es, en/es, en/en y es/en comprobados en ambos navegadores. UI no modifica Configuration ni revisión; SDD incrementa revisión y conserva decisiones/documento. Preferencias recuperadas tras recarga y cambios offline.
- RF-003-04: nombres, idea y alcance preservados incluso cuando coinciden exactamente con claves del catálogo; HTML continúa escapado. RF/T, comandos, rutas y productos permanecen técnicos. Solo se traducen fragmentos literales y metadatos controlados; ninguna llamada externa.
- RF-003-05: borrador anterior válido sin sddLanguage recuperado como es; valores inválidos rechazados. Controles accesibles como switches con descripción ES/EN, Space/Enter, tamaño mínimo 44 px y sin desbordamiento a 320,375,768,1440 px. Almacenamiento restringido permite uso en memoria.

El visor declara su propio lang, independientemente del idioma de la página. Capturas inspeccionadas: [escritorio en inglés](../../docs/evidence/idiomas-escritorio.png) y [UI inglesa con SDD español en móvil](../../docs/evidence/idiomas-movil.png).

## Rendimiento y límites

Referencia Chromium de la suite: ingreso p95 1,3 ms; generación 39 ms (30 muestras); conjuntos 10,9 ms y ZIP 9,5 ms. Ninguna tarea larga registrada en ese escenario. Comprobación adicional de 30 revisiones con UI/SDD ingleses y entrada cercana a 20.000 caracteres: kit p95 54,7 ms, dentro del objetivo 150 ms. Estas mediciones corresponden al entorno local, sin garantía universal.

Build principal 458,89 kB (gzip 146,98); worker 157,51 kB; ZIP continúa diferido. No se añadieron dependencias. Catálogos explícitos completos para los fragmentos existentes, con metadatos y prose de perfiles comprobados. Nuevos textos deben incorporar su traducción.

La primera prueba de UI inglesa falló por consultar también regiones de acordeón ocultas; el localizador se restringió a la región abierta. La ejecución completa posterior pasa. Los límites manuales originales (lector de pantalla real, ampliación real, teléfono físico y WebKit sin dependencias del sistema) siguen pendientes; no se presentan como comprobados aquí.

## Preservación

specs/002-kit-completo/ permanece ignorado y sin archivos seguidos; no se publica documentación de esa carpeta ni se reescribe historial. Cambios y documentación pública de 003 se sincronizan mediante push normal. No se despliega un sitio.
