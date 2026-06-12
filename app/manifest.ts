import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BlueprintAI',
    short_name: 'BlueprintAI',
    description: 'AI Tech Lead and Architecture Generator',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#06b6d4',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
