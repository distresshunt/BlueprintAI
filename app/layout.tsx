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
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "BlueprintAI",
                "applicationCategory": "DeveloperApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "29.00",
                  "priceCurrency": "USD"
                },
                "description": "An AI Tech Lead that generates 5-phase SaaS launch blueprints and .cursorrules architecture files for developers and indie hackers."
              })
            }}
          />
        </head>
        <body className="bg-zinc-950 text-zinc-50 min-h-screen antialiased" suppressHydrationWarning>
          <LiveCounterBanner />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
