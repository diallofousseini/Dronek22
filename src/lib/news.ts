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
