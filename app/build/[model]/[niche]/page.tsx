import { BlueprintGenerator } from '@/components/BlueprintGenerator';
import { Zap } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';
import { HypePoll } from '@/components/HypePoll';
import { Testimonials } from '@/components/Testimonials';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    model: string;
    niche: string;
  }>;
}

const formatValue = (val: string) => {
  if (!val) return '';
  return val
    .split('-')
    .map(word => {
      if (word.toLowerCase() === 'saas') return 'SaaS';
      if (word.toLowerCase() === 'hvac') return 'HVAC';
      if (word.toLowerCase() === 'ai') return 'AI';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const modelName = formatValue(resolvedParams.model);
  const nicheName = formatValue(resolvedParams.niche);

  return {
    title: `How to Build a ${modelName} for ${nicheName} in 2026 | BlueprintAI`,
    description: `Get the complete, step-by-step technical blueprint and AI agent prompts to build a ${modelName} for ${nicheName} without writing a single line of backend code.`,
  };
}

export default async function DynamicBuildPage({ params }: PageProps) {
  const resolvedParams = await params;
  const modelName = formatValue(resolvedParams.model);
  const nicheName = formatValue(resolvedParams.niche);
  const formattedTitle = `Build a ${modelName} for ${nicheName}`;
  const initialIdeaText = `A ${modelName} for ${nicheName}`;

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0f] shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase">Blueprint<span className="text-cyan-400">AI</span></span>
        </Link>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-500/80">System Secure</span>
          </div>
          <div className="flex items-center gap-3">
            <Show when="signed-in">
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-xs uppercase tracking-widest font-sans font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-white">Sign In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-xs uppercase tracking-widest font-sans font-semibold bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 rounded transition-colors text-black">Sign Up</button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-4 sm:p-8 flex flex-col gap-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center mt-4 sm:mt-8">
          
          <header className="mb-8 space-y-4 text-center flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]"></span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-500/80">Niche Deployment Protocol</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-light tracking-tighter text-white">
              {formattedTitle}
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-lg leading-relaxed font-sans">
              SYSTEM ONLINE. INITIALIZE MV_PROTOCOL. <br className="hidden sm:block" />
              Generate your bespoke launch plan and developer instructions for {nicheName}.
            </p>
          </header>

          <div className="w-full">
            <BlueprintGenerator pSeoModel={modelName} pSeoNiche={nicheName} />
            <Testimonials />
            <HypePoll />
          </div>
        </div>
      </main>

      {/* Footer Bar */}
      <LegalFooter />
    </div>
  );
}
