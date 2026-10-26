import { notify, useUIStore } from '../store/uiStore';
export async function registerOffline(): Promise<void> {
  if (!import.meta.env.PROD) return;
  try {
    if (!('serviceWorker' in navigator)) throw new Error();
    const registration = await navigator.serviceWorker.register(
      `${import.meta.env.BASE_URL}sw.js`,
      { scope: import.meta.env.BASE_URL },
    );
    await navigator.serviceWorker.ready;
    useUIStore.setState({ offlineReady: true });
    notify('Preparación sin conexión completa. Puedes recargar y exportar sin red.', 'exito');
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      if (worker)
        worker.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller)
            notify(
              'Hay una nueva versión disponible. Guarda el borrador y cierra las pestañas del estudio para actualizar.',
              'aviso',
            );
        });
    });
  } catch {
    notify('La sesión funciona localmente; no se pudo preparar la recarga sin conexión.', 'aviso');
  }
}
