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
  },
  {
    id: 'news-seminaire-ecologique',
    title: 'SÉMINAIRE ÉCOLOGIQUE SUR L\'AGRICULTURE DURABLE',
    titleEn: 'ECOLOGICAL SEMINAR ON SUSTAINABLE AGRICULTURE',
    content: 'Atelier de formation et d\'échange sur les méthodes agroécologiques et la préservation de la santé des sols.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
    category: 'Actualités',
    createdAt: '2024-04-10T10:00:00.000Z'
  },
  {
    id: 'news-dronek-innovation',
    title: 'INNOVATIONS DRONEK EN CARTOGRAPHIE HAUTE RÉSOLUTION',
    titleEn: 'DRONEK INNOVATIONS IN HIGH RESOLUTION MAPPING',
    content: 'Déploiement de nouvelles technologies de capteurs thermiques et multispectraux pour la surveillance des forêts.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2070&auto=format&fit=crop',
    category: 'Actualités',
    createdAt: '2024-03-22T10:00:00.000Z'
  },
  {
    id: 'news-protection-forets',
    title: 'PROTECTION ET SURVEILLANCE DES FORÊTS CLASSÉES',
    titleEn: 'PROTECTION AND MONITORING OF CLASSIFIED FORESTS',
    content: 'Mise en place de patrouilles guidées par cartographie aérienne pour lutter contre la déforestation illégale.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop',
    category: 'Actualités',
    createdAt: '2024-02-18T10:00:00.000Z'
  },
  {
    id: 'news-cartographie-tai',
    title: 'CARTOGRAPHIE DÉTAILLÉE DU MASSIF DE TAÏ',
    titleEn: 'DETAILED MAPPING OF THE TAI FOREST MASSIF',
    content: 'Projet d\'inventaire haute précision couvrant plus de 50 000 hectares avec classification automatique du couvert végétal.',
    image: 'https://images.unsplash.com/photo-1579389083395-4507e9f4c171?q=80&w=2070&auto=format&fit=crop',
    category: 'Actualités',
    createdAt: '2024-01-14T10:00:00.000Z'
  },
  {
    id: 'news-mission-reussie',
    title: 'MISSION RÉUSSIE : AUDIT D\'IMPACT ENVIRONNEMENTAL',
    titleEn: 'SUCCESSFUL MISSION: ENVIRONMENTAL IMPACT AUDIT',
    content: 'Livrables validés par les autorités partenaires pour le suivi des engagements carbone et biodiversité.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    category: 'Actualités',
    createdAt: '2023-12-05T10:00:00.000Z'
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
