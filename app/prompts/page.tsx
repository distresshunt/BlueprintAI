import Link from 'next/link';
import { LegalFooter } from '@/components/LegalFooter';
import { Navbar } from '@/components/Navbar';
import promptsData from '@/data/prompts-pseo.json';

// Helper to title case format
function toTitleCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const metadata = {
  title: 'AI Agent Prompt Library | LaunchCodes',
  description: 'The definitive library of system prompts for Cursor, Windsurf, AntiGravity, and Cline to architect scalable software.',
};

export default function PromptsHubPage() {
  const { agents, niches } = promptsData;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20">
        <div className="mb-16 border-b border-zinc-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">
            AI Agent Prompt Library
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            A meticulously engineered repository of system prompts designed to dictate architecture, stack choices, and feature sets to autonomous coding agents.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {agents.map((agent) => (
            <section key={agent} className="border border-zinc-800 bg-[#09090B] rounded-2xl p-8 sm:p-10">
              <div className="mb-8 border-b border-zinc-800/50 pb-6">
                <h2 className="text-3xl font-bold capitalize text-white">
                  {agent} Prompts
                </h2>
                <p className="text-zinc-500 mt-2">
                  Optimized context structures specifically formatted for {toTitleCase(agent)}'s cognitive architecture.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {niches.slice(0, 50).map((niche) => (
                  <Link 
                    key={niche} 
                    href={`/prompts/${agent}/${niche}`}
                    className="text-zinc-400 hover:text-white group flex items-start gap-3 transition-colors"
                  >
                    <span className="text-zinc-700 mt-1">↳</span>
                    <span className="leading-snug">
                      {toTitleCase(niche)}
                    </span>
                  </Link>
                ))}
              </div>
              
              {niches.length > 50 && (
                <div className="mt-8 pt-6 border-t border-zinc-800/50 text-zinc-600 text-sm">
                  Showing top 50 highly-curated architectural prompts for {toTitleCase(agent)}. Search specific niches via the terminal.
                </div>
              )}
            </section>
          ))}
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
