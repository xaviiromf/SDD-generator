# SDD-Studio

Una idea. Un plan claro. Genera, en español, un kit mínimo de desarrollo guiado por especificaciones para entregar a un agente de programación: requisitos estructurados, decisiones registradas, puntos de control y una revisión humana que solo puede hacer una persona.

Aplicación estática construida con React 19, TypeScript estricto, Vite, Zustand y CSS propio. Compila los documentos en un Web Worker y exporta el ZIP en memoria. No tiene backend ni llama a servicios externos. La interfaz usa exclusivamente iconos de lucide-react.

## Inicio local

Entorno verificado: Node 26.5.0 y npm 11.17.0.

```bash
npm ci
npm run dev
```

Abre la dirección que muestra Vite, con la subruta `/SDD-generator/`. Para comprobar la versión de distribución:

```bash
npm run build
npm run preview
```

`dist/` contiene únicamente recursos estáticos. La base predeterminada sirve para GitHub Pages en `/SDD-generator/`; para otro alojamiento en la raíz, construye con `npm run build -- --base /`.

## Cómo se usa

El estudio se recorre en cuatro pasos: Idea, Requisitos, Configuración y Documentos, más una Portada de resumen. Cada paso corresponde a un punto de control que el estudio comprueba:

| Punto | Paso | Se supera cuando |
|---|---|---|
| P1 Idea con alcance y exclusiones | Idea | Hay nombre, identificador válido, idea, alcance y al menos una exclusión (o «Sin exclusiones: motivo») |
| P2 Requisitos verificables | Requisitos | Hay al menos un requisito confirmado y todos los confirmados tienen título, comportamiento y un criterio observable |
| P3 Decisiones registradas | Configuración | Las elecciones que vienen de un conjunto o de una inferencia se han aceptado con «Aceptar elección», y los pilares están definidos |
| P4 Kit generado sin bloqueos | Documentos | El kit no tiene diagnósticos bloqueantes |

P5 (revisión humana) y P6 (autorización) no ocurren en el estudio: los registra la persona en el repositorio destino.

1. **Idea.** Cuenta quién necesita el proyecto, qué problema resuelve y qué queda fuera. «Convertir líneas en requisitos» crea un requisito pendiente por cada línea de «Qué debe hacer».
2. **Requisitos.** Completa actores, comportamiento, excepciones y criterios observables, y confirma cada requisito. «Propuestas y asistente» detecta actores, datos y exclusiones en tu texto con reglas locales y permite pegar la respuesta JSON de un asistente externo; lo propuesto no entra en las tareas hasta que lo confirmas.
3. **Configuración.** Elige plataforma, arquitectura, lenguajes, persistencia, estética, seguridad y pruebas, o parte de uno de los ocho conjuntos predefinidos. El catálogo muestra las opciones de esos conjuntos y lo que requieren; una opción fuera de ese grupo solo aparece si el borrador ya la tiene elegida.
4. **Documentos.** Revisa los siete documentos, los puntos de control y la trazabilidad. Si quieres una segunda lectura, «Revisión independiente (opcional)» copia el kit para otro asistente y registra sus hallazgos, sin decidir nada.

## El kit

El ZIP contiene siete documentos y ningún README, para no sobrescribir el del repositorio destino:

```text
AGENTS.md
docs/PROJECT_STATUS.md
docs/DECISIONS.md
specs/001-<identificador>/spec.md
specs/001-<identificador>/plan.md
specs/001-<identificador>/tasks.md
specs/001-<identificador>/validation.md
```

- **AGENTS.md** reúne las reglas, las fases con sus transiciones, la matriz de acceso y las preferencias de estilo del proyecto (español, cero emojis y lucide-react como valores por defecto editables).
- **docs/PROJECT_STATUS.md** incluye la guía de uso, la tabla de puntos de control y los bloques «Revisión humana» y «Autorización», que solo rellena la persona.
- **docs/DECISIONS.md** es un registro de solo añadir; indica qué decisiones vienen de un conjunto o de una inferencia sin aceptar.
- **spec.md**, **plan.md**, **tasks.md** y **validation.md** se generan desde los requisitos estructurados. Las tareas usan los identificadores T-RF-n-IMP y T-RF-n-VAL; la validación empieza siempre en «No ejecutado». Las rutas y comandos candidatos van aislados en la sección «Propuesta del generador (no verificada)» de plan.md.

Para entregarlo, copia los siete archivos en la raíz del repositorio destino y usa como primer mensaje para el agente: «Lee AGENTS.md y sigue la fase indicada en docs/PROJECT_STATUS.md». «Copiar primer mensaje» lo copia por ti.

**Cambios posteriores.** En «Contenido del ZIP», «Cambio en un proyecto existente» exporta solo la carpeta `specs/00N-<identificador>/` con un número que propone el estudio y puedes cambiar, más un fragmento para añadir a DECISIONS.md y otro para AGENTS.md. Nunca incluye PROJECT_STATUS.md: el repositorio destino conserva su estado y sus autorizaciones.

## Limitaciones

El motor es local y determinista. No ejecuta ni compila el código del proyecto objetivo, no reemplaza el juicio de ingeniería y no inventa reglas cuando falta contexto. Los documentos requieren revisión.

El borrador se guarda en localStorage cuando es posible; si el almacenamiento falla, puedes seguir en memoria. Una posible credencial bloquea el guardado, la copia y la exportación, pero nunca borra el último borrador válido. Los emojis solo generan un aviso al exportar mientras la preferencia sea «cero emojis». El detector usa patrones locales y no garantiza encontrar cualquier secreto. El tamaño total del borrador está limitado a 1 MiB, y el del kit también.

Tras la primera carga, cuando aparece «Preparación sin conexión completa», el estudio funciona sin red. El service worker requiere un origen seguro, como HTTPS o localhost.

Los borradores de versiones anteriores se migran al abrirlos: si no tenían requisitos estructurados, cada línea del alcance pasa a ser un requisito pendiente con su texto literal. Los datos de perfiles y aportaciones manuales que tuviera el borrador se conservan. Si el navegador guarda proyectos de la antigua biblioteca, «Exportar biblioteca» los descarga tal como están.

## Verificación

```bash
npm run lint        # ESLint y comprobación de formato Prettier
npm run typecheck
npm run test
npx playwright install chromium firefox
npm run build
npm run test:e2e
npm run budget      # presupuesto de tamaño del build
```

La regresión visual compara capturas de referencia solo en la máquina donde se generaron: `SDD_VISUAL=1 npx playwright test tests/e2e/visual.spec.ts --project=chromium`. GitHub Actions (.github/workflows/ci.yml) ejecuta lint, tipos, unitarias, build, presupuesto y la suite de Chromium. Las pruebas automáticas no sustituyen la revisión con un lector de pantalla real.

## Fuentes y licencias

Las 30 familias tipográficas se sirven localmente con sus licencias OFL en `public/fonts/`. `scripts/download-fonts.py` permite obtenerlas de nuevo desde Google Fonts y su repositorio oficial; no forma parte de la aplicación en tiempo de uso. El kit declara las tipografías por nombre y no incluye archivos de fuente.
