"use client";

import { useState, useEffect } from 'react';
import { Search, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CommandPalette({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string, title: string, url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  // Clear query when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch('/api/directory-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        const data = await res.json();
        setResults(data.results || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950/80 backdrop-blur-sm flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-3 border-b border-zinc-800">
          <Search className="w-5 h-5 text-zinc-500 mr-3 shrink-0" />
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-zinc-600 text-lg"
            placeholder="Search 100,000+ niches... (e.g., 'mobile pet groomers')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {loading && <Loader2 className="w-5 h-5 text-zinc-400 animate-spin shrink-0" />}
          <div className="text-xs bg-zinc-800 text-zinc-400 px-2 py-1 rounded ml-3 flex-shrink-0 font-mono">ESC</div>
        </div>

        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {results.map((r) => (
              <Link
                key={r.id}
                href={r.url}
                onClick={() => setIsOpen(false)}
                className="group flex items-center justify-between w-full p-3 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <span className="text-zinc-300 group-hover:text-white transition-colors">
                  {r.title}
                </span>
                <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        )}
        {query && results.length === 0 && !loading && (
          <div className="p-6 text-center text-zinc-500">
            No exact matches found. Try describing the industry or business model.
          </div>
        )}
      </div>
    </div>
  );
}
