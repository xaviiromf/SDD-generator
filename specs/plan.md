# Plan técnico — 001 / SDD-Studio

Contrato vigente: 34 documentos y generación local, con inferencia MCP opcional autorizada en 004. Las referencias históricas a seis documentos o ausencia absoluta de red quedan sustituidas por esos contratos; la ampliación 005 incorpora H0–H4 tras autorizaciones separadas y conserva H5 pospuesto.
Estado histórico de la ampliación 004: plan y matriz aprobados formalmente el 2026-10-07. T-004-04…23 autorizadas; implementación y verificación técnica final completadas. Aceptación y despliegue pendientes.

Especificación: [spec.md](spec.md). Fecha: 2026-10-06. Estado: **aprobado el 2026-10-06**. Implementación autorizada. Las rutas descritas inicialmente como propuestas se contrastan con la trazabilidad y el informe de verificación.

## 1. Inspección y decisiones

El directorio local contenía únicamente `prompt.txt`; no existen aplicación, paquetes, estilos, configuración ni pruebas previas. No se detectó repositorio Git local. El remoto solicitado existe y tiene rama `main`; debe preservarse antes de sincronizar. El marco se usa por lectura, no se copia ni modifica fuera del proyecto.

| Área | Mandato de la fuente | Selección propuesta para revisión |
|---|---|---|
| Interfaz | React 19/18, TypeScript estricto, Vite | React 19; TypeScript estricto; Vite. |
| Estado | Zustand o Signals; no Context para edición | Zustand con selectores por propiedad; selección superficial cuando agrupe campos. |
| Generación | Cadencia diferida o trabajador | Web Worker de módulo, motor puro y revisiones monotónicas. |
| Estilo | Tailwind y variables CSS | Tailwind con tokens semánticos; versión exacta pendiente. |
| Iconos | Exclusivamente lucide-react | Importaciones individuales de lucide-react. |
| Primitivas | Radix UI o patrones Headless UI | Primitivas Radix para diálogo, acordeón y pestañas; no añadir otra biblioteca de componentes. |
| Resaltado | Shiki o PrismJS ligero | PrismJS con gramáticas mínimas y carga diferida. |
| Exportación | JSZip y FileSaver | JSZip y file-saver, cargados al solicitar exportación. |
| Pruebas y lint | Alternativas de la fase 7 | Vitest para motor, Playwright para navegador, ESLint para análisis. |
| Paquetes | Build previsto con npm | npm y archivo de bloqueo; sin instalación en DOCUMENT. |
| Sin conexión | Todo local y utilizable sin red | Service worker nativo y fuentes locales; no añadir plugin de PWA. |

No se proponen bibliotecas de formularios, enrutador, parser Markdown adicional, búsqueda aproximada ni esquemas extra. El visor mostrará el texto Markdown con resaltado, sin convertir HTML arbitrario en DOM. La validación del estudio usa contratos TypeScript y funciones explícitas; Zod/Valibot/Pydantic son opciones para los proyectos objetivo.

## 2. Archivos previstos

Todos los archivos de aplicación siguientes son **propuestos y aún no creados**. Las rutas documentales existentes se mantienen separadas del código futuro.

```text
SDD-generator/
  prompt.txt                            fuente existente preservada
  specs/                               documentación de esta fase
    README.md
    spec.md
    plan.md
    tasks.md
    validation.md                      solo tras validación real
  docs/
    PROJECT.md
    PROJECT_STATUS.md
    DECISIONS.md
    TRACEABILITY.md
    ENVIRONMENT_AND_VERIFICATION.md    durante implementación
  README.md                            guía completa durante implementación
  package.json
  package-lock.json
  index.html
  vite.config.ts
  tsconfig.json
  eslint.config.js
  public/
    fonts/                             fuentes con licencias
  src/
    main.tsx
    app/App.tsx
    app/StudioLayout.tsx
    components/navigation/PanelNavigation.tsx
    components/configurator/Configurator.tsx
    components/configurator/PhaseSection.tsx
    components/configurator/TechnologyField.tsx
    components/configurator/PresetSelector.tsx
    components/command/CommandPalette.tsx
    components/storyteller/IdeaEditor.tsx
    components/storyteller/ScopeBadges.tsx
    components/aesthetics/AestheticStudio.tsx
    components/aesthetics/ArchetypeCard.tsx
    components/documents/DocumentCanvas.tsx
    components/documents/DocumentTabs.tsx
    components/documents/FileTree.tsx
    components/documents/MaturityMeter.tsx
    components/export/ExportBar.tsx
    components/feedback/StatusMessage.tsx
    store/editorStore.ts
    store/documentStore.ts
    store/uiStore.ts
    domain/models.ts
    domain/validation.ts
    domain/compatibility.ts
    domain/maturity.ts
    catalog/technologies.ts
    catalog/presets.ts
    catalog/archetypes.ts
    engine/tokenizer.ts
    engine/matcher.ts
    engine/scopeRules.ts
    engine/compiler.ts
    engine/targetTree.ts
    engine/taskGraph.ts
    engine/templates/                   plantillas documentales españolas por responsabilidad
    workers/generator.worker.ts
    workers/generatorClient.ts
    services/draftStorage.ts
    services/clipboard.ts
    services/zipExport.ts
    services/tokenExport.ts
    services/setupCommands.ts
    services/offlineRegistration.ts
    styles/tokens.css
    styles/app.css
    offline/service-worker.ts
  tests/
    unit/                              reglas, validación y compilación
    fixtures/                          ideas y kits sintéticos en español
    e2e/                               recorridos, accesibilidad y sin conexión
    performance/                       escenarios reproducibles
```

El service worker se compila como entrada independiente y obtiene el manifiesto de recursos estáticos del build; nunca se presupone que Vite copie TypeScript ejecutable a `public/`. La estrategia concreta de emisión forma parte de su tarea y no requiere dependencias nuevas.

## 3. Componentes y responsabilidades

```text
App
  StudioLayout
    Cabecera y estado de guardado
    PanelNavigation
    Configurator
      PresetSelector
      PhaseSection × 7
        TechnologyField
        AestheticStudio / ArchetypeCard
    IdeaEditor
      ScopeBadges
    DocumentCanvas
      MaturityMeter
      FileTree
      DocumentTabs
      Visor de Markdown resaltado
      ExportBar
    CommandPalette
    Confirmaciones y StatusMessage
```

`PhaseSection` recibe metadatos de fase y controla su apertura desde estado de interfaz; no se suscribe al documento entero. `TechnologyField` se suscribe a su valor y al subconjunto de compatibilidades relevante. `IdeaEditor` escucha únicamente texto, validación y estado de guardado. `ScopeBadges` recibe diagnósticos del trabajador. `ArchetypeCard` recibe tokens y contraste calculado; se monta de forma diferida cuando se abre estética. `DocumentCanvas` escucha una revisión documental confirmada, no cada pulsación del editor. Árbol y medidor conservan selectores propios.

Estado transitorio de foco, búsqueda, acordeones y pestañas se mantiene local o en `uiStore`; abrir un menú no incrementa la revisión semántica ni compila documentos. No se usa React Context como transporte del estado de edición.

## 4. Contratos, flujo y consistencia

1. Una acción valida un cambio y actualiza propiedades atómicas del editor; incrementa la revisión solo si cambia el contenido semántico.
2. El coordinador agrupa cambios con cadencia objetivo de 16 ms y envía la instantánea serializable al trabajador. Nunca serializa ni compila dentro del manejador de teclado.
3. El trabajador normaliza texto, detecta señales, evalúa compatibilidad, propone inferencias y genera los 34 documentos. Todas las funciones de dominio reciben entradas explícitas y no dependen de red, reloj o DOM.
4. La respuesta incluye revisión, inferencias, sugerencias, diagnósticos, madurez, documentos y árboles. El cliente descarta respuestas antiguas. Mantiene una sola petición pendiente reemplazable para evitar una cola ilimitada de compilaciones.
5. Inferencias inequívocas se aplican en una sola transacción únicamente a campos sin decisión manual; una comparación de cambios y huella semántica evita bucles de inferencia/compilación.
6. Se publica una revisión coherente en `documentStore`. Exportación y copia se habilitan solo cuando coincide con el editor y no existen diagnósticos bloqueantes.

| Acción interna | Entrada | Salida / error |
|---|---|---|
| Cambiar campo | ID conocido, valor permitido y origen | Estado validado o diagnóstico sin perder entrada. |
| Aplicar conjunto | ID y elecciones de variantes | Sustitución atómica confirmada; cancelación no cambia estado. |
| Compilar | Versión de esquema, revisión, configuración e idea | Seis documentos, sugerencias y madurez; error recuperable asociado a revisión. |
| Restaurar borrador | Registro local versionado | Datos migrados si existe migración explícita, o rechazo explicado; nunca aceptar versión desconocida como válida. |
| Exportar kit | Documentos de revisión actual y lista de rutas permitidas | Blob ZIP y nombre seguro; error en español. |
| Exportar tokens | Arquetipo, formato y perfil del destino | Archivo adecuado al formato o explicación de incompatibilidad. |
| Generar preparación | Perfil reconocido e identificador validado | Texto de comandos conocido; sin ejecución ni texto libre interpolado. |

No hay llamadas a backend, endpoints API, autenticación de aplicación, migraciones SQL ni secretos operativos. Los datos de un destino fullstack se documentan como contratos propuestos en su kit, sin presentarlos como implementados.

### Reglas del catálogo y del analizador

- Registro normalizado de entradas únicas, con alias separados y filtros declarativos de compatibilidad. Auditar cobertura de las siete fases y los ocho conjuntos antes de implementar UI.
- Normalización de Unicode, acentos y separación por palabras; coincidencias exactas/alias primero, aproximación acotada después. El umbral depende de longitud para evitar que abreviaturas de una letra activen tecnologías.
- Detectar contexto de negación, empates y exclusiones; no inferir relaciones de negocio complejas. «Sin backend» no crea autenticación cloud por contener otra palabra.
- Procedencia y prioridad: decisión manual > conjunto confirmado > inferencia. Campos no definidos quedan pendientes. Una inferencia incompatible se muestra como sugerencia, nunca como cambio oculto.
- La elección CLI desactiva estilo web en la compilación; al volver a web puede restaurar el borrador visual. Candidatos incompatibles no aumentan madurez.
- Madurez: seis pilares con peso igual; calcular `redondeo(100 × pilares resueltos / 6)`. Estilo «No aplica» para CLI y almacenamiento «En memoria» son elecciones válidas; pruebas o seguridad sin definir siguen incompletas.
- La consola, el README y el kit no usarán emojis. Entradas con emojis o secretos aparentes se marcan antes de guardar o exportar, conservando únicamente la edición transitoria para corrección.

### Kit exportado vigente

La ampliación 002 autorizada sustituye el contrato inicial de seis documentos: manifiesto de 30 archivos base del marco más cuatro de la especificación activa en `specs/001-<slug>/`. Documentos por identidad y formato MD/TXT; contexto único, requisitos/tareas numerados y perfiles de destino compartidos.

Se conservan seis archivos raíz, diez docs, nueve prompts, índice specs y cuatro plantillas. La especificación activa añade spec/plan/tasks/validation. Los registros empiezan pendientes y no contienen evidencia del generador. `kitManifest.ts` gobierna rutas, árbol, visor, copia y ZIP. La generación completa ocurre en el trabajador con revisión atómica. Solo se resalta el documento visible.

El código del destino permanece propuesto dentro del plan, no dentro del ZIP. La exportación de tokens es independiente. El kit es autónomo, sin depender de la ruta del marco en esta máquina. El plan detallado 002 es local y está excluido de Git conforme a la instrucción del usuario.

## 5. Diseño y catálogo exacto de arquetipos

Las variables semánticas previstas son fondo, superficie, acento, texto, texto secundario, borde, tipografías, radio, elevación y textura. Tailwind consume variables, no cadenas de clases construidas desde texto libre. Se define escala tipográfica de razón 1,25, espaciado base 4 px, ancho legible en documentos y objetivos táctiles independientes de la densidad visual.

Esta tabla conserva los valores del prompt; nombres visibles localizados. Los nombres técnicos de fuentes conservan su forma original. «Plano» equivale a ausencia de sombra.

| ID / nombre visible | Fondo / superficie | Acento(s) | Texto / secundario / borde | Título + cuerpo | Radio y textura/elevación |
|---|---|---|---|---|---|
| A01 · Prensa editorial independiente | #FBFBF9 / #F2EFE9 | #C2593F | #141413 / #75736C / #E5E1D8 | Cormorant Garamond + Space Grotesk | 4 px; plano, grano de papel. |
| A02 · Terminal ciberpunk / Matrix | #08090A / #101416 | #00FF88 | #E5E7EB / #64748B / #1E293B | JetBrains Mono + Fira Code | 0 px; plano, líneas de barrido. |
| A03 · Pizarra minimalista nórdica | #F8FAFC / #FFFFFF | #2563EB | #0F172A / #64748B / #E2E8F0 | Plus Jakarta Sans + Inter | 8 px; sombra suave, espacio limpio. |
| A04 · Precisión suiza para software | #111215 / #18191E | #2D5CF6 | #FFFFFF / #9CA3AF / #262830 | Geist Sans + Inter | 6 px; microbordes de 1 px. |
| A05 · Pop neobrutalista | #FFFDF5 / #FFFFFF | #FF5D00 / #FFE600 | #000000 / #4B5563 / #000000 | Archivo Black + Public Sans | 0 px; borde 2,5 px, sombra dura 4 px × 4 px negra. |
| A06 · Tierra orgánica y micelio | #181614 / #26231F | #BC6C25 / #52796F | #EDE0D4 / #A39688 / #38332D | Fraunces + Space Grotesk | 12 px; ruido terrestre sutil. |
| A07 · Lujo de obsidiana monocromática | #050505 / #0D0D0F | #D4AF37 | #F4F4F5 / #A1A1AA / #1F1F24 | Playfair Display + Manrope | 2 px; bisel, resplandor contenido. |
| A08 · Onda sintética retro de Tokio | #120D1D / #1D152E | #00F0FF / #FF007F | #F5F3FF / #938BA1 / #352554 | Syne + Space Mono | 10 px; sombras luminosas de neón. |
| A09 · Horizonte técnico solarizado | #002B36 / #073642 | #B58900 / #2AA198 | #93A1A1 / #657B83 / #0D4958 | Inconsolata + Source Sans 3 | 4 px; acabado mate. |
| A10 · Aura de cristal esmerilado | #0A0B12 / rgba(255,255,255,0.04) | #8B5CF6 | #F8FAFC / #94A3B8 / rgba(255,255,255,0.12) | Outfit + Inter | 16 px; desenfoque 24 px y luz flotante. |
| A11 · Carbón wabi-sabi japonés | #1E1E20 / #28282B | #C84B31 | #DCD6CD / #8A857D / #38383C | Shippori Mincho + Zen Kaku Gothic New | 0 px; mate táctil. |
| A12 · Mar profundo bioluminiscente | #020B14 / #061A29 | #00E5FF | #E0F7FA / #5C8296 / #0D344D | Syne + Inter | 14 px; viñeta oceánica, bordes luminosos. |
| A13 · Monolito industrial | #191A1C / #242629 | #F59E0B | #E5E7EB / #9CA3AF / #373A40 | Chivo + DM Mono | 2 px; chaflán, espaciado compacto. |
| A14 · Calidez del desierto de Sedona | #FDFAF6 / #F5EDE4 | #9C4125 | #2B2623 / #7C7067 / #E5D9CC | Cormorant Infant + Public Sans | 8 px; superficies cálidas. |
| A15 · Cafetería de espresso aterciopelado | #141110 / #211C1A | #D97706 | #F5EBE0 / #96867B / #3B322D | Newsreader + Epilogue | 10 px; profundidad cálida. |
| A16 · Titanio de sala limpia aeroespacial | #0E1117 / #161B22 | #FF5C00 | #E6EDF3 / #8B949E / #30363D | Space Grotesk + Geist Mono | 4 px; retícula precisa. |
| A17 · Musgo de bosque otoñal | #0D1612 / #16231D | #22C55E / #A16207 | #ECFDF5 / #6B8F7D / #22382E | Instrument Serif + Albert Sans | 12 px; sombras orgánicas suaves. |
| A18 · Brutalismo ácido Y2K | #0C0C0C / #171717 | #CCFF00 | #FFFFFF / #888888 / #262626 | Syne ExtraBold + JetBrains Mono | 0 px; insignias gruesas redondeadas. |
| A19 · Zafiro de medianoche art déco | #070E1B / #0E182B | #C5A059 | #F1F5F9 / #64748B / #1E304F | Cinzel + Manrope | 6 px; simetría y brillo metálico sutil. |
| A20 · Lujo sereno de lino y arena | #F7F5F0 / #ECE7DE | #556B2F | #202020 / #66635D / #DED7CB | Cormorant Garamond + Inter | 6 px; sin sombra, espacio amplio. |
| A21 · Orquídea botánica oscura | #0B120D / #122017 | #E11D48 | #ECFDF5 / #718C7B / #1E3827 | Playfair Display + Urbanist | 16 px; superficies aterciopeladas. |

Cada ficha incluye categoría, muestra tipográfica real, párrafo español, botón con estado de puntero/foco, cinco muestras de color y acabado. La generación de texturas usa CSS no interactivo y de bajo coste, sin imágenes externas ni SVG decorativos que amplíen el sistema de iconos.

Contraste: calcular luminancia relativa y componer colores alfa sobre el fondo efectivo. Informar AA normal ≥4,5:1, AA grande ≥3:1, AAA normal ≥7:1 y AAA grande ≥4,5:1; comprobar también contraste del texto del botón y controles. No suponer que texto secundario o acento de la fuente pasa AA. Se conservan los tokens originales, se muestran los fallos y se proponen ajustes explícitos sin sobrescribir silenciosamente la paleta. La interfaz del estudio sí debe cumplir AA.

Las fuentes se empaquetan localmente con licencias. Algunas familias del prompt no son de Google Fonts o pueden restringir redistribución; la auditoría separa disponibilidad y derechos. Si una fuente no puede incluirse, su ficha queda pendiente de sustitución aprobada: no se anuncia la pareja exacta usando otra fuente oculta. Cargar únicamente parejas activas y muestras visibles; la preparación offline debe cachear todas las fuentes necesarias para que ningún arquetipo dependa después de Internet.

Exportación: `tokens.json` contiene valores y metadatos; `tokens.css` expone variables; `tailwind.config.ts` se ofrece solo con un perfil compatible con configuración TypeScript de Tailwind. Los destinos que usen un enfoque CSS diferente reciben CSS/JSON. No se da por universal el formato de configuración entre versiones.

## 6. Adaptación, accesibilidad y estados

Cuadrícula móvil primero: una columna hasta 767 px, dos desde 768 px, tres desde 1280 px. `min-width: 0` en paneles y límites de contenido evitan overflow; el ocultamiento horizontal de la raíz es protección complementaria, no corrección de layouts rotos. El visor tiene desplazamiento propio. La barra móvil reserva altura y área segura. Los paneles preservan contenido al ocultarse sin conservar controles invisibles en el orden de tabulación.

Primitivas accesibles manejan diálogos, acordeones y pestañas. Árbol implementa navegación semántica consistente; controles nativos se prefieren cuando bastan. Atajos usan Cmd o Ctrl según plataforma, evitan campos editables y se explican junto a alternativas visibles. La actualización de documentos no roba foco. Estados de carga conservan la revisión anterior marcada; mensajes de error incluyen recuperación. Animaciones breves respetan `prefers-reduced-motion`.

## 7. Persistencia, seguridad y uso sin conexión

Guardar con retardo fuera de eventos de entrada, solo después de validar y descartar contenido sensible aparente. Clave propia versionada y escritura atrapada con diagnóstico explícito. No borrar otras claves ni asumir localStorage ilimitado. Un borrador incompatible puede descartarse por confirmación; cualquier migración debe estar definida y probada.

El service worker cachea exclusivamente recursos estáticos propios; no intercepta ni registra narrativas. Alcance y rutas relativos a la base de despliegue, con caché versionada, limpieza de cachés propias antiguas y aviso de nueva versión. La actualización no recarga automáticamente durante la edición. Trabajador, gramáticas y fuentes forman parte del manifiesto. Primera visita requiere obtener recursos; preparación offline completa se muestra al terminar. Si el navegador impide service workers, la sesión cargada sigue trabajando localmente y explica la limitación de recarga.

Entradas se muestran como texto; nunca se usa inyección de HTML desde la narrativa. Lista cerrada de rutas del ZIP; rechazo de rutas absolutas, `..` y separadores ajenos. Copiar/exportar utiliza solo instantáneas validadas. Detector local de patrones de secretos no guarda coincidencias en logs; avisa sin repetir el secreto completo. No se ejecuta un escáner contra sistemas externos para el conjunto de seguridad.

## 8. Exportación y rendimiento

Compilar Markdown mediante funciones puras y fragmentos reutilizables; el resaltado se memoriza por revisión/documento y se limita al documento visible. Búsqueda y filtros derivan índices del catálogo una vez. No construir 21 previews complejas ni todos los árboles en cada pulsación. JSZip y FileSaver se importan al exportar y sus recursos se incluyen en la preparación offline.

Preservar los presupuestos CA-11…13: controles e ingreso p95 <16 ms; kit actualizado objetivo p95 ≤150 ms; ZIP de referencia p95 <100 ms. Registrar tiempos por fase con Performance API y trazas de navegador, versión de build, dispositivo y tamaño de entrada. Una exportación de 1 MiB no se mezcla con la de referencia de 250 KiB. La compresión y nivel ZIP deben medirse; si bloquean el hilo o incumplen metas, trasladar empaquetado al trabajador antes de declarar aceptación. Ninguna optimización reduce alcance o calidad de documentos sin revisión.

## 9. Pruebas y verificación previstas

Estas verificaciones **no se han ejecutado**; no existe todavía la aplicación. Se probará comportamiento crítico, no una copia de cada detalle de implementación.

| Nivel | Casos necesarios |
|---|---|
| Dominio | Compatibilidades; conteo ≥201 sin alias; cobertura de siete fases, ocho presets y 21 arquetipos; madurez aplicable; contratos/límites. |
| Intención | «pyton», «tailwnd», negación, ambigüedad, decisiones manuales, eliminación de una señal y prioridades. |
| Generación | Determinismo con igual entrada; documentos españoles; pendientes explícitos; tareas acíclicas; cambios de árbol por destino; 34 documentos de una misma revisión. |
| Seguridad y persistencia | HTML inerte, enlaces peligrosos, traversal, emojis, secreto sintético, quota, borrador corrupto y versión desconocida. |
| Trabajador | Respuestas fuera de orden, coalescencia, reinicio y fallo sin perder edición ni permitir exportación obsoleta. |
| ZIP/tokens | Descomprimir archivo; comparar rutas y contenido con revisión visible; formatos compatibles y valores exactos. |
| Navegador | Recorrido completo, conflictos, confirmación/cancelación de presets, paleta, portapapeles denegado y descarga. |
| Offline | Primera carga completa, desconexión, recarga, fuentes de cada arquetipo, trabajador, exportación diferida y actualización de caché. |
| Accesibilidad | Teclado, orden de foco, Escape, lector de pantalla, contraste, movimiento reducido y zoom 200 %. |
| Responsive | 375/767/768/1279/1280/1440 px; árbol largo, etiquetas largas, 20.000 caracteres y objetivos ≥44 × 44. |
| Rendimiento | Escenarios y p95 de la especificación, con muestras suficientes y evidencia del hilo principal. |

Comandos previstos una vez definidos los scripts: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e` y `npm run build`. Verificar Chromium, Firefox y WebKit con Playwright cuando el entorno permita sus navegadores; las limitaciones se registran, no se simulan. Servir el build en raíz y en `/SDD-generator/`, con caché y rutas operativas. No instalar dependencias ni ejecutar estos comandos en la fase actual.

Durante VALIDATE, crear `specs/validation.md` con comandos, códigos de salida y evidencia; actualizar trazabilidad y estado. Pruebas automáticas no equivalen a aceptación visual del usuario.

## 10. Riesgos y resolución prevista

| Riesgo | Acción propuesta |
|---|---|
| Inventario incompleto o cantidad inflada | Auditar IDs y cobertura; si faltan entradas reales, proponer ampliación explícita antes de cerrar catálogo. |
| Fuentes sin licencia de redistribución | Auditar licencias; resolver sustituciones por revisión, sin hotlinks. |
| Paletas originales con contraste insuficiente | Mostrar métricas honestas; ajustes accesibles separados de tokens fuente. |
| Inferencias que cambian decisiones manuales | Procedencia, prioridades y conflictos visibles; pruebas con negación. |
| Respuestas obsoletas o exportación mezclada | Revisiones, coalescencia y bloqueo de acciones hasta coherencia. |
| Paquetes/fuentes pesados | Carga diferida, subconjuntos tipográficos válidos, gramáticas mínimas y medición de bundle. |
| Caché vieja o subruta incorrecta | Manifiesto de build, base relativa, versionado y prueba offline en subruta. |
| Meta ZIP <100 ms no cumplida | Medir tamaño/compresión; ajustar algoritmo o trabajador y registrar resultados reales. |
| Versiones de destino divergentes | Perfiles por versión declarada, sin presentar presets históricos como recomendaciones actuales. |
| Atajos reservados por navegador | Controles visibles equivalentes y handlers solo en contexto pertinente. |
| Historial remoto previo | Incorporar historial mediante Git sin reset, fuerza ni reemplazo de archivos del usuario. |

## 11. Documentación afectada y puerta de aprobación

En DOCUMENT: `specs/spec.md`, `specs/plan.md`, `specs/tasks.md`, `specs/README.md`, `docs/PROJECT.md`, `docs/PROJECT_STATUS.md`, `docs/DECISIONS.md` y `docs/TRACEABILITY.md`. En implementación: README y guía de comandos; en validación: evidencia real.

La aprobación debe identificar el alcance o tareas autorizadas y resolver o aceptar las propuestas de selección técnica, estética y límites. La existencia del plan no autoriza código, instalaciones ni despliegue. La sincronización documental en Git está solicitada por `prompt.txt`; publicar una web requiere autorización distinta.

## Ampliación Django autorizada — RF-30

Añadir campos api y addons al contrato versionado compatible con borradores previos (campos opcionales). El catálogo declara requisitos entre opciones; compatibilidad comprueba presencia y elegibilidad de prerrequisitos. TechnologyField observa backend/api para actualizar los complementos; el configurador explica los filtros. La paleta calcula el inventario dinámicamente. El árbol del destino propone manage.py, configuración, aplicación y rutas de API según selección. No se añaden dependencias al runtime del estudio. Validación: regresión unitaria de filtros/prerrequisitos y kit, recorrido en Chromium/Firefox, lint, TypeScript y build.

## Integración 003 — Idiomas

Catálogos en src/i18n/, useTranslation para UI y renderer literal/template para documentos. Locale UI en uiStore; sddLanguage en editorStore/Configuration con revisión y persistencia del borrador. Contexto y templates reciben idioma explícito; servicios de exportación mantienen coherencia. El visor declara su lang independientemente de document.documentElement.lang. Diseño y verificación en specs/003-idiomas/plan.md.

## Ampliación 004 — Plan aprobado

Fecha: 2026-10-07. Plan y AGENTS.md aprobados; implementación autorizada formalmente tras DOCUMENT. RF-004-01…14 en spec.md gobiernan esta ampliación y sus cambios respecto a 003. No se instalan dependencias en esta fase.

### Arquitectura y límites entre dominios

Mantener React, TypeScript, Zustand, Radix, lucide-react, worker y exportaciones existentes. Transporte propuesto mediante fetch, AbortController, ReadableStream y TextDecoder; controles nativos/Radix existentes; carrusel manual con una ficha, sin librería. No utilizar el worker de compilación como cliente HTTP ni hacer depender la muestra visual de la red. Una revisión documental completa permanece asíncrona; la muestra recibe los valores efectivos directamente.

| Dominio/tarea | Archivos propuestos o afectados | Contrato y límite de lectura |
|---|---|---|
| Documentación | AGENTS.md, specs/spec.md, plan.md, tasks.md, docs/PROJECT_STATUS.md, DECISIONS.md, TRACEABILITY.md | Definir contratos antes de programar; no leer implementación completa en DOCUMENT |
| Núcleo de diseño | src/domain/design.ts, src/domain/models.ts, validation.ts, maturity.ts, src/catalog/designOptions.ts | Tipos, valores por defecto, resolución y validación; sin acceso a componentes/estilos |
| Núcleo de inferencia | src/domain/intent.ts, src/domain/compatibility.ts, src/engine/matcher.ts, scopeRules.ts | Normalizar inferencias compatibles y prioridades; no leer UI ni cliente de transporte |
| Núcleo documental | src/engine/kitContext.ts, templates/plan.ts, constitution.ts y otras plantillas afectadas | Recibir diseño efectivo validado; no inspeccionar sandbox/carrusel |
| Servicios | src/services/mcpClient.ts, intentCoordinator.ts, draftStorage.ts, tokenExport.ts, offlineRegistration.ts; src/workers/generatorClient.ts | Adaptadores y coordinación con DTO de contrato; sin leer internals de UI o compilador |
| UI | src/components/storyteller/McpStatus.tsx, McpSettings.tsx; aesthetics/AdvancedDesignPanel.tsx, DesignSandbox.tsx, ArchetypeCarousel.tsx, AestheticStudio.tsx, ArchetypeCard.tsx; src/styles/app.css | Props/acciones documentadas; prohibido inspeccionar internals del motor/compilador |
| Integración | src/store/mcpStore.ts, editorStore.ts, uiStore.ts; src/app/App.tsx, StudioLayout.tsx; src/components/navigation/LanguageToggles.tsx; src/i18n/ | Tareas separadas de conexión/migración, solo consumidores públicos de los contratos |
| Verificación | tests/unit/mcp.test.ts, design.test.ts, intent.test.ts, services.test.ts; tests/e2e/mcp.spec.ts, design.spec.ts, carousel.spec.ts, performance.spec.ts | Preparar casos durante IMPLEMENT; en VALIDATE leer solo salidas, trazas y reportes |

Las rutas nuevas son propuestas; src/offline/service-worker.js ya existe y conserva su función de caché de recursos. La sección anterior enumera destinos de tareas, no concede permiso para abrirlos todos. En cada tarea registrar dominio y leer únicamente lo necesario. Los DTO y las reglas de importación se fijan en este documento; consumir un tipo no obliga a leer la implementación de otro dominio.

### Diseño: esquema, resolución y acciones

Extender Configuration con designVersion:1 y designOverrides opcionales, preservando el esquema externo v1 de borradores si una migración aditiva resulta compatible; validar antes de restore y antes del worker. Mantener selections.archetype como referencia única de base; no duplicar otro ID mutable en persistencia. baseArchetypeId del DTO efectivo se deriva de esa selección.

| Grupo | Propiedades y valores propuestos |
|---|---|
| Tipografía | headingFont, bodyFont, monoFont: familias OFL ya incluidas; filtrar monoespaciadas reales para código, conservar licencias y disponibilidad offline |
| Colores | background, surface, primaryAccent, secondaryAccent, border, text; HEX 6/8 dígitos, secundario desactivable; texto secundario existente conserva valor de base o neutro |
| Acabado | grain, scanlines, paper, frosted, matte, mesh; recetas cerradas locales, sin URL ni CSS arbitrario |
| Botones | radius 0/6/24 px, variant solid/outline/ghost; shadowDepth 0/1/2/3, presets de geometría explicitados en el catálogo |
| Tarjetas | borderWidth 0/1/2 px; shadow none/soft/hard; density compact/normal/spacious con padding 12/20/28 px |
| Iconos | strokeWidth 1.5/2/2.5; size 16/20/24 px, sin reducir área de clic de 44 px |
| Movimiento | snappy 100 ms, fluid 300 ms, spring 300 ms con curva de rebote documentada, none 0 ms; prefers-reduced-motion fuerza 0 ms |

Valores neutros de diseño personal: tipografías Geist Sans/Inter/JetBrains Mono, paleta del estudio documentada, secundario desactivado, mate, botón sólido 6 px sin sombra, tarjeta borde 1 px sin sombra/padding 20 px, icono 20 px y trazo 2 px, movimiento 100 ms. Solo se materializan al activar personalización sin arquetipo; no rellenar automáticamente un proyecto cuyo diseño siga pendiente. Los 21 arquetipos conservan sus valores iniciales, fuentes y acabados; propiedades nuevas no declaradas usan valores neutros. Evitar convertir silenciosamente acabados de los arquetipos en otra estética: documentar sus recetas compatibles o conservarlas como base hasta elegir un acabado nuevo.

Acciones públicas: setDesignOverride(grupo, clave, valor), clearDesignOverrides(), selectArchetype(id, preserveOverrides), detachArchetype(). Validación por clave y transacción atómica; incremento de revisión solo ante cambio semántico válido. Preset de arquitectura conserva personalización. Al activar un arquetipo distinto con overrides: diálogo Conservar ajustes / Restablecer ajustes / Cancelar. Sin overrides, selección directa. Desactivar conserva overrides; si no queda diseño completo, madurez vuelve a pendiente. Una plataforma no visual conserva overrides en borrador, pero diseño efectivo de exportación es no aplicable.

HEX parcial se guarda solo en estado de campo, con error visible y sin commit al editor. La resolución combina base+overrides en una función pura compartida. No introducir una segunda resolución distinta para el preview, las plantillas o los tokens.

### UI y muestra interactiva

AestheticStudio contiene ArchetypeCarousel y un apartado plegable Ajustes Avanzados de Diseño con DesignSandbox. Índice del carrusel y estados de interacción permanecen locales; navegar no dispara editorStore ni generación. Flechas operan solo cuando el foco está en el carrusel, nunca dentro de inputs, selectores o texto editable. Contador anunciado moderadamente y sin autoplay; anterior/siguiente con retorno circular 1…21; ficha activa identificada además del color. Botón seleccionado con aria-pressed; segunda activación desconecta base explícitamente.

Panel avanzado dividido en tipografía, colores, acabado, botones/tarjetas, iconos y movimiento. Móvil una columna; tablet/escritorio columnas internas solo si el ancho real del panel lo permite. No asumir que escritorio implica panel ancho. Muestra con CSS variables y valores tipados, colores alfa compuestos sobre fondo real, foco visible y botones interactivos no asociados a acciones del proyecto. Añadir estados de muestra con controles que simulen hover/activo sin depender exclusivamente del puntero.

Granulado y papel con SVG local/embebido sanitizado sin JavaScript; CRT y malla con capas CSS; cristal con transparencia y backdrop-filter con alternativa plana si no está soportado. No descargar imágenes ni fuentes. Mostrar ratios de texto normal/grande y texto de botón efectivo para los tres tipos, AA/AAA (4,5/3/7/4,5) y contraste de bordes/foco pertinente. No redondear un ratio que falle para declararlo aprobado.

Suscripciones pequeñas por grupo, useShallow cuando el selector devuelve objeto, memoización por diseño efectivo y montaje de una ficha. App/StudioLayout no se suscriben al objeto Configuration ni al diseño; controles actualizan sandbox sin recorrer las 34 plantillas en el hilo principal. Registrar commits DOM con Performance API y React Profiler de prueba, además de trazas de pintura/tareas largas.

### MCP: protocolo, transporte y servidor requerido

Referencia versionada de diseño: MCP 2025-11-25 y SSE heredado 2024-11-05; negociar la versión soportada, sin asumir compatibilidad con borradores del protocolo. [Transportes MCP](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports), [ciclo de vida](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle), [herramientas](https://modelcontextprotocol.io/specification/2025-11-25/server/tools). Verificar nuevamente interoperabilidad con el endpoint concreto al implementar; no instalar un SDK sin aprobación.

Secuencia: initialize, validar versión/capacidad tools, notifications/initialized, tools/list y tools/call de una herramienta permitida. Preservar IDs JSON-RPC, sesión/versión negociadas y cierre/cancelación. HTTP admite JSON o SSE incremental con UTF-8, eventos multilínea y fragmentos partidos. En modo automático intentar HTTP con transmisión y negociar SSE heredado solo ante respuestas compatibles de detección, dentro del mismo plazo. En SSE heredado aceptar endpoint de envío del servidor únicamente del mismo origen autorizado; no seguir destinos externos silenciosamente.

McpSettings permite URL y transporte, activar/desactivar, probar conexión y token de sesión opcional no persistente. Sin clave de proveedor IA, OAuth, instalación ni servidor propio. URL HTTP únicamente localhost/127.0.0.1/[::1], HTTPS para otros destinos; bloquear protocolos ajenos, credenciales embebidas, fragmentos y query con secretos. No usar credentials:include implícito. El endpoint debe permitir CORS para el origen real del estudio, métodos/cabeceras necesarios y exposición de cabeceras de sesión. Las restricciones de origen, permisos de acceso a red local y contenido mixto del navegador no se eluden. Referencia: [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS). La lista de orígenes, autenticación y coste del modelo pertenecen al operador del servidor.

Contrato de herramienta: entrada text y exclusions opcional; respuesta structuredContent o único bloque JSON con matches/missingScopes conforme a spec.md. El cliente pide explicaciones en español si el inputSchema lo admite; respuestas con mensajes no aptos se descartan o usan textos locales de catálogo, nunca se muestran instrucciones remotas libres. El servicio recibe validadores públicos; no deduce el catálogo leyendo el compilador. Limitar cuerpo normalizado a 128 KiB antes de parsear, acumulador SSE a 128 KiB y matches <=237/missingScopes <=24. Error MCP/isError activa local; no ejecutar herramientas adicionales ni aceptar callbacks de muestreo/acciones del servidor.

### Coordinación local/remota y carreras

Analizar localmente siempre con la coordinación existente y mantener kit utilizable. Tras 300 ms sin escritura, si MCP está habilitado y el texto es válido, empezar inferencia remota con plazo total 1500 ms; como máximo una solicitud vigente y una nueva intención reemplazable. Inicialización/listado necesarios consumen ese mismo plazo, no un plazo nuevo por cada operación. La prueba de conexión tampoco envía idea.

Cada petición captura revision, requestId, generación de conexión y huella de idea/exclusiones. Cualquier edición semántica, cambio de URL, apagado, timeout o desmontaje cancela lo obsoleto. La respuesta se acepta solo si todos esos datos siguen vigentes; aborto HTTP no garantiza cancelación del cálculo del servidor, por lo que se notifica cancelación MCP cuando proceda. ID de sesión/token y contenido remoto no se persistirán ni entrarán en caché del service worker.

Añadir metadatos de inferencia local/mcp en la coordinación, sin atribuir origen manual ni reaplicar ambas fuentes en bucle. El trabajador consume una instantánea de inferencias externas validadas para la revisión y omite sustituirlas por el matcher local de la misma idea mientras sean vigentes. No introducir network dentro del motor puro. Al terminar por error/plazo, retirar fuente remota y recomponer local para esa idea; elecciones manuales o de conjunto no se borran. Sugerencias remotas nunca inventan RF ni objetivos: se presentan para aceptar/descartar con IDs compatibles. Confianza <0,85 o ambigüedad no autoaplican.

Indicador conectado solo tras sesión validada con herramienta compatible; timeout/fallo vuelve a Motor Local Activo y aplica enfriamiento de 5 s antes del siguiente intento automático, sin alertas repetitivas. Probar conexión explícitamente permite reintento inmediato. No guardar ideas ni tokens en logs, trazas persistidas de red o errores públicos.

### Exportación, idioma y migración

Plan generado en specs/001-<slug>/plan.md incluye tabla de todos los valores efectivos y fragmentos completos reproducibles de tokens.css/recetas CSS; perfil Tailwind 3 autorizado incluye configuración y CSS complementario de texturas/estados. Tailwind 4 recibe CSS. Constitution exige respetar la personalización y revisar fallos de contraste, fuentes, iconos y movimiento reducido. Documentos PROJECT/TECHNICAL_CONTEXT/DECISIONS deben reflejar las decisiones de diseño pertinentes sin contradicciones. CSS/JSON/config exportados consumen el mismo diseño resuelto; no añadir archivos al manifiesto ZIP sin cambio de alcance.

Migrar borradores sin personalización preservando arquetipo y versiones previas; validar arrays, enums, números, colores y familias antes de usar. Mover MCP a clave independiente de preferencias; no guardar su token en Configuration, URLs, ZIP ni localStorage. Recursos de UI/diseño y fuentes se cachean como propios; URLs MCP y respuestas de inferencia quedan excluidas.

La aprobación de este plan autorizará retirar ambos controles de idioma, fijar es en UI/config/visor/copias/tokens, ignorar y limpiar exclusivamente la preferencia de idioma del estudio y mostrar una explicación española al recuperar una selección en inglés. No borrar borradores ni otras claves. La infraestructura i18n anterior puede conservarse inactiva para no duplicar una refactorización ajena; los tests de cuatro combinaciones de 003 quedan históricos y se sustituyen por pruebas de migración española. No traducir texto libre con MCP ni transmitirlo por cambiar idioma.

### Orden de entrega y verificación

1. Documentación y AGENTS.md, revisión humana; parada obligatoria.
2. Tras aprobación: contratos y validadores de diseño/inferencia, migración y acciones de editor por tareas aisladas.
3. Renderer/tokens y coherencia del kit; UI avanzada y muestra; carrusel y selección explícita.
4. Transporte MCP, coordinación y presentación/configuración; modo local primero y escenarios de fallo.
5. Español integral, guías actualizadas y pruebas de migración; regresión completa, accesibilidad y rendimiento; evidencia y push normal del hito aprobado.

Pruebas propuestas: servidor MCP simulado HTTP JSON/SSE/heredado y fragmentación UTF-8, timeout con reloj controlado, cancelaciones/carreras, CORS real en navegador, IDs/confianza/límites, secreto/emojis sin envío; todos los controles/diseños, contraste alfa/fronteras de ratio, campos inválidos y fuentes locales; 21 posiciones sin cambios de configuración, selección/desactivación/cancelación; ZIP/copia/plan/constitution/tokens coherentes y 34 referencias; borradores previos, modo no visual y offline. Lint, TypeScript, Vitest, build y Playwright Chromium/Firefox solo durante ejecución autorizada. Medir los presupuestos y no marcar aprobación manual inexistente.

Puerta de integración real: probar contra el servidor que el usuario configure, con herramienta y CORS compatibles, sin incluir su endpoint privado/credenciales en evidencia pública. Hasta entonces, distinguir interoperabilidad simulada de conexión real. Sin autorización de implementación, ninguna de estas pruebas nuevas se presenta como ejecutada.

Estado vigente de 005: H0–H4 autorizados; T-005-25…29 implementadas y verificadas; cierre y sincronización H4 completados en 9a0e46f. H5 pospuesto. Contratos y evidencia en [plan de 005](005-generador-profesional/plan.md) y [validation de 005](005-generador-profesional/validation.md).
