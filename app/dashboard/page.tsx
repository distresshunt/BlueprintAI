import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Zap, Lock, Unlock, ArrowLeft, LayoutDashboard, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { LegalFooter } from '@/components/LegalFooter';
import { UserButton } from '@clerk/nextjs';
import { DashboardClient } from '@/components/DashboardClient';

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

  if (error) {
    console.error("Supabase Error: ", error.message);
  }

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
          <div className="text-red-500">Failed to load blueprints: {error.message || JSON.stringify(error) || "Unknown Error"}</div>
        ) : (
          <DashboardClient initialBlueprints={blueprints || []} userId={userId} />
        )}
      </main>

      <LegalFooter />
    </div>
  );
}
