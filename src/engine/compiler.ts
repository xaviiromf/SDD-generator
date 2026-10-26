import { deriveDocumentStatuses, deriveProjectOverview } from './documentStatus';
import { isProfileConfiguration } from '../domain/profiles';
import { calculateReadiness } from '../domain/readiness';
import { evaluateCheckpoints } from './checkpoints';
import { projectValidationErrors } from '../domain/projectValidation';
import { calculateCoverage } from './coverage';
import { projectDiagrams, diagramsMarkdown } from './diagramProjection';
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
  c = { ...c, sddLanguage: 'es' };
  const diagnostics = [
    ...validateConfiguration(c, knownIds),
    ...compatibilityDiagnostics(c).map(d => ({ ...d, kind: 'compatibility' as const })),
  ];
  if (c.profile && !isProfileConfiguration(c.profile)) c = { ...c, profile: undefined };
  if (c.project && projectValidationErrors(c.project).length) c = { ...c, project: undefined };
  if (c.project) c = { ...c, project: { ...c.project, revision: c.revision } };
  const ctx = createKitContext(c);
  const documents = kitDocuments(ctx);
  const coverage = c.project ? calculateCoverage(c.project) : undefined;
  const diagrams = projectDiagrams(c, coverage, ctx.tasks);
  for (const document of documents) {
    const selected = diagrams.diagrams.filter(d => d.documentIds.includes(document.id));
    if (selected.length)
      document.content += `\n## Diagramas declarados\n\nLos diagramas representan declaraciones y pendientes; no acreditan implementación ni pruebas.\n\n${diagramsMarkdown(selected)}\n`;
  }
  const maturity = calculateMaturity(c);
  if (new TextEncoder().encode(documents.map(d => d.content).join('')).length > 1048576)
    diagnostics.push({
      message: 'El kit supera 1 MiB. Acota el alcance antes de exportar.',
      blocking: true,
    });
  if (brokenReferences(documents).length)
    diagnostics.push({
      message: 'Hay referencias internas fuera del kit. Revisa los enlaces del texto introducido.',
      blocking: true,
    });
  const readiness = calculateReadiness(c, coverage, diagnostics, maturity.pillars);
  const documentStatuses = deriveDocumentStatuses(c, documents, readiness, diagrams);
  const checkpoints = evaluateCheckpoints(c, diagnostics, maturity.pillars);
  const status = documents.find(d => d.id === 'docs/PROJECT_STATUS.md');
  if (status)
    status.content += `\n## Puntos de control al exportar\n\n| Punto | Dónde | Estado | Pendiente |\n|---|---|---|---|\n${checkpoints.map(cp => `| ${cp.id} ${cp.label} | ${cp.place === 'estudio' ? 'Estudio' : 'Repositorio destino'} | ${cp.place === 'repositorio' ? 'Pendiente (lo registra la persona)' : cp.met ? 'Superado' : 'Pendiente'} | ${cp.place === 'repositorio' ? 'Bloque de esta página' : cp.missing.map(m => m.replaceAll('|', '/')).join(' ') || 'Ninguno'} |`).join('\n')}\n\nSi un agente añade o cambia un RF, un CA, un actor o una exclusión, marca P1 o P2 como «Invalidado» aquí y vuelve a DOCUMENT.\n`;
  const overview = deriveProjectOverview(c, readiness, checkpoints, diagrams, documentStatuses);
  return {
    overview,
    documentStatuses,
    diagrams,
    readiness,
    checkpoints,
    coverage,
    sddLanguage: c.sddLanguage ?? 'es',
    revision: c.revision,
    slug: ctx.config.slug,
    documents,
    diagnostics,
    suggestions: scopeSuggestions(c),
    inferences: inferTechnologies(c.idea),
    maturity,
    targetTree: ctx.profile.paths,
  };
}
