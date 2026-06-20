'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Sparkles, Send, Map } from 'lucide-react';

const DUMMY_FEATURES = [
  { id: 1, title: '1-Click Cursor / Windsurf Prompt Export', description: 'Instantly convert this blueprint into the exact system prompts needed for AI coding agents to build the app.', votes: 412, upvoted: false },
  { id: 2, title: 'Automated Competitor & Pricing Tear-Down', description: 'AI scans the web for your direct competitors and reverse-engineers their pricing models.', votes: 184, upvoted: false },
  { id: 3, title: 'Figma Wireframe Generator', description: 'Export Phase 1 directly into a basic Figma layout.', votes: 89, upvoted: false },
];

export function HypePoll() {
  const [features, setFeatures] = useState(DUMMY_FEATURES);
  const [newIdea, setNewIdea] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleUpvote = (id: number) => {
    setFeatures(features.map(f => 
      f.id === id 
        ? { ...f, votes: f.upvoted ? f.votes - 1 : f.votes + 1, upvoted: !f.upvoted } 
        : f
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim()) return;
    
    // Add the new idea locally for immediate satisfaction
    const newFeature = {
      id: Date.now(),
      title: newIdea,
      description: '',
      votes: 1,
      upvoted: true,
    };
    
    setFeatures([newFeature, ...features].slice(0, 4));
    setNewIdea('');
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="w-full mt-6 sm:mt-12 mb-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
          <Map className="w-5 h-5 text-slate-300" />
        </div>
        <div>
          <h3 className="text-slate-200 font-sans font-semibold text-lg tracking-tight">Community Roadmap</h3>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Vote on what comes next for the community.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-3">
          <AnimatePresence mode="popLayout">
            {features.map(feature => (
              <motion.div 
                key={feature.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-start justify-between gap-4 p-4 rounded-xl border transition-all ${
                  feature.upvoted ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex flex-col gap-1 pr-2">
                  <span className={`text-sm font-semibold transition-colors ${feature.upvoted ? 'text-zinc-300' : 'text-slate-300'}`}>
                    {feature.title}
                  </span>
                  {feature.description && (
                    <span className="text-xs text-slate-500 font-serif leading-relaxed">
                      {feature.description}
                    </span>
                  )}
                </div>
                <button 
                  onClick={() => handleUpvote(feature.id)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all mt-1 ${
                    feature.upvoted 
                      ? 'bg-zinc-800 text-slate-950' 
                      : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <ArrowUp className={`w-3 h-3 ${feature.upvoted ? 'text-slate-950' : ''}`} />
                  {feature.votes}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="w-full md:w-1/3 flex flex-col justify-end border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="text-xs font-mono text-slate-500 uppercase tracking-widest block">Submit your idea</label>
            <div className="relative">
              <input 
                type="text" 
                value={newIdea}
                onChange={(e) => setNewIdea(e.target.value)}
                placeholder="e.g. Export to PDF"
                className="w-full bg-slate-800/50 border border-slate-700 text-white text-sm rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:border-zinc-700 transition-colors placeholder:text-slate-600"
              />
              <button 
                type="submit"
                disabled={!newIdea.trim()}
                className="absolute right-2 top-2 p-1.5 text-slate-400 hover:text-zinc-300 disabled:opacity-50 disabled:hover:text-slate-400 transition-colors bg-slate-900 rounded-lg border border-slate-700"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            <AnimatePresence>
              {submitted && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="text-xs text-green-400 font-mono flex items-center gap-1 mt-1"
                >
                  <Sparkles className="w-3 h-3" /> Note added to builder queue!
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}
