import type { Configuration } from '../../domain/models';
import { technologyById, fieldLabels } from '../../catalog/technologies';
import { section } from './spec';
export function selectedStack(c: Configuration): string { return Object.entries(c.selections).filter(([,ids]) => ids.length).map(([field,ids]) => `- ${fieldLabels[field as keyof typeof fieldLabels]}: ${ids.map(id => technologyById.get(id)?.label ?? id).join(', ')}`).join('\n') || 'Pendiente de seleccionar.'; }
export function projectTemplate(c: Configuration): string { return `# Proyecto — ${section(c.name)}\n\nIdentificador: ${c.slug}\n\n## Propósito\n\n${section(c.idea)}\n\n## Pila declarada\n\n${selectedStack(c)}\n\n## Alcance\n\n${section(c.positive)}\n\n## Exclusiones\n\n${section(c.negative)}\n\n## Estado\n\nKit documental propuesto. Sin código implementado ni pruebas ejecutadas. Las versiones de presets son declaradas, no recomendaciones automáticas sobre versiones recientes.\n`; }
