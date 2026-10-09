# Evidencia de cierre de H2 — 006

[Comandos y códigos de salida](checks.json), [entorno](environment.json), [build](build.json) y [mediciones](measurements.json). Registros completos: [lint](lint.txt), [tipos](types.txt), [unitarias](unit.txt), [build](build.txt), [regresión integral](e2e.txt), [dirigidas](directed.txt) y [complemento tablet](tablet.txt). Lint/tipos se repitieron después de añadir el caso tablet: [lint](lint-tablet.txt), [tipos](types-tablet.txt).

Integral: 173 correctas y siete mediciones Firefox omitidas, cero fallos; complemento tablet: dos correctas. Cobertura de 175 casos distintos correctos/siete omitidos, sin sumar dirigidas duplicadas. La aplicación y el build no cambiaron entre integral y complemento. [Intento fallido conservado](intento-01/checks.json): 172 correctas/siete omitidas/un fallo de rendimiento, con registros propios.

Resultados, presupuestos y límites de revisión manual en [validation.md](../../../specs/006-diagramas-y-experiencia-visual/validation.md). Los datos corresponden a pruebas automatizadas con fixtures, sin medición de ahorro humano ni aceptación del proyecto objetivo.

Los registros conservan salidas y valores; se normalizaron espacios finales y líneas vacías finales para cumplir git diff --check.
