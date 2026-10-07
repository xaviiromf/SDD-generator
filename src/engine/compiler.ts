import { knownIds } from '../catalog/technologies';
import type { Configuration, Compilation } from '../domain/models';
import { documentPaths } from '../domain/models';
import { validateConfiguration } from '../domain/validation';
import { compatibilityDiagnostics, effectiveConfiguration } from '../domain/compatibility';
import { calculateMaturity } from '../domain/maturity';
import { inferTechnologies } from './matcher';
import { scopeSuggestions } from './scopeRules';
import { targetTree } from './targetTree';
import { specTemplate } from './templates/spec';
import { planTemplate } from './templates/plan';
import { tasksTemplate } from './templates/tasks';
import { constitutionTemplate } from './templates/constitution';
import { projectTemplate } from './templates/project';
import { orchestratorTemplate } from './templates/orchestrator';
export function compile(c: Configuration): Compilation {
    const effective = effectiveConfiguration(c);
    const diagnostics = [...validateConfiguration(c, knownIds), ...compatibilityDiagnostics(c)];
    const contents = [specTemplate(effective), planTemplate(effective), tasksTemplate(effective), constitutionTemplate(effective), projectTemplate(effective), orchestratorTemplate()];
    if (new TextEncoder().encode(contents.join('')).length > 1048576)
        diagnostics.push({ message: 'El kit supera 1 MiB. Acota el alcance antes de exportar.', blocking: true });
    return { revision: c.revision, documents: documentPaths.map((path, index) => ({ path, content: contents[index], revision: c.revision })), diagnostics, suggestions: scopeSuggestions(c), inferences: inferTechnologies(c.idea), maturity: calculateMaturity(c), targetTree: targetTree(effective) };
}
