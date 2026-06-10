import { BlueprintGenerator } from '@/components/BlueprintGenerator';
import { LegalFooter } from '@/components/LegalFooter';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ skill: string; niche: string }>;
};

function formatTitleCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const skill = formatTitleCase(resolvedParams.skill);
  const niche = formatTitleCase(resolvedParams.niche);

  return {
    title: `Learn ${skill} in 2026: Build an app for ${niche} | BlueprintAI`,
    description: `Stop doing boring tutorials. Learn ${skill} by architecting and building a real, profitable app for ${niche} using AI.`,
  };
}

export default async function LearnSkillNichePage({ params }: Props) {
  const resolvedParams = await params;
  const formattedSkill = formatTitleCase(resolvedParams.skill);
  const formattedNiche = formatTitleCase(resolvedParams.niche);

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-y-auto">
      <main className="flex-1 p-4 sm:p-8 flex flex-col gap-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center mt-4 sm:mt-8">
          <BlueprintGenerator learnSkill={formattedSkill} learnNiche={formattedNiche} />
          
          <article className="mt-16 w-full max-w-3xl bg-slate-900/40 border border-cyan-900/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] rounded-2xl p-8 sm:p-12 mb-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 leading-tight">
              Why learn {formattedSkill} by building for {formattedNiche}?
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Tutorial hell is real. The fastest way to learn {formattedSkill} in 2026 is through project-based learning. Instead of building another generic todo app, you are going to architect a real-world, profitable solution for {formattedNiche}. This approach forces you to solve actual business logic, handle complex data states, and integrate production-ready AI tools.
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              The BlueprintAI Learning Path
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed">
              We leverage advanced Agent-to-Agent (A2A) directives to turn your AI Builder (Cursor, Windsurf, or Antigravity) into a senior tech lead. They will guide you step-by-step as you learn {formattedSkill}, ensuring you build a production-grade application for {formattedNiche} without writing spaghetti code.
            </p>
          </article>
        </div>
      </main>
      <LegalFooter />
    </div>
  );
}
