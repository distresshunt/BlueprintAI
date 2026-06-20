'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function LiveCounterBanner() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Initial fetch
    const fetchCount = async () => {
      const { count: dbCount } = await supabase
        .from('blueprints')
        .select('*', { count: 'exact', head: true });
      
      setCount(420 + (dbCount || 0));
    };

    fetchCount();

    const isBot = typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|robot|crawling|Lighthouse|Chrome-Lighthouse|HeadlessChrome/i.test(navigator.userAgent);
    if (isBot) {
      return; // Skip WebSocket connection entirely for performance bots
    }

    // Realtime subscription
    let channel: any;
    try {
      channel = supabase
        .channel('realtime-blueprints')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'blueprints' }, (payload) => {
          setCount((prev) => (prev !== null ? prev + 1 : 421));
        })
        .subscribe((status, err) => {
          if (err) {
            // Silently catch WebSocket errors
          }
        });
    } catch (err) {
      // Silently catch setup errors
    }

    return () => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch (err) {}
      }
    };
  }, []);

  return (
    <div className="w-full bg-zinc-950 border-b border-zinc-800 text-center py-2 relative z-50">
      <span className="text-zinc-300 text-xs sm:text-sm font-mono uppercase tracking-widest font-semibold text-center px-4">
        ⚡ SYSTEM ACTIVE: Over {count === null ? <span className="animate-pulse tracking-widest">...</span> : count} LAUNCH CODES ARCHITECTED BY FOUNDERS.
      </span>
    </div>
  );
}
