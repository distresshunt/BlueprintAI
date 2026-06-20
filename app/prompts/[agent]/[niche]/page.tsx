import Link from 'next/link';
import { LegalFooter } from '@/components/LegalFooter';
import { Navbar } from '@/components/Navbar';
import promptsData from '@/data/prompts-pseo.json';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Next.js 15+ generateStaticParams
export function generateStaticParams() {
  const { agents, niches } = promptsData;
  const params: { agent: string, niche: string }[] = [];
  
  // We strictly limit the build payload here to avoid memory crashes on edge
  // We'll generate paths for the exact permutations shown on the hub page
  for (const agent of agents) {
    for (const niche of niches.slice(0, 50)) {
      params.push({ agent, niche });
    }
  }
  
  return params;
}

function toTitleCase(str: string) {
  return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export async function generateMetadata({ params }: { params: Promise<{ agent: string, niche: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const agentTitle = toTitleCase(resolvedParams.agent);
  const nicheTitle = toTitleCase(resolvedParams.niche);
  
  return {
    title: `The Ultimate ${agentTitle} Prompt for ${nicheTitle} | LaunchCodes`,
    description: `Copy and paste this exact ${agentTitle} system prompt to build a scalable software business for ${nicheTitle} without hallucination.`,
  };
}

export default async function DynamicPromptPage({ params }: { params: Promise<{ agent: string, niche: string }> }) {
  const resolvedParams = await params;
  const { agent, niche } = resolvedParams;

  // Validate agent
  if (!promptsData.agents.includes(agent.toLowerCase())) {
    notFound();
  }

  const agentTitle = toTitleCase(agent);
  const nicheTitle = toTitleCase(niche);

  // Generate a strict, highly-detailed prompt based on the agent and niche
  const systemPrompt = `You are an elite, 10x Full-Stack AI Engineer operating within ${agentTitle}. 
Your objective is to architect and deploy a production-ready software system for: ${nicheTitle}.

# CORE ARCHITECTURE & STACK
- Frontend: Next.js 15 (App Router), React 19, Tailwind CSS
- Backend: Supabase (PostgreSQL, Row Level Security, Edge Functions)
- Authentication: Clerk (B2B SaaS configuration)
- Payments: Stripe Connect
- UI Components: Shadcn/UI (Strictly use Radix primitives)

# STRICT Directives
1. ERADICATE BOILERPLATE: Write only highly scalable, performant code. No inline styles.
2. TYPESCRIPT FIRST: Strictly type all Supabase database returns and React component props.
3. DATABASE SCHEMA: Begin by defining the core SQL schema in a .sql file. 
4. ENVIRONMENT VARIABLES: Explicitly declare required variables without exposing secrets.
5. NO HALLUCINATION: Do not invent missing libraries. Use standard NPM packages.

# THE NICHE: ${nicheTitle}
Architect the core data models, UI dashboards, and edge functions required to dominate this specific market. Assume a multi-tenant B2B or B2C structure depending on the domain.

Return the complete folder structure, database schema, and the primary Next.js dashboard code. Do not apologize, do not explain. Just output the code.`;

  return (
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20">
        <div className="mb-12">
          <Link href="/prompts" className="text-zinc-500 hover:text-white transition-colors text-sm font-mono flex items-center gap-2 mb-8">
            ← BACK TO LIBRARY
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight">
            The Ultimate {agentTitle} Prompt for {nicheTitle}
          </h1>
          <p className="text-zinc-400 mt-4 text-lg">
            A battle-tested system prompt designed to force {agentTitle} to output production-grade, zero-hallucination code for your specific market.
          </p>
        </div>

        <div className="bg-[#09090B] border border-zinc-800 rounded-xl overflow-hidden mb-16">
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-black/50">
            <div className="text-zinc-500 font-mono text-sm uppercase tracking-widest">system_prompt.txt</div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-800"></div>
            </div>
          </div>
          <div className="p-6 md:p-8 overflow-x-auto">
            <pre className="text-zinc-300 font-mono text-sm leading-relaxed whitespace-pre-wrap selection:bg-zinc-800 selection:text-white">
              {systemPrompt}
            </pre>
          </div>
        </div>

        <div className="border border-zinc-800 bg-[#09090B] rounded-xl p-8 md:p-10 text-center flex flex-col items-center">
          <h3 className="text-2xl font-bold text-white mb-4">Don't want to code this manually?</h3>
          <p className="text-zinc-400 mb-8 max-w-xl">
            Skip the terminal. Let our Multi-Agent Swarm instantly architect the entire Next.js & Supabase codebase for {nicheTitle}.
          </p>
          <Link 
            href={`/?prompt=${encodeURIComponent(`I want to build a software system for ${nicheTitle}`)}`}
            className="bg-white text-black font-bold px-8 py-4 rounded-lg hover:bg-zinc-200 transition-colors inline-block"
          >
            Let LaunchCodes generate the full architecture
          </Link>
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
