import { emptyConfiguration, type Configuration } from '../domain/models';
import { createRequirement, type ProjectItem } from '../domain/projectDefinition';
import { presets } from './presets';
const item = (id: string, text: string): ProjectItem => ({
  id,
  text,
  references: [],
  status: 'confirmado',
  origin: 'user',
});
/** Proyecto de ejemplo para la bienvenida: datos ficticios y completamente editables. */
export function exampleProject(): Configuration {
  const c = emptyConfiguration();
  c.name = 'Reservas del taller';
  c.slug = 'reservas-taller';
  c.idea =
    'Un taller mecánico necesita registrar, consultar y cancelar reservas de sus clientes sin conexión a internet. La recepción crea las reservas y los mecánicos consultan la agenda del día y marcan los trabajos terminados.';
  c.positive = 'Crear reservas\nCancelar reservas\nConsultar la agenda del día';
  c.negative = 'Pagos en línea\nSincronización en la nube';
  c.selections = structuredClone(presets.find(p => p.id === 'client-spa')!.selections);
  c.origins = Object.fromEntries(Object.keys(c.selections).map(field => [field, 'preset']));
  const p = c.project!;
  p.projectId = c.slug;
  p.nextId = 20;
  p.context.actors = [item('ACT-1', 'Recepción del taller'), item('ACT-2', 'Mecánico')];
  p.context.entities = [
    item('ENT-1', 'Cliente con nombre y teléfono'),
    item('ENT-2', 'Reserva con fecha, hora y vehículo'),
  ];
  p.context.rules = [item('REG-1', 'Una franja horaria admite una sola reserva por elevador')];
  p.context.exclusions = [item('EXC-1', 'Pagos en línea y sincronización en la nube')];
  p.requirements = [
    {
      ...createRequirement('RF-1'),
      title: 'Crear reservas',
      actorId: 'ACT-1',
      context: 'La recepción atiende a un cliente que pide una cita',
      behavior: 'La reserva queda guardada en el navegador con fecha, hora y vehículo',
      status: 'confirmado',
      priority: 'alta',
      ruleIds: ['REG-1'],
      exceptions: ['La franja ya está ocupada'],
      criteria: [
        { id: 'CA-1', text: 'La reserva aparece en la agenda del día elegido' },
        { id: 'CA-2', text: 'Una franja ocupada se rechaza con un mensaje claro' },
      ],
    },
    {
      ...createRequirement('RF-2'),
      title: 'Cancelar reservas',
      actorId: 'ACT-1',
      context: 'El cliente avisa que no podrá asistir',
      behavior: 'La reserva se marca como cancelada y libera la franja',
      status: 'confirmado',
      criteria: [{ id: 'CA-3', text: 'La franja liberada vuelve a estar disponible' }],
    },
    {
      ...createRequirement('RF-3'),
      title: 'Consultar la agenda del día',
      actorId: 'ACT-2',
      context: 'El mecánico empieza la jornada',
      behavior: 'Se listan las reservas del día ordenadas por hora',
      status: 'confirmado',
      criteria: [{ id: 'CA-4', text: 'La lista funciona sin conexión' }],
    },
  ];
  return c;
}
