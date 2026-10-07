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
