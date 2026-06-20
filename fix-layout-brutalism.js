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

  // 1. Remove <Navbar /> from individual pages (since it is now in layout.tsx)
  if (file !== 'app\\layout.tsx' && file !== 'app/layout.tsx') {
    content = content.replace(/import { Navbar } from ".*";\n?/g, '');
    content = content.replace(/import { Navbar } from '.*';\n?/g, '');
    content = content.replace(/<Navbar \/>\n?/g, '');
  }

  // 2. Global Color Swap (amber -> lime, cyan -> lime)
  content = content.replace(/amber-(\d{2,3})/g, 'lime-$1');
  content = content.replace(/cyan-(\d{2,3})/g, 'lime-$1');
  content = content.replace(/prose-amber/g, 'prose-lime');
  content = content.replace(/prose-cyan/g, 'prose-lime');
  
  // Replace RGBA
  content = content.replace(/rgba\(245,158,11,/g, 'rgba(132,204,22,'); // amber-500 -> lime-500
  content = content.replace(/rgba\(251,191,36,/g, 'rgba(163,230,53,'); // amber-400 -> lime-400
  content = content.replace(/rgba\(6,182,212,/g, 'rgba(132,204,22,'); // cyan-500 -> lime-500
  content = content.replace(/rgba\(34,211,238,/g, 'rgba(163,230,53,'); // cyan-400 -> lime-400

  // Replace Hex Codes
  content = content.replace(/#f59e0b/gi, '#84cc16'); // amber-500 -> lime-500
  content = content.replace(/#fbbf24/gi, '#a3e635'); // amber-400 -> lime-400
  content = content.replace(/#d97706/gi, '#65a30d'); // amber-600 -> lime-600
  content = content.replace(/#78350f/gi, '#365314'); // amber-900 -> lime-900

  content = content.replace(/#06b6d4/gi, '#84cc16'); // cyan-500 -> lime-500
  content = content.replace(/#22d3ee/gi, '#a3e635'); // cyan-400 -> lime-400
  content = content.replace(/#0891b2/gi, '#65a30d'); // cyan-600 -> lime-600
  content = content.replace(/#164e63/gi, '#365314'); // cyan-900 -> lime-900

  // 3. Button Brutalism (High-Contrast UX)
  // "Initialize" in app/page.tsx
  if (file.replace(/\\/g, '/') === 'app/page.tsx') {
    content = content.replace(
      /bg-lime-500 hover:bg-lime-400 text-black px-6 py-3 rounded-xl font-bold transition-all shadow-\[0_0_20px_rgba\(132,204,22,0\.4\)\] hover:shadow-\[0_0_30px_rgba\(132,204,22,0\.6\)\] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2/,
      'bg-lime-400 hover:bg-lime-500 text-black font-black uppercase tracking-widest shadow-[0_0_15px_rgba(163,230,53,0.4)] px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
    );
  }

  // "Generate Launch Blueprint" in BlueprintGenerator.tsx
  if (file.replace(/\\/g, '/') === 'components/BlueprintGenerator.tsx') {
    content = content.replace(
      /bg-gradient-to-r from-lime-500 to-lime-400 hover:from-lime-400 hover:to-lime-300 text-black px-8 py-5 rounded-2xl font-bold text-xl sm:text-2xl transition-all shadow-\[0_0_40px_rgba\(132,204,22,0\.3\)\] hover:shadow-\[0_0_60px_rgba\(132,204,22,0\.5\)\]/,
      'bg-lime-400 hover:bg-lime-500 text-black font-black uppercase tracking-widest shadow-[0_0_15px_rgba(163,230,53,0.4)] px-8 py-5 rounded-2xl text-xl sm:text-2xl transition-all'
    );
  }

  // "Boot Environment" in studio/page.tsx
  if (file.replace(/\\/g, '/') === 'app/studio/page.tsx') {
    content = content.replace(
      /bg-lime-500 hover:bg-lime-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-\[0_0_30px_rgba\(132,204,22,0\.3\)\] hover:shadow-\[0_0_40px_rgba\(132,204,22,0\.5\)\]/,
      'bg-lime-400 hover:bg-lime-500 text-black font-black uppercase tracking-widest shadow-[0_0_15px_rgba(163,230,53,0.4)] px-8 py-4 rounded-xl text-lg transition-all'
    );
  }

  // Save if changed
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
}
console.log('Total files changed:', changedFiles);
