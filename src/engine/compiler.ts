import { knownIds } from '../catalog/technologies';
import type { Configuration, Compilation } from '../domain/models';
import { validateConfiguration } from '../domain/validation';
import { compatibilityDiagnostics } from '../domain/compatibility';
import { calculateMaturity } from '../domain/maturity';
import { inferTechnologies } from './matcher';
import { scopeSuggestions } from './scopeRules';
import { createKitContext } from './kitContext';
import { kitDocuments } from './templates/kit';
import { brokenReferences } from './references';
export function compile(c: Configuration): Compilation {
    const diagnostics = [...validateConfiguration(c, knownIds), ...compatibilityDiagnostics(c)];
    const ctx = createKitContext(c);
    const documents = kitDocuments(ctx);
    if (new TextEncoder().encode(documents.map(d => d.content).join('')).length > 1048576)
        diagnostics.push({ message: 'El kit supera 1 MiB. Acota el alcance antes de exportar.', blocking: true });
    if (brokenReferences(documents).length)
        diagnostics.push({ message: 'Hay referencias internas fuera del kit. Revisa los enlaces del texto introducido.', blocking: true });
    return { sddLanguage: c.sddLanguage ?? 'es', revision: c.revision, slug: ctx.config.slug, documents, diagnostics, suggestions: scopeSuggestions(c), inferences: inferTechnologies(c.idea), maturity: calculateMaturity(c), targetTree: ctx.profile.paths };
}
