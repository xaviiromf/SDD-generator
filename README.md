# SDD-Studio

Una idea. Un plan claro. Genera kits de desarrollo guiado por especificaciones exclusivamente en español, con requisitos estructurados, trazabilidad, reglas locales e inferencia MCP opcional.

Aplicación estática construida con React 19, TypeScript estricto, Vite, Zustand y Tailwind CSS. Compila documentos en un Web Worker y exporta ZIP en memoria. La interfaz usa exclusivamente iconos de lucide-react.

## Inicio local

Requisitos: una versión de Node compatible con las dependencias fijadas y npm. Entorno verificado: Node 26.5.0 y npm 11.17.0.

```bash
npm ci
npm run dev
```

Abre la dirección que muestra Vite, con la subruta `/SDD-generator/`. Para comprobar la versión de distribución:

```bash
npm run build
npm run preview
```

`dist/` contiene únicamente recursos estáticos; no requiere servidor de aplicación. La base predeterminada permite GitHub Pages en `/SDD-generator/`. Para otro alojamiento en la raíz, construye con `npm run build -- --base /`. No se ha publicado un sitio como parte de esta implementación.

## Cómo Utilizar Apropiadamente la Herramienta para Sacarle el Máximo Provecho

1. **Define el concepto en Idea / Prompt.** Cuenta quién necesita el proyecto, qué problema resuelve y cómo debería usarse. Por ejemplo: «Un taller necesita crear y cancelar reservas sin conexión». El análisis reconoce tecnologías y algunas señales de alcance; no comprende arbitrariamente todas las reglas del negocio.
2. **Declara requisitos y contexto.** En Idea abre «Requisitos y criterios» y «Entrevista y contexto». Registra actores, comportamiento, condiciones, excepciones y criterios observables; añade reglas, decisiones, contratos, preguntas y exclusiones cuando existan. Relaciona cada requisito con sus entradas de contexto. Los IDs permanecen estables al reordenar. Puedes empezar sin escoger tecnologías y conservar campos pendientes. Para un proceso documental, desmarca «El proyecto requiere implementación de software».
3. **Refina las siete fases en Configuración.** Elige plataforma, arquitectura, lenguajes, persistencia, estética, seguridad y flujo. Puedes partir de uno de los ocho conjuntos predefinidos. Su aplicación exige confirmar la sustitución de decisiones; las variantes de motor, framework y base de datos deben elegirse explícitamente. Acepta sugerencias como persistencia ausente. Las selecciones manuales prevalecen sobre las inferencias.
4. **Personaliza estética y tokens cuando corresponda.** Recorre el carrusel sin aplicar cambios; selecciona o desactiva explícitamente su estilo. Hay 21 arquetipos con parejas tipográficas, paletas, radios y acabados concretos. Las fichas calculan contraste y muestran resultados reales, incluso cuando una paleta original no pasa AA. Los ajustes avanzados permiten elegir tres fuentes locales, seis colores con transparencia, texturas, botones, tarjetas, iconos y movimiento; la muestra es interactiva y advierte el contraste insuficiente. Al cambiar la base puedes conservar ajustes, restablecerlos o cancelar. Seleccionar un arquetipo configura el proyecto generado; el estudio conserva su propia identidad. Puedes descargar CSS, JSON o una configuración de Tailwind 3 si escoges expresamente ese perfil. Para Tailwind 4 usa variables CSS.
5. **Revisa y entrega el kit.** Recorre los 34 documentos, examina cobertura de configuración, calidad estructural, diagnósticos y grafo de trazabilidad, copia el prompt maestro o descarga el ZIP. Abre la carpeta extraída en VS Code y entrega `prompts/00-orchestrator.md` a Codex o Cursor. Lee también `AGENTS.md` y los manuales; para cambios o continuidad utiliza las guías 06 y 07. Solicita primero DOCUMENT, revisa lo que complete el agente y autoriza código solo después. El ZIP incluye documentación; los archivos de implementación dibujados dentro del plan son propuestas, no código ya generado.

El kit se organiza en 34 documentos: seis archivos raíz, diez documentos de gobernanza en `docs/`, nueve guías en `prompts/`, un índice de especificaciones, cuatro plantillas reutilizables en `specs/_templates/` y cuatro documentos activos en `specs/001-<identificador>/`: `spec.md`, `plan.md`, `tasks.md` y `validation.md`. El registro de validación empieza «No ejecutado»; no incluye resultados del generador.

Usa el árbol anidado o «Documento del kit» para consultar cualquiera de los 34 archivos, incluido el manual TXT. Los accesos rápidos conservan spec, plan, tasks, constitution, PROJECT y el orquestador. Cambiar el identificador actualiza la carpeta activa y sus referencias sin cambiar el documento seleccionado. El ZIP coincide con el visor; las rutas de código del plan siguen siendo propuestas.

### Idioma y recuperación de preferencias

La interfaz, los 34 documentos generados, la copia, el ZIP, los tokens y los comentarios de preparación se presentan exclusivamente en español. Las antiguas preferencias ES/EN se migran sin eliminar nombre, idea, alcance, selecciones ni personalizaciones. Tus textos se conservan literalmente; no se traducen automáticamente. Las rutas, los identificadores y los nombres de productos mantienen su forma técnica.

### Inferencia MCP opcional

El tutorial [INSTRUCCIONES_MCP_TUNNEL.md](INSTRUCCIONES_MCP_TUNNEL.md) explica cómo preparar un servidor compatible, publicar su túnel y utilizarlo desde el estudio, Codex, Claude Code, Google Antigravity y Cursor.

En el panel Idea, «Ajustes de MCP» permite indicar un endpoint HTTPS (o HTTP en localhost), transporte automático, HTTP con transmisión o SSE heredado. El servidor debe aceptar CORS desde el origen del estudio y publicar `match_technologies` o `infer_intent` con entrada `text` y respuesta estructurada de coincidencias y alcances. «Probar conexión sin enviar idea» verifica negociación y herramienta.

Antes de guardar la activación se muestra el destino y el permiso para enviar únicamente idea y exclusiones. Una credencial de sesión opcional permanece en memoria; nunca se guarda ni se incluye en el kit. No introduzcas claves de proveedores de IA. El servidor externo es responsable de su modelo, sus costes y su tratamiento de datos.

El motor local actúa inmediatamente. Tras 300 ms sin cambios, MCP dispone de un máximo total de 1500 ms para negociar e inferir. Sin configurar, sin conexión, con errores o al exceder ese plazo, el análisis vuelve al motor local. Las coincidencias de confianza inferior a 0,85 y los alcances ausentes requieren confirmación; las decisiones manuales y los conjuntos prevalecen. La confianza declarada por un servidor no garantiza precisión. La integración se verifica con servidores simulados; un endpoint real debe comprobarse con su configuración concreta.

### Atajos y búsqueda

Cmd + K en macOS o Ctrl + K abre la paleta de 237 opciones y ocho conjuntos. Busca un producto, un arquetipo o una arquitectura; las erratas «pyton» y «tailwnd» se reconocen. Usa flechas y Enter para elegir; Escape cierra y devuelve el foco.

En Configuración, Cmd/Ctrl + 1…7 abre una fase cuando no estás escribiendo en un campo. Algunos navegadores reservan esas combinaciones: usa los encabezados visibles como alternativa. Acordeones, pestañas, árbol, diálogos y acciones permiten teclado.

### Django y sus complementos

En Arquitectura elige Monolito o Cliente y API desacoplados; en Lenguajes y frameworks elige Python y Django en Frameworks de servidor y herramientas. Puedes seleccionar Plantillas Django para páginas renderizadas en el servidor. En Persistencia y comunicación aparecen Django REST Framework, Django Ninja y los complementos de filtrado, OpenAPI, WebSockets y tareas en segundo plano; Django ORM puede combinarse con la base de datos elegida. En Seguridad están django-allauth, Simple JWT y CORS; en Flujo y distribución, pytest-django.

Las opciones dependientes se muestran al seleccionar su framework. drf-spectacular y Simple JWT requieren DRF; si retiras un requisito, se conserva tu selección y la exportación se bloquea hasta corregirla. La búsqueda también permite localizar Django aunque un filtro lo oculte y señala cualquier incompatibilidad resultante.

### Redacta un alcance que pueda verificarse

Escribe necesidades concretas y separa qué debe hacer de qué queda fuera. «Crear, consultar y cancelar reservas; no incluir pagos, cuentas ni sincronización cloud» ofrece mejores límites que «una aplicación completa». Aporta roles, datos y criterios de aceptación; el generador deja como pendientes los contratos específicos que no conoce.

«Preparación documental» muestra los campos que faltan, preguntas pendientes y referencias a revisar. El grafo enlaza cada requisito con decisiones, contratos, tareas y criterios; sus validaciones empiezan «No ejecutado». Un estado «Listo para revisión» sigue requiriendo revisión humana y autorización explícita para implementar. El diagnóstico reconoce referencias y contradicciones conocidas, no cualquier conflicto semántico.

El medidor «Cobertura de configuración» valora seis pilares con peso igual. «En memoria» es una decisión válida; diseño «No aplica» cuenta para destinos no visuales. Un 100 % indica que los pilares están declarados, no que el proyecto sea seguro, viable o listo para producción.

## Limitaciones y Alcance del Generador

SDD-Studio funciona en el cliente y no depende de un backend propio. El motor local es determinista. Idea, configuración y documentos permanecen en memoria y en localStorage cuando es posible guardar; activar MCP autoriza el envío de idea y exclusiones al servidor configurado. Los servidores y bases del catálogo describen tu proyecto objetivo; seleccionarlos no conecta el estudio a esos servicios.

No ejecuta ni compila el código del proyecto objetivo; estructura especificaciones para que una persona o agente autorizado lo implemente. No reemplaza el juicio de ingeniería ni inventa reglas complejas cuando falta contexto. Los documentos generados requieren revisión. El alcance actual conserva un único borrador local. Multiproyecto, diferencias, perfiles extensibles y adaptadores de contratos están pospuestos; los destinos fuera del catálogo pueden documentarse sin prometer una implementación especializada. Los presets versionados conservan las versiones declaradas en el prompt y no se presentan como recomendaciones sobre versiones recientes.

La primera carga necesita descargar los recursos propios. Cuando aparece «Preparación sin conexión completa», puedes recargar, cambiar estilos y exportar con la red desconectada. Las fuentes, el trabajador y los módulos de exportación se guardan localmente en la caché. El service worker requiere origen seguro, como HTTPS o localhost. Abrir `index.html` directamente con `file://` no sustituye servir el sitio estático.

Si localStorage está restringido, corrupto o sin espacio, se explica el fallo y puedes trabajar en memoria. «Borrar borrador» requiere confirmación y afecta solo la clave del estudio. El detector de credenciales usa patrones locales; no garantiza detectar cualquier secreto. No introduzcas credenciales reales. Los textos con emojis o posibles secretos bloquean guardado, copia y exportación hasta corregirse.

Límites: nombre hasta 80 caracteres, identificador hasta 64, idea hasta 20.000, alcance hasta 100 líneas de 500 caracteres por sección, kit hasta 1 MiB de texto. El modelo estructurado admite hasta 100 requisitos, 10 criterios y 10 excepciones por requisito, 100 elementos por colección de contexto y 256 KiB de datos adicionales. Los textos de contexto y criterios admiten hasta 2000 caracteres. Los datos faltantes se incluyen como pendientes explícitos. Los conflictos tecnológicos bloquean la exportación normal; con requisitos estructurados puedes permitir expresamente un borrador para revisión. Ese permiso conserva los bloqueos de secretos, rutas inseguras y revisión obsoleta. Los diagnósticos de preparación se mantienen visibles en el kit. Portapapeles denegado ofrece selección y copia manual. Los comandos de preparación se muestran y nunca se ejecutan.

## Verificación y trazabilidad

```bash
npm run lint
npm run typecheck
npm run test
npx playwright install chromium firefox
npm run build
npm run test:e2e
```

Las pruebas de navegador usan el build de producción servido localmente. Resultados y limitaciones de requisitos/trazabilidad están en [validación 005](specs/005-generador-profesional/validation.md), y la evidencia histórica en [specs/validation.md](specs/validation.md); estado y autorización, en [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md). Las pruebas automáticas no sustituyen la aceptación visual del usuario ni una revisión con lector de pantalla real.

## Fuentes y licencias

Las 30 familias tipográficas se sirven localmente con sus licencias OFL preservadas en `public/fonts/`. Las sustituciones autorizadas por el usuario se registran en [docs/DECISIONS.md](docs/DECISIONS.md). Los avisos legales del proveedor conservan su idioma original.

`scripts/download-fonts.py` permite obtener de nuevo los archivos desde Google Fonts y su repositorio oficial; no forma parte de las llamadas de la aplicación en tiempo de uso. Las tipografías exportadas se declaran por nombre; el kit no incluye archivos de fuente ni autoriza redistribuir fuentes ajenas.

La documentación de trabajo de la ampliación 002 se conserva solo localmente por instrucción del usuario y está excluida de Git. Su exclusión no afecta los kits que genera la aplicación.
