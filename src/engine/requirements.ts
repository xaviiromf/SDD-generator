import type { Configuration } from '../domain/models';
import { escapeMarkdown } from '../domain/validation';
export const requirementId = (number: number) => `RF-001-${String(number).padStart(2, '0')}`;
export function scopeRequirements(c: Configuration) {
    return c.positive.split('\n').map(line => line.trim()).filter(Boolean).map((text, index) => ({ id: requirementId(index + 5), text: escapeMarkdown(text) }));
}
export function requirements(c: Configuration) {
    return [
        { id: requirementId(1), text: 'Resolver el propósito descrito dentro del alcance declarado.' },
        { id: requirementId(2), text: 'Validar entradas y mostrar errores recuperables sin pérdida de datos.' },
        { id: requirementId(3), text: 'Respetar persistencia, seguridad y plataforma seleccionadas.' },
        { id: requirementId(4), text: 'Mantener accesibilidad y adaptación cuando corresponda al destino.' },
        ...scopeRequirements(c)
    ];
}
