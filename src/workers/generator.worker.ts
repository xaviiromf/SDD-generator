import type { IntentSnapshot } from '../domain/intent';
import { compile } from '../engine/compiler';
import { isConfiguration } from '../domain/validation';
import { isProfileConfiguration } from '../domain/profiles';
import { emptyConfiguration } from '../domain/models';
import { projectArchitecture } from '../engine/diagramProjection';
import type { ArchitecturePreviewRequest, ArchitecturePreviewResult } from '../domain/diagrams';
self.onmessage = (event: MessageEvent<unknown>) => {
    try {
        if (event.data && typeof event.data === 'object' && 'type' in event.data && event.data.type === 'architecture-preview') {
            const request = (event.data as unknown as { request: ArchitecturePreviewRequest }).request;
            const valid = !!request && typeof request.projectId === 'string' && Number.isSafeInteger(request.baseRevision) && Number.isSafeInteger(request.previewToken) && isProfileConfiguration(request.candidateProfile);
            const diagrams = valid ? projectArchitecture({ ...emptyConfiguration(), profile: request.candidateProfile }) : [];
            const issues = valid ? diagrams.flatMap(d => d.issues) : [{ id: 'perfil-invalido', message: 'La vista previa contiene dependencias o tecnologías inválidas.', sourceIds: [] }];
            const result: ArchitecturePreviewResult = { projectId: request?.projectId ?? '', baseRevision: request?.baseRevision ?? 0, previewToken: request?.previewToken ?? 0, diagrams, issues, state: !valid ? 'invalido' : issues.length ? 'incompleto' : 'valido' };
            self.postMessage({ type: 'architecture-preview', result }); return;
        }
        const envelope = event.data && typeof event.data === 'object' && 'config' in event.data ? event.data as { config: unknown; intent?: IntentSnapshot } : { config: event.data, intent: undefined };
        if (!isConfiguration(envelope.config))
            throw new Error('Datos de generación no válidos.');
        self.postMessage({ result: compile(envelope.config, envelope.intent) });
    }
    catch {
        self.postMessage({ error: 'No se pudieron generar los documentos. Tu idea sigue disponible; vuelve a intentarlo.' });
    }
};
