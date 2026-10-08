# Verificación ejecutada — 005, H0–H2

Fecha: 2026-10-08. Implementación H0–H2 autorizada por el usuario. T-005-02…19 verificadas dentro de sus límites técnicos; T-005-35 consolida y sincroniza. H3–H5 y tareas 20…34 pospuestas. La aprobación del plan no equivale a aceptación del producto. No se despliega un sitio.

## Entorno y comandos

Linux x86_64, Intel Core i5-1235U, Node 26.5.0, npm 11.17.0. Builds de producción servidos localmente en la subruta del estudio. Navegadores Playwright Chromium 153 y Firefox. Dependencias y manifiestos sin cambios; no se instalan paquetes nuevos.

| Comprobación ejecutada | Resultado |
|---|---|
| npm test | 76 pruebas correctas, 19 archivos, código 0 |
| npm run lint | Código 0 tras declarar los globales del banco de pruebas |
| npm run build | TypeScript estricto y Vite correctos, código 0 |
| npm run test:e2e | 87 correctas, 3 omitidas en Firefox, 0 fallos; 90 casos, 3,6 minutos |
| node tests/benchmarks/projectComparison.mjs | Doce casos en ambas versiones, 60 muestras por versión y 30 de volumen, código 0 |
| Auditoría Unicode de archivos de texto propios | 185 archivos en ese momento, cero archivos con emojis |
| git diff --check | Correcto tras retirar dos espacios finales |
| Exclusión 002 | git check-ignore confirma ruta ignorada; git ls-files no devuelve archivos de esa carpeta |

Los avisos experimentales de localStorage de Node y NO_COLOR/FORCE_COLOR del ejecutor no producen fallos. El primer build del bloque avisó de 513,50 kB en el paquete principal: los paneles nuevos se dividieron mediante carga diferida. Build final sin ese aviso: principal 499,18 kB (161,46 kB comprimido), trabajador 185,13 kB, editor 11,56 kB, revisión 2,93 kB y CSS 32,31 kB.

## Evidencia funcional

H0: corpus de doce entradas ficticias, oráculos y rúbrica congelados antes de modificar el motor; base inicial de doce ZIP de 34 archivos. Esa base solo comprueba presencia literal y estructura; las frases exactas del oráculo no estaban siempre ingresadas en la idea. La comparación posterior subsana esta diferencia entregando los mismos hechos completos a ambas versiones.

H1: pruebas de modelo/versiones/estados, IDs duplicados, referencias de tipos incorrectos, límites, secretos aparentes, textos con emojis y borradores incompletos. Migración aditiva del único borrador: preserva texto, selecciones, diseño y el registro original cuando la entrada es inválida. Acciones probadas para reordenación con IDs estables, referencia que impide eliminar un actor y límites sin publicar una revisión inválida. Flujo de navegador: crear actor, requisito y criterio, exportar, verificar el ZIP y recuperar el borrador.

H2: los doce casos conservan actor, comportamiento, criterio y excepción aportados; misma revisión y salida determinista, 34 documentos, cero referencias rotas y criterio enlazado a tareas/trazabilidad. Se comprueban estados pendientes, contradicciones literales conocidas y distinción entre calidad estructural, configuración y revisión. El modo documental explícito no propone rutas de código ni habilita preparación de software. La exportación con conflicto tecnológico requiere consentimiento de borrador; ese consentimiento conserva los bloqueos por ruta insegura y secreto. Los registros del proyecto objetivo permanecen «No ejecutado».

Regresión: catálogo/Django, idiomas históricos migrados a español, carrusel/diseño, fuentes locales, recuperación de trabajador, HTML literal, portapapeles denegado, caché actualizada, exportación sin red, teclado/foco y reflujo. Nuevos controles comprobados a 375, 768 y 1280 px; recorridos existentes a 320, 375, 767, 768, 1279, 1280 y 1440 px.

MCP conserva activación opcional, prioridad manual, privacidad, HTTP/SSE, abandono al desactivar, carrera de preferencias y fallback máximo de 1500 ms. Las pruebas unitarias usan reloj controlado y las de navegador servidores simulados con CORS. No se ha evaluado un proveedor/modelo externo real ni se envían los nuevos requisitos estructurados.

## Mediciones observadas

| Escenario Chromium | Muestras | p95 |
|---|---|---|
| Eventos de entrada / procesamiento local | 230 | 2,6 ms |
| Generación de referencia con idea extensa | 30 | 43,5 ms |
| Aplicación de conjuntos | 30 | 14,1 ms |
| Empaquetado ZIP de referencia | 30 | 11,3 ms |
| Sandbox de diseño | 200 | 6,2 ms |
| Generación H2, corpus completo | 60 | 48,0 ms |
| Generación H2, cien requisitos | 30 | 68,2 ms |

El escenario de entrada no registra tareas largas. Los 200 ajustes de estética producen cero renders adicionales en raíz, cabecera, idea, árbol, madurez y configuración según la instrumentación React. Las tres mediciones de referencia se omiten deliberadamente en Firefox; no se presentan como ejecutadas allí. Son mediciones del entorno, sin promesa universal de FPS o latencia.

## T-005-19: alternativa autorizada sin participantes

El usuario informó que no dispone de participantes y pidió otra manera de medir tiempo y correcciones. [corpus.md](corpus.md) describe el banco comparativo, y [fixtures/comparison.json](fixtures/comparison.json) conserva los resultados por caso. Ambas versiones reciben los mismos hechos y decisiones manuales; H2 utiliza además su representación estructurada. Datos preparados automáticamente: se excluyen entrevista, carga manual y revisión humana.

Generación mediana/p95: anterior 35,7/46,6 ms; H2 35,9/48,0 ms. Empaquetado ZIP mediana/p95: anterior 7,5/19,3 ms; H2 8,8/18,1 ms. Hallazgos estructurales pendientes: 60 frente a 0, cinco por caso referidos a IDs y enlaces RF/criterio/tarea/validación; ambas versiones conservan los hechos literales y el manifiesto de 34 archivos. Se midió empaquetado en memoria, sin tiempo de descarga de red.

Un hallazgo es una propiedad estructural pendiente, no una acción manual ni una corrección semántica independiente. La diferencia temporal no demuestra aceleración y no se ha medido ahorro humano del 25 %. No se asignan puntuaciones completas de la rúbrica ni se inventan participantes. Se entrega H2 para revisión del cliente, con esta limitación explícita.

## Límites y pendientes

Revisión semántica del corpus y de cada proyecto generado, aceptación del cliente, lector de pantalla real, ampliación real del navegador y teléfono físico pendientes. La evidencia automatizada no verifica adecuación especializada de móvil/API, protocolos propios o cualquier dominio imaginable; H4 sigue pospuesto. El detector cubre contradicciones conocidas y literales, no semántica universal. No se desarrolla importación/multiproyecto/diffs de H3 ni adaptadores de H5. No se ejecuta código de un proyecto generado.

## Sincronización

T-005-35: push normal al remoto existente después de las comprobaciones; registrar confirmación y commit en docs/PROJECT_STATUS.md. No incluir specs/002-kit-completo/ ni reescribir historial.
