import { compile } from '../engine/compiler';
import { isConfiguration } from '../domain/validation';
self.onmessage = (event: MessageEvent<unknown>) => {
    try {
        if (!isConfiguration(event.data))
            throw new Error('Datos de generación no válidos.');
        self.postMessage({ result: compile(event.data) });
    }
    catch {
        self.postMessage({ error: 'No se pudieron generar los documentos. Tu idea sigue disponible; vuelve a intentarlo.' });
    }
};
