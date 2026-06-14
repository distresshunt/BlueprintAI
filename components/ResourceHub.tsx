'use client';

import React, { useMemo } from 'react';

interface ResourceHubProps {
  blueprintMarkdown: string;
}

export function ResourceHub({ blueprintMarkdown }: ResourceHubProps) {
  const categorizedLinks = useMemo(() => {
    if (!blueprintMarkdown) return {};

    // Split markdown by Phase headers (e.g., ## Phase 1 or **Phase 1**)
    const phases = blueprintMarkdown.split(/(?=(?:^|\n)(?:##|\*\*)\s*(?:Phase|Step).*?(?:\n|$))/i);
    const linksByPhase: Record<string, { title: string; url: string }[]> = {};

    const defaultPhase = 'General Resources';

    phases.forEach((phaseText) => {
      // Extract Phase name if available
      const phaseMatch = phaseText.match(/(?:^|\n)(?:##|\*\*)\s*(Phase\s*[\d\w\s:-]+|Step\s*[\d\w\s:-]+)/i);
      let phaseName = phaseMatch ? phaseMatch[1].trim() : defaultPhase;
      // Strip out markdown bold/italic characters
      phaseName = phaseName.replace(/\*\*|__/g, '').replace(/[:#]/g, '').trim();

      const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
      let match;
      const links = [];
      while ((match = regex.exec(phaseText)) !== null) {
        links.push({ title: match[1], url: match[2] });
      }

      if (links.length > 0) {
        if (!linksByPhase[phaseName]) {
          linksByPhase[phaseName] = [];
        }
        linksByPhase[phaseName].push(...links);
      }
    });

    return linksByPhase;
  }, [blueprintMarkdown]);

  if (Object.keys(categorizedLinks).length === 0) {
    return null;
  }

  return (
    <details className="bg-zinc-900/50 border border-zinc-800 rounded-xl mb-6 group overflow-hidden">
      <summary className="p-4 cursor-pointer font-semibold text-zinc-200 select-none flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
        <span>🔗 Magical Resource Hub (Extracted Links)</span>
        <span className="text-zinc-500 group-open:rotate-180 transition-transform duration-200">
          ▼
        </span>
      </summary>
      <div className="p-4 pt-0 border-t border-zinc-800/50">
        {Object.entries(categorizedLinks).map(([phase, links]) => (
          <div key={phase} className="mt-4 first:mt-2">
            <h3 className="text-cyan-400 text-sm font-bold uppercase mb-2">{phase}</h3>
            <div className="flex flex-wrap gap-2">
              {links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-md text-sm transition-colors shadow-sm border border-zinc-700/50 hover:border-zinc-500"
                >
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}
