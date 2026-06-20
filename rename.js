const fs = require('fs');
const path = require('path');

const ignores = ['node_modules', '.next', '.git', 'assets'];
const exts = ['.tsx', '.ts', '.js', '.json', '.md', '.webmanifest'];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (ignores.includes(file)) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      if (exts.some(ext => fullPath.endsWith(ext))) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content
          .replace(/LaunchCodes/g, 'LaunchCodes')
          .replace(/LaunchCodes/g, 'LaunchCodes')
          .replace(/blueprintagent\.dev/g, 'yourlaunchcodes.com');
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  }
}

walk('.');
