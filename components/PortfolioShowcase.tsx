import { ArrowRight, ExternalLink } from 'lucide-react';

const portfolioItems = [
  {
    name: 'Tenant Shield',
    description: 'Legal-Tech SaaS',
    gradient: 'from-blue-500/20 to-purple-500/20',
    border: 'group-hover:border-blue-500/50',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
  },
  {
    name: 'CanadianForms',
    description: 'pSEO Directory',
    gradient: 'from-emerald-500/20 to-teal-500/20',
    border: 'group-hover:border-emerald-500/50',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]'
  },
  {
    name: 'DistressHunt',
    description: 'Real Estate Data Platform',
    gradient: 'from-orange-500/20 to-red-500/20',
    border: 'group-hover:border-orange-500/50',
    shadow: 'group-hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]'
  }
];

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {portfolioItems.map((item, i) => (
            <div 
              key={i}
              className={`group relative bg-slate-900/50 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden ${item.border} ${item.shadow}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 bg-slate-800 rounded-xl mb-6 flex items-center justify-center border border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
                  <div className="w-6 h-6 bg-slate-600 rounded-md" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-slate-400 mb-8 flex-1">{item.description}</p>
                
                <div className="flex items-center text-cyan-400 text-sm font-bold uppercase tracking-widest gap-2 group-hover:gap-3 transition-all">
                  Visit Site <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
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
