import { SearchPromptsUseCase } from '@/core/application/prompts/search-prompts.use-case';
import { Prompt } from '@/core/domain/prompts/prompt.entity';
import { PromptRepository } from '@/core/domain/prompts/prompt.repository';

describe('SearchPromptsUseCase', () => {
  const input: Prompt[] = [
    {
      id: '1',
      title: 'Title 01',
      content: 'Content 01',
      updatedAt: new Date(),
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Title 02',
      content: 'Content 02',
      updatedAt: new Date(),
      createdAt: new Date(),
    },
  ];

  const repository: PromptRepository = {
    async findMany(): Promise<Prompt[]> {
      return input;
    },
    async searchMany(term: string): Promise<Prompt[]> {
      return input.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(term.toLowerCase()) ||
          prompt.content.toLowerCase().includes(term.toLowerCase())
      );
    },
  };

  it('deve retornar todos os prompts quando o termo for vazio', async () => {
    const useCase = new SearchPromptsUseCase(repository);

    const results = await useCase.execute('');

    expect(results).toHaveLength(2);
  });

  it('deve filtrar a lista de prompts pelo termo pesquisado', async () => {
    const useCase = new SearchPromptsUseCase(repository);
    const query = 'title 01';
    const results = await useCase.execute(query);

    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('deve aplicar trim em buscas com espaços em branco e retornar toda a lista de prompts', async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = '   ';

    const results = await useCase.execute(query);

    expect(results).toHaveLength(2);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(searchMany).not.toHaveBeenCalled();
  });

  it('deve buscar termo com espaços em branco, tratando com trim', async () => {
    const firstElement = input.slice(0, 1);
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue(firstElement);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = ' title 02  ';

    const results = await useCase.execute(query);

    expect(results).toMatchObject(firstElement);
    expect(findMany).not.toHaveBeenCalled();
    expect(searchMany).toHaveBeenCalledWith(query.trim());
  });

  it('deve lidar com termo undefined ou null e retornar a lista completa de prompts', async () => {
    const findMany = jest.fn().mockResolvedValue(input);
    const searchMany = jest.fn().mockResolvedValue([]);
    const repositoryWithSpies: PromptRepository = {
      ...repository,
      findMany,
      searchMany,
    };

    const useCase = new SearchPromptsUseCase(repositoryWithSpies);
    const query = undefined as unknown as string;

    const results = await useCase.execute(query);

    expect(results).toMatchObject(input);
    expect(findMany).toHaveBeenCalled();
    expect(searchMany).not.toHaveBeenCalled();
  });
});
