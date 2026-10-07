# Especificación — 002 / Kit SDD completo y adaptable

Fecha: 2026-10-06. Estado: DOCUMENT, propuesta para revisión. Implementación de esta ampliación: no autorizada. Fuente: solicitud del usuario de mantener la estructura completa de SDD-AI-FULLSTACK y adaptar cada documento a su SDD.

## Problema y objetivo

La aplicación actual exporta seis documentos. El marco utilizado para desarrollarla contiene 30 archivos y un flujo operativo más completo. Faltan guías de agentes, contexto, manuales, prompts por fase, índices, plantillas y registros de continuidad. Algunas rutas de tareas son genéricas aunque el plan ya proponga un destino Django.

El objetivo es exportar un kit autónomo que preserve todos los nombres, carpetas y responsabilidades del marco, traducido al español y especializado según la configuración del usuario. Se añade una especificación activa numerada; los archivos de implementación del destino siguen siendo propuestas dentro de documentos.

## Alcance y continuidad

Se conservan React, TypeScript, Zustand, trabajador, PrismJS, Radix, JSZip, FileSaver, caché local, catálogo de 237 opciones, ocho conjuntos y 21 arquetipos. No se introducen paquetes, servicios, llamadas a IA ni dependencias del marco externo en tiempo de ejecución.

La estructura del kit exportado pasa a tener 30 archivos base y cuatro archivos de la especificación activa: 34 documentos. Los tres documentos actuales se trasladan a `specs/001-<slug>/`; no se duplican en rutas planas. El número inicial es 001 y el identificador usa el slug ya validado por el estudio. Los agentes gestionarán posteriormente el siguiente número libre para funcionalidades nuevas.

La documentación histórica de la aplicación en `specs/spec.md`, `plan.md` y `tasks.md` se conserva. Esta ampliación se documenta en 002 y solo sustituirá el contrato de exportación de seis archivos cuando sea aprobada e implementada. Las tareas originales de accesibilidad pendientes no se dan por completadas.

## Usuarios y recorrido

El usuario configura su proyecto como ahora. En Documentos SDD ve el árbol completo, selecciona cualquier documento y consulta su ruta. Los documentos de la especificación activa permanecen accesibles mediante accesos rápidos. La copia del prompt maestro apunta al orquestador por identidad, no por su posición en una lista. La descarga produce el mismo inventario que la vista previa, con una revisión consistente.

Modificar idea, alcance, exclusiones, tecnologías, arquitectura o arquetipo recompone coherentemente todo el kit. Se preservan los controles actuales de incompatibilidad, límites de entrada, secretos y emojis. La madurez continúa midiendo seis pilares y no se convierte en certificación de implementación o validación.

## Requisitos funcionales

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| RF-002-01 | Preservar los 30 archivos del marco, más cuatro de la especificación activa. | ZIP descomprimido con 34 rutas de archivo exactas, sin duplicados, rutas planas heredadas ni código objetivo. |
| RF-002-02 | Especializar el contenido desde una única configuración efectiva y revisión. | Idea, stack, alcance, tokens y referencias consistentes en todos los documentos; cambio de configuración sin restos de decisiones previas. |
| RF-002-03 | Mantener guías, plantillas, gobernanza y evidencia con estados honestos. | DOCUMENT por defecto, implementación pendiente de autorización; observaciones y pruebas no ejecutadas; decisiones del configurador separadas de aprobación formal. |
| RF-002-04 | Organizar especificaciones, requisitos y tareas por número y enlazarlos. | Índice apunta a `specs/001-<slug>/`; IDs `RF-001-XX` y `T-001-XX`; enlaces internos resolubles y grafo acíclico. |
| RF-002-05 | Adaptar arquitectura, archivos, tareas, comandos y guías a cada destino. | Django usa config/apps/manage.py; Rust usa Cargo/src; CLI no hereda obligaciones web; tecnologías desconocidas no producen comandos inventados. |
| RF-002-06 | Mostrar y copiar todos los documentos mediante navegación accesible. | Árbol anidado con etiquetas inequívocas, lector y teclado, selección por identidad, visor Markdown/TXT, accesos rápidos y conteo dinámico. |
| RF-002-07 | Exportar el kit completo con seguridad, coherencia, uso offline y presupuestos verificables. | Vista previa y ZIP coinciden; rechaza traversal, documentos ajenos, revisiones mezcladas, secretos y emojis; recarga/exportación sin red tras preparación. |
| RF-002-08 | Mantener borradores y funciones actuales durante la transición. | Borradores existentes restaurados; misma prioridad manual > conjunto > inferencia; catálogo, tokens y comandos independientes conservados. |

## Contratos y límites propuestos

El conjunto de archivos se deriva de un manifiesto de kit y un identificador de especificación validado. Una ruta solo se acepta si pertenece exactamente al manifiesto de la compilación; no se autoriza cualquier Markdown bajo specs o docs. Todas las referencias a la especificación usan el mismo identificador y carpeta.

El destino generado comienza sin código, pruebas, inspección de repositorio ni aprobación formal. `validation.md` existe como registro pendiente, con espacio para evidencia futura. Los resultados de la aplicación SDD-Studio no se transfieren al proyecto objetivo.

Se conservan los límites actuales de entrada y 1 MiB de texto total del kit. Los presupuestos de referencia siguen siendo entrada/controles p95 <16 ms, generación ≤150 ms y empaquetado ZIP <100 ms; se medirán con 34 documentos y la misma separación entre generación, carga de módulos y guardado del sistema. Si el límite o un presupuesto no puede cumplirse, se documenta el resultado y se revisa la propuesta antes de alterarlo.

## Exclusiones

No se implementa el proyecto objetivo, no se ejecutan comandos, no se importa un repositorio existente, no se añaden editores manuales de documentos ni se mezclan múltiples especificaciones activas en el estudio. El kit conserva instrucciones para extenderse a nuevas funcionalidades después de su extracción. No se copian los registros reales de otros proyectos ni se fija una licencia nueva sin revisar los derechos de las fuentes documentales.

## Revisión pendiente

Revisar el plan y las tareas vinculados. El contrato de 34 documentos, la migración a carpeta numerada y el tratamiento de validation como pendiente son decisiones propuestas para aprobación. La autorización previa de 001 no autoriza implementar 002; la instrucción actual exige detenerse tras esta entrega.
