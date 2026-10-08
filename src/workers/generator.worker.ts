import type { IntentSnapshot } from '../domain/intent';
import { compile } from '../engine/compiler';
import { isConfiguration } from '../domain/validation';
self.onmessage = (event: MessageEvent<unknown>) => {
    try {
        const envelope = event.data && typeof event.data === 'object' && 'config' in event.data ? event.data as { config: unknown; intent?: IntentSnapshot } : { config: event.data, intent: undefined };
        if (!isConfiguration(envelope.config))
            throw new Error('Datos de generación no válidos.');
        self.postMessage({ result: compile(envelope.config, envelope.intent) });
    }
    catch {
        self.postMessage({ error: 'No se pudieron generar los documentos. Tu idea sigue disponible; vuelve a intentarlo.' });
    }
};
