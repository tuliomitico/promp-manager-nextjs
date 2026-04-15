import z from 'zod';

export const createPromptSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdoé obrigatório'),
});

export type CreatePromptDTO = z.infer<typeof createPromptSchema>;
