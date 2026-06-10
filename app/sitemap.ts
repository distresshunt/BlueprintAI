import { MetadataRoute } from 'next';
import pseoData from '@/data/pseo.json';
import learnPseoData from '@/data/learn-pseo.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://blueprintagent.dev';
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Generate dynamic pSEO routes
  pseoData.models.forEach((model) => {
    pseoData.niches.forEach((niche) => {
      routes.push({
        url: `${baseUrl}/build/${model}/${niche}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  // Generate dynamic pSEO routes for learning
  learnPseoData.skills.forEach((skill) => {
    learnPseoData.niches.forEach((niche) => {
      routes.push({
        url: `${baseUrl}/learn/${skill}/${niche}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  return routes;
}
