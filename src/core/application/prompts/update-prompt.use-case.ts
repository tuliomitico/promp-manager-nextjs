import { PromptRepository } from '@/core/domain/prompts/prompt.repository';
import { UpdatePromptDTO } from './update-prompt.dto';
import { Prompt } from '@/core/domain/prompts/prompt.entity';

export class UpdatePromptUseCase {
  constructor(private promptRepository: PromptRepository) {}

  async execute(data: UpdatePromptDTO): Promise<Prompt> {
    const exists = await this.promptRepository.findById(data.id);
    if (!exists) {
      throw new Error('PROMPT_NOT_FOUND');
    }

    return await this.promptRepository.update(data.id, {
      title: data.title,
      content: data.content,
    });
  }
}
