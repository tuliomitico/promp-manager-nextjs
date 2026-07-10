import { PromptCard, type PromptCardProps } from '@/components/prompts';
import { render, screen } from '@/lib/test-utils';

const makeSut = ({ prompt }: PromptCardProps) => {
  return render(<PromptCard prompt={prompt} />);
};

describe('PromptCard', () => {
  it('deveria renderizar o link com href corretamente', () => {
    const prompt: PromptCardProps['prompt'] = {
      id: '1',
      title: 'title 01',
      content: 'content 01',
    };
    makeSut({ prompt });
    const link = screen.getByRole('link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/${prompt.id}`);
  });
});
