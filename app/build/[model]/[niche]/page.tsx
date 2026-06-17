import { BlueprintGenerator } from '@/components/BlueprintGenerator';
import { LegalFooter } from '@/components/LegalFooter';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ model: string; niche: string }>;
};

function formatTitleCase(str: string) {
  return str.split('-').map(word => {
    if (word.toLowerCase() === 'ai') return 'AI';
    if (word.toLowerCase() === 'okf') return 'OKF';
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function getBuildPhrase(modelRaw: string, nicheRaw: string) {
  const model = formatTitleCase(modelRaw);
  const niche = formatTitleCase(nicheRaw);
  const m = modelRaw.toLowerCase();

  if (m === 'make-an-app') return `Make an App for ${niche}`;
  if (m === 'uber-for') return `Build an Uber for ${niche}`;
  if (m === 'directory-website') return `Build a Directory Website for ${niche}`;
  if (m === 'automated-booking-system') return `Build an Automated Booking System for ${niche}`;
  
  const startsWithVowel = /^[AEIOU]/.test(model);
  return `Build a${startsWithVowel ? 'n' : ''} ${model} for ${niche}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const buildPhrase = getBuildPhrase(resolvedParams.model, resolvedParams.niche);

  return {
    title: `How to ${buildPhrase} in 2026 | BlueprintAI`,
    description: `Get the complete, step-by-step technical blueprint and AI agent prompts to ${buildPhrase.toLowerCase()} without writing a single line of backend code.`,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function BuildModelNichePage({ params }: Props) {
  const resolvedParams = await params;
  const buildPhrase = getBuildPhrase(resolvedParams.model, resolvedParams.niche);
  const whyPhrase = buildPhrase.charAt(0).toLowerCase() + buildPhrase.slice(1);
  const pSeoModel = formatTitleCase(resolvedParams.model);
  const pSeoNiche = formatTitleCase(resolvedParams.niche);

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-y-auto">
      <main className="flex-1 p-4 sm:p-8 flex flex-col gap-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center mt-4 sm:mt-8">
          <BlueprintGenerator initialIdea={`I want to ${whyPhrase}.`} />
          
          <article className="mt-16 w-full max-w-3xl bg-slate-900/40 border border-cyan-900/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] rounded-2xl p-8 sm:p-12 mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-tight">
              Why {whyPhrase} in 2026?
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              The market for {pSeoNiche} is rapidly evolving. As more professionals in this space look to automate their workflows, {whyPhrase} provides a massive unfair advantage. Whether you are streamlining daily operations or creating a new revenue stream, deploying the right tech stack is critical.
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
