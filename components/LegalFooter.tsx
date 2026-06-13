'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function LegalFooter() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert('Click the install icon in your browser address bar to install BlueprintAI!');
    }
  };

  return (
    <footer className="h-12 bg-[#050507] border-t border-slate-900 px-4 sm:px-8 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-600 shrink-0">
      <div>&copy; 2026 BlueprintAI</div>
      <div className="flex gap-4 sm:gap-6 items-center">
        <button 
          className="hover:text-cyan-400 text-cyan-500 font-bold transition-colors"
          onClick={handleInstallClick}
        >
          ⬇️ Install App
        </button>
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
        <Link href="/sitemap.xml" className="hover:text-cyan-400 transition-colors">
          Sitemap
        </Link>
      </div>
    </footer>
  );
}

