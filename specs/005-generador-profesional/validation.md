# Verificación ejecutada — 005, H0–H3

Fecha: 2026-10-08. H0–H2 e H3 autorizados por separado por el usuario y verificados técnicamente. T-005-02…24 completadas; cierre 35 de H3 completado con push normal de 0bb522e. H4/H5 y tareas 25…34 pospuestos. La aprobación del plan no equivale a aceptación del producto. No se despliega un sitio.

Los apartados anteriores a H3 conservan la evidencia histórica de H0–H2; cifras y exclusiones describen ese momento. La evidencia vigente de biblioteca/versiones y regresión está en el apartado H3.

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

Revisión semántica del corpus y de cada proyecto generado, aceptación del cliente, lector de pantalla real, ampliación real del navegador y teléfono físico pendientes. La evidencia automatizada no verifica adecuación especializada de móvil/API, protocolos propios o cualquier dominio imaginable; H4 sigue pospuesto. El detector cubre contradicciones conocidas y literales, no semántica universal. En ese cierre no se desarrollaba H3; biblioteca/importación/diferencias se verifican posteriormente en el apartado siguiente. H5 sigue pospuesto. No se ejecuta código de un proyecto generado.

## Sincronización

T-005-35 completada: push normal 53d13c2..84ed6e0 al remoto existente, código 0; ls-remote confirma 84ed6e046e61a8972d5c251e3aae83e897abfb0f en main. Registro de cierre en docs/PROJECT_STATUS.md. 002 excluido, historial sin reescritura y sin despliegue.

## H3 — Biblioteca local, versiones y reconciliación

Autorización explícita del 2026-10-08 para T-005-20…24 y cierre 35. H4/H5 no implementados. Cambios de fase/dominio y correcciones registrados en PROJECT_STATUS. Dependencias y manifiestos permanecen sin cambios. Las mediciones siguientes proceden del build final, servido localmente; no son estimaciones ni resultados del proyecto generado.

### Comprobaciones finales

| Comando o comprobación | Resultado observado |
|---|---|
| npm run test | 94 pruebas correctas en 22 archivos, código 0; incluye las 76 previas y 18 de H3 |
| npm run lint | Código 0 |
| npm run build | TypeScript estricto y Vite correctos, código 0; sin aviso de tamaño |
| npm run test:e2e | 112 casos: 108 correctos, 4 omitidos, 0 fallos; 5,1 minutos |
| Regresión H2 | Corpus de 12 escenarios, volumen de 100 requisitos, proyección/grafo/34 documentos y recorridos de requisitos incluidos en las suites |

Las cuatro omisiones son mediciones instrumentadas de rendimiento en Firefox: las tres históricas y la nueva biblioteca poblada. Los recorridos funcionales H3 se ejecutaron en Chromium y Firefox, incluidas continuidad, importación, aportaciones, foco, conflictos, cuota/corrupción y funcionamiento sin red. No se atribuyen mediciones p95 a Firefox.

### Contratos, servicios e integración

- `libraryContracts.test.ts`: cuatro pruebas de formato y límites, IDs/versiones, campos desconocidos, claves y orden de diferencias, máximo de 200 entradas, secciones con IDs de RF, encabezados dentro de cercas de código, destinos ausentes y orden de varias aportaciones al mismo destino. Los textos manuales se preservan sin reemplazar el contenido generado.
- `libraryServices.test.ts`: cinco pruebas de lectura/escritura y revisión concurrente, cuota simulada, registro corrupto conservado, formato incompatible, campos/prototipos peligrosos, IDs duplicados, exceso de tamaño, referencias/rutas inválidas, credenciales aparentes en datos/metadatos y cancelación anterior al commit.
- `libraryStore.test.ts`: nueve pruebas de crear/cambiar/guardar/recuperar, comparación y cancelación sin escritura, copia previa al reemplazar importación, recuperación inmediata por procedencia, conservación como copia ante revisión ajena, generación pendiente y resolución manual, respaldo completo con historial pese a cuota y autoguardado sin deshabilitar acciones.

La escritura valida y serializa en un trabajador nativo; una cola local y comprobación del registro anterior evitan cambios obsoletos. Web Locks coordina pestañas donde exista; la alternativa comprueba y escribe en el mismo turno, sin garantía universal de exclusión entre procesos. No hay persistencia remota. Ante corrupción no se borra ni se sustituye el registro original. Importar solo permite JSON del formato versionado del estudio y exige confirmación antes de aplicar; cancelar conserva datos.

### Recorridos reales de navegador

`tests/e2e/library.spec.ts`: recuperar proyectos y versiones tras recargar; cierre inmediato antes del guardado diferido; comparación previa a recuperación; respaldo/importación, copia del registro reemplazado y JSON inválido; aportación que cambia de sección, cancelación que mantiene el bloqueo, resolución y ZIP con 34 archivos. El diálogo devuelve foco, contiene navegación Tab y permite Escape; no se detecta desbordamiento a 375, 768 y 1280 px.

Dos páginas reales verifican que una revisión concurrente no sobrescribe la edición local y permite respaldarla. Un trabajador con entrega retrasada verifica que un clic de creación no se pierde durante autoguardado. La biblioteca corrupta conserva su texto y permite respaldar la edición segura. Tras completar la caché, versiones y respaldo funcionan con la red desconectada en ambos navegadores. Las pruebas usan datos ficticios, nunca secretos reales.

La regresión completa conserva idiomas históricos migrados a español, Django/catálogo, diseño/carrusel, fuentes locales, MCP HTTP/SSE con fallback de 1500 ms, límites, compatibilidad, trabajador, caché, portapapeles y exportación. No se añade información estructurada al envío MCP.

### Paquetes y rendimiento

| Recurso final de producción | Tamaño Vite | Comprimido |
|---|---|---|
| Paquete principal | 453,60 kB | 148,39 kB |
| Módulo compartido editorStore | 51,21 kB | 15,24 kB |
| Adaptador projectLibraryStore | 14,19 kB | 4,94 kB |
| Interfaz ProjectLibrary | 7,25 kB | 2,56 kB |
| Interfaz ManualSections | 5,32 kB | 1,97 kB |
| Trabajador de importación | 112,85 kB | — |
| Trabajador generador | 186,15 kB | — |
| CSS | 34,13 kB | — |

El presupuesto autorizado de <500 kB se comprueba sobre el paquete principal, no sobre la suma de todos los recursos. La tabla hace visible el módulo compartido adicional y los módulos separados; los tamaños comprimidos son los informados por Vite, no mediciones de transferencia de una red real. La biblioteca y los paneles se cargan de forma diferida; no se incorporan bibliotecas nuevas.

| Escenario Chromium final | Muestras/eventos | Resultado |
|---|---|---|
| Edición con 20 proyectos y 100 RF | 200 entradas | p95 3,4 ms; guardado posterior conserva la última edición |
| Sandbox estético | 200 ajustes | p95 4,2 ms; cero renders ajenos en raíz, cabecera, idea, árbol, madurez y configuración |
| Procesamiento de entrada de referencia | 230 eventos | p95 2,0 ms; sin tareas largas observadas |
| Generación de referencia | 30 muestras | 38,4 ms en el presupuesto de generación |
| Aplicación de conjuntos | 30 muestras | p95 10,1 ms |
| ZIP de referencia | 30 muestras | p95 9,5 ms |

El límite <16 ms corresponde a entrada/interacción y muestra; no al ciclo completo de generación/ZIP ni a MCP. Estas cifras son del entorno probado, no una garantía para cualquier equipo, volumen o navegador.

### Correcciones verificadas y límites

La primera prueba de recarga inmediata evidenció edición anterior al guardado diferido; se corrigió continuidad al ocultar/cerrar página con procedencia para no sobrescribir una revisión ajena. Una prueba adicional reprodujo bloqueo del respaldo completo ante cuota; ahora se exporta una instantánea validada de solo lectura. Una regresión intermedia detectó un fallo Firefox al crear tras guardar; se corrigió que el autoguardado deshabilitara acciones y se añadió el caso con entrega de trabajador retrasada. Se corrigieron asimismo selectores de pruebas y se reforzaron orden de aportaciones y cercas de código. La regresión final de 112 casos usa todas esas correcciones.

No se comprueba cierre abrupto del proceso ni pérdida física del almacenamiento. El navegador puede imponer una cuota inferior al presupuesto interno; biblioteca, borrador histórico y registro de continuidad ocupan claves independientes. Los respaldos descargados requieren conservación por el usuario. WebKit, lector de pantalla real, ampliación real y teléfono físico mantienen sus pendientes históricos. No se mide ahorro humano ni precisión de un modelo MCP real. Aceptación del cliente, H4/H5 y despliegue quedan fuera de este cierre.

### Cierre T-005-35 de H3

Documentación y evidencia consolidadas tras pasar pruebas/build. Auditoría final: 200 archivos de texto propios, cero archivos con emojis; enlaces locales de los documentos afectados existentes y git diff --check correcto. git check-ignore confirma 002 ignorado y git ls-files no devuelve archivos de esa carpeta. Push normal a6f0e5f..0bb522e a origin/main, código 0; git ls-remote confirma 0bb522efa9a72e8a243cda28ea30aba57460f8a5 en refs/heads/main. Árbol de trabajo limpio tras sincronizar el código; este registro se consolida en un commit documental posterior. No se reescribe historial ni se despliega el sitio.
