# 003 — Idiomas independientes

Solicitud del usuario: dos controles en el header para elegir español o inglés de manera independiente para la UI y el SDD generado. Implementación autorizada por la solicitud de modificación.

- RF-003-01: la UI cambia integralmente: contenido, catálogo, ayudas, diálogos, errores, estados y nombres accesibles. El atributo lang sigue la UI.
- RF-003-02: el idioma del SDD cubre los 34 archivos, sus instrucciones de idioma, comentarios de preparación y metadatos de tokens; visor, copia y ZIP comparten contenido.
- RF-003-03: las preferencias son independientes, persisten localmente y admiten las cuatro combinaciones. Cambiar UI no recompila ni modifica el borrador; cambiar SDD incrementa revisión y conserva selección/documento.
- RF-003-04: conservar estructura, rutas, identificadores y nombres de productos. El usuario confirmó conservar su nombre, idea y alcance tal como los escribe; no se traducen ni envían a servicios externos.
- RF-003-05: borradores anteriores siguen funcionando con español por defecto. Valores de idioma inválidos se rechazan. Controles accesibles por teclado, visibles en móvil y sin emojis.

Aceptación: verificar cuatro combinaciones, los 34 documentos, perfiles web/Django/CLI, exportaciones, recarga, almacenamiento restringido y ausencia de regresiones.
