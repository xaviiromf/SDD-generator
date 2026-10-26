import { test, expect } from '@playwright/test';
import { goTo } from './navigation';
import { emptyConfiguration } from '../../src/domain/models';
test('Django no se ofrece en el catálogo reducido', async ({ page }) => {
  await page.goto('./');
  await goTo(page, 'Configuración');
  await page.getByRole('button', { name: 'Lenguajes y frameworks' }).click();
  await page.getByRole('button', { name: 'Python', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Python', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Django', exact: true })).toHaveCount(0);
});
test('un borrador que ya tiene Django lo conserva visible y elegido', async ({ page }) => {
  const c = emptyConfiguration();
  c.selections = { ...c.selections, language: ['python'], backend: ['django'] };
  await page.addInitScript(
    c => localStorage.setItem('sdd-studio:borrador:v1', JSON.stringify(c)),
    c,
  );
  await page.goto('./');
  await goTo(page, 'Configuración');
  await page.getByRole('button', { name: 'Lenguajes y frameworks' }).click();
  await expect(page.getByRole('button', { name: 'Django', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});
// Catálogo reducido a los ocho conjuntos: Django y sus complementos vuelven al ampliarlo.
test.skip('configura Django, sus APIs y complementos y conserva conflictos visibles', async ({
  page,
}) => {
  await page.goto('./');
  await goTo(page, 'Configuración');
  await page.getByRole('button', { name: 'Arquitectura y topología' }).click();
  await page.getByLabel('Arquitectura', { exact: true }).selectOption('monolith');
  await page.getByRole('button', { name: 'Lenguajes y frameworks' }).click();
  await expect(page.getByText('Para Django elige Python', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Python', exact: true }).click();
  await page.getByRole('button', { name: 'Django', exact: true }).click();
  await page.getByLabel('Interfaz y frameworks').selectOption('django-templates');
  await page.getByRole('button', { name: 'Persistencia y comunicación' }).click();
  await page.getByRole('button', { name: 'Django REST Framework (DRF)', exact: true }).click();
  await page
    .getByRole('button', { name: 'drf-spectacular — OpenAPI para DRF', exact: true })
    .click();
  await page
    .getByRole('button', { name: 'Django ORM — modelos y migraciones', exact: true })
    .click();
  await expect(
    page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true }),
  ).toBeEnabled();
  await page.getByRole('tab', { name: 'plan', exact: true }).click();
  await expect(page.locator('.document-content')).toContainText('manage.py');
  await expect(page.locator('.document-content')).toContainText('drf-spectacular');
  await page.getByRole('button', { name: 'Django REST Framework (DRF)', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'drf-spectacular — OpenAPI para DRF', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('alert').filter({ hasText: 'Requiere:' })).toBeVisible();
  await expect(
    page.getByRole('button', { name: 'Descargar Kit SDD (.zip)', exact: true }),
  ).toBeDisabled();
});
