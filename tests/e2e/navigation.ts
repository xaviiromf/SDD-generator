import type { Page } from '@playwright/test';
export type Step = 'Portada' | 'Idea' | 'Requisitos' | 'Configuración' | 'Documentos';
/** Abre un paso del estudio desde la navegación principal. */
export async function goTo(page: Page, step: Step): Promise<void> {
  await page
    .getByRole('navigation', { name: 'Pasos del estudio' })
    .getByRole('button', { name: step, exact: true })
    .click();
}
