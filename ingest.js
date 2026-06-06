const fs = require('fs');
const path = require('path');

const rawNichesPath = path.join(__dirname, 'raw_niches.txt');
const pseoJsonPath = path.join(__dirname, 'data', 'pseo.json');

try {
  // Read raw niches
  const rawText = fs.readFileSync(rawNichesPath, 'utf-8');
  
  // Split, clean, and convert to kebab-case slugs
  const niches = rawText
    .split('\n')
    .map(line => {
      // Clean string: remove "- ", remove numbers, remove duplicate words, trim
      let clean = line.replace(/^- /, '').replace(/[0-9]/g, '').trim();
      
      // Remove duplicate words
      const words = clean.split(' ');
      const uniqueWords = [...new Set(words)];
      clean = uniqueWords.join(' ');
      
      return clean.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    })
    .filter(Boolean); // remove empty
    
  // Deduplicate array
  const uniqueNiches = [...new Set(niches)];
  
  // Read pseo.json
  const pseoJson = JSON.parse(fs.readFileSync(pseoJsonPath, 'utf-8'));
  
  // Update niches array
  pseoJson.niches = uniqueNiches;
  
  // Write back to pseo.json
  fs.writeFileSync(pseoJsonPath, JSON.stringify(pseoJson, null, 2));
  
  console.log(`Successfully ingested ${uniqueNiches.length} niches into pseo.json`);
} catch (e) {
  console.error("Error during ingestion:", e);
}
