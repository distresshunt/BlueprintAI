import { NextResponse } from 'next/server';
import Fuse from 'fuse.js';
import pseoData from '@/data/pseo.json';

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ results: [] });

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    let extractedModel = query;
    let extractedNiche = query;

    if (accountId && apiToken) {
      const systemPrompt = `Extract the core 'Business Model' and 'Target Niche' from the user's query. Return ONLY a raw JSON object like {'model': '...', 'niche': '...'}. No markdown formatting.`;

      try {
        const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3-8b-instruct`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const responseText = data.result.response;
          const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || responseText.match(/{[\s\S]*?}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            if (parsed.model) extractedModel = parsed.model;
            if (parsed.niche) extractedNiche = parsed.niche;
          }
        }
      } catch (e) {
        console.error("Cloudflare AI request failed", e);
      }
    }

    // Local Fuzzy Match
    const modelFuse = new Fuse(pseoData.models, { includeScore: true, threshold: 0.6 });
    const nicheFuse = new Fuse(pseoData.niches, { includeScore: true, threshold: 0.6 });

    let matchedModels = modelFuse.search(extractedModel);
    let matchedNiches = nicheFuse.search(extractedNiche);

    // Fallback if no exact matches found but query is general
    if (matchedModels.length === 0) matchedModels = modelFuse.search(query);
    if (matchedNiches.length === 0) matchedNiches = nicheFuse.search(query);

    const modelsToUse = matchedModels.length > 0 ? matchedModels.slice(0, 3).map(m => m.item) : pseoData.models.slice(0, 3);
    const nichesToUse = matchedNiches.length > 0 ? matchedNiches.slice(0, 3).map(n => n.item) : pseoData.niches.slice(0, 3);

    const results = [];
    for (let i = 0; i < 3; i++) {
        const model = modelsToUse[i % modelsToUse.length];
        const niche = nichesToUse[i % nichesToUse.length];
        
        const formattedModel = model.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const formattedNiche = niche.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        
        results.push({
            id: `${model}-${niche}`,
            title: `Build a ${formattedModel} for ${formattedNiche}`,
            url: `/build/${model}/${niche}`
        });
    }

    return NextResponse.json({ results });

  } catch (error) {
    console.error("Search route error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
