import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/premium-vault', '/api', '/sign-in', '/sign-up'],
    },
    sitemap: 'https://yourlaunchcodes.com/sitemap.xml',
  }
}
