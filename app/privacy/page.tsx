import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { LegalFooter } from '@/components/LegalFooter';

export const metadata = {
  title: 'Privacy Policy | BlueprintAI',
  description: 'Privacy Policy for BlueprintAI platform.',
};

export default function PrivacyPage() {
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
            <span className="text-[10px] uppercase tracking-widest font-mono text-zinc-300">BlueprintAI Compliance Protocol</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">Privacy Policy</h1>
          <p className="text-slate-500 font-mono text-xs mb-8">LAST REVISED: JUNE 3, 2026</p>

          <div className="space-y-8 text-sm leading-relaxed text-slate-300">
            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">01.</span> Information We Collect
              </h2>
              <p>
                We collect personal information that you provide to us directly when creating an account or using the platform. This includes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                <li>Account credentials and profile information managed securely by <strong>Clerk</strong> (e.g. name, email, profile picture).</li>
                <li>The text prompts, ideas, and configurations you submit to the generator.</li>
                <li>Transactional information when purchasing services processed securely via <strong>Stripe</strong>.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">02.</span> How We Use Your Information
              </h2>
              <p>
                We use the information we collect to operate, maintain, and improve our services, including to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                <li>Generate and customize 6-Phase launch blueprints and developer prompts.</li>
                <li>Manage user subscriptions and facilitate secure Stripe billing.</li>
                <li>Analyze system performance, prevent abuse, and safeguard platform security.</li>
                <li>Communicate critical product updates, system alerts, or billing information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">03.</span> Information Sharing
              </h2>
              <p>
                We do not sell, rent, or trade your personal data. We only share information with trusted third-party subprocessors essential to running the platform:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                <li><strong>Clerk</strong> for user authentication and session management.</li>
                <li><strong>Supabase</strong> for database storage of saved blueprints and logs.</li>
                <li><strong>Stripe</strong> for processing secure payment transactions.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">04.</span> Data Security & Retention
              </h2>
              <p>
                We implement robust security measures to protect your personal data from unauthorized access, disclosure, or modification. Your account data is secured via Clerk's identity solutions, and your blueprint history is stored in an encrypted database managed by Supabase. We retain data only as long as necessary to provide service or as required by regulatory compliance.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">05.</span> Your Rights & Access
              </h2>
              <p>
                You may access, update, or delete your account credentials directly through the user profile menu. If you wish to permanently delete your account and all associated blueprint records, you can contact us or trigger a deletion. Deleting your account will remove your historical files permanently.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-3 font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="text-zinc-300">06.</span> Contact Us
              </h2>
              <p>
                For questions regarding this Privacy Policy or how we manage user information, please reach out to us at <a href="mailto:support@blueprintagent.dev" className="text-zinc-300 hover:underline">support@blueprintagent.dev</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
