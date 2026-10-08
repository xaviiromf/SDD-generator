# Entorno y comandos de verificación

Fecha: 2026-10-06. Sistema local: Linux. Node 26.5.0, npm 11.17.0. Versiones exactas reproducibles en `package-lock.json`.

- `npm ci`: instalación desde archivo de bloqueo.
- `npm run dev`: desarrollo local, base `/SDD-generator/`.
- `npm run lint`: análisis ESLint.
- `npm run typecheck`: TypeScript estricto sin emisión.
- `npm run test`: Vitest; contratos, catálogo, reglas, compilador, trabajador, servicios y ZIP.
- `npm run build`: TypeScript y build Vite estático; incluye manifiesto/caché nativa.
- `npm run preview`: sirve el build localmente.
- `npm run test:e2e`: Playwright sobre producción, Chromium y Firefox.

Pruebas de rendimiento: 230 eventos de entrada con idea cercana a 20.000 caracteres; 30 muestras de disponibilidad documental; 30 cambios de conjunto; 30 ZIP medidos tras una preparación inicial. Se separan trabajo síncrono de evento, espera de revisión y empaquetado. Los escenarios se reproducen en `tests/e2e/performance.spec.ts` y `tests/unit/performance.test.ts`.

El presupuesto de 100 ms se refiere al empaquetado del kit de referencia, no a la carga inicial del módulo ni al diálogo de descarga del sistema. El service worker cachea archivos estáticos propios, incluidas fuentes y exportación diferida. La actualización no fuerza recarga durante la edición.

WebKit fue descargado, pero su inicio falla en esta máquina por ausencia de `libicu74` y `libflite1`; no se modificaron paquetes del sistema. Se ejecutan Chromium y Firefox y se conserva esa limitación en el informe.

No se ha desplegado el sitio. La sincronización Git está autorizada por el usuario y es independiente del alojamiento de producción.

## Evidencia de ampliación 004

2026-10-07, mismo entorno Node 26.5.0/npm 11.17.0. Build de producción en la subruta /SDD-generator/. Lint, TypeScript, 52 unitarias y build: código 0. Referencia Chromium: muestra de 200 ajustes p95 3,8 ms; seis áreas React ajenas sin renders adicionales; edición 1,7 ms, revisión documental 36,2 ms, conjuntos 9,6 ms, ZIP 10,7 ms. Casos Firefox funcionales; rendimiento medido solo en Chromium. Detalle y límites: specs/validation.md, apartado 004.

Los escenarios MCP incluyen un servidor local de pruebas con CORS/SSE reales; no prueban un modelo externo real. El plazo total de 1500 ms se verifica con reloj controlado y respuesta demorada en navegador. El token nunca se persiste ni se exporta. La captura de diseño a 320 px se inspeccionó como evidencia visual de reflujo, sin atribuir aceptación al usuario.

Suite final completa: 75 pruebas de navegador correctas, tres mediciones omitidas en Firefox, cero fallos/inestables y código 0; duración 178,92 s. Lint, TypeScript, 52 unitarias y build también correctos.
