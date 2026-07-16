import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/menu', changeFrequency: 'weekly' as const, priority: 0.95 },
    { path: '/visit', changeFrequency: 'monthly' as const, priority: 0.85 },
    { path: '/story', changeFrequency: 'monthly' as const, priority: 0.75 },
    { path: '/franchise', changeFrequency: 'monthly' as const, priority: 0.7 },
  ];
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${env.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
    images: path === '' ? [`${env.siteUrl}/images/hero-realistic.png`] : path === '/menu' ? [`${env.siteUrl}/images/matka-chai-cooler-scene.webp`] : undefined,
  }));
}
