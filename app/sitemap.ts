import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/menu', '/story', '/visit', '/franchise'].map((path) => ({
    url: `${env.siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/menu' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }));
}
