import { ArrowRight, ExternalLink } from 'lucide-react';
import showcaseData from '@/data/showcase.json';
import Link from 'next/link';

export function PortfolioShowcase() {
  return (
    <section className="w-full py-24 bg-zinc-50 dark:bg-[#050507] border-t border-zinc-200 dark:border-slate-800/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(132,204,22,0.03)_0%,transparent_70%)]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tight uppercase mb-4">
            BUILT WITH <span className="text-amber-500">LAUNCHCODES</span>
          </h2>
          <p className="text-zinc-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Explore real, production-ready platforms architected using our AI Tech Lead.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
          {showcaseData.map((app) => {
            const isPurple = app.theme.includes('purple');
            const isAmber = app.theme.includes('amber');
            const isEmerald = app.theme.includes('emerald');
            const accentBorder = isPurple ? 'group-hover:border-purple-500/50' : isAmber ? 'group-hover:border-zinc-700' : isEmerald ? 'group-hover:border-emerald-400/50' : 'group-hover:border-blue-500/50';
            const accentText = isPurple ? 'text-purple-400' : isAmber ? 'text-zinc-300' : isEmerald ? 'text-emerald-400' : 'text-blue-400';

            return (
              <div key={app.slug} className={`group flex flex-col bg-white/60 dark:bg-slate-900/40 border border-zinc-200 dark:border-slate-800/50 ${accentBorder} rounded-2xl p-8 transition-all hover:shadow-xl`}>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3 flex items-center justify-between">
                  {app.name}
                </h3>
                <p className="text-zinc-600 dark:text-slate-400 text-sm mb-6 flex-1">
                  {app.tagline}
                </p>
                <Link 
                  href={`/showcase/${app.slug}`}
                  className={`mt-auto inline-flex items-center gap-2 font-semibold text-sm ${accentText} hover:opacity-80 transition-opacity`}
                >
                  Visit App <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <a 
            href="mailto:support@yourlaunchcodes.com?subject=Portfolio Submission"
            className="group flex items-center gap-3 px-8 py-4 bg-zinc-200 hover:bg-zinc-300 dark:bg-slate-900 dark:hover:bg-slate-800 border border-zinc-300 dark:border-slate-800 dark:hover:border-zinc-700 text-zinc-900 dark:text-white rounded-xl transition-all shadow-lg hover:"
          >
            <span className="font-bold uppercase tracking-widest text-sm">Submit your project 🚀</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-zinc-600 dark:text-zinc-300" />
          </a>
        </div>
      </div>
    </section>
  );
}
