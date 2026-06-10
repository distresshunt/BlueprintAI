'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { FolderOpen, Lock, Unlock, Trash2, Search } from 'lucide-react';

type Blueprint = any; // You can refine this type based on your DB schema

export function DashboardClient({ initialBlueprints, userId }: { initialBlueprints: Blueprint[], userId: string }) {
  const [blueprints, setBlueprints] = useState<Blueprint[]>(initialBlueprints);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('Newest');

  const filteredAndSortedBlueprints = useMemo(() => {
    let result = [...blueprints];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(bp => bp.idea_prompt?.toLowerCase().includes(query));
    }

    // Filter by status
    if (filterStatus === 'Unlocked') {
      result = result.filter(bp => bp.is_unlocked);
    } else if (filterStatus === 'Locked') {
      result = result.filter(bp => !bp.is_unlocked);
    }

    // Sort
    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'Newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [blueprints, searchQuery, filterStatus, sortOrder]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // Prevent navigating to the Link
    
    if (window.confirm("Are you sure you want to delete this blueprint? This cannot be undone.")) {
      const { error } = await supabase
        .from('blueprints')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (!error) {
        setBlueprints(prev => prev.filter(bp => bp.id !== id));
      } else {
        alert("Failed to delete blueprint.");
      }
    }
  };

  if (blueprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 bg-slate-900/40 border border-slate-800/60 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-50" />
        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-2xl border border-slate-700/50 relative z-10">
          <FolderOpen className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </div>
        <h3 className="text-3xl font-black text-white mb-4 tracking-tight relative z-10">Your Vault is Empty.</h3>
        <p className="text-slate-400 mb-10 text-center max-w-xl leading-relaxed relative z-10 text-lg">
          This is your personal storage matrix. When you generate a new SaaS architecture, it will be securely saved here so you can access your .cursorrules files, Tech Stacks, and monetization strategies from any device at any time.
        </p>
        <Link 
          href="/" 
          className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-[0.2em] text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:-translate-y-1 relative z-10"
        >
          Architect a Blueprint ⚡️
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-900/50 border border-slate-800 rounded-xl shadow-lg">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search blueprints..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer font-medium"
          >
            <option value="All">All Blueprints</option>
            <option value="Unlocked">Unlocked Only</option>
            <option value="Locked">Locked Only</option>
          </select>
          <select 
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer font-medium"
          >
            <option value="Newest">Newest First</option>
            <option value="Oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {filteredAndSortedBlueprints.length === 0 ? (
        <div className="py-20 text-center text-slate-500 bg-slate-900/20 rounded-xl border border-slate-800/50 border-dashed">
          No blueprints found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedBlueprints.map((bp) => {
            const isUnlocked = bp.is_unlocked;
            const href = isUnlocked ? \`/premium-vault?id=\${bp.id}\` : \`/?id=\${bp.id}\`;

            return (
              <Link key={bp.id} href={href} className="group relative bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] flex flex-col h-full overflow-hidden">
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
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] uppercase font-bold tracking-widest">
                        <Lock className="w-3 h-3" /> Locked
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-center relative z-20">
                  <h3 className="text-lg font-semibold text-white leading-snug line-clamp-4 group-hover:text-cyan-400 transition-colors">
                    "{bp.idea_prompt}"
                  </h3>
                </div>

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
  );
}
