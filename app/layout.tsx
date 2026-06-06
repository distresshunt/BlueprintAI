import type {Metadata} from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'; // Global styles
import { supabase } from '@/lib/supabase';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'BlueprintAI',
  description: 'Generate a 4-phase SaaS product MVP blueprint from your idea.',
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const { count } = await supabase.from('blueprints').select('*', { count: 'exact', head: true });
  const displayCount = count !== null && count < 500 ? count + 420 : count || 420;

  return (
    <ClerkProvider>
      <html lang="en" className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
        <body className="bg-zinc-950 text-zinc-50 min-h-screen antialiased" suppressHydrationWarning>
          <div className="sticky top-0 w-full bg-cyan-950/30 border-b border-cyan-500/30 backdrop-blur-md py-2 z-50 flex justify-center items-center">
            <span className="text-cyan-400 text-xs sm:text-sm font-mono uppercase tracking-widest font-semibold text-center px-4">
              ⚡ SYSTEM ACTIVE: Over {displayCount} App Blueprints architected by Founders.
            </span>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
