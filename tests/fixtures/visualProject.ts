import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { emptyProfiles } from '../../src/domain/profiles';
export function visualProject() {
    const c = emptyConfiguration(); c.name = 'Reservas visuales'; c.idea = 'Gestionar reservas en un proyecto local';
    c.project!.nextId = 30;
    c.profile = { ...emptyProfiles(), components: [{ id: 'CMP-1', name: 'Interfaz', kind: 'web', responsibility: 'Consultar', profileId: '', dependsOn: ['CMP-2'], technologyIds: ['TEC-1'] }, { id: 'CMP-2', name: 'Servicio local', kind: 'servicio', responsibility: 'Guardar', profileId: '', dependsOn: [], technologyIds: [] }], technologies: [{ id: 'TEC-1', name: 'Tecnología declarada', role: 'lenguaje', purpose: 'Contratos', constraints: [], version: '', sources: [], reviewedAt: '', support: 'declarada' }] };
    c.project!.context.components = c.profile.components.map(item => ({ id: item.id, text: item.responsibility, references: item.dependsOn, status: 'confirmado', origin: 'user' }));
    c.project!.context.entities = ['E-1', 'E-2'].map(id => ({ id, text: id === 'E-1' ? 'Persona' : 'Reserva', references: [], status: 'confirmado', origin: 'user' }));
    c.project!.context.actors = [{ id: 'ACT-1', text: 'Cliente', references: [], status: 'confirmado', origin: 'user' }];
    c.project!.context.decisions = [{ id: 'D-1', text: 'Persistencia local', references: [], status: 'confirmado', origin: 'user' }];
    c.project!.requirements = [{ ...createRequirement('RF-1'), title: 'Crear reserva', actorId: 'ACT-1', context: 'Solicitar disponibilidad', behavior: 'Reserva registrada', status: 'confirmado', componentIds: ['CMP-1'], decisionIds: ['D-1'], exceptions: ['Sin cupos'], criteria: [{ id: 'CA-1', text: 'La reserva aparece en la lista' }] }, { ...createRequirement('RNF-2'), kind: 'nonfunctional', title: 'Respuesta local', context: 'Sin conexión', behavior: 'Mantiene lectura', status: 'confirmado', criteria: [{ id: 'CA-2', text: 'Lee sin red' }], decisionIds: ['D-1'], exceptions: ['Caché no preparada'] }, { ...createRequirement('RF-3'), status: 'descartado' }];
    c.project!.diagramFacts = { schemaVersion: 1, entityRelations: [{ id: 'REL-1', fromEntityId: 'E-1', toEntityId: 'E-2', label: 'solicita', fromCardinality: 'uno', toCardinality: 'cero-muchos', identifying: false, status: 'confirmado' }] };
    return c;
}
