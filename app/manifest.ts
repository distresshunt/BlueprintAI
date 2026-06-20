import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BlueprintAI',
    short_name: 'BlueprintAI',
    description: 'AI Tech Lead and Architecture Generator',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#84cc16',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/icon2',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon3',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
