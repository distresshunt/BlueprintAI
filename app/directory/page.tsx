import Link from 'next/link';
import pseoData from '@/data/pseo.json';
import { LegalFooter } from '@/components/LegalFooter';
import { Navbar } from '@/components/Navbar';

function toTitleCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const metadata = {
  title: 'Industry Architecture Directory | LaunchCodes',
  description: 'Explore thousands of battle-tested SaaS models and architectural blueprints for any niche.',
};

export default function DirectoryPage() {
  const { models, niches } = pseoData;

  // We limit to the first 100 niches per model to prevent massive DOM bloat
  // The actual dynamic routes still mathematically support all niches
  const limitedNiches = niches.slice(0, 100);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-20">
        <div className="mb-16 border-b border-zinc-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-white">
            Industry Architecture Directory
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl">
            A master directory of validated SaaS models and specialized niches. Select a model to instantly generate its complete Next.js architecture.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {models.map((model) => (
            <section key={model} className="border border-zinc-800 bg-[#09090B] rounded-2xl p-8 sm:p-10">
              <div className="mb-8 border-b border-zinc-800/50 pb-6">
                <h2 className="text-3xl font-bold capitalize text-white">
                  {toTitleCase(model)} Architectures
                </h2>
                <p className="text-zinc-500 mt-2">
                  Top 100 pre-engineered blueprints for the {toTitleCase(model)} business model.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-4">
                {limitedNiches.map((niche) => (
                  <Link 
                    key={`${model}-${niche}`} 
                    href={`/build/${model}/${niche}`}
                    className="text-zinc-400 hover:text-white group flex items-start gap-3 transition-colors text-sm"
                  >
                    <span className="text-zinc-700 mt-0.5">↳</span>
                    <span className="leading-snug truncate" title={toTitleCase(niche)}>
                      {toTitleCase(niche)}
                    </span>
                  </Link>
                ))}
              </div>
              
              {niches.length > 100 && (
                <div className="mt-8 pt-6 border-t border-zinc-800/50 text-zinc-600 text-sm">
                  Showing top 100 niches. Over {(niches.length - 100).toLocaleString()} additional niches are available dynamically via search.
                </div>
              )}
            </section>
          ))}
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
