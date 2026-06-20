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
  // Skip the 6 files we already manually fixed (or actually, we can run it, since they don't have cyan anymore)
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace cyan-X with amber-X
  content = content.replace(/cyan-(\d{2,3})/g, 'amber-$1');
  content = content.replace(/prose-cyan/g, 'prose-amber');
  
  // Replace rgba(6,182,212,X) with rgba(245,158,11,X)
  content = content.replace(/rgba\(6,182,212,/g, 'rgba(245,158,11,');
  content = content.replace(/rgba\(34,211,238,/g, 'rgba(251,191,36,'); // cyan-400 -> amber-400
  
  // Replace Hex Codes
  content = content.replace(/#06b6d4/gi, '#f59e0b'); // cyan-500 -> amber-500
  content = content.replace(/#22d3ee/gi, '#fbbf24'); // cyan-400 -> amber-400
  content = content.replace(/#0891b2/gi, '#d97706'); // cyan-600 -> amber-600
  content = content.replace(/#164e63/gi, '#78350f'); // cyan-900 -> amber-900
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log('Updated', file);
  }
}
console.log('Total files changed:', changedFiles);
