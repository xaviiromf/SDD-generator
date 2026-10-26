import { test, expect } from '@playwright/test';
import { goTo } from './navigation';
test('las elecciones de un conjunto se aceptan una a una y P3 lo refleja', async ({ page }) => {
  await page.goto('./');
  await goTo(page, 'Configuración');
  await page.getByLabel('Conjunto predefinido').selectOption('client-spa');
  await page.getByRole('button', { name: 'Aplicar conjunto', exact: true }).click();
  const accept = page.getByRole('button', { name: 'Aceptar elección (de un conjunto)' });
  await expect(accept.first()).toBeVisible();
  const pending = await accept.count();
  await accept.first().click();
  await expect(accept).toHaveCount(pending - 1);
  await goTo(page, 'Documentos');
  const checkpoints = page.getByRole('list', { name: 'Puntos de control', exact: true });
  await expect(checkpoints).toContainText('P3 Decisiones registradas');
  await expect(checkpoints).toContainText('viene de un conjunto');
  await expect(checkpoints).toContainText('P5 Revisión humana: fuera del estudio');
});
test('el revisor independiente es opcional y sus hallazgos quedan en PROJECT_STATUS.md', async ({
  page,
}) => {
  await page.goto('./');
  await goTo(page, 'Documentos');
  const select = page.getByRole('combobox', { name: 'Documento del kit', exact: true });
  await select.selectOption('docs/PROJECT_STATUS.md');
  await expect(page.locator('.document-content')).toContainText('Omitida');
  await page.locator('.review-panel > summary').click();
  await page.getByLabel('Respuesta del revisor (JSON)').fill(
    JSON.stringify({
      esquema: 'sdd-studio.revision.v1',
      hallazgos: [
        {
          documento: 'AGENTS.md',
          severidad: 'baja',
          problema: 'Falta indicar la versión del entorno.',
          evidencia: 'Pila declarada',
        },
      ],
    }),
  );
  await page.getByRole('button', { name: 'Validar y registrar hallazgos', exact: true }).click();
  await expect(page.locator('.document-content')).toContainText(
    'Falta indicar la versión del entorno.',
  );
});
