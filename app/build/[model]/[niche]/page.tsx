import { BlueprintGenerator } from '@/components/BlueprintGenerator';
import { LegalFooter } from '@/components/LegalFooter';
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
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-y-auto">
      <main className="flex-1 p-4 sm:p-8 flex flex-col gap-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center mt-4 sm:mt-8">
          <BlueprintGenerator pSeoModel={pSeoModel} pSeoNiche={pSeoNiche} />
          
          <article className="mt-16 w-full max-w-3xl bg-slate-900/40 border border-cyan-900/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] rounded-2xl p-8 sm:p-12 mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-tight">
              Why build a {pSeoModel} for {pSeoNiche} in 2026?
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              The market for {pSeoNiche} is rapidly evolving. As more professionals in this space look to automate their workflows, building a custom {pSeoModel} provides a massive unfair advantage. Whether you are streamlining daily operations or creating a new revenue stream, deploying the right tech stack is critical.
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              The AI Advantage for {pSeoNiche}
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              Most generic software fails to capture the specific nuances required by {pSeoNiche}. By utilizing BlueprintAI to architect a bespoke {pSeoModel}, you eliminate development guesswork. Our engine analyzes the specific data constraints and monetization strategies required to succeed in this industry, outputting a production-ready launch plan and Agent-to-Agent (A2A) directives.
            </p>
          </article>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
}
