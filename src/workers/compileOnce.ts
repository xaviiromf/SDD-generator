import type { Compilation, Configuration } from '../domain/models';
/**
 * Compila una configuración en un trabajador temporal del mismo generador: no
 * interfiere con la generación activa ni duplica las plantillas en el hilo principal.
 */
export function compileOnce(config: Configuration): Promise<Compilation> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./generator.worker.ts', import.meta.url), {
      type: 'module',
    });
    const finish = () => worker.terminate();
    worker.onmessage = event => {
      finish();
      if (event.data?.result) resolve(event.data.result as Compilation);
      else reject(new Error(event.data?.error ?? 'No se pudo generar la versión.'));
    };
    worker.onerror = () => {
      finish();
      reject(new Error('El motor de generación no pudo iniciarse.'));
    };
    worker.postMessage(config);
  });
}
