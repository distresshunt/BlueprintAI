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
      alert('Click the install icon in your browser address bar to install LaunchCodes!');
    }
  };

  return (
    <footer className="h-12 bg-zinc-100 dark:bg-[#050507] border-t border-zinc-200 dark:border-slate-900 px-4 sm:px-8 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-zinc-500 dark:text-slate-600 shrink-0">
      <div>&copy; 2026 LAUNCHCODES</div>
      <div className="flex gap-4 sm:gap-6 items-center">
        <button 
          className="text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-300 font-bold transition-colors"
          onClick={handleInstallClick}
        >
          ⬇️ Install App
        </button>
        <a href="mailto:support@blueprintagent.dev" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          Support
        </a>
        <Link href="/terms" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          Privacy Policy
        </Link>
        <Link href="/refund" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          Refund Policy
        </Link>
        <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
          Sitemap
        </a>
      </div>
    </footer>
  );
}

