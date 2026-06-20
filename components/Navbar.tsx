"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Plus, ArrowLeft, Search } from "lucide-react";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { CommandPalette } from "./CommandPalette";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <header className="h-16 border-b border-slate-800 w-full bg-[#0a0a0f] shrink-0 sticky top-0 relative z-[100]">
      <div className="w-full px-6 lg:px-12 h-full flex items-center justify-between z-[100] relative">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            onClick={(e) => {
              if (window.location.pathname === '/' && !window.location.search) {
                e.preventDefault();
                window.location.reload();
              }
            }}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center shrink-0">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase hidden sm:inline">
              <span className="text-zinc-50 font-bold">Launch</span><span className="text-amber-500 italic">Codes</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-800"></span>
            <span className="text-xs uppercase tracking-widest font-mono text-zinc-300">System Secure</span>
          </div>
          <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors text-sm"
              >
                <Search className="w-4 h-4" />
                <span>Search 100k+ Niches...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-zinc-800 rounded text-zinc-500">⌘K</kbd>
              </button>
              {pathname !== '/' && isLoaded && isSignedIn && (
                <Link 
                  href="/" 
                  onClick={(e) => {
                    if (window.location.pathname === '/' && !window.location.search) {
                      e.preventDefault();
                      window.location.reload();
                    }
                  }}
                  className="px-4 py-2 text-sm font-semibold text-zinc-50 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Blueprint</span>
                </Link>
              )}
              
              <Link href="/blog/what-is-google-okf" className="text-xs uppercase tracking-widest font-sans font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded transition-colors text-emerald-400 border border-emerald-500/20 hidden sm:flex items-center gap-2">
                 Guides
              </Link>
              <Link href="/stack" className="text-xs uppercase tracking-widest font-sans font-semibold bg-zinc-800 hover:bg-zinc-800 px-3 py-1.5 rounded transition-colors text-zinc-300 border border-zinc-700 hidden sm:flex items-center gap-2">
                 Founder's Stack
              </Link>
              <Link href="/dashboard" className="text-xs uppercase tracking-widest font-sans font-semibold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors text-white border border-white/10 hidden sm:flex items-center gap-2">
                 My Blueprints
              </Link>

              {isLoaded && !isSignedIn && (
                <SignInButton mode="modal">
                  <button className="text-sm font-semibold text-zinc-300 hover:text-zinc-300 transition-colors">Sign In</button>
                </SignInButton>
              )}
              {isLoaded && isSignedIn && (
                <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 ring-2 ring-zinc-800" } }} />
              )}
          </div>
        </div>
      </div>
      <CommandPalette isOpen={isSearchOpen} setIsOpen={setIsSearchOpen} />
    </header>
  );
}
