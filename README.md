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

### Proyectos locales, versiones y respaldos

Abre «Proyectos» en la cabecera para crear un proyecto vacío o duplicar la edición actual. Cada proyecto conserva nombre, idea, configuración, requisitos, diseño y aportaciones manuales. El guardado automático del borrador se programa tras 800 ms sin cambios; «Guardar versión» crea una instantánea explícita con una etiqueta. Abrir otro proyecto o recuperar una versión muestra primero las diferencias. Recuperar conserva también una versión del borrador anterior; cancela o libera una versión si se alcanza el límite. No se eliminan proyectos ni versiones automáticamente.

El respaldo JSON incluye los proyectos elegidos y sus versiones; el respaldo completo incorpora la edición activa en memoria sin exigir una escritura previa. También puedes respaldar solo la edición actual si la biblioteca está dañada o no puede guardarse. Descarga un respaldo antes de borrar los datos del navegador, cambiar de equipo u origen del sitio. El ZIP del kit mantiene sus 34 documentos; el JSON es el formato para recuperar proyectos en el estudio.

Para importar, elige un respaldo JSON. Se validan formato, versión, campos, referencias, IDs, límites y textos antes de mostrar la comparación; cancelar no escribe. La opción predeterminada crea copias con IDs nuevos. La sustitución de proyectos coincidentes exige marcarla expresamente y confirmar; se conserva una copia del proyecto anterior con su historial. Si falta espacio para esa copia, se rechaza la operación completa. No se importan ZIP, directorios ni código ejecutable.

La biblioteca admite hasta 20 proyectos y cinco versiones explícitas por proyecto. Su presupuesto es 2 MiB de texto serializado contado como UTF-16; cada configuración admite 512 KiB UTF-8 y un archivo de importación hasta 2 MiB UTF-8. Son límites del estudio: el navegador puede imponer una cuota menor o restringir el almacenamiento. Las diferencias muestran hasta 200 entradas e indican el total. Ante cuota, revisión concurrente o datos corruptos se conserva la edición, se explica el fallo y se permite respaldarla; no se sustituye silenciosamente el registro anterior.

La biblioteca pertenece al navegador y al origen del sitio; no se sincroniza entre equipos ni cuentas. Si otra pestaña cambia la biblioteca, la pestaña anterior conserva su edición y pide recargar o respaldar antes de escribir. Al cerrar u ocultar la página se guarda una referencia de continuidad; una recarga normal puede recuperar la edición pendiente sin reemplazar una revisión ajena. Un cierre abrupto del proceso o un fallo de cuota puede impedir ese último guardado: el respaldo descargado sigue siendo la vía de recuperación externa. «Borrar borrador» no elimina la biblioteca completa; elimina proyectos y versiones desde sus acciones con confirmación.

### Aportaciones manuales por sección

En el visor abre «Aportaciones manuales por sección», elige un destino del documento generado y redacta tu aportación. Se añade como bloque propio sin reemplazar el texto generado y se conserva al regenerar, duplicar, respaldar o recuperar el proyecto. Los requisitos de negocio y sus criterios deben declararse en el editor estructurado para formar parte del grafo; una aportación libre no se convierte automáticamente en requisito.

Si cambia o desaparece la sección de destino, la nueva generación queda pendiente. «Revisar cambios de secciones» permite comparar el contenido anterior y el nuevo, mantener la aportación en su sección o llevarla al final del documento. Confirmar preserva el texto aportado y regenera; cancelar conserva el resultado anterior y la exportación permanece bloqueada para evitar entregar una revisión obsoleta. Las aportaciones siguen los controles de seguridad y el límite total del kit.

Hay hasta 50 aportaciones, 128 KiB UTF-8 en conjunto y 10.000 caracteres por texto. Se guarda una referencia de la sección de hasta 40.000 caracteres; una sección mayor no puede usarse como destino directo. El encabezado completo del documento permite añadir al final. Los encabezados dentro de bloques de código no se interpretan como destinos.

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

No ejecuta ni compila el código del proyecto objetivo; estructura especificaciones para que una persona o agente autorizado lo implemente. No reemplaza el juicio de ingeniería ni inventa reglas complejas cuando falta contexto. Los documentos generados requieren revisión. El alcance actual incluye biblioteca multiproyecto, versiones explícitas, respaldos JSON y comparación de diferencias. Los perfiles extensibles y adaptadores de contratos siguen pospuestos; los destinos fuera del catálogo pueden documentarse sin prometer una implementación especializada. Los presets versionados conservan las versiones declaradas en el prompt y no se presentan como recomendaciones sobre versiones recientes.

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
