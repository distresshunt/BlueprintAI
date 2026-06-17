import stackData from "@/data/stack.json";
import { Navbar } from "@/components/Navbar";
import { ExternalLink, ArrowUpRight } from "lucide-react";

export default function StackPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Founder's Stack</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            A curated directory of the absolute best tools to build, launch, and scale your SaaS or AI product.
          </p>
        </div>

        <div className="space-y-16">
          {stackData.map((categoryGroup, index) => (
            <section key={index}>
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-4">
                {categoryGroup.category}
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent"></div>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
                {categoryGroup.tools.map((tool, tIndex) => {
                  let badgeColor = "bg-zinc-800 text-zinc-300 border-zinc-700";
                  if (tool.difficulty === "Easy") {
                    badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                  } else if (tool.difficulty === "Medium") {
                    badgeColor = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
                  } else if (tool.difficulty === "Hard") {
                    badgeColor = "bg-red-500/10 text-red-400 border-red-500/20";
                  }

                  return (
                    <div 
                      key={tIndex} 
                      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-colors group flex flex-col h-full"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {tool.name}
                          </h3>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border mt-2 ${badgeColor}`}>
                            {tool.difficulty} Setup
                          </span>
                        </div>
                        <a 
                          href={tool.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-zinc-800 hover:bg-cyan-500/20 text-zinc-300 hover:text-cyan-400 p-2 rounded-lg transition-all"
                          title={`Visit ${tool.name}`}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      </div>
                      
                      <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">
                        {tool.description}
                      </p>
                      
                      <div className="space-y-3 mt-auto">
                        <div className="flex items-start gap-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                          <span className="text-emerald-400 font-bold shrink-0">+</span>
                          <p className="text-xs text-emerald-200/80 leading-relaxed"><strong className="text-emerald-300">Pros:</strong> {tool.pros}</p>
                        </div>
                        <div className="flex items-start gap-2 bg-red-500/5 p-3 rounded-xl border border-red-500/10">
                          <span className="text-red-400 font-bold shrink-0">-</span>
                          <p className="text-xs text-red-200/80 leading-relaxed"><strong className="text-red-300">Cons:</strong> {tool.cons}</p>
                        </div>
                      </div>
                      
                      <a 
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 w-full py-3 bg-zinc-800 hover:bg-cyan-500 hover:text-black text-white rounded-xl text-sm font-bold transition-all text-center flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      >
                        <span className="flex items-center justify-center gap-1.5">View Tool <ArrowUpRight className="w-4 h-4" /></span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
