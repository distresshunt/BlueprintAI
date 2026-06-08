import type {Metadata} from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css'; // Global styles
import { LiveCounterBanner } from '@/components/LiveCounterBanner';
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

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`dark ${spaceGrotesk.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
        <body className="bg-zinc-950 text-zinc-50 min-h-screen antialiased" suppressHydrationWarning>
          <LiveCounterBanner />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
