import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Matka Chai Karachi',
    short_name: 'Matka Chai',
    description: 'Pakistan’s contemporary chai room at Creek Walk, DHA Phase 8, Karachi.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5e7c8',
    theme_color: '#3b1117',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
