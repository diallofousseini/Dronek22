export interface DefaultNewsItem {
  id: string;
  title: string;
  titleEn?: string;
  content: string;
  image: string;
  category: string;
  createdAt: string;
}

export const defaultNewsPosts: DefaultNewsItem[] = [
  {
    id: 'news-reboisement-2024',
    title: 'CAMPAGNE DE REBOISEMENT ET RESTAURATION FORESTIÈRE',
    titleEn: 'REFORESTATION AND FOREST RESTORATION CAMPAIGN',
    content: 'Sensibilisation des communautés locales et plantation de milliers d\'arbres d\'essences locales pour restaurer le couvert forestier en Côte d\'Ivoire.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop',
    category: 'Actualités',
    createdAt: '2024-05-15T10:00:00.000Z'
  }
];

export function mergeNewsPosts(supaPosts: any[] = [], apiPosts: any[] = [], localStoredPosts: any[] = [], lang: string = 'fr') {
  const mergedMap = new Map<string, any>();

  // 1. Initialize with default news items
  defaultNewsPosts.forEach((dn, index) => {
    const baseObj = {
      id: dn.id,
      originalId: dn.id,
      numericIndex: index + 1,
      title: lang === 'en' && dn.titleEn ? dn.titleEn : dn.title,
      content: dn.content,
      image: dn.image,
      createdAt: dn.createdAt,
      customDate: dn.createdAt,
      category: dn.category,
      isDefault: true
    };
    mergedMap.set(dn.id, baseObj);
  });

  // Helper to merge an incoming post
  const applyPost = (p: any) => {
    if (!p) return;
    const rawId = String(p.id || p.originalId || '');
    const titleKey = (p.titre || p.title || '').trim().toLowerCase();

    // Find if matching any default post by ID, originalId, or title
    let matchedKey: string | null = null;

    for (const [k, v] of mergedMap.entries()) {
      if (k === rawId || (v.originalId && String(v.originalId) === rawId)) {
        matchedKey = v.id;
        break;
      }
      if (v.title && v.title.trim().toLowerCase() === titleKey) {
        matchedKey = v.id;
        break;
      }
    }

    const itemDate = p.date_publication || p.customDate || p.created_at || p.createdAt || new Date().toISOString();
    const finalObj = {
      id: matchedKey || rawId || `post_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      originalId: matchedKey || rawId,
      title: p.titre || p.title || 'Actualité',
      content: p.contenu || p.content || p.resume || '',
      image: p.image_url || p.image || null,
      gallery: p.gallery || null,
      customDate: itemDate,
      createdAt: itemDate,
      category: 'Actualités',
      isDefault: false
    };

    if (matchedKey) {
      mergedMap.set(matchedKey, finalObj);
    } else {
      mergedMap.set(finalObj.id, finalObj);
    }
  };

  // Apply in order: localStored -> API -> Supabase
  localStoredPosts.forEach(applyPost);
  apiPosts.forEach(applyPost);
  supaPosts.forEach(applyPost);

  // Convert map to array
  const result: any[] = [];
  const seenIds = new Set<string>();

  for (const item of mergedMap.values()) {
    if (!seenIds.has(item.id)) {
      seenIds.add(item.id);
      result.push(item);
    }
  }

  // Sort by date descending
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return result;
}
