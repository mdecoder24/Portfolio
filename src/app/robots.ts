import type { MetadataRoute } from 'next';
import { config } from '@/content';

// AI crawlers are allowed on purpose: being described accurately by assistants is a goal.
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${config.site.url}/sitemap.xml` };
}
