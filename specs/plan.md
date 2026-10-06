# Plan técnico — 001 / SDD-Studio

Especificación: [spec.md](spec.md). Fecha: 2026-10-06. Estado: **propuesto; sin código**. Implementación: pendiente de autorización.

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
    engine/templates/                   seis plantillas documentales españolas
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
3. El trabajador normaliza texto, detecta señales, evalúa compatibilidad, propone inferencias y genera los seis documentos. Todas las funciones de dominio reciben entradas explícitas y no dependen de red, reloj o DOM.
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

### Kit exportado y contenido mínimo

| Ruta | Contenido obligatorio |
|---|---|
| `specs/spec.md` | Problema, usuarios, historias, alcance positivo/negativo, RF, datos, criterios y decisiones pendientes. |
| `specs/plan.md` | Árbol del proyecto objetivo, módulos/componentes, contratos, compatibilidades, tokens y estrategia de pruebas. |
| `specs/tasks.md` | Tareas `[T1]`, `[T2]`…, RF relacionados, dependencias sin ciclos, archivos previstos y verificación. |
| `constitution.md` | Reglas de español, ausencia de emojis, arquitectura, validación, secretos, integridad, alcance y simulación cuando aplique. |
| `docs/PROJECT.md` | Identidad, pila seleccionada, versiones declaradas, propósito y limitaciones. |
| `prompts/00-orchestrator.md` | Lectura del kit, DOCUMENT, parada y solicitud de revisión, implementación solo autorizada y validación con evidencia. |

El árbol del ZIP contiene estos documentos y no promete código objetivo inexistente. Las rutas de implementación propuestas se muestran dentro del plan del kit. La exportación directa de tokens puede añadir su archivo elegido al paquete cuando el usuario lo indique; no cambia los seis mínimos. El orquestador exportado es autónomo y no depende de la ruta absoluta del marco en esta máquina.

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
| A06 · Tierra orgánica y micelio | #181614 / #26231F | #BC6C25 / #52796F | #EDE0D4 / #A39688 / #38332D | Fraunces + Cabinet Grotesk | 12 px; ruido terrestre sutil. |
| A07 · Lujo de obsidiana monocromática | #050505 / #0D0D0F | #D4AF37 | #F4F4F5 / #A1A1AA / #1F1F24 | Playfair Display + Satoshi | 2 px; bisel, resplandor contenido. |
| A08 · Onda sintética retro de Tokio | #120D1D / #1D152E | #00F0FF / #FF007F | #F5F3FF / #938BA1 / #352554 | Syne + Space Mono | 10 px; sombras luminosas de neón. |
| A09 · Horizonte técnico solarizado | #002B36 / #073642 | #B58900 / #2AA198 | #93A1A1 / #657B83 / #0D4958 | Inconsolata + Source Sans 3 | 4 px; acabado mate. |
| A10 · Aura de cristal esmerilado | #0A0B12 / rgba(255,255,255,0.04) | #8B5CF6 | #F8FAFC / #94A3B8 / rgba(255,255,255,0.12) | Outfit + Inter | 16 px; desenfoque 24 px y luz flotante. |
| A11 · Carbón wabi-sabi japonés | #1E1E20 / #28282B | #C84B31 | #DCD6CD / #8A857D / #38383C | Shippori Mincho + Zen Kaku Gothic | 0 px; mate táctil. |
| A12 · Mar profundo bioluminiscente | #020B14 / #061A29 | #00E5FF | #E0F7FA / #5C8296 / #0D344D | Clash Display + General Sans | 14 px; viñeta oceánica, bordes luminosos. |
| A13 · Monolito industrial | #191A1C / #242629 | #F59E0B | #E5E7EB / #9CA3AF / #373A40 | Chivo + DM Mono | 2 px; chaflán, espaciado compacto. |
| A14 · Calidez del desierto de Sedona | #FDFAF6 / #F5EDE4 | #9C4125 | #2B2623 / #7C7067 / #E5D9CC | Cormorant Infant + Switzer | 8 px; superficies cálidas. |
| A15 · Cafetería de espresso aterciopelado | #141110 / #211C1A | #D97706 | #F5EBE0 / #96867B / #3B322D | Newsreader + Epilogue | 10 px; profundidad cálida. |
| A16 · Titanio de sala limpia aeroespacial | #0E1117 / #161B22 | #FF5C00 | #E6EDF3 / #8B949E / #30363D | Space Grotesk + Geist Mono | 4 px; retícula precisa. |
| A17 · Musgo de bosque otoñal | #0D1612 / #16231D | #22C55E / #A16207 | #ECFDF5 / #6B8F7D / #22382E | Instrument Serif + Albert Sans | 12 px; sombras orgánicas suaves. |
| A18 · Brutalismo ácido Y2K | #0C0C0C / #171717 | #CCFF00 | #FFFFFF / #888888 / #262626 | Syne ExtraBold + JetBrains Mono | 0 px; insignias gruesas redondeadas. |
| A19 · Zafiro de medianoche art déco | #070E1B / #0E182B | #C5A059 | #F1F5F9 / #64748B / #1E304F | Cinzel + Manrope | 6 px; simetría y brillo metálico sutil. |
| A20 · Lujo sereno de lino y arena | #F7F5F0 / #ECE7DE | #556B2F | #202020 / #66635D / #DED7CB | Bespoke Serif + Neue Montreal | 6 px; sin sombra, espacio amplio. |
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
| Generación | Determinismo con igual entrada; documentos españoles; pendientes explícitos; tareas acíclicas; cambios de árbol por destino; seis revisiones iguales. |
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
