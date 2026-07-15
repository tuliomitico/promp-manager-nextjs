import { test, expect, type Page } from '@playwright/test';

test('Criação de prompt via UI (sucesso)', async ({ page }: { page: Page }) => {
  const uniqueTitle = `E2E Prompt ${Date.now()}`;
  const content = 'Conteúdo gerado via E2E';

  await page.goto('/new');
  await expect(page.getByPlaceholder('Título do prompt')).toBeVisible();
  await page.fill('input[name="title"]', uniqueTitle);
  await page.fill('textarea[name="content"]', content);
  await page.getByRole('button', { name: 'Salvar' }).click();

  await page.waitForSelector(`text=Prompt criado com sucesso`, {
    state: 'visible',
    timeout: 15000,
  });
});

test('deve manter o usuário em /new e mostrar erro de validação ao enviar vazio', async ({
  page,
}: {
  page: Page;
}) => {
  await page.goto('/new');

  await page.getByRole('button', { name: 'Salvar' }).click();

  await expect(page.getByText('Título é obrigatório')).toBeVisible();
  await expect(page.getByText('Conteúdo é obrigatório')).toBeVisible();

  await expect(page).toHaveURL(/\/new$/);
});
