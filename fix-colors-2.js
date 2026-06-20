const fs = require('fs');

['components/Navbar.tsx', 'app/page.tsx', 'components/LiveCounterBanner.tsx', 'components/PortfolioShowcase.tsx'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  let newContent = content.replace(/amber-(?!\d)/g, 'amber-500'); // Assume 500 for missing numbers
  
  // Specific fix for Navbar.tsx
  if (f === 'components/Navbar.tsx') {
    newContent = newContent.replace(/text-amber-500 italic/g, 'text-amber-400 italic');
    newContent = newContent.replace(/text-amber-500 hover:text-amber-500/g, 'text-amber-400 hover:text-amber-300');
    newContent = newContent.replace(/bg-amber-500\/10 hover:bg-amber-500\/20 px-3 py-1.5 rounded transition-colors text-amber-500/g, 'bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded transition-colors text-amber-400');
  }
  
  // Specific fix for page.tsx
  if (f === 'app/page.tsx') {
    newContent = newContent.replace(/text-amber-500 drop-shadow/g, 'text-amber-400 drop-shadow');
    newContent = newContent.replace(/hover:bg-amber-500/g, 'hover:bg-amber-400');
  }
  
  // Specific fix for LiveCounterBanner.tsx
  if (f === 'components/LiveCounterBanner.tsx') {
    newContent = newContent.replace(/text-amber-500/g, 'text-amber-400');
    newContent = newContent.replace(/bg-amber-500\/30 border-b border-amber-500\/30/g, 'bg-amber-950/30 border-b border-amber-500/30');
  }

  // Specific fix for PortfolioShowcase.tsx
  if (f === 'components/PortfolioShowcase.tsx') {
    newContent = newContent.replace(/text-amber-500/g, 'text-amber-400');
    newContent = newContent.replace(/hover:border-amber-500\/50 text-white/g, 'hover:border-amber-500/50 text-white');
  }
  
  fs.writeFileSync(f, newContent);
});

console.log("Fixed amber classes.");
