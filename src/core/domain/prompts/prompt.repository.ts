import { CreatePromptDTO } from '@/core/application/prompts/create-prompt.dto';
import { UpdatePromptDTO } from '@/core/application/prompts/update-prompt.dto';
import { Prompt } from './prompt.entity';

export interface PromptRepository {
  create(data: CreatePromptDTO): Promise<void>;
  update(id: string, data: Partial<UpdatePromptDTO>): Promise<Prompt>;
  findMany(): Promise<Prompt[]>;
  findById(id: string): Promise<Prompt | null>;
  findByTitle(title: string): Promise<Prompt | null>;
  searchMany(term?: string): Promise<Prompt[]>;
}
