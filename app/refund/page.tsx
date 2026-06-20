import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';

export const metadata = {
  title: 'Refund Policy | BlueprintAI',
  description: 'Refund Policy for BlueprintAI platform.',
};

export default function RefundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0f] shrink-0">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase">Blueprint<span className="text-zinc-300">AI</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="text-xs uppercase tracking-widest font-sans font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full bg-slate-900/30 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
            <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-300">BlueprintAI Billing Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Refund Policy</h1>
          <p className="text-slate-500 font-mono text-xs mb-8">LAST REVISED: JUNE 3, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-slate-300">
            <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-red-400 font-mono text-xs flex flex-col gap-2 shadow-inner">
              <span className="font-bold uppercase tracking-widest text-red-500">Notice to Users: Strict Refund Terms</span>
              <span>BlueprintAI sells digital products and computing resources. By purchasing one-time access or starting a recurring subscription, you agree that all sales are final. No refunds will be issued.</span>
            </div>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">01.</span> Digital Goods Delivery
              </h2>
              <p>
                BlueprintAI provides instant access to digital assets, premium AI-generated launch files, technical specifications, and proprietary prompt templates. Because these assets are immediately accessible and downloadable upon payment, they are non-tangible, digital goods. Therefore, we maintain a strict <strong>no-refunds policy</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">02.</span> Subscription Cancellations
              </h2>
              <p>
                You may cancel your recurring subscription at any time. When you cancel, you will continue to have access to premium features (including the Founder Tier) until the end of your current billing period. Once the period ends, your subscription will not renew, and your access to premium features will be restricted. We do not provide pro-rated refunds or credits for partial billing periods.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">03.</span> Chargebacks and Disputes
              </h2>
              <p>
                We encourage you to contact support at <a href="mailto:support@blueprintagent.dev" className="text-zinc-300 hover:underline">support@blueprintagent.dev</a> to resolve any issues or cancel your subscription. Filing a chargeback or payment dispute for legitimate transactions will lead to immediate account suspension and deletion of generated blueprint history.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">04.</span> Exceptional Circumstances
              </h2>
              <p>
                In the rare event that a system outage prevents you from accessing the platform or generating blueprints for more than 72 consecutive hours, you may request a service credit by emailing our support team with proof of the issue.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
