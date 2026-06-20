'use client';

import { useState, useMemo, useEffect } from 'react';
import { redirect, useRouter } from "next/navigation";

import { useAuth, UserButton } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Zap, Lock, Unlock, ArrowLeft, LayoutDashboard, FolderOpen, Trash2, Search, Copy } from 'lucide-react';
import Link from 'next/link';
import { LegalFooter } from '@/components/LegalFooter';

type Blueprint = any;

export default function DashboardPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');

  // Handle redirect if not logged in
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/');
    }
  }, [isLoaded, userId, router]);

  // Fetch blueprints on mount
  useEffect(() => {
    async function fetchBlueprints() {
      if (!userId) return;
      setLoading(true);
      
      const [{ data: profile }, { data, error: fetchError }] = await Promise.all([
        supabase.from('profiles').select('is_pro').eq('user_id', userId).single(),
        supabase.from('blueprints').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);
      
      const isPro = profile?.is_pro === true;

      if (fetchError) {
        console.error("Supabase Error: ", fetchError.message);
        setError(fetchError.message);
      } else {
        const enhancedBlueprints = (data || []).map(bp => ({
          ...bp,
          is_unlocked: bp.is_unlocked || isPro
        }));
        setBlueprints(enhancedBlueprints);
      }
      setLoading(false);
    }

    if (userId) {
      fetchBlueprints();
    }
  }, [userId]);

  const filteredAndSortedBlueprints = useMemo(() => {
    let result = [...blueprints];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(bp => bp.idea_prompt?.toLowerCase().includes(query));
    }

    if (filterStatus === 'Unlocked') {
      result = result.filter(bp => bp.is_unlocked);
    } else if (filterStatus === 'Locked') {
      result = result.filter(bp => !bp.is_unlocked);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [blueprints, searchQuery, filterStatus, sortOrder]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (!userId) return;
    
    if (window.confirm("Are you sure you want to delete this blueprint? This cannot be undone.")) {
      const { error: deleteError } = await supabase
        .from('blueprints')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (!deleteError) {
        setBlueprints(prev => prev.filter(bp => bp.id !== id));
      } else {
        alert("Failed to delete blueprint.");
      }
    }
  };

  if (!isLoaded || (loading && !error)) {
    return (
      <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans items-center justify-center">
        <Zap className="w-8 h-8 text-zinc-300 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans">
      

      <main className="flex-1 p-4 sm:p-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 border-b border-slate-800 pb-4">
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-zinc-300" /> My Blueprints
          </h1>
          <p className="text-slate-400 mt-2">View and manage your generated architectural blueprints.</p>
        </div>

        {error ? (
          <div className="text-red-500">Failed to load blueprints: {error}</div>
        ) : blueprints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-6 bg-white/5 rounded-3xl backdrop-blur-3xl relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/5 via-transparent to-transparent opacity-50" />
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-slate-700/50 relative z-10">
              <FolderOpen className="w-10 h-10 text-zinc-300 drop-" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight relative z-10">Your Vault is Empty.</h3>
            <p className="text-slate-400 mb-10 text-center max-w-xl leading-relaxed relative z-10 text-lg">
              This is your personal storage matrix. When you generate a new SaaS architecture, it will be securely saved here so you can access your .cursorrules files, Tech Stacks, and monetization strategies from any device at any time.
            </p>
            <Link 
              href="/" 
              className="px-10 py-4 bg-zinc-800 hover:bg-zinc-800 text-black font-bold uppercase tracking-[0.2em] text-sm rounded-xl transition-all hover: hover:-translate-y-1 relative z-10"
            >
              Architect a Blueprint ⚡️
            </Link>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-8">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-white/5 rounded-2xl backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Search blueprints..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/20 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:bg-white/5 transition-all placeholder:text-slate-500 backdrop-blur-md"
                />
              </div>
              <div className="flex gap-4">
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-black/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:bg-white/5 transition-all cursor-pointer font-medium backdrop-blur-md"
                >
                  <option value="All">All Blueprints</option>
                  <option value="Unlocked">Unlocked Only</option>
                  <option value="Locked">Locked Only</option>
                </select>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-black/20 text-white rounded-xl px-4 py-3 focus:outline-none focus:bg-white/5 transition-all cursor-pointer font-medium backdrop-blur-md"
                >
                  <option value="Newest">Newest First</option>
                  <option value="Oldest">Oldest First</option>
                </select>
              </div>
            </div>

            {filteredAndSortedBlueprints.length === 0 ? (
              <div className="py-24 text-center text-slate-500 bg-white/5 rounded-2xl backdrop-blur-xl">
                No blueprints found matching your search.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedBlueprints.map((bp) => {
                  const isUnlocked = bp.is_unlocked;
                  const href = isUnlocked ? `/studio?id=${bp.id}` : `/?id=${bp.id}`;

                  return (
                    <Link key={bp.id} href={href} className="group relative bg-white/5 hover:bg-white/10 rounded-2xl p-8 backdrop-blur-2xl transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col h-full overflow-hidden">
                      <div className="flex justify-between items-start mb-4 relative z-20">
                        <div className="flex-1">
                          <div className="text-xs font-mono text-slate-500 mb-2">
                            {new Date(bp.created_at).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isUnlocked ? (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] uppercase font-bold tracking-widest">
                              <Unlock className="w-3 h-3" /> Unlocked
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded text-[10px] uppercase font-bold tracking-widest">
                              <Lock className="w-3 h-3" /> Locked
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center relative z-20">
                        <h3 className="text-lg font-semibold text-white leading-snug line-clamp-4 group-hover:text-zinc-300 transition-colors">
                          "{bp.idea_prompt}"
                        </h3>
                      </div>

                      {isUnlocked && (
                        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3 relative z-30" onClick={(e) => e.preventDefault()}>
                          <div className="text-[10px] uppercase font-mono tracking-widest text-slate-500 flex items-center justify-between">
                            <span>A2A Sync ID</span>
                          </div>
                          <div className="flex items-center justify-between bg-black/40 rounded-xl p-2 pl-4 group/copy hover:bg-black/60 transition-colors backdrop-blur-md">
                            <code className="text-[10px] font-mono text-zinc-300 truncate mr-2">npx launchcodes-cli@latest init --id {bp.id}</code>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                navigator.clipboard.writeText(`npx launchcodes-cli@latest init --id ${bp.id}`);
                              }}
                              className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded text-slate-400 hover:text-zinc-300 transition-colors shrink-0 flex items-center gap-1.5 border border-slate-800"
                              title="Copy CLI Command"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-mono uppercase">Copy Key</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="absolute bottom-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleDelete(e, bp.id)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-colors border border-red-500/20"
                          title="Delete Blueprint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {!isUnlocked && (
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none z-10" />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <LegalFooter />
    </div>
  );
}
