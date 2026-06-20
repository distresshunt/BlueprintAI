'use client';

import { Navbar } from '@/components/Navbar';
import { LegalFooter } from '@/components/LegalFooter';
import { CheckCircle2, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">Compare LaunchCodes Plans</h1>
          <p className="text-zinc-400 text-lg sm:text-xl font-medium tracking-wide">Choose the arsenal you need to build your empire.</p>
        </div>

        {/* Aesthetic Toggle */}
        <div className="flex items-center gap-4 mb-16 p-1 bg-zinc-900 border border-zinc-800 rounded-lg">
          <button 
            onClick={() => setIsYearly(false)}
            className={`px-6 py-2 rounded-md font-bold uppercase tracking-widest text-sm transition-all ${
              !isYearly ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setIsYearly(true)}
            className={`px-6 py-2 rounded-md font-bold uppercase tracking-widest text-sm transition-all ${
              isYearly ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Yearly <span className="ml-2 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">-20%</span>
          </button>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          
          {/* Card 1: The Hustler */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-colors">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">The Hustler</h3>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6 h-10">For rapid prototyping.</p>
            <div className="text-5xl font-black text-white mb-2 tracking-tighter">$29<span className="text-lg font-bold text-zinc-500 ml-2 uppercase tracking-wide">One-Time</span></div>
            
            <ul className="space-y-4 mb-8 flex-1 mt-8">
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>6-Phase Launch Blueprint</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>Database Schemas & RLS</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>Standard .cursorrules generation</span>
              </li>
            </ul>
            
            <a 
              href="https://distresshunter.gumroad.com/l/vjowjj?wanted=true" 
              className="w-full py-4 text-center bg-zinc-800 hover:bg-zinc-700 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-colors border border-zinc-700 block"
            >
              Unlock Hustler
            </a>
          </div>

          {/* Card 2: The Founder (Highlighted) */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-500 rounded-2xl p-8 relative shadow-[0_0_30px_rgba(255,255,255,0.05)] transform md:-translate-y-4">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-sm flex items-center gap-1">
              <Zap className="w-3 h-3" /> Most Popular
            </div>
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">The Founder</h3>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6 h-10">For commercial and professional builds.</p>
            <div className="text-5xl font-black text-white mb-2 tracking-tighter">${isYearly ? '15' : '19'}<span className="text-lg font-bold text-zinc-500 ml-2 uppercase tracking-wide">/ mo</span></div>
            
            <ul className="space-y-4 mb-8 flex-1 mt-8">
              <li className="flex items-start gap-3 text-sm text-white font-bold">
                <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                <span>Everything in Hustler, PLUS:</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>24/7 Context-Aware AI Tech Lead</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>Live Cloud Execution (E2B Sandbox)</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>Deploy directly to GitHub</span>
              </li>
            </ul>
            
            <a 
              href="https://distresshunter.gumroad.com/l/pbhwbn?wanted=true" 
              className="w-full py-4 text-center bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest text-sm rounded-xl transition-colors block"
            >
              Start Subscription
            </a>
          </div>

          {/* Card 3: Enterprise */}
          <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-colors opacity-90">
            <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">Enterprise</h3>
            <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest mb-6 h-10">For massive scale operations.</p>
            <div className="text-5xl font-black text-white mb-2 tracking-tighter">Custom</div>
            
            <ul className="space-y-4 mb-8 flex-1 mt-8">
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>Custom LLM Routing</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>Dedicated Support</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-300 font-medium">
                <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                <span>API Access</span>
              </li>
            </ul>
            
            <a 
              href="mailto:support@yourlaunchcodes.com" 
              className="w-full py-4 text-center bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-colors border border-zinc-800 block"
            >
              Contact Sales
            </a>
          </div>

        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
