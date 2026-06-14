import { MetadataRoute } from 'next';
import pseoData from '@/data/pseo.json';
import learnPseoData from '@/data/learn-pseo.json';

const SITEMAP_LIMIT = 40000;
const baseUrl = 'https://blueprintagent.dev';

export async function generateSitemaps() {
  if (!pseoData || !pseoData.models || !pseoData.niches) return [{ id: 0 }];

  const buildCombinations = pseoData.models.length * pseoData.niches.length;
  const learnCombinations = learnPseoData.skills.length * learnPseoData.niches.length;
  const totalCombinations = buildCombinations + learnCombinations;
  
  const totalSitemaps = Math.ceil(totalCombinations / SITEMAP_LIMIT);
  
  if (totalSitemaps === 0 || isNaN(totalSitemaps)) {
    console.log("Fallback triggered, totalSitemaps:", totalSitemaps);
    return [{ id: 0 }];
  }
  
  const sitemaps = [];
  for (let i = 0; i < totalSitemaps; i++) {
    sitemaps.push({ id: i });
  }
  
  console.log("Generated sitemaps:", sitemaps.length);
  return sitemaps;
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const models = pseoData.models;
  const buildNiches = pseoData.niches;
  const skills = learnPseoData.skills;
  const learnNiches = learnPseoData.niches;
  
  const buildNichesCount = buildNiches.length;
  const learnNichesCount = learnNiches.length;
  const buildCombinations = models.length * buildNichesCount;
  const learnCombinations = skills.length * learnNichesCount;
  
  const start = id * SITEMAP_LIMIT;
  const end = Math.min(start + SITEMAP_LIMIT, buildCombinations + learnCombinations);
  
  const routes: MetadataRoute.Sitemap = [];
  
  if (id === 0) {
    routes.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });
  }

  for (let i = start; i < end; i++) {
    if (i < buildCombinations) {
      const modelIndex = Math.floor(i / buildNichesCount);
      const nicheIndex = i % buildNichesCount;
      routes.push({
        url: `${baseUrl}/build/${models[modelIndex]}/${buildNiches[nicheIndex]}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    } else {
      const learnIndex = i - buildCombinations;
      const skillIndex = Math.floor(learnIndex / learnNichesCount);
      const nicheIndex = learnIndex % learnNichesCount;
      routes.push({
        url: `${baseUrl}/learn/${skills[skillIndex]}/${learnNiches[nicheIndex]}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }
  
  return routes;
}
