import { PrismaClient } from '@/generated/prisma/client';
import { test, expect, type Page } from '@playwright/test';
import { PrismaPg } from '@prisma/adapter-pg';

function uniqueTitle() {
  return `Prompt E2E ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function createPromptViaUi(page: Page, title: string, content: string) {
  await page.goto('/new');
  await page.getByPlaceholder('Título do prompt').fill(title);
  await page.getByPlaceholder('Digite o conteúdo do prompt...').fill(content);
  await page.getByRole('button', { name: 'Salvar' }).click();
  await expect(page.getByText('Prompt criado com sucesso!')).toBeVisible();
}

test('Edição de prompt via UI (sucesso)', async ({ page }: { page: Page }) => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  const now = Date.now();
  const originalTitle = `E2E Edit Original ${now}`;
  const originalContent = 'Original Content';
  const updatedTitle = `E2E Edit Updated ${now}`;
  const updatedContent = 'Updated Content';

  const created = await prisma.prompt.create({
    data: {
      title: originalTitle,
      content: originalContent,
    },
  });

  await prisma.$disconnect();

  await page.goto(`/${created.id}`);
  await expect(page.getByPlaceholder('Título do prompt')).toBeVisible();

  await page.fill('input[name="title"]', updatedTitle);
  await page.fill('textarea[name="content"]', updatedContent);
  await page.getByRole('button', { name: 'Salvar' }).click();

  await page.waitForSelector(`text=Prompt atualizado com sucesso`, {
    state: 'visible',
    timeout: 15000,
  });

  await expect(
    page.getByRole('heading', { name: updatedContent })
  ).toBeVisible();
  await expect(page.locator('input[name="title"')).toHaveValue(updatedTitle);
});

test('deve atualizar o título e conteúdo de um prompt existente', async ({
  page,
}: {
  page: Page;
}) => {
  const title = uniqueTitle();
  const content = 'Conteúdo original do prompt.';
  await createPromptViaUi(page, title, content);

  await page.getByRole('heading', { name: title }).click();

  const updatedTitle = `${title} (editado)`;
  const updatedContent = 'Conteúdo atualizado pelo teste e2e.';

  await page.getByPlaceholder('Título do prompt').fill(updatedTitle);
  await page
    .getByPlaceholder('Digite o conteúdo do prompt...')
    .fill(updatedContent);
  await page.getByRole('button', { name: 'Salvar' }).click();

  await expect(page.getByText('Prompt atualizado com sucesso!')).toBeVisible();
  await expect(page.getByRole('heading', { name: updatedTitle })).toBeVisible();
  await expect(page.getByRole('heading', { name: title })).toHaveCount(0);
});

test('deve mostrar erro de validação ao tentar salvar edição vazia', async ({
  page,
}: {
  page: Page;
}) => {
  const title = uniqueTitle();
  const content = 'Conteúdo original do prompt.';
  await createPromptViaUi(page, title, content);

  await page.getByRole('heading', { name: title }).click();

  await page.getByPlaceholder('Título do prompt').fill('');
  await page.getByPlaceholder('Digite o conteúdo do prompt...').fill('');
  await page.getByRole('button', { name: 'Salvar' }).click();

  await expect(page.getByText('Título é obrigatório')).toBeVisible();
  await expect(page.getByText('Conteúdo é obrigatório')).toBeVisible();
});
