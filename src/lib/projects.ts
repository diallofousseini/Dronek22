export type ProjectCategory = 'forestry' | 'agriculture' | 'drone' | 'agroforestry';

export type ProjectItem = {
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  summary: string;
  location: string;
  year: string;
  image: string;
  detail: string;
  objectives: string[];
  impacts: string[];
  gallery: string[];
};

export const projects: ProjectItem[] = [
  {
    slug: 'inventaire-forestier-parc-national-tai',
    title: 'INVENTAIRE FORESTIER DU PARC NATIONAL DE TAI',
    category: 'forestry',
    categoryLabel: 'FORESTERIE',
    summary:
      'Inventaire et cartographie d\'un massif forestier avec collecte de données de terrain et analyse de la biodiversité.',
    location: 'Parc National de Taï',
    year: '2023',
    image: '/images/project-forest.jpg',
    detail:
      'Ce projet a permis de documenter de manière exhaustive l\'état du couvert forestier du Parc National de Taï. L\'équipe DRONEK a combiné relevés terrain, géoréférencement et cartographie haute résolution pour établir un inventaire exploitable par les gestionnaires du site.',
    objectives: [
      'Identifier les essences dominantes et les zones sensibles',
      'Produire des cartes de référence pour la gestion durable',
      'Fournir une base de suivi pour les actions de conservation',
    ],
    impacts: [
      'Vision actualisée de l\'état du parc sur les zones étudiées',
      'Meilleure priorisation des actions de conservation',
      'Données directement exploitables par les équipes terrain',
    ],
    gallery: ['/images/project-forest.jpg', '/images/drone-work.jpg', '/images/about-forest.jpg'],
  },
  {
    slug: 'formation-cooperatives-cacao-sud-ouest',
    title: 'FORMATION DES COOPERATIVES DE CACAO DU SUD-OUEST',
    category: 'agriculture',
    categoryLabel: 'AGRICULTURE',
    summary:
      'Formation pratique des producteurs aux bonnes pratiques agricoles et aux systèmes de cacao durable.',
    location: 'Sud-Ouest de la Côte d\'Ivoire',
    year: '2023',
    image: '/images/project-training.jpg',
    detail:
      "Ce programme stratégique visait à moderniser les pratiques culturales de plusieurs coopératives cacaoyères dans le Sud-Ouest ivoirien. À travers un dispositif hybride associant ingénierie pédagogique, démonstrations techniques in-situ et suivi personnalisé, nous avons transmis des méthodes d'agriculture régénérative permettant de concilier rentabilité économique et préservation des écosystèmes.",
    objectives: [
      "Professionnalisation des méthodes de culture et de gestion des exploitations",
      "Optimisation durable des rendements par l'adoption d'itinéraires techniques innovants",
      "Intégration de modèles agroforestiers résilients face aux enjeux climatiques",
    ],
    impacts: [
      "Transformation structurelle du savoir-faire technique des producteurs",
      "Adoption mesurable de pratiques agricoles respectueuses de la biodiversité",
      "Consolidation de la chaîne de valeur par un encadrement local certifié",
    ],
    gallery: ['/images/project-training.jpg', '/images/hero-agriculture.jpg', '/images/nursery.jpg'],
  },
  {
    slug: 'cartographie-drone-projet-redd-plus',
    title: 'CARTOGRAPHIE DRONE POUR LE PROJET REDD+',
    category: 'drone',
    categoryLabel: 'DRONE ET CARTOGRAPHIE',
    summary:
      'Production de cartes drone haute précision pour le suivi d\'un territoire REDD+ et l\'analyse des usages du sol.',
    location: 'Grabo, Tabou',
    year: '2022',
    image: '/images/project-carbon.jpg',
    detail:
      'DRONEK a réalisé une cartographie drone détaillée pour le projet REDD+ afin de produire une base cartographique fiable, suivre l\'évolution du couvert et documenter les zones à enjeu environnemental. Les livrables ont servi à la planification et au suivi des interventions.',
    objectives: [
      'Fournir une orthomosaïque exploitable pour le pilotage',
      'Mesurer les évolutions du couvert avec précision',
      'Appuyer les décisions liées au projet REDD+',
    ],
    impacts: [
      'Gain de précision sur les superficies suivies',
      'Livrables adaptés aux besoins des équipes projet',
      'Réduction du temps d\'intervention sur le terrain',
    ],
    gallery: ['/images/project-carbon.jpg', '/images/hero-drone.jpg', '/images/drone-work.jpg'],
  },
  {
    slug: 'amenagement-perimetres-irrigue-nord',
    title: 'AMÉNAGEMENT DE PÉRIMÈTRES IRRIGUÉS DANS LE NORD',
    category: 'agriculture',
    categoryLabel: 'AGRICULTURE',
    summary: 'Étude et aménagement de systèmes d\'irrigation pour les cultures maraîchères.',
    location: 'Korhogo, Côte d\'Ivoire',
    year: '2024',
    image: '/images/hero-agriculture.jpg',
    detail: 'Ce projet vise à sécuriser la production agricole pendant la saison sèche en installant des systèmes d\'irrigation efficients et durables.',
    objectives: ['Optimiser la gestion de l\'eau', 'Accroître les rendements maraîchers'],
    impacts: ['Augmentation des revenus des producteurs', 'Sécurité alimentaire renforcée'],
    gallery: ['/images/hero-agriculture.jpg'],
  },
  {
    slug: 'reboisement-reserve-forestiere-lamto',
    title: 'REBOISEMENT DE LA RÉSERVE FORESTIÈRE DE LAMTO',
    category: 'forestry',
    categoryLabel: 'FORESTERIE',
    summary: 'Restauration du couvert forestier par la plantation d\'essences locales sur 50 hectares.',
    location: 'Lamto, Tiassalé',
    year: '2023',
    image: '/images/hero-forest.jpg',
    detail: 'DRONEK accompagne la réserve de Lamto dans ses efforts de restauration écologique pour préserver la biodiversité unique du site.',
    objectives: ['Restaurer l\'écosystème dégradé', 'Favoriser le retour de la faune sauvage'],
    impacts: ['50 000 plants mis en terre', 'Taux de survie des plants supérieur à 90%'],
    gallery: ['/images/hero-forest.jpg'],
  },
  {
    slug: 'suivi-sanitaire-palmeraies-drone',
    title: 'SUIVI SANITAIRE DES PALMERAIES PAR DRONE',
    category: 'drone',
    categoryLabel: 'DRONE ET CARTOGRAPHIE',
    summary: 'Détection précoce des maladies et carences nutritionnelles par imagerie multispectrale.',
    location: 'Grand-Lahou',
    year: '2023',
    image: '/images/drone-work.jpg',
    detail: 'L\'utilisation de capteurs multispectraux permet d\'identifier les arbres stressés avant que les symptômes ne soient visibles à l\'œil nu.',
    objectives: ['Réduire l\'utilisation de pesticides', 'Cibler précisément les interventions'],
    impacts: ['Réduction des pertes de production', 'Économie sur les intrants agricoles'],
    gallery: ['/images/drone-work.jpg'],
  },
  {
    slug: 'pepiniere-agroforestiere-communautaire',
    title: 'PÉPINIÈRE AGROFORESTIÈRE COMMUNAUTAIRE',
    category: 'agroforestry',
    categoryLabel: 'AGROFORESTERIE',
    summary: 'Production de 100 000 plants fruitiers et forestiers pour les petits exploitants.',
    location: 'Adzopé',
    year: '2024',
    image: '/images/nursery.jpg',
    detail: 'Mise en place d\'une pépinière de proximité pour faciliter l\'accès des paysans à des plants de qualité supérieure.',
    objectives: ['Démocratiser l\'agroforesterie', 'Améliorer les revenus paysans'],
    impacts: ['Autonomisation des femmes rurales', 'Diversification des cultures'],
    gallery: ['/images/nursery.jpg'],
  },
  {
    slug: 'inventaire-biomasse-carbon-nord',
    title: 'INVENTAIRE BIOMASSE ET CARBONE DU NORD',
    category: 'forestry',
    categoryLabel: 'FORESTERIE',
    summary: 'Évaluation des stocks de carbone pour les projets de compensation carbone.',
    location: 'Ferkessédougou',
    year: '2023',
    image: '/images/about-forest.jpg',
    detail: 'Mesure précise de la biomasse aérienne pour quantifier les crédits carbone potentiels d\'une zone protégée.',
    objectives: ['Estimer les stocks de carbone', 'Appuyer la certification carbone'],
    impacts: ['Données scientifiques robustes', 'Accès au marché du carbone'],
    gallery: ['/images/about-forest.jpg'],
  },
  {
    slug: 'audit-agroeconomique-cooperatives',
    title: 'AUDIT AGROÉCONOMIQUE DES COOPÉRATIVES',
    category: 'agriculture',
    categoryLabel: 'AGRICULTURE',
    summary: 'Diagnostic financier et technique de 10 coopératives agricoles.',
    location: 'Yamoussoukro',
    year: '2024',
    image: '/images/hero-agriculture.jpg',
    detail: 'Renforcement de la gouvernance et de l\'efficacité opérationnelle des organisations de producteurs.',
    objectives: ['Identifier les leviers de croissance', 'Améliorer la transparence financière'],
    impacts: ['Coopératives plus résilientes', 'Meilleur accès au crédit'],
    gallery: ['/images/hero-agriculture.jpg'],
  },
  {
    slug: 'topographie-aerienne-site-industriel',
    title: 'TOPOGRAPHIE AÉRIENNE POUR SITE INDUSTRIEL',
    category: 'drone',
    categoryLabel: 'DRONE ET CARTOGRAPHIE',
    summary: 'Levés topographiques haute résolution pour l\'aménagement d\'un site industriel.',
    location: 'San Pedro',
    year: '2023',
    image: '/images/project-carbon.jpg',
    detail: 'Génération de modèles numériques de terrain et de courbes de niveau avec une précision centimétrique.',
    objectives: ['Accélérer les relevés terrain', 'Fournir des données 3D précises'],
    impacts: ['Réduction des coûts de relevé', 'Planification optimisée'],
    gallery: ['/images/project-carbon.jpg'],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
