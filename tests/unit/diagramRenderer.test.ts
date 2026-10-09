import { expect, it } from 'vitest';
import { compile } from '../../src/engine/compiler';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { DiagramError, validateDiagramSource } from '../../src/services/diagramSvgPolicy';
it('admite las familias acordadas y rechaza directivas, HTML y fuentes excesivas', () => {
    for (const source of ['flowchart TD\n A["Uno"] --> B["Dos"]', 'graph LR\n A-->B', 'erDiagram\n E["Entidad"]', 'sequenceDiagram\n actor A\n participant P\n A->>P: Solicitud']) expect(() => validateDiagramSource(source)).not.toThrow();
    for (const source of ['flowchart TD\n%%{init: {}}%%', 'flowchart TD\nclick A callback', 'flowchart TD\nA["<script>valor</script>"]', 'pie\n "Dato": 1', `flowchart TD\n${'a'.repeat(33000)}`]) expect(() => validateDiagramSource(source)).toThrow(DiagramError);
});
it('rechaza nodos implícitos excesivos antes de cargar Mermaid', () => {
    for (const source of [`flowchart TD\n${Array.from({ length: 201 }, (_, i) => `N${i}`).join('\n')}`, `flowchart TD\nA --> ${Array.from({ length: 201 }, (_, i) => `N${i}`).join(' & ')}`]) expect(() => validateDiagramSource(source)).toThrow(DiagramError);
});

it('las fuentes del kit al máximo pasan el filtro sin falsos límites', () => {
    const c = emptyConfiguration(); c.project!.requirements = Array.from({ length: 100 }, (_, i) => ({ ...createRequirement(`RF-${i}`), title: `Requisito ${i}` }));
    for (const diagram of compile(c).diagrams!.diagrams) expect(() => validateDiagramSource(diagram.source)).not.toThrow();
    expect(() => validateDiagramSource(`sequenceDiagram\n${Array.from({ length: 201 }, (_, i) => `participant P${i} as Persona ${i}`).join('\n')}`)).toThrow(DiagramError);
});
