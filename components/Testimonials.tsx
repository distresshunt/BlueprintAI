'use client';

import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "BlueprintAI saved me 3 weeks of over-engineering. I launched my productized service in 48 hours and got 3 paying clients.",
    author: "Alex R.",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    quote: "The Cursor rules file it generated literally coded my marketplace MVP for me.",
    author: "Sarah T.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    quote: "The Wizard of Oz strategy is genius. Got to $1k MRR before writing any backend code.",
    author: "Marcus J.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
];

export function Testimonials() {
  return (
    <div className="w-full mt-10 mb-6 overflow-hidden relative" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
      <div className="animate-marquee flex gap-6 shrink-0 min-w-full w-max" style={{ animationDuration: '40s' }}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex gap-6 shrink-0">
            {TESTIMONIALS.map((t, j) => (
              <div key={j} className="w-[300px] sm:w-[350px] bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 flex flex-col gap-4 shadow-xl shrink-0">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 font-serif text-sm italic leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.author} className="w-8 h-8 rounded-full border border-slate-700" />
                  <span className="text-white font-sans font-semibold text-xs">{t.author}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
