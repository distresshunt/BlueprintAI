import { BlueprintGenerator } from '@/components/BlueprintGenerator';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ model: string; niche: string }>;
};

function formatTitleCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const model = formatTitleCase(resolvedParams.model);
  const niche = formatTitleCase(resolvedParams.niche);

  return {
    title: `How to Build a ${model} for ${niche} in 2026 | BlueprintAI`,
    description: `Get the complete, step-by-step technical blueprint and AI agent prompts to build a ${model} for ${niche} without writing a single line of backend code.`,
  };
}

export default async function BuildModelNichePage({ params }: Props) {
  const resolvedParams = await params;
  const pSeoModel = formatTitleCase(resolvedParams.model);
  const pSeoNiche = formatTitleCase(resolvedParams.niche);

  return (
    <BlueprintGenerator pSeoModel={pSeoModel} pSeoNiche={pSeoNiche} />
  );
}
