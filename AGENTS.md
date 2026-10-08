# Instrucciones para agentes de SDD-Studio

## Entrada y autorización

Leer como máximo tres archivos al iniciar una solicitud, en este orden:
1. AGENTS.md.
2. docs/PROJECT_STATUS.md: fase, permisos y siguiente tarea.
3. specs/spec.md: únicamente el apartado de la necesidad activa.

Identificar la tarea antes de ampliar lectura. Consultar después solo los apartados pertinentes de specs/plan.md y specs/tasks.md y los archivos permitidos para esa fase y dominio. No cargar el repositorio, las 34 plantillas ni todos los documentos como contexto inicial. Buscar rutas y símbolos con rg antes de abrir archivos; preferir extractos delimitados. No releer contenido ya disponible.

El usuario aprobó formalmente el plan y la matriz el 2026-10-07 y autorizó IMPLEMENT de T-004-04…23, registrada en docs/PROJECT_STATUS.md. No requiere otra confirmación para estas tareas. Mantener lectura por dominio, verificar bloques y sincronizar al pasar pruebas/build; despliegue y dependencias nuevas fuera del plan requieren autorización separada.

El usuario autorizó H0–H2 de 005 el 2026-10-08: corpus, modelo/editor estructurado, proyección de 34 documentos, trazabilidad y preparación; tareas T-005-02…19 y cierre 35. H3 fue autorizado posteriormente: T-005-20…24 y cierre 35. H4 autorizado posteriormente: T-005-25…29 y cierre 35. H5 y tareas 30…34 siguen pospuestos. Ante falta de participantes, autorizó comparar tiempos y hallazgos mediante un banco automatizado, sin atribuir ahorro humano. Consultar evidencia y siguiente paso en docs/PROJECT_STATUS.md.

## Matriz obligatoria de acceso

| Fase | Lecturas permitidas | Escrituras permitidas | Prohibición |
|---|---|---|---|
| DOCUMENT | Especificaciones, planes, tareas, docs, manifiestos de dependencias, inventario de rutas y fuentes técnicas oficiales necesarias | AGENTS.md, specs y documentos de proyecto afectados | Leer implementaciones completas por anticipado, escribir código de aplicación, instalar paquetes |
| IMPLEMENT | Solo archivos del subsistema de la tarea activa, sus pruebas específicas y contratos públicos documentados | Archivos previstos por la tarea autorizada y su evidencia | Lecturas masivas, cruzar internals de dominios, ampliar alcance sin permiso |
| VALIDATE | Salidas de pruebas, trazas, mediciones y reportes de validación | Reportes, trazabilidad y estado verificables | Inspeccionar o modificar implementación; una corrección vuelve a IMPLEMENT mediante tarea registrada |

Ejecutar las verificaciones autorizadas no equivale a leer el código de todas las pruebas. En VALIDATE registrar únicamente lo observado, incluyendo errores y límites. Nunca marcar como comprobado algo no ejecutado.

## Segmentación de dominios

| Dominio | Rutas | Responsabilidad |
|---|---|---|
| Núcleo | src/domain/, src/engine/, src/catalog/ | Contratos, compatibilidad, inferencias, plantillas y catálogo |
| Interfaz y estética | src/components/, src/styles/ | Controles, accesibilidad, carrusel y muestra interactiva |
| Servicios y trabajadores | src/services/, src/workers/, src/offline/ | Transporte MCP, persistencia, exportación y coordinación; actualmente el service worker se encuentra en src/offline/service-worker.js |
| Especificaciones y documentación | specs/, docs/ | Requisitos, planes, tareas, decisiones y evidencia |
| Integración pública | src/app/, src/store/, src/i18n/, tests/ | Solo contratos o adaptadores nombrados expresamente en una tarea de integración |

Un agente que ejecuta una tarea de UI tiene estrictamente prohibido leer internals del motor o compilador. Un agente que ejecuta una tarea del motor tiene estrictamente prohibido leer internals de UI o estilos. Consumir contratos definidos en specs/plan.md; no interpretar una importación como permiso para inspeccionar otra implementación. Los cambios entre dominios se dividen en tareas de contrato e integración explícitas; cambiar de tarea y dominio se registra antes de leer esos archivos. Una tarea de integración no elimina las prohibiciones de internals.

## Reglas del producto y preservación

- Cero emojis en código, interfaz, comentarios, documentación y exportaciones. Iconos únicamente lucide-react.
- La ampliación solicitada exige español integral de la interfaz, del contenido propio del kit y de la documentación de usuario. El cambio respecto a los idiomas de 003 se documenta antes de implementar. Conservar identificadores técnicos y textos aportados por el usuario; no inventar traducción de texto libre.
- Mantener los rangos móvil <768 px, tablet 768–1279 px y escritorio >=1280 px, teclado, foco, contraste y objetivos de al menos 44 x 44 px.
- Suscripciones Zustand granulares con comparación superficial cuando corresponda; no suscribir la raíz a ajustes de estética. Verificar actualizaciones de la muestra visual <16 ms con mediciones reales; no atribuir ese plazo al servicio remoto.
- MCP es opcional y requiere activación explícita antes de enviar la idea. Conservar el motor local y la edición durante fallos o desconexión. No enviar secretos ni registrar contenido sensible.
- Preservar decisiones manuales, borradores previos, estructura de 34 documentos y trabajo del usuario. No añadir bibliotecas, servicios ni herramientas fuera del plan aprobado.
- specs/002-kit-completo/ permanece local, ignorado y excluido de commits y GitHub. No copiar sus archivos a otras rutas ni forzar su inclusión. No reescribir historial sin autorización específica.
- Sincronizar hitos autorizados mediante push normal al remoto existente. No confundir commit, verificación, aceptación ni despliegue.
