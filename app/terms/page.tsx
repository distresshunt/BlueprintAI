import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';

export const metadata = {
  title: 'Terms of Service | BlueprintAI',
  description: 'Terms of Service for BlueprintAI platform.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050507] text-slate-300 font-sans overflow-hidden">
      {/* Header Navigation */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0f] shrink-0">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase">Blueprint<span className="text-cyan-400">AI</span></span>
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
            <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
            <span className="text-[10px] uppercase tracking-widest font-mono text-cyan-500/80">BlueprintAI Compliance Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Terms of Service</h1>
          <p className="text-slate-500 font-mono text-xs mb-8">LAST REVISED: JUNE 3, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-slate-300">
            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">01.</span> Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or using BlueprintAI (referred to as the "Service" or "Platform"), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">02.</span> Description of Service
              </h2>
              <p>
                BlueprintAI provides AI-driven product modeling and architecting services, generating launch strategies, technical blueprints, and custom configuration specifications (such as Cursor, Windsurf, or Antigravity prompt rules) for software products, websites, and business applications. The service is provided "as is" and is subject to change or updates without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">03.</span> User Accounts & Authentication
              </h2>
              <p>
                In order to save generated blueprints, configure settings, or bypass paywalls, you may be required to sign in via our third-party identity provider, Clerk. You agree to maintain the security of your credentials and accept all risks of unauthorized access to your account data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">04.</span> Intellectual Property & Content Ownership
              </h2>
              <p>
                As between you and BlueprintAI, you own all rights, title, and interest in the specific text prompts you submit and the custom blueprints generated specifically for you. BlueprintAI retains all rights, title, and interest in the underlying algorithms, platform designs, code structures, branding elements, and overall proprietary systems.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">05.</span> Payments and Billing
              </h2>
              <p>
                BlueprintAI offers paid plans (such as the Hustler and Founder tiers) processed via Stripe. By subscribing or completing a one-time purchase, you authorize BlueprintAI to charge the designated payment method. You agree to provide accurate and complete billing information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">06.</span> Disclaimer of Warranties
              </h2>
              <p>
                The materials on BlueprintAI are provided on an 'as is' basis. BlueprintAI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">07.</span> Limitations of Liability
              </h2>
              <p>
                In no event shall BlueprintAI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BlueprintAI's platform, even if BlueprintAI or a BlueprintAI authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-cyan-400">08.</span> Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the operator of BlueprintAI resides, without giving effect to any principles of conflicts of law.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
