import { PromptRepository } from '@/core/domain/prompts/prompt.repository';

export class SearchPromptsUseCase {
  constructor(private propmtRepository: PromptRepository) {}

  async execute(term?: string) {
    const q = term?.trim() ?? '';

    if (!q) return this.propmtRepository.findMany();

    return this.propmtRepository.searchMany(q);
  }
}
