import { template } from '../../i18n/translate';
import type { Configuration } from '../../domain/models';
import { createKitContext, textSection, type KitContext } from '../kitContext';
import { documentLink } from '../references';
export { selectedStack } from '../kitContext';
export function projectTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
    return template(ctx.config.sddLanguage)`# Proyecto — ${textSection(c.name, ctx.config.sddLanguage)}\n\nIdentificador: ${ctx.config.slug}.\n\n## Propósito\n\n${textSection(c.idea, ctx.config.sddLanguage)}\n\n## Pila declarada\n\n${ctx.stack}\n\n## Alcance\n\n${textSection(c.positive, ctx.config.sddLanguage)}\n\n## Exclusiones\n\n${textSection(c.negative, ctx.config.sddLanguage)}\n\n## Estado\n\nDOCUMENT. Kit propuesto, sin código implementado ni pruebas ejecutadas. Aprobación formal pendiente.\n\nEspecificación activa: ${documentLink('docs/PROJECT.md', `${ctx.folder}/spec.md`, '001')}.\n\nLas versiones de los conjuntos son declaradas, no recomendaciones automáticas sobre versiones recientes. Las tecnologías seleccionadas describen el destino; no conectan servicios ni instalan paquetes.\n`;
}
