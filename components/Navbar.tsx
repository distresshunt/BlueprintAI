"use client";

import Link from "next/link";
import { Zap, Plus, ArrowLeft } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0f] shrink-0 sticky top-0 z-50">
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
          <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white uppercase hidden sm:inline">
            Blueprint<span className="text-cyan-400">AI</span>
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"></span>
          <span className="text-xs uppercase tracking-widest font-mono text-cyan-500/80">System Secure</span>
        </div>
        <div className="flex items-center gap-3">
          <SignedIn>
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
            <Link href="/dashboard" className="text-xs uppercase tracking-widest font-sans font-semibold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded transition-colors text-white border border-white/10 hidden sm:flex items-center gap-2">
               My Blueprints
            </Link>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-xs uppercase tracking-widest font-sans font-semibold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition-colors text-white">Sign In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-xs uppercase tracking-widest font-sans font-semibold bg-cyan-500 hover:bg-cyan-400 px-3 py-1.5 rounded transition-colors text-black">Sign Up</button>
            </SignUpButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
