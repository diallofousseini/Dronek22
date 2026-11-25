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
    objectives: ['Sécuriser l\'accès à l\'eau', 'Former à l\'utilisation du matériel', 'Augmenter les rendements'],
    impacts: ['Disponibilité continue d\'eau', 'Production maraîchère toute l\'année', 'Amélioration des revenus'],
    gallery: ['/images/hero-agriculture.jpg', '/images/project-training.jpg'],
  },
  {
    slug: 'reboisement-reserve-forestiere-lamto',
    title: 'REBOISEMENT DE LA RÉSERVE FORESTIÈRE DE LAMTO',
    category: 'forestry',
    categoryLabel: 'FORESTERIE',
    summary: 'Restauration écologique par plantation d\'espèces indigènes en zone dégradée.',
    location: 'Lamto, Côte d\'Ivoire',
    year: '2023',
    image: '/images/project-forest.jpg',
    detail: 'Projet de restauration écologique combinant pépinières communautaires et suivi par drone de la reprise des plants.',
    objectives: ['Restaurer 200 hectares', 'Impliquer les communautés locales', 'Suivre le taux de survie par drone'],
    impacts: ['200 hectares restaurés', 'Création d\'emplois locaux', 'Taux de reprise supérieur à 85%'],
    gallery: ['/images/project-forest.jpg', '/images/nursery.jpg'],
  },
  {
    slug: 'suivi-sanitaire-palmeraies-drone',
    title: 'SUIVI SANITAIRE DES PALMERAIES PAR DRONE',
    category: 'drone',
    categoryLabel: 'DRONE ET CARTOGRAPHIE',
    summary: 'Détection précoce du dépérissement et cartographie de la vigueur végétative.',
    location: 'Dabou, Côte d\'Ivoire',
    year: '2024',
    image: '/images/hero-drone.jpg',
    detail: 'Utilisation de capteurs multispectraux pour évaluer l\'état nutritionnel et phytosanitaire de grandes plantations industrielles.',
    objectives: ['Identifier le stress hydrique', 'Optimiser les traitements ciblés', 'Réduire l\'usage des intrants'],
    impacts: ['Économie de 30% d\'intrants', 'Détection précoce des attaques', 'Cartes de vigueur en temps réel'],
    gallery: ['/images/hero-drone.jpg', '/images/drone-work.jpg'],
  },
  {
    slug: 'pepiniere-agroforestiere-communautaire',
    title: 'PÉPINIÈRE AGROFORESTIÈRE COMMUNAUTAIRE',
    category: 'agroforestry',
    categoryLabel: 'AGROFORESTERIE',
    summary: 'Mise en place de pépinières villageoises pour l\'approvisionnement en essences forestières.',
    location: 'Daloa, Côte d\'Ivoire',
    year: '2023',
    image: '/images/nursery.jpg',
    detail: 'Création et gestion de pépinières communautaires destinées à fournir des plants de cacaoyers et d\'arbres d\'ombrage.',
    objectives: ['Produire 500 000 plants par an', 'Former les femmes et jeunes', 'Favoriser l\'ombrage dans les cacaoyères'],
    impacts: ['Autonomie des villages en plants', 'Diversification des revenus', 'Amélioration de la résilience climatique'],
    gallery: ['/images/nursery.jpg', '/images/project-training.jpg'],
  },
  {
    slug: 'inventaire-biomasse-carbone-nord',
    title: 'INVENTAIRE BIOMASSE ET CARBONE DU NORD',
    category: 'forestry',
    categoryLabel: 'FORESTERIE',
    summary: 'Modélisation 3D et estimation des stocks de carbone dans les savanes boisées.',
    location: 'Boundiali, Côte d\'Ivoire',
    year: '2023',
    image: '/images/project-carbon.jpg',
    detail: 'Acquisition photogrammétrique par drone pour modéliser le volume de bois sur pied et évaluer les crédits carbone potentiels.',
    objectives: ['Modéliser la canopée en 3D', 'Estimer les stocks de carbone', 'Établir un protocole de suivi'],
    impacts: ['Données précises pour les projets carbone', 'Gain de temps considérable', 'Rapports scientifiques validés'],
    gallery: ['/images/project-carbon.jpg', '/images/about-forest.jpg'],
  },
  {
    slug: 'audit-agronomique-cooperatives',
    title: 'AUDIT AGROÉCONOMIQUE DES COOPÉRATIVES',
    category: 'agriculture',
    categoryLabel: 'AGRICULTURE',
    summary: 'Diagnostic global de conformité aux normes internationales de durabilité.',
    location: 'Abengourou, Côte d\'Ivoire',
    year: '2022',
    image: '/images/project-training.jpg',
    detail: 'Évaluation technique et économique de 15 coopératives agricoles pour l\'obtention des certifications Rainforest Alliance et Fairtrade.',
    objectives: ['Auditer les pratiques agricoles', 'Structurer la traçabilité', 'Accompagner la certification'],
    impacts: ['15 coopératives certifiées', 'Meilleure valorisation des récoltes', 'Transparence accrue de la filière'],
    gallery: ['/images/project-training.jpg', '/images/hero-agriculture.jpg'],
  },
  {
    slug: 'topographie-aerienne-site-industriel',
    title: 'TOPOGRAPHIE AÉRIENNE POUR SITE INDUSTRIEL',
    category: 'drone',
    categoryLabel: 'DRONE ET CARTOGRAPHIE',
    summary: 'Levé topographique et calcul de cubature par drone pour extension d\'usine.',
    location: 'San Pédro, Côte d\'Ivoire',
    year: '2024',
    image: '/images/drone-work.jpg',
    detail: 'Relevé topographique centimétrique par drone avec récepteur RTK pour la préparation des travaux de terrassement.',
    objectives: ['Produire un MNT et des courbes de niveau', 'Calculer les volumes de déblai/remblai', 'Générer un plan DAO'],
    impacts: ['Précision centimétrique', 'Livraison en 48 heures', 'Sécurité optimale sur le chantier'],
    gallery: ['/images/drone-work.jpg', '/images/hero-drone.jpg'],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
