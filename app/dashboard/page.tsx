import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Zap, Lock, Unlock, ArrowLeft, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { LegalFooter } from '@/components/LegalFooter';
import { UserButton } from '@clerk/nextjs';

export const metadata = {
  title: 'My Blueprints | BlueprintAI',
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/');
  }

  const { data: blueprints, error } = await supabase
    .from('blueprints')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans">
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0f] shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase hidden sm:inline">
              Blueprint<span className="text-cyan-400">AI</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xs uppercase tracking-widest font-sans font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-white flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">New Blueprint</span>
          </Link>
          <UserButton />
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-cyan-400" /> My Blueprints
          </h1>
          <p className="text-slate-400 mt-2">View and manage your generated architectural blueprints.</p>
        </div>

        {error ? (
          <div className="p-4 bg-red-900/20 border border-red-500/30 text-red-400 rounded-xl">
            Failed to load blueprints.
          </div>
        ) : !blueprints || blueprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-slate-900/30 border border-slate-800 rounded-xl">
            <Zap className="w-12 h-12 text-slate-700 mb-4" />
            <p className="text-slate-400">You haven't architected any blueprints yet.</p>
            <Link href="/" className="mt-4 text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4">
              Create your first one
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blueprints.map((bp) => {
              const isUnlocked = bp.is_unlocked;
              // If locked, we send them to /?id= so the homepage can load their prompt and show paywall
              // Actually, wait, BlueprintGenerator doesn't load ?id= currently. We might need to add that, or just send them to /
              // For now, let's just send them to / premium-vault?id= so premium-vault can handle if it's locked.
              // Let's send everything to /premium-vault?id= and premium vault should verify unlocking?
              // The user said: "If is_unlocked: false, clicking it should route them to the paywall/checkout flow."
              // In our implementation plan, I decided to route them to /?id= but I will need to update the homepage to read id.
              // Let's just route to /?id=
              const href = isUnlocked ? `/premium-vault?id=${bp.id}` : `/?id=${bp.id}`;

              return (
                <Link key={bp.id} href={href} className="group relative bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col h-full overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="text-xs font-mono text-slate-500 mb-2">
                        {new Date(bp.created_at).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      {isUnlocked ? (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] uppercase font-bold tracking-widest">
                          <Unlock className="w-3 h-3" /> Unlocked
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] uppercase font-bold tracking-widest">
                          <Lock className="w-3 h-3" /> Locked
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold text-white leading-snug line-clamp-4 group-hover:text-cyan-400 transition-colors">
                      "{bp.idea_prompt}"
                    </h3>
                  </div>

                  {!isUnlocked && (
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <LegalFooter />
    </div>
  );
}
