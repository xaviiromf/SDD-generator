import type { Configuration } from '../domain/models';
import { validSlug } from '../engine/kitManifest';
import { targetProfile } from '../engine/targetProfile';
export function setupCommands(c: Configuration): string {
    if (!validSlug(c.slug)) throw new Error('Corrige el identificador antes de copiar comandos.');
    return targetProfile({ ...c, sddLanguage: 'es' }).setup;
}
