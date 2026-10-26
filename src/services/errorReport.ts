import { version } from '../../package.json';
import type { Configuration } from '../domain/models';
/**
 * Informe técnico copiable para un fallo. Incluye mensaje, revisión, tamaño y
 * recuentos de la configuración y el navegador; nunca la idea ni otros textos del usuario.
 */
export function errorReport(area: string, message: string, config: Configuration): string {
  const p = config.project;
  return [
    `SDD-Studio ${version} — informe de error`,
    `Fecha: ${new Date().toISOString()}`,
    `Área: ${area}`,
    `Mensaje: ${message}`,
    `Revisión: ${config.revision}`,
    `Tamaño de la configuración: ${new TextEncoder().encode(JSON.stringify(config)).length} bytes`,
    `Requisitos: ${p?.requirements.length ?? 0}; componentes: ${config.profile?.components.length ?? 0}; aportaciones: ${config.manualSections?.length ?? 0}`,
    `Selecciones: ${Object.values(config.selections).flat().length}`,
    `Navegador: ${typeof navigator === 'undefined' ? 'desconocido' : navigator.userAgent}`,
    `En línea: ${typeof navigator === 'undefined' ? 'desconocido' : navigator.onLine ? 'sí' : 'no'}`,
  ].join('\n');
}
