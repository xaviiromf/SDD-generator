# Corpus, rúbrica y base de H0

Fecha: 2026-10-08. Datos ficticios congelados en fixtures/corpus.json. Ningún texto del corpus contiene credenciales ni datos de clientes. La base se recoge del ZIP del producto previo a cambiar el motor mediante Chromium, desde una sesión aislada; no modifica el borrador del usuario.

## Rúbrica

Evaluar cada dimensión como 0 (ausente/incorrecta), 1 (presente como texto sin estructura completa) o 2 (estructura verificable y referencias correctas): fidelidad de requisitos, completitud de datos declarados, trazabilidad, aplicabilidad y claridad de pendientes. No sumar puntos por cantidad de archivos ni por tecnologías inferidas sin fundamento. Una evaluación automatizada de presencia literal no sustituye esta revisión semántica.

Los 12 casos abarcan Django, PWA sin backend, API, CLI, escritorio, móvil/API, lotes, dispositivos, aprendizaje automático, cambio existente, protocolo propio y proceso sin código. Cada caso congela idea, actor, comportamiento, criterio, excepción y oráculo. H0 registra si el producto preserva contenido y manifiesto; H2 añade entradas estructuradas del mismo caso. No se exige implementar perfiles avanzados de H4: representar componentes o datos sin catálogo es suficiente para H1/H2; la adecuación especializada queda pendiente.

## Límites de H1/H2

Modelo adicional máximo 256 KiB, kit completo máximo 1 MiB. Hasta 100 requisitos, 10 criterios y 10 excepciones por requisito, 100 elementos por colección de contexto, 64 caracteres por ID, 500 por título, 2000 por descripción y criterio. Referencias hasta 100 por elemento. Conservar límite actual de idea de 20.000 caracteres. Un texto incompleto se persiste como pendiente; no una entrada estructuralmente inválida. Los límites son explícitos y verificables antes de compilar o restaurar.

La persistencia de un único borrador sigue siendo la existente, con migración aditiva y preservación del registro previo cuando falle la validación. No hay importación, historial ni multiproyecto de H3 en este hito. No usar campos nuevos para ampliar la transmisión MCP.

## Evaluación con usuarios y esfuerzo

Protocolo propuesto: al menos tres participantes preparan dos casos equivalentes, con medición de tiempo y correcciones sustanciales antes/después de H2. Registrar condiciones, errores, tamaños de muestra y mediana; objetivo de reducción del 25 % sin empeorar calidad. El usuario confirmó que no dispone de participantes y solicitó otro método el 2026-10-08. Ese protocolo humano queda sustituido para T-005-19 por el banco descrito abajo; no se declara base humana, ahorro ni aceptación.

H1 tiene complejidad alta por contrato/migración/editor; H2, alta por coherencia de documentos y grafo. La capacidad disponible en esta ejecución es un agente, trabajando secuencialmente. No se establece una fecha ni un coste monetario sin datos de planificación del equipo.

## Base ejecutada

Resultados automatizados de presencia literal y número de documentos: fixtures/baseline.json. No se presentan como puntuación semántica completa ni precisión del modelo. MCP permanece desactivado. La evaluación real de proveedores externos no forma parte de esta base.

## Comparación automatizada autorizada

Banco reproducible: `tests/benchmarks/projectComparison.mjs`; informe completo: [fixtures/comparison.json](fixtures/comparison.json). Construye la base del commit 53d13c2 en una copia temporal con las dependencias ya existentes y sirve ambos builds en puertos distintos. Con ambos servidores activos, ejecuta `node tests/benchmarks/projectComparison.mjs`; `SDD_BASE_URL` y `SDD_H2_URL` permiten cambiar sus direcciones. No usa un servicio externo ni el borrador del usuario.

Condiciones: Chromium 153, builds de producción, MCP desactivado, selección manual fija client-spa para aislar proyección de inferencia tecnológica. Cada versión recibe exactamente la misma idea, actor, comportamiento, criterio y excepción como texto libre; H2 recibe además esos campos estructurados. Los datos se insertan automáticamente: no se mide tiempo de recopilación, entrevista, carga manual o revisión humana. Orden anterior seguido de H2, un calentamiento y cinco muestras por caso; 60 muestras por versión. Generación: desde evento input hasta que se habilita exportar la revisión; ZIP: duración de empaquetado instrumentada con Performance API, sin tiempo de descarga de red.

| Medición | Versión anterior | H2 |
|---|---|---|
| Generación, mediana / p95 | 35,7 / 46,6 ms | 35,9 / 48,0 ms |
| Empaquetado ZIP, mediana / p95 | 7,5 / 19,3 ms | 8,8 / 18,1 ms |
| Hallazgos estructurales, 12 casos | 60 | 0 |
| Archivos por kit | 34 | 34 |

Se comprueban siete propiedades por caso: preservación literal de los cuatro hechos, comportamiento con ID de RF, criterio observable con ID, tarea enlazada al criterio, grafo RF/tarea/criterio, criterio en validación inicialmente no ejecutada y manifiesto de 34 documentos. La base conserva los hechos en texto libre y las 34 rutas, pero carece de los cinco enlaces estructurados evaluados: cinco hallazgos por caso. Un hallazgo indica una propiedad pendiente de corrección; no equivale al número de acciones manuales ni a un defecto semántico independiente. No se asigna una puntuación completa de la rúbrica con este banco.

Volumen H2: cien requisitos declarados, 30 muestras tras calentamiento; generación mediana 53,5 ms, p95 68,2 ms. El resultado respeta el presupuesto de generación de 150 ms en este entorno. Las diferencias pequeñas entre versiones no demuestran aceleración; el beneficio observado es la estructura explícita y la trazabilidad. No se ha demostrado un ahorro humano del 25 % ni adaptabilidad especializada universal. La revisión semántica, la aceptación y los perfiles avanzados continúan pendientes.

[fixtures/h2-results.json](fixtures/h2-results.json) registra la proyección determinista de los doce casos, hechos aportados preservados y cero referencias rotas. Ninguna validación del proyecto objetivo se presenta como ejecutada.
