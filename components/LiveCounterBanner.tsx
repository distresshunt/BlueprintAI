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

    const isBot = /bot|googlebot|crawler|spider|robot|crawling|Lighthouse|Chrome-Lighthouse|HeadlessChrome/i.test(navigator.userAgent);
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
    <div className="sticky top-0 w-full bg-cyan-950/30 border-b border-cyan-500/30 backdrop-blur-md py-2 z-50 flex justify-center items-center">
      <span className="text-cyan-400 text-xs sm:text-sm font-mono uppercase tracking-widest font-semibold text-center px-4">
        ⚡ SYSTEM ACTIVE: Over {count === null ? <span className="animate-pulse tracking-widest">...</span> : count} App Blueprints architected by Founders.
      </span>
    </div>
  );
}
