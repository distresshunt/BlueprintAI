import { ArrowRight, ExternalLink } from 'lucide-react';



export function PortfolioShowcase() {
  return (
    <section className="w-full py-24 bg-[#050507] border-t border-slate-800/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.03)_0%,transparent_70%)]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
            Built with <span className="text-cyan-400">BlueprintAI</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Join hundreds of founders shipping production-ready apps using our architecture.
          </p>
        </div>

        <div className="backdrop-blur-md bg-zinc-900/50 border border-zinc-800 p-12 text-center rounded-2xl mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Community Showcase Dropping Soon.</h3>
          <p className="text-slate-400 text-lg">Submit your BlueprintAI projects to be featured here.</p>
        </div>

        <div className="flex justify-center">
          <a 
            href="mailto:support@blueprintagent.dev?subject=Portfolio Submission"
            className="group flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-white rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
          >
            <span className="font-bold uppercase tracking-widest text-sm">Submit your project 🚀</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
          </a>
        </div>
      </div>
    </section>
  );
}
