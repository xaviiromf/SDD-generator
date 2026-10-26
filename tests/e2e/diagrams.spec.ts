import { test, expect, type Page } from '@playwright/test';
import { goTo } from './navigation';
import { emptyConfiguration } from '../../src/domain/models';
import { createRequirement } from '../../src/domain/projectDefinition';
import { emptyProfiles } from '../../src/domain/profiles';
import { compile } from '../../src/engine/compiler';
test.use({ trace: 'off' });
function fixture() {
  const c = emptyConfiguration();
  c.name = 'Reservas';
  c.idea = 'Gestionar reservas locales';
  c.profile = {
    ...emptyProfiles(),
    components: [
      {
        id: 'CMP-1',
        name: 'Interfaz',
        kind: 'web',
        responsibility: 'Consultar',
        profileId: '',
        dependsOn: ['CMP-2'],
        technologyIds: ['TEC-1'],
      },
      {
        id: 'CMP-2',
        name: 'Servicio local',
        kind: 'servicio',
        responsibility: 'Guardar',
        profileId: '',
        dependsOn: [],
        technologyIds: [],
      },
    ],
    technologies: [
      {
        id: 'TEC-1',
        name: 'TypeScript',
        role: 'lenguaje',
        purpose: 'Contratos',
        constraints: [],
        version: '',
        sources: [],
        reviewedAt: '',
        support: 'declarada',
      },
    ],
  };
  c.project!.context.components = c.profile.components.map(item => ({
    id: item.id,
    text: item.responsibility,
    references: item.dependsOn,
    status: 'confirmado',
    origin: 'user',
  }));
  c.project!.context.entities = ['E-1', 'E-2'].map(id => ({
    id,
    text: id === 'E-1' ? 'Persona' : 'Reserva',
    references: [],
    status: 'confirmado',
    origin: 'user',
  }));
  c.project!.context.actors = [
    { id: 'ACT-1', text: 'Cliente', references: [], status: 'confirmado', origin: 'user' },
  ];
  c.project!.context.decisions = [
    { id: 'D-1', text: 'Persistencia local', references: [], status: 'confirmado', origin: 'user' },
  ];
  const rf = createRequirement('RF-1');
  Object.assign(rf, {
    title: 'Crear reserva',
    actorId: 'ACT-1',
    context: 'Solicitar disponibilidad',
    behavior: 'Reserva registrada',
    componentIds: ['CMP-1'],
    decisionIds: ['D-1'],
    exceptions: ['Sin cupos', 'Datos inválidos'],
    criteria: [{ id: 'CA-1', text: 'La reserva aparece en la lista' }],
  });
  c.project!.requirements = [rf];
  c.project!.diagramFacts = {
    schemaVersion: 1,
    entityRelations: [
      {
        id: 'REL-1',
        fromEntityId: 'E-1',
        toEntityId: 'E-2',
        label: 'solicita',
        fromCardinality: 'uno',
        toCardinality: 'cero-muchos',
        identifying: false,
        status: 'confirmado',
      },
    ],
  };
  return c;
}
async function seed(page: Page) {
  await page.addInitScript(
    c => localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify(c)),
    fixture(),
  );
  await page.goto('./');
}
async function architecture(page: Page) {
  if ((await page.viewportSize())!.width < 768) await goTo(page, 'Documentos');
  await page.getByRole('combobox', { name: 'Documento del kit', exact: true }).selectOption('plan');
  const block = page.locator('.document-content .mermaid-block').first();
  await block.scrollIntoViewIfNeeded();
  await expect(block).toBeVisible();
  return block;
}
// Fase 1: los diagramas se muestran como código Mermaid sin renderizar.
test('el visor muestra el mismo código Mermaid que el kit, sin SVG', async ({ page }) => {
  await seed(page);
  const source = compile(fixture()).diagrams!.diagrams.find(d => d.kind === 'architecture')!.source;
  const block = await architecture(page);
  await expect(block.locator('code')).toHaveText(source);
  await expect(page.locator('.mermaid-block svg')).toHaveCount(0);
});
test('el código de los diagramas está disponible sin conexión', async ({ page, context }) => {
  await seed(page);
  await expect(page.locator('.notice')).toContainText('Preparación sin conexión completa');
  await context.setOffline(true);
  await page.reload();
  const block = await architecture(page);
  await expect(block.locator('code')).toContainText('flowchart');
});
for (const width of [320, 375, 767, 768, 1279, 1280, 1440])
  test(`el código del diagrama recibe foco y no desborda a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await seed(page);
    const block = await architecture(page);
    const code = block.locator('pre.mermaid-source');
    await code.focus();
    await expect(code).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
