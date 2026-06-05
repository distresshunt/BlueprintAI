'use client';

import Link from 'next/link';

export function LegalFooter() {
  return (
    <footer className="h-12 bg-[#050507] border-t border-slate-900 px-4 sm:px-8 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-600 shrink-0">
      <div>&copy; 2026 BlueprintAI</div>
      <div className="flex gap-4 sm:gap-6">
        <a href="mailto:support@blueprintagent.dev" className="hover:text-cyan-400 transition-colors">
          Support
        </a>
        <Link href="/terms" className="hover:text-cyan-400 transition-colors">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
          Privacy Policy
        </Link>
        <Link href="/refund" className="hover:text-cyan-400 transition-colors">
          Refund Policy
        </Link>
      </div>
    </footer>
  );
}

