import { calculateReadiness } from '../domain/readiness';
import { projectValidationErrors } from '../domain/projectValidation';
import { calculateCoverage } from './coverage';
import { hasProjectContent } from '../domain/projectDefinition';
import { intentFingerprint, intentInferences, intentSuggestions, normalizeIntent, type IntentSnapshot } from '../domain/intent';
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
export function compile(c: Configuration, snapshot?: IntentSnapshot): Compilation {
    c = { ...c, sddLanguage: 'es' };
    let remote;
    try { if (snapshot?.fingerprint === intentFingerprint(c)) remote = normalizeIntent(snapshot.result); } catch { /* Datos remotos inválidos: motor local íntegro. */ }
    const diagnostics = [...validateConfiguration(c, knownIds), ...compatibilityDiagnostics(c).map(d=>({...d,kind:'compatibility' as const}))];
    if(c.project && projectValidationErrors(c.project).length) c={...c,project:undefined};
    if(c.project) c={...c,project:{...c.project,revision:c.revision}};
    const ctx = createKitContext(c);
    const documents = kitDocuments(ctx);
    const coverage=hasProjectContent(c.project)?calculateCoverage(c.project!):undefined;
    const maturity=calculateMaturity(c);
    const initialReadiness=calculateReadiness(c,coverage,diagnostics,maturity.pillars);
    if(hasProjectContent(c.project)) for(const document of documents) if(['spec','plan','PROJECT','validation'].includes(document.id)||document.path==='docs/PROJECT_STATUS.md') {
        document.content+=`\n## Preparación documental y revisión\n\nBorrador documental: generación no equivale a aprobación, implementación ni pruebas. Calidad estructural: ${initialReadiness.quality.complete}/${initialReadiness.quality.applicable} comprobaciones de campos. Revisión semántica y autorización: pendientes.\n\n${initialReadiness.issues.map(issue=>`- ${issue.source}: ${issue.message.replaceAll('<','&lt;').replaceAll('>','&gt;')} (${issue.severity}).`).join('\n')||'Sin bloqueos estructurales conocidos; revisión humana pendiente.'}\n`;
    }
    if (new TextEncoder().encode(documents.map(d => d.content).join('')).length > 1048576)
        diagnostics.push({ message: 'El kit supera 1 MiB. Acota el alcance antes de exportar.', blocking: true });
    if (brokenReferences(documents).length)
        diagnostics.push({ message: 'Hay referencias internas fuera del kit. Revisa los enlaces del texto introducido.', blocking: true });
    const readiness=calculateReadiness(c,coverage,diagnostics,maturity.pillars);
    return { readiness, coverage, sddLanguage: c.sddLanguage ?? 'es', revision: c.revision, slug: ctx.config.slug, documents, diagnostics, suggestions: [...scopeSuggestions(c), ...(remote ? intentSuggestions(remote, c) : [])], inferences: remote ? intentInferences(remote, c) : inferTechnologies(c.idea), maturity, targetTree: ctx.profile.paths };
}
