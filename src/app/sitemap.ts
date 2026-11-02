import type { MetadataRoute } from 'next';
import { caseStudyHref, config, projects } from '@/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = config.site.url;
  return [
    { url, lastModified: config.site.lastUpdated, priority: 1 },
    ...projects.map((s) => ({
      url: `${url}${caseStudyHref(s)}`,
      lastModified: config.site.lastUpdated,
      priority: 0.8,
    })),
    { url: `${url}/resume`, lastModified: config.site.lastUpdated, priority: 0.6 },
    { url: `${url}/privacy`, lastModified: config.site.lastUpdated, priority: 0.2 },
  ];
}
