import { BlueprintGenerator } from '@/components/BlueprintGenerator';
import { Target, Zap } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';
import { HypePoll } from '@/components/HypePoll';
import { Testimonials } from '@/components/Testimonials';
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs';
import Link from 'next/link';
export default async function Home(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id as string | undefined;
  
  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0f] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase">Blueprint<span className="text-cyan-400">AI</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
            <span className="text-xs uppercase tracking-widest font-mono text-cyan-500/80">System Secure</span>
          </div>
          <div className="flex items-center gap-3">
            <Show when="signed-in">
              <Link href="/dashboard" className="text-xs uppercase tracking-widest font-sans font-semibold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors text-white border border-white/10 hidden sm:flex items-center gap-2">
                My Blueprints
              </Link>
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
      <main className="flex-1 p-4 sm:p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full flex flex-col items-center mt-0">
          
          <header className="mb-4 space-y-2 text-center flex flex-col items-center">
            <h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-white">
              Blueprint<span className="font-bold italic text-cyan-400">AI</span>
            </h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              SYSTEM ONLINE. INITIALIZE MV_PROTOCOL. <br className="hidden sm:block" />
              Transform raw concepts into actionable 5-phase indie hacker launch plans.
            </p>
          </header>

          <div className="w-full">
            <BlueprintGenerator initialId={id} />
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
