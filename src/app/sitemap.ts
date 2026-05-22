import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || 'https://dronek.ci';

  // 1. Define all key static pages of the Dronek application
  const staticPaths = [
    '',
    '/contact',
    '/actualite',
    '/activities',
    '/activite',
    '/activites',
  ];

  const staticRoutes = staticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  // 2. Fetch news items (actualités) from the local Prisma (SQLite) database
  let prismaPosts: any[] = [];
  try {
    prismaPosts = await db.post.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    });
  } catch (err) {
    console.warn('[Sitemap] Could not fetch news from Prisma:', err);
  }

  // 3. Fetch news items from Supabase if configured/available
  let supabasePosts: any[] = [];
  try {
    const { data } = await supabase
      .from('actualites')
      .select('id, date_publication')
      .in('statut', ['publie', 'Publié', 'Published']);
    
    if (data) {
      supabasePosts = data;
    }
  } catch (err) {
    console.warn('[Sitemap] Could not fetch news from Supabase:', err);
  }

  // 4. Map & Combine dynamic routes
  const dynamicRoutesMap = new Map<string, { url: string; lastModified: Date; changeFrequency: 'weekly'; priority: number }>();

  // Add Prisma news
  prismaPosts.forEach((post) => {
    const url = `${baseUrl}/actualite?id=${post.id}`;
    dynamicRoutesMap.set(post.id, {
      url,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    });
  });

  // Add Supabase news (will overwrite/merge by ID)
  supabasePosts.forEach((post) => {
    const url = `${baseUrl}/actualite?id=${post.id}`;
    dynamicRoutesMap.set(post.id, {
      url,
      lastModified: post.date_publication ? new Date(post.date_publication) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    });
  });

  const dynamicRoutes = Array.from(dynamicRoutesMap.values());

  return [...staticRoutes, ...dynamicRoutes];
}
