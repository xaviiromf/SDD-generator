import { hasProjectContent } from '../domain/projectDefinition';
import { literal } from '../i18n/translate';
import type { Configuration } from '../domain/models';
import { escapeMarkdown } from '../domain/validation';
export const requirementId = (number: number) => `RF-001-${String(number).padStart(2, '0')}`;
export function scopeRequirements(c: Configuration) {
    return c.positive.split('\n').map(line => line.trim()).filter(Boolean).map((text, index) => ({ id: requirementId(index + 5), text: escapeMarkdown(text) }));
}
export function requirements(c: Configuration) {
    if (hasProjectContent(c.project)) return c.project!.requirements.filter(r=>r.status!=='descartado').map(r=>({id:r.id,text:escapeMarkdown(r.behavior || r.title || 'Pendiente de definir.')}));
    return [
        { id: requirementId(1), text: literal('Resolver el propósito descrito dentro del alcance declarado.', c.sddLanguage) },
        { id: requirementId(2), text: literal('Validar entradas y mostrar errores recuperables sin pérdida de datos.', c.sddLanguage) },
        { id: requirementId(3), text: literal('Respetar persistencia, seguridad y plataforma seleccionadas.', c.sddLanguage) },
        { id: requirementId(4), text: literal('Mantener accesibilidad y adaptación cuando corresponda al destino.', c.sddLanguage) },
        ...scopeRequirements(c)
    ];
}
