# Instrucciones para agentes de SDD-Studio

## Entrada

Leer este archivo y CLAUDE.md (comandos y arquitectura) al iniciar. Identificar la tarea antes de ampliar la lectura: buscar rutas y símbolos con rg y abrir solo los archivos del subsistema afectado, con extractos delimitados. No cargar el repositorio entero como contexto inicial.

Cambiar código, instalar dependencias, publicar o reescribir el historial requiere una petición explícita de la persona que mantiene el repositorio.

## Fases

| Fase | Lecturas | Escrituras | Prohibición |
|---|---|---|---|
| Documentar | Código y pruebas pertinentes, manifiestos de dependencias y fuentes técnicas oficiales | Propuestas y documentación | Escribir código de aplicación o instalar paquetes |
| Implementar | Archivos del subsistema de la tarea, sus pruebas y contratos públicos | Los archivos de la tarea pedida | Lecturas masivas, cruzar internals de dominios o ampliar el alcance |
| Validar | Salidas de pruebas, trazas y mediciones | Informes de lo observado | Modificar la implementación; una corrección vuelve a Implementar |

Registrar solo lo ejecutado, con errores y límites. Nunca dar por comprobado algo que no se ejecutó.

## Dominios

| Dominio | Rutas | Responsabilidad |
|---|---|---|
| Núcleo | src/domain/, src/engine/, src/catalog/ | Contratos, compatibilidad, inferencias, plantillas del kit y catálogo |
| Interfaz y estética | src/components/, src/styles/ | Controles, accesibilidad, carrusel y muestra interactiva |
| Servicios y trabajadores | src/services/, src/workers/, src/offline/ | Persistencia, exportación, coordinación y service worker |
| Integración | src/app/, src/store/, tests/ | Solo contratos o adaptadores nombrados en la tarea |

Una tarea de interfaz no lee internals del motor ni del compilador; una tarea del motor no lee internals de la interfaz ni de los estilos. Los cambios entre dominios se dividen en una tarea de contrato y otra de integración.

## Reglas del producto

- Cero emojis en código, interfaz, comentarios, documentación y exportaciones. Iconos únicamente de lucide-react.
- Español en la interfaz, en el contenido propio del kit y en la documentación de usuario. Conservar los identificadores técnicos y los textos aportados por el usuario; no traducir texto libre.
- Mantener los rangos móvil <768 px, tableta 768 a 1279 px y escritorio >=1280 px, con teclado, foco visible, contraste y objetivos de al menos 44 x 44 px.
- Suscripciones Zustand por campo; la raíz no se suscribe a ajustes de estética. Las actualizaciones de la muestra visual se verifican por debajo de 16 ms con mediciones reales.
- El estudio funciona sin red y sin backend. No enviar secretos ni registrar contenido sensible.
- Preservar decisiones manuales, borradores anteriores y el trabajo del usuario. El kit exportado tiene siete documentos; cambiar su manifiesto exige actualizar exportación, explorador y pruebas a la vez.
- No añadir bibliotecas, servicios ni herramientas sin una petición explícita.
- prompt.txt y las carpetas locales ignoradas por Git no se copian a otras rutas ni se fuerzan en un commit.
