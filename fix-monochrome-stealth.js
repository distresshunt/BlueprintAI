const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('app').concat(walk('components')).concat(walk('data'));
let changedFiles = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Remove all shadow-[...] and drop-shadow-[...] classes completely
  content = content.replace(/\s?shadow-\[[^\]]*\]/g, '');
  content = content.replace(/\s?drop-shadow-\[[^\]]*\]/g, '');

  // 2. Eradicate neon colors (lime, cyan, amber) with monochrome replacements
  // Text colors
  content = content.replace(/text-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'text-zinc-300');
  // Background colors
  content = content.replace(/bg-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'bg-zinc-800');
  // Border colors
  content = content.replace(/border-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'border-zinc-700');
  // Hover Background colors
  content = content.replace(/hover:bg-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'hover:bg-zinc-700');
  // Hover Text colors
  content = content.replace(/hover:text-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'hover:text-white');
  // Hover Border colors
  content = content.replace(/hover:border-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'hover:border-zinc-500');
  // Prose
  content = content.replace(/prose-(lime|amber|cyan)/g, 'prose-invert');
  
  // Gradients (replace from/via/to colors)
  content = content.replace(/from-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'from-zinc-800');
  content = content.replace(/via-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'via-zinc-800');
  content = content.replace(/to-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'to-zinc-900');

  // Ring colors
  content = content.replace(/ring-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'ring-zinc-500');
  content = content.replace(/focus:ring-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'focus:ring-zinc-500');
  content = content.replace(/focus:border-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'focus:border-zinc-500');
  
  // Fill colors
  content = content.replace(/fill-(lime|amber|cyan)-[0-9]{2,3}(\/[0-9]{2})?/g, 'fill-zinc-300');

  // 3. Clean up the Brutalist buttons we just made
  // "Initialize" in app/page.tsx (will be completely rewritten manually, but let's scrub it here just in case)
  content = content.replace(/bg-lime-400 hover:bg-lime-500 text-black font-black uppercase tracking-widest/g, 'bg-white text-black hover:bg-zinc-200');

  // Save if changed
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
}
console.log('Total files changed:', changedFiles);
