import { test, expect } from '@playwright/test';
import { goTo } from './navigation';
test('propuestas locales y respuesta pegada de un asistente llegan al modelo como propuestas', async ({
  page,
}) => {
  await page.goto('./');
  await page
    .getByLabel('Tu idea, en tus palabras')
    .fill(
      'Un taller necesita crear y cancelar reservas. Los mecánicos marcan trabajos terminados.',
    );
  await goTo(page, 'Requisitos');
  await page.getByText('Propuestas y asistente').click();
  const local = page.getByRole('region', { name: 'Propuestas a partir de tu idea' });
  await expect(local.getByRole('checkbox', { name: /Mecánicos/ })).toBeChecked();
  await local.getByRole('checkbox', { name: /Trabajo/ }).uncheck();
  await local.getByRole('button', { name: /Añadir seleccionadas/ }).click();
  await expect(page.locator('.notice')).toContainText('propuestas añadidas');
  const external = page.getByRole('region', { name: 'Asistente externo sin conexión del estudio' });
  const answer = external.getByLabel('Respuesta del asistente (JSON)');
  await answer.fill('{"esquema":"otro"}');
  await external.getByRole('button', { name: 'Validar respuesta' }).click();
  await expect(external.getByRole('alert')).toContainText('sdd-studio.asistente.v1');
  await answer.fill(
    JSON.stringify({
      esquema: 'sdd-studio.asistente.v1',
      preguntas: ['¿Cuántos elevadores hay?'],
      requisitos: [
        {
          titulo: 'Avisar al cliente',
          comportamiento: 'Se envía un aviso',
          criterios: ['El aviso consta en la reserva'],
        },
      ],
    }),
  );
  await external.getByRole('button', { name: 'Validar respuesta' }).click();
  await external.getByRole('button', { name: /Añadir seleccionadas \(2\)/ }).click();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const p = JSON.parse(localStorage.getItem('sdd-studio:borrador:v1') ?? '{}').project;
        return [
          p?.context.actors.map((i: { text: string; origin: string }) => `${i.text}:${i.origin}`),
          p?.context.questions.map((i: { origin: string }) => i.origin),
          p?.requirements.map((r: { title: string; origin: string }) => `${r.title}:${r.origin}`),
        ];
      }),
    )
    .toEqual([
      ['Mecánicos:local'],
      ['assistant-accepted'],
      ['Avisar al cliente:assistant-accepted'],
    ]);
});
