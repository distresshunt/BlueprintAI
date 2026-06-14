'use client';

import React, { useMemo } from 'react';
import { ExternalLink, Link as LinkIcon, ChevronDown } from 'lucide-react';

interface ResourceHubProps {
  blueprintMarkdown: string;
}

const extractLinksByPhase = (text: string) => {
  const phases: Record<string, { label: string; url: string }[]> = {};
  let currentPhase = "General / Phase 0";

  const lines = text.split('\n');
  for (const line of lines) {
    // Detect Phase Headers (matches Phase 1, **Phase 1**, ### Phase 1, etc.)
    const phaseMatch = line.match(/(?:Phase)[\s_]*([0-9A-Za-z]+)/i);
    if (phaseMatch && (line.includes('#') || line.includes('**'))) {
      currentPhase = `Phase ${phaseMatch[1].toUpperCase()}`;
    }

    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    let linkMatch: RegExpExecArray | null;
    while ((linkMatch = linkRegex.exec(line)) !== null) {
      const match = linkMatch;
      if (!phases[currentPhase]) phases[currentPhase] = [];
      // Prevent duplicate buttons for the same URL in the same phase
      if (!phases[currentPhase].some(l => l.url === match[2])) {
        phases[currentPhase].push({ label: match[1], url: match[2] });
      }
    }
  }
  return phases;
};

export function ResourceHub({ blueprintMarkdown }: ResourceHubProps) {
  const categorizedLinks = useMemo(() => {
    if (!blueprintMarkdown) return {};
    return extractLinksByPhase(blueprintMarkdown);
  }, [blueprintMarkdown]);

  if (Object.keys(categorizedLinks).length === 0) {
    return null;
  }

  return (
    <details className="bg-slate-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl mb-8 group overflow-hidden shadow-2xl transition-all duration-300">
      <summary className="p-5 cursor-pointer select-none flex items-center justify-between hover:bg-slate-800/40 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <LinkIcon className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-bold text-white tracking-tight">Magical Resource Hub</h2>
            <p className="text-xs text-zinc-500 font-medium">Auto-extracted links from your blueprint</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
          <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform duration-300" />
        </div>
      </summary>
      <div className="p-5 pt-0 border-t border-zinc-800/50 bg-slate-900/20">
        {Object.entries(categorizedLinks).map(([phase, links]) => (
          <div key={phase} className="mt-6 first:mt-4">
            <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-cyan-500/30"></span>
              {phase}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center justify-between bg-zinc-900/80 hover:bg-[#0D0D0D] border border-zinc-800 hover:border-cyan-500/40 px-4 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                >
                  <span className="text-sm font-medium text-zinc-300 group-hover/link:text-cyan-300 truncate pr-4 transition-colors">
                    {link.label}
                  </span>
                  <ExternalLink className="w-4 h-4 text-zinc-600 group-hover/link:text-cyan-400 shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
