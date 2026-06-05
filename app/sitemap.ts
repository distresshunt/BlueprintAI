import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: 'https://blueprintagent.dev',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://blueprintagent.dev/terms',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://blueprintagent.dev/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://blueprintagent.dev/refund',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    const dataPath = path.join(process.cwd(), 'data', 'pseo.json');
    const fileContent = fs.readFileSync(dataPath, 'utf8');
    const { models, niches } = JSON.parse(fileContent);

    if (Array.isArray(models) && Array.isArray(niches)) {
      for (const model of models) {
        for (const niche of niches) {
          sitemapEntries.push({
            url: `https://blueprintagent.dev/build/${model}/${niche}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }
    }
  } catch (err) {
    console.error('Error reading sitemap data:', err);
  }

  return sitemapEntries;
}
