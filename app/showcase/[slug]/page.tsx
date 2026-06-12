import { notFound } from 'next/navigation';
import showcaseData from '@/data/showcase.json';
import Link from 'next/link';

export async function generateStaticParams() {
  return showcaseData.map((app) => ({
    slug: app.slug,
  }));
}

export default async function ShowcasePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const app = showcaseData.find((a) => a.slug === resolvedParams.slug);

  if (!app) {
    notFound();
  }

  // Parse the theme for dynamic classes
  const isPurple = app.theme.includes('purple');
  const isAmber = app.theme.includes('amber');
  const isEmerald = app.theme.includes('emerald');

  const accentColorText = isPurple ? 'text-purple-500' : isAmber ? 'text-amber-500' : isEmerald ? 'text-emerald-400' : 'text-blue-500';
  const accentColorBg = isPurple ? 'bg-purple-600 hover:bg-purple-700' : isAmber ? 'bg-amber-600 hover:bg-amber-700' : isEmerald ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700';
  const accentBorder = isPurple ? 'border-purple-500/30' : isAmber ? 'border-amber-500/30' : isEmerald ? 'border-emerald-400/30' : 'border-blue-500/30';
  const accentGlow = isPurple ? 'shadow-[0_0_30px_rgba(168,85,247,0.15)]' : isAmber ? 'shadow-[0_0_30px_rgba(245,158,11,0.15)]' : isEmerald ? 'shadow-[0_0_30px_rgba(52,211,153,0.15)]' : 'shadow-lg';

  const bgStyle = isPurple ? 'bg-zinc-950' : isAmber ? 'bg-slate-900' : isEmerald ? 'bg-zinc-900' : 'bg-[#050507]';

  return (
    <div className={`min-h-screen flex flex-col ${bgStyle} text-white font-sans selection:bg-cyan-500/30`}>
      <header className="flex items-center justify-between p-6 sm:px-12 border-b border-white/5">
        <Link href="/" className="text-xl font-bold tracking-tighter hover:text-cyan-400 transition-colors">
          BlueprintAI <span className="text-white/40">Ecosystem</span>
        </Link>
        <a 
          href={app.sub_link} 
          className={`px-5 py-2 rounded-full font-semibold transition-all ${accentColorBg} text-white shadow-lg`}
        >
          Get Access
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-5xl mx-auto w-full py-20">
        <div className={`inline-block mb-6 px-4 py-1.5 rounded-full border ${accentBorder} bg-white/5 backdrop-blur-sm text-sm font-medium ${accentColorText}`}>
          New Release
        </div>
        
        <h1 className="text-5xl sm:text-7xl font-black mb-8 leading-tight tracking-tight">
          {app.name}
        </h1>
        
        <p className="text-xl sm:text-2xl text-slate-400 mb-12 max-w-3xl leading-relaxed">
          {app.tagline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-20 w-full">
          <a 
            href={app.one_time_link} 
            className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all border border-white/20 text-slate-300 hover:text-white hover:bg-white/5 active:scale-95"
          >
            Get Lifetime Access - $29
          </a>
          <a 
            href={app.sub_link} 
            className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all ${accentColorBg} text-white hover:scale-105 active:scale-95 shadow-xl`}
          >
            Start Pro Subscription - $19/mo
          </a>
        </div>

        {/* Feature section mock */}
        <div className={`w-full max-w-4xl p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent ${accentGlow}`}>
          <div className="w-full bg-[#0a0a0c] rounded-[22px] p-8 sm:p-12 border border-white/5">
            <h3 className="text-2xl font-bold mb-8">Why {app.name}?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
              <div>
                <div className={`w-12 h-12 rounded-xl bg-white/5 border ${accentBorder} flex items-center justify-center mb-4 ${accentColorText}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">Lightning Fast</h4>
                <p className="text-sm text-slate-400">Deploy instantly within the ecosystem without juggling multiple tabs.</p>
              </div>
              <div>
                <div className={`w-12 h-12 rounded-xl bg-white/5 border ${accentBorder} flex items-center justify-center mb-4 ${accentColorText}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">Secure Sync</h4>
                <p className="text-sm text-slate-400">Deep integration with BlueprintAI ensures your data is always perfectly synced.</p>
              </div>
              <div>
                <div className={`w-12 h-12 rounded-xl bg-white/5 border ${accentBorder} flex items-center justify-center mb-4 ${accentColorText}`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h4 className="text-lg font-semibold mb-2">Flexible Pricing</h4>
                <p className="text-sm text-slate-400">Choose between a lifetime deal or our affordable Pro MRR subscription tier.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
