# Cómo utilizar un túnel MCP con SDD-Studio y agentes de desarrollo

Guía de configuración para Codex, Claude Code, Google Antigravity y Cursor. En esta guía se interpreta «agy» como Google Antigravity. Las instrucciones de productos externos se contrastaron con sus fuentes oficiales el 7 de octubre de 2026; comprueba la ayuda de tu versión antes de modificar su configuración.

## 1. Qué necesitas y cómo se conectan las piezas

SDD-Studio es un **cliente MCP**. Envía una idea a una herramienta de un servidor externo, valida las tecnologías sugeridas y las incorpora al proceso local de generación. El túnel permite llegar a ese servidor mediante HTTPS; la inferencia la realiza el modelo o motor que el operador conecte al servidor.

```text
Navegador con SDD-Studio
    -> endpoint HTTPS del túnel, por ejemplo /mcp
    -> servidor MCP de inferencia
    -> modelo configurado por el operador
    <- tecnologías, confianza y alcances pendientes

Codex / Claude Code / Antigravity / Cursor
    -> el mismo servidor MCP, como clientes independientes
```

Los agentes pueden ayudarte a construir, revisar y probar el servidor, o consultar sus herramientas. Añadir un servidor a la configuración de un agente **no conecta ese agente a SDD-Studio ni convierte su sesión en un servicio de inferencia**. La configuración del navegador y la de cada agente son independientes.

Necesitas un servidor que publique `match_technologies` o `infer_intent` con el contrato de la sección 3. Un servidor genérico de archivos, documentación o bases de datos no cumple ese contrato. Tampoco basta con reenviar por HTTP un proceso MCP de entrada/salida estándar: hacen falta el transporte compatible y las herramientas adecuadas.

Este repositorio incluye el cliente, no el servidor de inferencia ni un modelo. La guía no instala servicios, inicia túneles ni crea cuentas. Si todavía no tienes un servidor compatible, utiliza el encargo de la sección 4 antes de continuar. Para trabajar sin servicios externos, deja MCP desactivado: el generador mantiene todas sus funciones locales.

## 2. Elige dónde ejecutar el servidor

| Situación | Endpoint de ejemplo | Qué debes comprobar |
|---|---|---|
| Navegador y servidor en el mismo equipo | `http://127.0.0.1:3000/mcp` | Servidor activo, CORS y permisos de red local del navegador. |
| Navegador en otro equipo o teléfono | `https://mcp.ejemplo.com/mcp` | Túnel hacia el equipo del servidor, HTTPS, autenticación y CORS. |
| Agente en contenedor o máquina remota | URL accesible desde ese entorno | `localhost` del agente puede ser distinto del navegador y del servidor. |
| Servidor con SSE heredado | `https://mcp.ejemplo.com/sse` | Túnel que permita SSE y endpoint de envío del mismo origen. |

Los dominios `ejemplo.com`, UUID y rutas de configuración de esta guía son marcadores: sustitúyelos por tus valores. El puerto 3000 es ilustrativo; no hay un servidor de SDD-Studio escuchando allí por defecto.

`localhost` se refiere al equipo que efectúa la petición. Una aplicación estática publicada no ejecuta tu servidor MCP en su alojamiento. Si abres el estudio en un teléfono, `127.0.0.1` apunta al teléfono. Para una primera prueba, sirve el estudio y el servidor localmente en el mismo equipo; después valida el túnel HTTPS desde el navegador objetivo.

La aplicación acepta HTTPS remoto y HTTP únicamente para `localhost`, `127.0.0.1` y `[::1]`. No admite credenciales incrustadas en la URL, fragmentos ni parámetros de consulta con secretos. Usa la dirección final del endpoint, sin redirecciones a otra URL o a una página de acceso.

## 3. Contrato que debe publicar el servidor

El contrato del producto está documentado en [specs/spec.md](specs/spec.md) y en el apartado MCP de [specs/plan.md](specs/plan.md). Es el criterio de compatibilidad con SDD-Studio.

### Transporte y negociación

Para una instalación nueva, configura **HTTP con transmisión**, también denominado Streamable HTTP, en una ruta como `/mcp`. El servidor debe gestionar `initialize`, `notifications/initialized`, `tools/list` y `tools/call`. Un `POST /infer` que devuelve JSON sin negociación MCP no sustituye este protocolo. Las respuestas HTTP pueden ser JSON o SSE. Referencias: [transportes MCP](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports) y [ciclo de vida MCP](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle).

El cliente inicia con la versión `2025-11-25` y admite negociación con `2025-06-18`, `2025-03-26` y `2024-11-05`. Si el servidor usa sesiones, devuelve `Mcp-Session-Id` y acepta esa cabecera en solicitudes siguientes, junto con `MCP-Protocol-Version`. Permite el cierre de sesión mediante `DELETE` cuando corresponda.

El modo **SSE heredado** utiliza una conexión de recepción y un endpoint de envío anunciado por el servidor; ambos deben permanecer en el mismo origen autorizado. El modo **Detección automática** intenta HTTP primero y solo prueba el transporte heredado ante respuestas de detección compatibles. Elegir explícitamente el transporte conocido evita trabajo adicional dentro del presupuesto de latencia.

### Herramienta y entrada

Publica preferentemente `match_technologies`. Si no está disponible, el cliente puede utilizar `infer_intent`; no encadena ambas herramientas para cada idea. El siguiente objeto ilustra la declaración que debe aparecer en `tools/list`:

```json
{
  "name": "match_technologies",
  "description": "Identifica tecnologías del catálogo y alcances pendientes sin modificar archivos.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "text": { "type": "string" },
      "exclusions": { "type": "string" }
    },
    "required": ["text"],
    "additionalProperties": false
  }
}
```

`text` contiene la idea escrita por el usuario, con un máximo de 20.000 caracteres. `exclusions` contiene las exclusiones cuando corresponda; el contrato admite también una declaración compatible como lista de cadenas. No exijas argumentos adicionales como modelo, repositorio, clave de proveedor o ruta del proyecto: la aplicación no los proporciona. Configúralos en el servidor.

La aplicación transmite idea y exclusiones, no el kit entero, los archivos del repositorio ni todas las selecciones de configuración. El servidor debe conocer previamente los IDs del catálogo vigente: el cliente no se los envía automáticamente.

### Respuesta

Devuelve el resultado en `structuredContent`. Como alternativa, puedes devolver un único bloque de texto cuyo contenido sea el JSON del resultado, sin Markdown ni explicaciones fuera de él. MCP define ambos mecanismos en su [contrato de herramientas](https://modelcontextprotocol.io/specification/2025-11-25/server/tools).

Ejemplo de resultado de `tools/call`, dentro de la envoltura JSON-RPC correspondiente:

```json
{
  "structuredContent": {
    "matches": [
      { "id": "python", "confidence": 0.96, "reason": "La idea solicita Python." },
      { "id": "django", "confidence": 0.94, "reason": "La idea solicita Django." }
    ],
    "missingScopes": [
      {
        "id": "persistencia",
        "message": "Falta confirmar dónde se guardarán las reservas.",
        "options": ["sqlite", "postgres"]
      }
    ]
  },
  "content": []
}
```

Los IDs del ejemplo son opciones del catálogo; no equivalen a sus etiquetas visibles. Usa una lista permitida versionada del catálogo completo y verifica sus relaciones de compatibilidad. No inventes IDs ni confundas `postgres` con una etiqueta como «PostgreSQL».

| Campo | Restricción del cliente |
|---|---|
| `matches` | Hasta 237 entradas, con IDs conocidos y sin duplicados. |
| `confidence` | Número finito entre 0 y 1; no porcentajes ni cadenas. |
| `reason` | Cadena de hasta 500 caracteres; redactar en español. |
| `missingScopes` | Hasta 24 entradas, con IDs únicos. |
| ID de alcance | Entre 1 y 64 caracteres, letras minúsculas, números y guiones. |
| `message` | Cadena de hasta 500 caracteres; redactar en español. |
| `options` | IDs conocidos de tecnologías, sin duplicados. |
| Tamaño | Respuesta y acumulador SSE limitados a 128 KiB. |

Una respuesta inválida activa el motor local; devolver algunos aciertos no compensa incluir un ID desconocido. El estudio normaliza las explicaciones para presentar textos locales seguros y no interpreta prosa remota como instrucciones ejecutables.

Una confianza de al menos `0.85` permite incorporar inferencias compatibles cuando el usuario o un conjunto no haya fijado la decisión. Las coincidencias ambiguas, las de menor confianza y los alcances ausentes requieren revisión. La precedencia es **decisión manual > conjunto predefinido > inferencia**. La confianza que declara el servidor no es una garantía de precisión.

## 4. Preparar un servidor con ayuda de un agente

Puedes entregar este encargo a Codex, Claude Code, Antigravity o Cursor en un proyecto separado del generador. Adjunta esta guía y los contratos públicos pertinentes; evita cargar todo el repositorio como contexto.

```text
Necesito preparar un servidor MCP de inferencia compatible con SDD-Studio.
Primero documenta arquitectura, configuración y pruebas; espera mi aprobación
antes de implementar o instalar dependencias.

Publicará match_technologies mediante Streamable HTTP en /mcp.
Recibirá text y exclusions opcional, y devolverá structuredContent con
matches [{id, confidence, reason}] y missingScopes [{id, message, options}],
conforme a INSTRUCCIONES_MCP_TUNNEL.md.

Solicita una lista permitida versionada de IDs del catálogo; no los inventes.
Separa el adaptador del modelo, la validación del resultado y el transporte.
Mantén las credenciales del proveedor en el servidor, fuera de Git y del navegador.
Utiliza una credencial independiente para autenticar a los clientes del servidor.
Valida el origen y configura CORS para el origen exacto de mi estudio.
No escribas archivos ni ejecutes comandos al procesar una idea de un usuario.
No registres ideas, exclusiones ni credenciales en los logs.

Diseña la respuesta para completar negociación e inferencia en menos de 1500 ms.
Prueba IDs desconocidos, exclusiones, contradicciones, errores del modelo,
cancelación, autenticación, CORS y tiempos de respuesta.
Documenta los comandos reales de inicio y las variables necesarias.
No modifiques SDD-Studio ni publiques nada sin mi instrucción.
```

El proveedor del modelo se elige en ese servidor: puede ser un servicio autorizado de OpenAI, Anthropic, Google o un modelo local. MCP no selecciona un proveedor ni reutiliza automáticamente la suscripción del agente. Verifica acceso, facturación y condiciones del proveedor antes de configurar sus credenciales.

Usar una sesión interactiva del agente para cada pulsación añade arranque, planificación y posibles aprobaciones. Para cumplir 1500 ms, prepara un servicio persistente con una inferencia acotada y mide su latencia real. Un adaptador de agente requeriría desarrollo propio, credenciales permitidas y el mismo contrato; los comandos de conexión de la sección 7 no implementan ese adaptador.

## 5. Publicar el endpoint mediante un túnel

Primero inicia el servidor con **su comando documentado** y verifica que escucha en `127.0.0.1:3000`. Instala `cloudflared` según la [documentación oficial de Cloudflare](https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/create-local-tunnel/). El túnel debe ejecutarse en un entorno que pueda alcanzar ese servidor.

### Opción A: prueba temporal con respuestas JSON

Si tu servidor Streamable HTTP devuelve respuestas JSON y no depende de SSE, puedes probar:

```bash
cloudflared tunnel --url http://127.0.0.1:3000
```

Copia el hostname HTTPS que muestra el proceso y añade `/mcp`. Mantén el proceso abierto. Configura autenticación Bearer en tu servidor antes de exponerlo.

Los túneles rápidos de Cloudflare cambian de hostname, son para pruebas y **no admiten SSE**. No los uses para `/sse` ni para respuestas Streamable HTTP que necesiten SSE. Su acceso por correo requiere interacción del navegador y no sirve para este cliente MCP. Referencia: [limitaciones de Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

### Opción B: túnel con hostname estable

Con una cuenta y un dominio configurados en Cloudflare, este es un ejemplo de túnel administrado localmente:

```bash
cloudflared tunnel login
cloudflared tunnel create sdd-inferencia
```

Anota el UUID y la ruta del archivo de credenciales generados. Crea un archivo propio de configuración, por ejemplo `~/.cloudflared/sdd-inferencia.yml`, reemplazando los marcadores:

```yaml
tunnel: UUID_DEL_TUNEL
credentials-file: /ruta/privada/UUID_DEL_TUNEL.json
ingress:
  - hostname: mcp.ejemplo.com
    service: http://127.0.0.1:3000
  - service: http_status:404
```

Después configura DNS e inicia el túnel:

```bash
cloudflared tunnel route dns sdd-inferencia mcp.ejemplo.com
cloudflared tunnel --config ~/.cloudflared/sdd-inferencia.yml run sdd-inferencia
```

Usa `https://mcp.ejemplo.com/mcp` en los clientes. Conserva el archivo de credenciales fuera del repositorio. Procedimiento y formato: [crear un túnel](https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/create-local-tunnel/) y [configuración de rutas](https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/configuration-file/).

Puedes utilizar otro operador de túneles o un servidor HTTPS propio si conserva métodos, cabeceras y respuestas del transporte elegido. Prueba que no devuelve una página HTML de bienvenida, un inicio de sesión interactivo o una redirección. SDD-Studio solo ofrece una credencial Bearer opcional; no dispone de flujo OAuth, cookies de sesión ni campos para otras cabeceras de autenticación.

### CORS y autenticación

La conexión desde un agente de terminal no comprueba las restricciones del navegador. Autoriza **el origen exacto** desde el que abres SDD-Studio, sin ruta. Ejemplos: `http://localhost:5173` o `http://127.0.0.1:4173`; son orígenes distintos. Para un alojamiento en GitHub Pages, el origen sería `https://xaviiromf.github.io`, sin `/SDD-generator/`, si utilizas ese alojamiento.

Ejemplo de cabeceras para un único origen local autorizado:

```http
Access-Control-Allow-Origin: http://127.0.0.1:4173
Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE
Access-Control-Allow-Headers: Content-Type, Accept, Authorization, MCP-Protocol-Version, Mcp-Session-Id
Access-Control-Expose-Headers: Mcp-Session-Id
Vary: Origin
```

Si admites varios orígenes, comprueba una lista permitida y devuelve únicamente el que coincida. Atiende la preconsulta `OPTIONS` para orígenes autorizados sin exigir una cabecera Bearer que el navegador todavía no ha enviado; exige autenticación en las operaciones MCP reales. Incluye las cabeceras CORS pertinentes también en errores autorizados. Referencia del navegador: [CORS en MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).

Valida `Origin` para evitar ataques de revinculación DNS y escucha en loopback durante desarrollo, conforme a las [reglas de seguridad del transporte MCP](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports). CORS limita lecturas desde navegadores; no reemplaza la autenticación de un servidor accesible desde Internet.

Hay tres credenciales distintas: la del túnel, la del proveedor del modelo y la de acceso al servidor MCP. **Solo la tercera** corresponde al campo de credencial del estudio. Define permisos limitados a inferencia, rotación y límites de solicitudes; no permitas que un texto del usuario active herramientas de archivos o shell.

## 6. Conectar SDD-Studio paso a paso

1. Abre el estudio y entra en el panel **Idea**. Pulsa **Ajustes de MCP**.
2. En **URL del servidor MCP**, introduce el endpoint completo, por ejemplo `https://mcp.ejemplo.com/mcp`.
3. Selecciona **HTTP con transmisión** para `/mcp`, o **SSE heredado** si tu servidor ofrece ese transporte. Utiliza **Detección automática** cuando necesites comprobar cuál publica.
4. Si el servidor requiere autenticación, introduce únicamente su token en **Credencial de sesión opcional**. Se escribe el token, sin anteponer `Bearer`; el cliente forma la cabecera.
5. Pulsa **Probar conexión sin enviar idea**. Esta prueba negocia y comprueba una herramienta compatible; no invoca inferencia ni envía tu idea. Si falla, revisa el detalle antes de continuar.
6. Comprueba el destino y activa **Activar MCP y permitir el envío de mi idea y exclusiones a este destino**. Pulsa **Guardar ajustes**. La activación puede analizar la idea existente: realiza la prueba con texto ficticio si todavía estás comprobando el servicio.
7. Escribe una idea concreta y espera el análisis. **MCP Conectado** identifica una inferencia remota válida y vigente; **Motor Local Activo** indica que está actuando el motor local. La prueba de conexión por sí sola no demuestra que el modelo respondió correctamente.
8. Revisa propuestas, incompatibilidades y alcances pendientes; fija manualmente las decisiones importantes antes de exportar.

El estudio conserva endpoint, transporte y activación como preferencias independientes. El token permanece en memoria: tras recargar puede ser necesario introducirlo otra vez. No lo incluyas en la idea, la URL ni el ZIP. Desactivar MCP cancela la solicitud vigente; el operador debe atender las cancelaciones y limitar el trabajo remoto, pues un aborto de red no garantiza detener el modelo.

El análisis local aparece inmediatamente. Tras **300 ms sin escritura**, la operación MCP dispone de **1500 ms en total**, incluyendo negociación, descubrimiento y llamada necesarios. Al fallar o exceder el plazo vuelve íntegramente al motor local, sin bloquear la edición. Un fallo por tiempo aplica un enfriamiento de 5 segundos antes de otro intento automático; una prueba explícita permite comprobar la conexión de nuevo.

## 7. Conectar agentes al mismo servidor

Estas configuraciones permiten que el agente **consuma** la herramienta para ayudarte a verificarla. No son necesarias para que el navegador use MCP. No copies un token del proveedor de IA en estas configuraciones: utilizan la credencial independiente del servidor de inferencia.

### Codex CLI y extensión

Comprueba `codex mcp add --help`. Para un endpoint sin autenticación, exclusivamente de prueba local:

```bash
codex mcp add sdd-inferencia --url http://127.0.0.1:3000/mcp
```

Para un endpoint autenticado, carga el token sin escribirlo literalmente en el historial de Bash:

```bash
read -rsp 'Token del servidor MCP: ' SDD_MCP_TOKEN
printf '\n'
export SDD_MCP_TOKEN
codex mcp add sdd-inferencia --url https://mcp.ejemplo.com/mcp --bearer-token-env-var SDD_MCP_TOKEN
codex mcp list
codex
```

Dentro de Codex, `/mcp` permite consultar los servidores. Como alternativa al comando de alta, añade esta tabla a `~/.codex/config.toml`, conservando las existentes:

```toml
[mcp_servers.sdd-inferencia]
url = "https://mcp.ejemplo.com/mcp"
bearer_token_env_var = "SDD_MCP_TOKEN"
enabled_tools = ["match_technologies", "infer_intent"]
```

La CLI y la extensión comparten configuración; el proceso del cliente debe recibir la variable. Reinicia la extensión desde un entorno que la tenga disponible cuando corresponda. Referencia: [configuración MCP de Codex](https://learn.chatgpt.com/docs/extend/mcp?surface=cli).

### Claude Code

Comprueba `claude mcp add --help`. Para una prueba local sin autenticación:

```bash
claude mcp add --transport http --scope local sdd-inferencia http://127.0.0.1:3000/mcp
claude mcp list
claude
```

Para autenticación mediante variable, incorpora esta entrada en `.mcp.json` del proyecto de prueba, conservando sus otras entradas:

```json
{
  "mcpServers": {
    "sdd-inferencia": {
      "type": "http",
      "url": "https://mcp.ejemplo.com/mcp",
      "headers": { "Authorization": "Bearer ${SDD_MCP_TOKEN}" }
    }
  }
}
```

Carga `SDD_MCP_TOKEN` con el bloque `read`/`export` anterior antes de iniciar `claude`. Revisa la autorización del servidor de proyecto y consulta `/mcp` dentro de la sesión. Para SSE heredado utiliza `--transport sse` y la ruta `/sse`. Referencia: [MCP y expansión de variables en Claude Code](https://code.claude.com/docs/en/mcp).

### Google Antigravity, denominado «agy» en esta guía

En el IDE, abre el menú del panel del agente, elige la opción de servidores MCP, su administración y la configuración sin procesar. La documentación denomina esos controles **MCP Servers**, **Manage MCP Servers** y **View raw config**. Edita el archivo que abra tu versión; la documentación actual indica `~/.gemini/config/mcp_config.json` o `.agents/mcp_config.json` para el proyecto.

Añade una entrada local de prueba:

```json
{
  "mcpServers": {
    "sdd-inferencia": {
      "serverUrl": "http://127.0.0.1:3000/mcp"
    }
  }
}
```

Para un túnel autenticado utiliza `serverUrl` con HTTPS y `headers.Authorization` con `Bearer TOKEN_DEL_SERVIDOR_MCP`. Ese marcador no es una credencial válida. Guarda valores reales únicamente en configuración privada protegida; no se presupone expansión `${...}` en este cliente. Referencia: [MCP de Google Antigravity](https://antigravity.google/docs/mcp).

### Cursor

Configura un servidor personal en `~/.cursor/mcp.json`, o uno del proyecto de prueba en `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "sdd-inferencia": {
      "url": "http://127.0.0.1:3000/mcp"
    }
  }
}
```

Para el túnel usa su URL HTTPS. Si requiere autenticación, configura `headers.Authorization` según los mecanismos de credenciales de tu versión y conserva los secretos fuera de Git. Comprueba en los ajustes MCP que la herramienta está disponible y habilitada para el agente. Referencia: [integraciones MCP de Cursor](https://cursor.com/help/customization/mcp).

### Petición de comprobación para cualquiera de los agentes

```text
Usa únicamente match_technologies del servidor sdd-inferencia con esta idea
ficticia: «Una aplicación web en Python y Django para registrar reservas».
Exclusiones: «Sin pagos ni sincronización externa».
Muéstrame el JSON recibido y revisa IDs, confianza, exclusiones y alcances.
No modifiques archivos ni ejecutes otras herramientas para resolver la idea.
No completes una respuesta del servidor con tecnologías inventadas.
```

Comprueba después la misma idea desde SDD-Studio. Un agente puede conectarse aunque falte CORS, puede esperar mucho más de 1500 ms y puede tolerar respuestas que el estudio rechaza. Solo la prueba desde el navegador verifica esas condiciones del producto.

## 8. Aprovechar la inferencia sin perder control del SDD

Describe usuarios, plataforma, operaciones, datos, restricciones y exclusiones. Evita una lista de nombres de tecnologías sin contexto y explica qué decisiones ya conoces. Un ejemplo útil es:

```text
Un taller necesita una aplicación web para que una persona administradora
registre, consulte y cancele reservas. El servidor debe usar Python y Django.
Hay que guardar las reservas entre reinicios. No he decidido la base de datos.
No incluir pagos, cuentas de clientes ni sincronización externa.
```

1. Comprueba que Python y Django se reconocen y que la persistencia pendiente se presenta como decisión por revisar.
2. Revisa las sugerencias de API y complementos en los apartados pertinentes; no añadas DRF, Django Ninja, tareas o WebSockets si tu alcance no los necesita.
3. Fija explícitamente base de datos, seguridad y distribución; las inferencias no deberían sustituir tus decisiones.
4. Revisa los 34 documentos y resuelve pendientes del negocio antes de entregar el kit al agente que implementará el proyecto.
5. En el proyecto generado, sigue DOCUMENT, aprobación, IMPLEMENT y VALIDATE. La conexión MCP del estudio no concede autorización para escribir código.

Para mejorar el servidor, utiliza un conjunto de ideas ficticias con resultados esperados: Django, proyectos sin interfaz, trabajo sin conexión, requisitos contradictorios y exclusiones explícitas. Mide aciertos, sugerencias innecesarias y latencia completa. Ajusta las instrucciones del modelo y su lista permitida en lugar de asignar confianza alta a todas las respuestas.

Mantén el proceso y el modelo preparados, respuestas breves y conexiones próximas al usuario. El servidor puede reutilizar recursos internos y atender cancelaciones, pero no debe depender de que el navegador conserve siempre una sesión. Mide también la primera conexión; inicializar después de una inactividad consume el mismo presupuesto. Aumentar el tiempo de espera del agente no cambia el límite del estudio.

MCP mejora la selección tecnológica cuando el servidor funciona bien; no traduce tus textos libres, no escribe código del proyecto y no valida automáticamente reglas del negocio. La respuesta del sandbox estético inferior a 16 ms es un presupuesto de interacción local independiente del plazo MCP.

## 9. Diagnóstico y comprobación final

| Síntoma | Comprobación y solución |
|---|---|
| Permanece «Motor Local Activo» | Confirma activación, URL, credencial, idea válida y disponibilidad; ejecuta la prueba explícita. |
| El agente conecta, el navegador no | Revisa `Origin`, preconsulta `OPTIONS`, CORS de errores y exposición de `Mcp-Session-Id`. |
| HTTP 401 o 403 | Comprueba token de acceso al servidor, origen autorizado y política del proxy; no uses la clave del modelo. |
| HTTP 404 o 405 | Confirma ruta `/mcp` o `/sse` y transporte; una página raíz no es el endpoint. |
| Respuesta HTML o redirección | Retira el flujo interactivo de ese endpoint o usa un acceso Bearer compatible y su URL final. |
| La conexión se verifica pero no hay inferencia | Revisa `tools/call`, respuesta estructurada, IDs y latencia del modelo; inicializar no prueba inferencia. |
| Funciona localmente y falla con el túnel | Mide la ruta HTTPS completa y verifica si el operador permite el transporte; Quick Tunnels no admite SSE. |
| Falla en teléfono o contenedor | Verifica a qué equipo apunta loopback; utiliza un endpoint alcanzable desde el cliente. |
| Falla después de recargar | Vuelve a introducir la credencial de sesión; no se persiste. |
| MCP pierde cambios manuales en tu interpretación | Revisa prioridades y distingue propuestas de decisiones; las selecciones manuales deben prevalecer. |
| Supera 1500 ms | Reduce arranque e inferencia, prepara recursos y mide negociación; el estudio continuará con el motor local. |

En las herramientas de desarrollo del navegador, observa métodos, códigos HTTP, tiempos y errores CORS. Evita compartir capturas o exportaciones de red con `Authorization`, ideas privadas o IDs de sesión. Si mides desde la terminal, recuerda que esa prueba no reproduce CORS ni permisos de red local del navegador.

Antes de dar tu instalación por operativa, comprueba estos casos con datos ficticios:

- La prueba de conexión descubre una herramienta compatible sin enviar la idea.
- Una inferencia completa valida el resultado en menos de 1500 ms desde el navegador.
- El servidor respeta exclusiones y devuelve únicamente IDs permitidos.
- Una selección manual prevalece sobre una inferencia contradictoria.
- Una edición nueva impide aplicar una respuesta de la idea anterior.
- Desconectar el túnel o provocar un error conserva edición, decisiones y exportación mediante el motor local.
- El kit conserva su estructura y contenido propio en español, sin credenciales ni resultados internos de conexión.

La integración del repositorio se ha verificado con servidores simulados, según [specs/validation.md](specs/validation.md). Esta guía contrasta contratos y fuentes oficiales; no acredita que un servidor, modelo, túnel o combinación real de agentes se haya desplegado y probado. Registra por separado tus resultados, versiones y latencias, sin publicar datos privados.
