import Link from 'next/link';
import pseoData from '@/data/pseo.json';
import learnPseoData from '@/data/learn-pseo.json';
import { LegalFooter } from '@/components/LegalFooter';

const ITEMS_PER_PAGE = 1000;

interface DirectoryLink {
  href: string;
  label: string;
}

function generateLinks(): DirectoryLink[] {
  const links: DirectoryLink[] = [];
  
  // From pseo.json: models x niches
  if (pseoData && Array.isArray(pseoData.models) && Array.isArray(pseoData.niches)) {
    for (const model of pseoData.models) {
      for (const niche of pseoData.niches) {
        links.push({
          href: `/build/${model}/${niche}`,
          label: `Build a ${model.replace(/-/g, ' ')} for ${niche.replace(/-/g, ' ')}`
        });
      }
    }
  }

  // From learn-pseo.json: skills x niches
  if (learnPseoData && Array.isArray(learnPseoData.skills) && Array.isArray(learnPseoData.niches)) {
    for (const skill of learnPseoData.skills) {
      for (const niche of learnPseoData.niches) {
        links.push({
          href: `/learn/${skill}/${niche}`,
          label: `Learn ${skill.replace(/-/g, ' ')} for ${niche.replace(/-/g, ' ')}`
        });
      }
    }
  }
  
  return links;
}

const allLinks = generateLinks();

export default async function DirectoryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const pageParam = typeof params.page === 'string' ? params.page : '1';
  let currentPage = parseInt(pageParam, 10);
  if (isNaN(currentPage) || currentPage < 1) currentPage = 1;

  const totalItems = allLinks.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  
  // Ensure currentPage doesn't exceed totalPages
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentLinks = allLinks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-slate-300 font-sans">
            
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        <header className="mb-12 border-b border-amber-/30 pb-6 relative group">
          <div className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-amber- to-transparent group-hover:from-amber- transition-colors"></div>
          <h1 className="text-4xl font-bold text-white tracking-tight drop-">
            LaunchCodes Architecture Directory
          </h1>
          <p className="text-zinc-400 mt-2">
            Explore our massive index of {totalItems.toLocaleString()} SaaS models, niches, and architectures.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {currentLinks.map((link, idx) => (
            <Link 
              key={idx} 
              href={link.href}
              className="text-zinc-400 hover:text-amber- text-sm transition-colors truncate block capitalize"
              title={link.label}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-6 mt-auto">
          {currentPage > 1 ? (
            <Link 
              href={`/directory?page=${currentPage - 1}`}
              className="px-6 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 hover:border-amber-/50 transition-all font-medium text-sm"
            >
              &larr; Previous 1000
            </Link>
          ) : (
            <div></div> // Spacer
          )}
          
          <span className="text-sm text-zinc-500 font-mono">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Link 
              href={`/directory?page=${currentPage + 1}`}
              className="px-6 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 hover:border-amber-/50 transition-all font-medium text-sm"
            >
              Next 1000 &rarr;
            </Link>
          ) : (
            <div></div>
          )}
        </div>
      </main>

      <LegalFooter />
    </div>
  );
}
