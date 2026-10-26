import { structuredSpec } from '../projectProjection';
import type { Configuration } from '../../domain/models';
import { createKitContext, textSection, type KitContext } from '../kitContext';
export const section = textSection;
/** Siempre desde el modelo estructurado: no hay modo sin requisitos. */
export function specTemplate(c: Configuration, ctx: KitContext = createKitContext(c)): string {
  return structuredSpec(ctx);
}
