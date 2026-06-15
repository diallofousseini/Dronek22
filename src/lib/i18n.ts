export type Language = "fr" | "en";

export const translations = {
  fr: {
    nav: {
      home: "Accueil",
      services: "Services",
      projects: "Projets",
      news: "Actualités",
      blog: "Actualités",
      about: "À Propos",
      team: "Équipe",
      production: "Sites de Production",
      contact: "Contact",
      admin: "Admin",
      latestPosts: "Derniers posts",
      mediaLibrary: "Notre médiathèque",
    },
    hero: {
      title: "Technologies Innovantes pour une Gestion Durable des Forêts et de l'Agriculture",
      subtitle: "DRONEK - Expert en cartographie par drone, foresterie durable et agroforesterie",
      cta1: "Contact",
      cta2: "Nos Services",
      stat1: "Années d'Expertise",
      stat2: "Projets Réalisés",
      stat3: "Partenaires",
      stat4: "Secteurs d'Activités",
    },
    services: {
      title: "Nos Domaines d'Expertise",
      subtitle: "Des solutions innovantes pour un développement durable",
      forestry: {
        name: "Foresterie",
        desc: "",
        fullDesc: "En foresterie, Dronek relève le défi d'un monde en mutation. Grâce à notre équipe de techniciens, de pépiniéristes et d'un répertoire de prestataires de qualité dans le domaine rural, nous apportons des solutions durables.",
        items: [
          { title: "Formations aux métiers forestiers (pépiniéristes, sylviculteurs, aménagistes forestiers)", desc: "", image: "/images/hero-forest.jpg", pdfUrl: "/docs/formation_forestiere.pdf" },
          { title: "Production de plantes maraîchères par la mise en place de pépinières", desc: "", image: "/images/project-forest.jpg", pdfUrl: "/docs/pepinieres_maraicheres.pdf" },
          { title: "Inventaire forestier et faunique", desc: "", image: "/images/hero-tech.jpg", pdfUrl: "/docs/inventaire_faunique.pdf" },
          { title: "Suivi de reboisement", desc: "", image: "/images/drone-work.jpg", pdfUrl: "/docs/suivi_reboisement.pdf" },
        ],
        benefits: ["Expertise locale reconnue", "Technologies de pointe", "Résultats certifiés", "Accompagnement personnalisé"],
      },
      drone: {
        name: "Drone et Cartographie",
        desc: "",
        fullDesc:
          "Grâce à notre flotte de drones de dernière génération et notre expertise en géomatique, nous produisons des données cartographiques de haute précision pour vos projets d'aménagement du territoire.",
        items: [
          { title: "TOPOGRAPHIE.", desc: "Relevés topographiques aériens, modèles numériques de terrain, courbes de niveau, précision centimétrique", image: "/images/hero-drone.jpg", pdfUrl: "/docs/topographie.pdf" },
          { title: "MODÉLISATION.", desc: "Modélisation 3D par photogrammétrie, nuages de points LiDAR, orthophotos haute résolution, maquettes numériques", image: "/images/project-carbon.jpg", pdfUrl: "/docs/modelisation.pdf" },
          { title: "INSPECTION.", desc: "Inspection d'ouvrages sans risque, détection d'anomalies structurelles, rapport photographique détaillé, recommandations", image: "/images/drone-work.jpg", pdfUrl: "/docs/inspection.pdf" },
          { title: "SUIVI.", desc: "Suivi de chantier BIM, mesure de volumes, contrôle d'avancement, documentation photographique", image: "/images/hero-tech.jpg", pdfUrl: "/docs/suivi_chantier.pdf" },
        ],
        benefits: ["Haute résolution", "Rapidité d'exécution", "Données géoréférencées", "Rapports détaillés"],
      },
      agroforestry: {
        name: "Agroforesterie",
        desc: "Formation, plants agroforestiers, pratiques durables",
        fullDesc:
          "Nous promouvons des systèmes agroforestiers intégrés qui combinent production agricole et conservation des arbres, contribuant ainsi à la sécurité alimentaire et à la préservation de l'environnement.",
        items: [
          { title: "Formation et sensibilisation", desc: "Programmes de formation sur les pratiques agricoles durables et l'agroforesterie", pdfUrl: "/docs/agroforesterie_formation.pdf" },
          { title: "Production de plants", desc: "Production et transport de plants agroforestiers de qualité supérieure", pdfUrl: "/docs/agroforesterie_plants.pdf" },
        ],
        benefits: ["Systèmes durables", "Renforcement des capacités", "Plants certifiés", "Suivi technique"],
      },
      agriculture: {
        name: "Agriculture",
        desc: "",
        fullDesc: "",
        items: [
          { title: "Audit, renforcement des capacités et conseils en agroéconomie", desc: "", image: "/images/hero-agriculture.jpg", pdfUrl: "/docs/agroeconomie.pdf" },
          { title: "Appui à la diversification des activités agricoles", desc: "", image: "/images/cocoa-agroforestry.jpg", pdfUrl: "/docs/diversification_agricole.pdf" },
          { title: "Formation sur les techniques d'élevage", desc: "", image: "/images/nursery-detail.jpg", pdfUrl: "/docs/techniques_elevage.pdf" },
          { title: "Formation des producteurs sur les bonnes pratiques agricoles (BPA)", desc: "", image: "/images/about-agriculture.jpg", pdfUrl: "/docs/bonnes_pratiques_agricoles.pdf" },
        ],
        benefits: ["Augmentation des rendements", "Diversification", "Formation pratique", "Accompagnement continu"],
      },
      surveillance: {
        name: "Agroforesterie",
        desc: "",
        fullDesc:
          "Nous accompagnons les producteurs dans la mise en place de systèmes agroforestiers durables, alliant productivité agricole et préservation de l'environnement.",
        items: [
          { title: "CONSEIL.", desc: "Accompagnement technique pour la mise en place de parcelles agroforestières, choix des essences, densités de plantation", image: "/images/cocoa-agroforestry.jpg", pdfUrl: "/docs/conseil_agroforesterie.pdf" },
          { title: "PLANTS.", desc: "Fourniture de plants forestiers et fruitiers sélectionnés pour l'association avec les cultures pérennes", image: "/images/nursery-detail.jpg", pdfUrl: "/docs/plants_agroforesterie.pdf" },
          { title: "FORMATION.", desc: "Sessions de formation pratique sur les techniques d'entretien et de taille des arbres en milieu agricole", image: "/images/project-training.jpg", pdfUrl: "/docs/formation_agroforesterie.pdf" },
          { title: "SUIVI.", desc: "Suivi pluriannuel du développement des arbres et évaluation de l'impact sur les rendements agricoles", image: "/images/about-forest.jpg", pdfUrl: "/docs/suivi_agroforesterie.pdf" },
        ],
        benefits: ["Rendements durables", "Diversification des revenus", "Préservation des sols", "Microclimat favorable"],
      },
      learnMore: "En savoir plus",
      downloadSheet: "Fiches techniques (PDF)",
      requestQuote: "Contact",
      consultationTitle: "Laissez-nous un message",
      consultationSubtitle: "Parlons de votre projet et de la manière dont nous pouvons vous accompagner.",
      placeholders: {
        nom: "Nom",
        prenom: "Prénom",
        email: "E-mail",
        message: "Message",
      },
      sending: "Envoi...",
      send: "Envoyer",
      success: "Votre demande a bien été envoyée.",
      error: "Échec de l'envoi. Veuillez réessayer.",
      bannerDesc: {
        title: "Nos Services",
        content: "Dans chacune de ces activités, DRONEK propose un panel de services afin de fournir des prestations efficaces et performantes."
      }
    },
    projects: {
      title: "Nos Projets Phares",
      subtitle: "Découvrez nos réalisations à travers la Côte d'Ivoire",
      heroTitle: "Nos Projets & Réalisations",
      heroDesc: "Au cours de notre existence DRONEK a participé à d’innombrables projets sur toutes l’étendues du territoire et avec des acteurs venant de toute part. Alors plongez dans notre histoire à travers nos réalisations.",
      learnMore: "En savoir plus",
      yearLabel: "Année",
      locationLabel: "Localisation",
      objectivesLabel: "Objectifs du projet",
      impactsLabel: "Résultats & Impacts",
      aboutTitle: "À propos",
      aboutText: "DRONEK vous accompagne dans vos projets d'innovation technologique liés à l'agriculture. Notre technologie permet d'alléger considérablement le travail de terrain par l'élimination de l'échantillonnage et la collecte de données manuelles qui peuvent représenter un travail de longue haleine.\n\nNous utilisons la technologie dans la pratique de l'agroforesterie en ayant recours aux drones pour la collecte d'informations relatives à la mise en place de systèmes agroforestiers de pointe.",
      close: "Fermer",
      all: "Tous",
      forestry: "Foresterie",
      agriculture: "Agriculture",
      drone: "Drone et Cartographie",
      agroforestry: "Agroforesterie",
      byYear: "Par Année",
      viewProject: "Voir les projets",
      caseStudy: "Étude de cas",
      year: "Année",
      location: "Localisation",
      sector: "Secteur",
      items: [
        {
          title: "Inventaire Forestier du Parc National de Taï",
          desc: "Cartographie complète de 5000 hectares de forêt primaire avec identification de plus de 300 espèces végétales. Projet mené en collaboration avec l'OIPR.",
          location: "Parc National de Taï",
          year: "2023",
          sector: "forestry",
          image: "project-forest.jpg",
          fullContent: "Ce projet ambitieux a consisté en la réalisation d'un inventaire forestier complet du Parc National de Taï, patrimoine mondial de l'UNESCO. Sur une superficie de 5000 hectares, notre équipe a identifié et cartographié plus de 300 espèces végétales, évalué la biomasse forestière et les stocks de carbone. Les données collectées ont permis d'élaborer un plan de gestion durable pour les prochaines décennies.",
        },
        {
          title: "Formation des Coopératives de Cacao du Sud-Ouest",
          desc: "Programme de formation de 200 agriculteurs aux bonnes pratiques de culture du cacao durable et à l'agroforesterie.",
          location: "Soubré, San Pedro",
          year: "2023",
          sector: "agriculture",
          image: "project-training.jpg",
          fullContent: "Ce programme stratégique visait à moderniser les pratiques culturales de plusieurs coopératives cacaoyères dans le Sud-Ouest ivoirien. À travers un dispositif hybride associant ingénierie pédagogique, démonstrations techniques in-situ et suivi personnalisé, nous avons transmis des méthodes d'agriculture régénérative permettant de concilier rentabilité économique et préservation des écosystèmes.",
        },
        {
          title: "Cartographie Drone pour le Projet REDD+",
          desc: "Cartographie par drone de 10000 hectares pour le projet REDD+ de la Sous-préfecture de Grabo.",
          location: "Grabo, Tabou",
          year: "2022",
          sector: "drone",
          image: "project-carbon.jpg",
          fullContent: "Dans le cadre du projet REDD+ (Réduction des Émissions dues à la Déforestation et à la Dégradation des Forêts), DRONEK a réalisé une cartographie par drone haute résolution de 10000 hectares dans la région de Grabo. Cette cartographie a permis d'établir une ligne de base des stocks de carbone et de suivre l'évolution de la couverture forestière avec une précision centimétrique.",
        },
        {
          title: "Reboisement de la Réserve de Lamto",
          desc: "Plantation de 50000 arbres sur 200 hectares dégradés avec des espèces locales adaptées.",
          location: "Lamto, Tiassalé",
          year: "2022",
          sector: "forestry",
          image: "hero-forest.jpg",
          fullContent: "DRONEK a coordonné un programme de reboisement ambitieux dans la Réserve de Lamto, touchée par la dégradation. Au total, 50000 arbres de 15 espèces locales ont été plantés sur 200 hectares. Le projet inclut un suivi par drone tous les 6 mois pour évaluer la survie et la croissance des plants, avec un taux de réussite dépassant 85%.",
        },
        {
          title: "Audit Agricole des Coopératives de Yamoussoukro",
          desc: "Diagnostic complet de 15 coopératives agricoles avec plan d'amélioration personnalisé.",
          location: "Yamoussoukro",
          year: "2023",
          sector: "agriculture",
          image: "hero-agriculture.jpg",
          fullContent: "DRONEK a réalisé un audit approfondi de 15 coopératives agricoles dans la région de Yamoussoukro. L'audit a couvert les aspects techniques, économiques et environnementaux des exploitations. Chaque coopérative a reçu un rapport détaillé avec des recommandations personnalisées pour améliorer sa productivité et sa durabilité.",
        },
        {
          title: "Pépinière Agroforestière d'Abidjan",
          desc: "Mise en place d'une pépinière de 5 hectares avec capacité de production de 100000 plants par an.",
          location: "Abidjan, Cocody",
          year: "2021",
          sector: "agroforestry",
          image: "nursery.jpg",
          fullContent: "DRONEK a créé une pépinière agroforestière moderne à Abidjan, d'une capacité de 100000 plants par an. La pépinière produit des espèces forestières et agroforestières locales adaptées aux différents types de sols et de climats de la Côte d'Ivoire. Un système d'irrigation goutte-à-goutte et des serres permettent une production de qualité toute l'année.",
        },
      ],
    },
    blog: {
      title: "Actualités",
      heroBadge: "Actualités & Médias",
      heroTitle: "Nos dernières nouvelles",
      heroDesc: "Suivez les dernières avancées de DRONEK dans la technologie agricole et la gestion forestière durable.",
      mediaBadge: "Médiathèque",
      mediaTitle: "Notre Médiathèque",
      newsBadge: "Actualité",
      summaryLabel: "En résumé",
      summaryText: "DRONEK continue d'innover pour offrir des solutions technologiques de pointe au service du développement durable en Afrique de l'Ouest.",
      readMore: "Lire la suite",
      subtitle: "Actualités, conseils et décryptages sur la foresterie et l'agriculture durable",
      categories: "Catégories",
      tags: "Tags",
      recentPosts: "Articles Récents",
      all: "Tous",
      newsGrid: [
        {
          title: "Centres de services et de formation dans les villages",
          desc: "Nous offrons des formations gratuites et rendons nos services accessibles aux communautés villageoises pour favoriser leur développement.",
          image: "/images/project-training.jpg"
        },
        {
          title: "Réduction de l'utilisation d'agents polluants",
          desc: "Nos solutions par drones dans le secteur agricole permettent une utilisation plus efficace et précise du traitement des champs, évitant ainsi une utilisation excessive de pesticides nocifs.",
          image: "/images/hero-agriculture.jpg"
        },
        {
          title: "Diminution des interventions humaines à risque",
          desc: "Nos solutions par drones dans les secteurs agricole et industriel permettent des interventions plus efficaces et précises, réduisant les actions humaines dans des zones risquées.",
          image: "/images/drone-work.jpg"
        },
        {
          title: "Cartographie et inventaire forestier",
          desc: "Grâce à nos drones, nous réalisons des inventaires forestiers précis pour une gestion durable des ressources naturelles en Côte d'Ivoire.",
          image: "/images/hero-forest.jpg"
        },
        {
          title: "Production de plants en pépinière",
          desc: "Nos pépinières produisent des plants forestiers et agroforestiers de qualité pour soutenir les programmes de reboisement et d'agroforesterie.",
          image: "/images/nursery-detail.jpg"
        },
        {
          title: "Télédétection et traitement d'images",
          desc: "Nous utilisons des technologies de télédétection avancées pour produire des cartes d'occupation des sols et des orthomosaïques précises.",
          image: "/images/project-carbon.jpg"
        }
      ],
      articles: [
        {
          title: "L'importance de la cartographie par drone dans la gestion forestière",
          excerpt: "Découvrez comment les drones révolutionnent l'inventaire forestier et permettent une gestion plus précise et durable de nos ressources naturelles.",
          date: "15 Janvier 2024",
          category: "Technologie",
          tags: ["drone", "cartographie", "foresterie"],
          content: "La cartographie par drone représente une avancée majeure dans la gestion forestière. Contrairement aux méthodes traditionnelles qui nécessitent des mois de terrain, les drones peuvent cartographier plusieurs centaines d'hectares en quelques jours seulement. Cette technologie offre une résolution centimétrique, permettant d'identifier individuellement les arbres, d'évaluer leur état de santé et de calculer la biomasse avec une précision inédite. Chez DRONEK, nous utilisons des drones équipés de capteurs multispectraux et LiDAR pour produire des données qui alimentent les systèmes d'information géographique (SIG) et guident les décisions de gestion forestière.",
        },
        {
          title: "Agroforesterie : comment combiner agriculture et conservation",
          excerpt: "L'agroforesterie offre une solution viable pour concilier production agricole et préservation de l'environnement en Côte d'Ivoire.",
          date: "28 Décembre 2023",
          category: "Agroforesterie",
          tags: ["agroforesterie", "agriculture", "durable"],
          content: "L'agroforesterie est une approche qui consiste à intégrer des arbres dans les systèmes de production agricole. En Côte d'Ivoire, cette pratique présente de nombreux avantages : amélioration de la fertilité des sols, réduction de l'érosion, séquestration du carbone et diversification des revenus pour les agriculteurs. DRONEK accompagne les producteurs dans la mise en place de systèmes agroforestiers adaptés à leurs contextes locaux, avec des essences d'arbres soigneusement sélectionnées pour leurs services écosystémiques.",
        },
        {
          title: "Guide complet du calcul du stock de carbone forestier",
          excerpt: "Comprendre les méthodologies de calcul du stock de carbone et leur importance pour les projets REDD+ et les crédits carbone.",
          date: "10 Novembre 2023",
          category: "Environnement",
          tags: ["carbone", "REDD+", "environnement"],
          content: "Le calcul du stock de carbone forestier est une étape essentielle pour évaluer la contribution des forêts à la lutte contre le changement climatique. Les méthodologies reposent sur des mesures in situ combinées à des données de télédétection. DRONEK utilise des équations allométriques adaptées aux espèces tropicales africaines pour estimer la biomasse aérienne et souterraine des arbres. Ces données sont cruciales pour les projets REDD+ et la certification de crédits carbone.",
        },
        {
          title: "Formation agricole : investir dans le capital humain",
          excerpt: "Pourquoi la formation des agriculteurs est la clé de l'adoption de pratiques durables et de l'amélioration des rendements.",
          date: "5 Octobre 2023",
          category: "Formation",
          tags: ["formation", "agriculture", "coopératives"],
          content: "La formation agricole est un investissement stratégique pour le développement rural. Chez DRONEK, nous croyons que le transfert de compétences est le moteur du changement durable. Nos programmes de formation couvrent les bonnes pratiques agricoles, la gestion financière des coopératives et les techniques de conservation des sols. Les résultats sont tangibles : les agriculteurs formés voient leurs rendements augmenter en moyenne de 25 à 40% dans les deux années suivant la formation.",
        },
        {
          title: "Les tendances de la foresterie durable en Afrique de l'Ouest",
          excerpt: "Un panorama des innovations et des politiques qui façonnent l'avenir de la gestion forestière en Afrique de l'Ouest.",
          date: "20 Septembre 2023",
          category: "Foresterie",
          tags: ["foresterie", "Afrique", "politique"],
          content: "L'Afrique de l'Ouest connaît une évolution rapide dans le domaine de la foresterie durable. Les gouvernements adoptent des cadres politiques plus stricts, les technologies de télédétection deviennent plus accessibles et les communautés locales s'impliquent davantage dans la gestion des ressources. DRONEK est à l'avant-garde de cette transformation, en apportant des solutions technologiques innovantes qui répondent aux défis spécifiques de la région.",
        },
      ],
    },
    actualite: {
      title: "Actualité",
      loading: "Chargement...",
      empty: "Aucune actualité publiée pour le moment.",
      subtitle: "Les publications officielles partagées depuis l’admin apparaissent ici dans un fil vertical."
    },
    training: {
      title: "Notre Catalogue de Formations",
      subtitle: "Développez vos compétences avec nos programmes de formation spécialisés",
      register: "S'inscrire",
      modules: [
        {
          title: "Bonnes Pratiques Agricoles",
          desc: "Maîtrisez les techniques modernes d'agriculture durable pour optimiser vos rendements tout en préservant l'environnement. Ce module couvre la gestion des sols, la lutte intégrée contre les nuisibles, l'irrigation et la post-récolte.",
          duration: "5 jours",
          level: "Débutant",
          topics: ["Gestion durable des sols", "Lutte intégrée", "Techniques d'irrigation", "Conservation post-récolte"],
        },
        {
          title: "Cartographie par Drone",
          desc: "Apprenez à utiliser les drones pour la cartographie professionnelle. De la planification de vol au traitement des données, ce module vous forme aux compétences essentielles de la photogrammétrie.",
          duration: "7 jours",
          level: "Intermédiaire",
          topics: ["Planification de vol", "Photogrammétrie", "Traitement d'images", "SIG et cartographie"],
        },
        {
          title: "Gestion Forestière Durable",
          desc: "Approfondissez vos connaissances en aménagement forestier, inventaire et suivi des écosystèmes forestiers. Ce module combine théorie et terrain pour une formation complète.",
          duration: "10 jours",
          level: "Avancé",
          topics: ["Inventaire forestier", "Aménagement", "Biomasse et carbone", "Suivi écologique"],
        },
        {
          title: "Agroforesterie Pratique",
          desc: "Découvrez comment concevoir et mettre en place des systèmes agroforestiers performants. Ce module inclut des visites de terrain et des travaux pratiques en pépinière.",
          duration: "5 jours",
          level: "Débutant",
          topics: ["Conception de systèmes", "Choix des espèces", "Gestion de pépinière", "Analyse économique"],
        },
      ],
      newsletter: {
        title: "Restez Informé",
        subtitle: "Inscrivez-vous à notre newsletter pour recevoir nos dernières actualités et offres de formation",
        placeholder: "Votre adresse email",
        button: "S'abonner",
      },
      faq: {
        title: "Questions Fréquentes",
        items: [
          {
            q: "Comment s'inscrire à une formation ?",
            a: "Vous pouvez vous inscrire directement en ligne via le formulaire sur notre site, par email à contact@dronek.ci, ou par téléphone au +225 07 07 73 22 64 / +225 27 21 51 41 49. Un conseiller vous contactera pour finaliser votre inscription.",
          },
          {
            q: "Les formations sont-elles certifiantes ?",
            a: "Oui, toutes nos formations sont certifiantes. À l'issue de chaque module, vous recevrez une attestation de formation reconnue par les institutions professionnelles du secteur.",
          },
          {
            q: "Des financements sont-ils disponibles ?",
            a: "DRONEK propose des facilités de paiement et peut vous orienter vers des organismes de financement pour les coopératives et les organisations professionnelles. Contactez-nous pour en savoir plus.",
          },
          {
            q: "Les formations se déroulent-elles sur site ou en ligne ?",
            a: "Nos formations combinent sessions en présentiel sur nos sites de formation et modules en ligne pour la théorie. Les travaux pratiques se déroulent exclusivement sur le terrain.",
          },
          {
            q: "Quel est le nombre maximum de participants par session ?",
            a: "Nos sessions sont limitées à 20 participants pour garantir un suivi personnalisé et une qualité d'apprentissage optimale. Les formations drone sont limitées à 10 participants.",
          },
        ],
      },
    },
    team: {
      title: "Notre Équipe",
      heroBadge: "Notre Équipe",
      heroTitle: "Les Experts DRONEK",
      subtitle: "Une équipe d'experts passionnés au service du développement durable",
      founderWord: {
        title: "Le Mot du Fondateur",
        quote: "Mettre la technologie au service de la nature et des communautés.",
        desc1: "Depuis la création de DRONEK en 2017, notre vision n'a pas changé. En tant qu'ingénieur forestier diplômé de l'INP-HB, j'ai toujours été convaincu que les solutions durables naissent à l'intersection de la science, de la technologie et du savoir-faire local.",
        desc2: "Aujourd'hui, avec une équipe de professionnels dévoués et plus de 150 projets réalisés, nous continuons à innover pour une Afrique plus verte et plus prospère. Chaque projet que nous menons est une brique supplémentaire dans la construction d'un avenir durable.",
        name: "Kouacou Yao Elvis Franklin",
        signature: "Fondateur et Directeur Général",
      },
      members: [],
    },
    production: {
      title: "Sites de Production",
      heroBadge: "DRONEK",
      subtitle: "Actuellement, avec nos moyens, DRONEK a une capacité de production annuelle de plus de 2 000 000 plants. Nous mobilisons nos hubs géospatiaux et centres opérationnels pour assurer la production, le suivi et la qualité de nos plants conformément aux meilleures pratiques durables.",
      sites: [
        {
          name: "Site de Bonoua",
          location: "Bonoua, Côte d'Ivoire",
          desc: "Siège opérationnel coordonnant les missions de cartographie aérienne dans les secteurs agricole, agroforestier et forestier. Centre d'excellence pour la planification stratégique, le traitement des données et le contrôle qualité.",
          image: "/images/nursery.jpg",
          employees: "25+ Experts",
          services: ["Cartographie Aérienne", "Planification Stratégique", "Contrôle Qualité"]
        },
        {
          name: "Site de Yamoussoukro",
          location: "Yamoussoukro, Côte d'Ivoire",
          desc: "Installation géospatiale avancée spécialisée en cartographie par drone, génération d'orthomosaïques, analyse végétale (NDVI), levés topographiques et modélisation 3D pour secteurs agricoles et industriels.",
          image: "/images/project-forest.jpg",
          employees: "15+ Spécialistes",
          services: ["Analyse NDVI", "Levés Topographiques", "Modélisation 3D"]
        },
        {
          name: "Site de San Pédro",
          location: "San Pédro, Côte d'Ivoire",
          desc: "Centre d'excellence littoral spécialisé dans la surveillance maritime, la cartographie des zones humides et la gestion durable des plantations de cacao. Un hub stratégique pour le développement agro-industriel du Sud-Ouest ivoirien.",
          image: "/images/nursery.jpg",
          employees: "12+ Spécialistes",
          services: ["Surveillance Maritime", "Cartographie Humide", "Cultures Pérennes"]
        },
      ],
    },
    contact: {
      title: "Contactez-Nous",
      subtitle: "Nous sommes à votre écoute pour discuter de votre projet",
      address: "Abidjan Cocody 216 Logements - 15 BP 116 Abidjan 15",
      phone: "+225 07 07 73 22 64 / +225 27 21 51 41 49",
      email: "contact@dronek.ci",
      schedule: "Lun - Ven : 8h00 - 16h00",
      formTitle: "Envoyez-nous un Message",
      name: "Nom complet",
      firstName: "Prénom",
      lastName: "Nom",
      emailField: "Email",
      phoneField: "Téléphone",
      subject: "Sujet",
      subjects: {
        select: "Sélectionnez un sujet",
        quote: "Demande de devis",
        info: "Demande d'information",
        partnership: "Proposition de partenariat",
        training: "Inscription formation",
        other: "Autre",
      },
      message: "Votre message",
      send: "Envoyer",
      sending: "Envoi en cours...",
      success: "Message envoyé avec succès ! Nous vous répondrons sous 24h.",
      quoteTitle: "Contact",
      quoteDesc: "Contactez-nous pour discuter de votre projet",
      appointmentTitle: "Prendre Rendez-vous",
      appointmentDesc: "Réservez un créneau pour une consultation avec nos experts",
      dateField: "Date souhaitée",
      timeField: "Heure",
      description: "Description brève de votre besoin",
      book: "Prendre Rendez-vous",
      heroBadge: "DRONEK",
      heroSubtitle: "Contactez-nous pour toute question ou demande de renseignements.",
    },
    testimonials: {
      title: "Ce que disent nos clients",
      items: [
        {
          text: "DRONEK a réalisé pour notre coopérative une cartographie par drone exceptionnelle. La précision des données nous a permis d'optimiser notre plan de gestion forestière. Un partenaire fiable et professionnel.",
          name: "M. Koné Ibrahim",
          role: "Directeur, Coopérative Agricole de Daloa",
        },
        {
          text: "La formation en bonnes pratiques agricoles dispensée par DRONEK a transformé notre façon de cultiver. Nos rendements ont augmenté de 35% en une seule saison. Je recommande vivement leurs services.",
          name: "Mme Bamba Aminata",
          role: "Présidente, Union des Coopératives de Soubré",
        },
        {
          text: "L'expertise technique de DRONEK dans le domaine du carbone forestier est remarquable. Leur contribution à notre projet REDD+ a été déterminante pour l'obtention de la certification.",
          name: "Dr. Ouattara Seydou",
          role: "Coordonnateur, Projet REDD+ Grabo",
        },
      ],
    },
    cta: {
      title: "Besoin d'une Solution Sur Mesure ?",
      desc: "Contactez nos experts pour discuter de votre projet",
      button: "Contact",
    },
    footer: {
      desc: "Nous partageons avec nos collaborateurs des valeurs d'honnêteté, de confiance et d'équité. Notre amour de la nature et notre respect de l'environnement guident notre travail au quotidien sur le terrain et dans nos bureaux.",
      quickLinks: "Liens rapides",
      contactUs: "Nous contacter",
      followUs: "Suivez-nous",
      copyright: "Tous droits réservés © 2026 DRONEK",
      ticker: "Précision - Innovation - Sécurité - Efficacité - Précision - Innovation - Sécurité -",
      email: "Email",
      phone: "Téléphone",
    },
    cookie: {
      title: "Nous utilisons des cookies",
      desc: "Nous utilisons des cookies pour améliorer votre expérience de navigation, analyser le trafic du site et personnaliser le contenu. En continuant à naviguer, vous acceptez notre utilisation des cookies.",
      accept: "Accepter tout",
      reject: "Refuser tout",
      learnMore: "Gérer les préférences",
      secure: "Vos données sont protégées",
      close: "Fermer",
      alwaysOn: "Toujours actif",
      savePreferences: "Enregistrer",
      policyNote: "En cliquant sur « Accepter tout », vous consentez à l'utilisation de tous les cookies. Vous pouvez modifier vos préférences à tout moment depuis les paramètres de votre navigateur.",
      prefNecessary: "Cookies indispensables",
      prefNecessaryDesc: "Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés. Ils permettent notamment la navigation entre les pages et l'accès aux fonctionnalités sécurisées.",
      prefAnalytics: "Cookies analytiques",
      prefAnalyticsDesc: "Ces cookies nous permettent de collecter des données anonymisées sur la façon dont les visiteurs utilisent le site. Ils nous aident à comprendre le trafic et à améliorer nos services.",
      prefPersonalization: "Cookies de personnalisation",
      prefPersonalizationDesc: "Ces cookies permettent au site de mémoriser vos choix linguistiques et vos préférences pour offrir une expérience personnalisée lors de vos prochaines visites.",
      prefMarketing: "Cookies marketing",
      prefMarketingDesc: "Ces cookies sont utilisés pour suivre les visiteurs sur notre site afin d'afficher des publicités pertinentes et de mesurer l'efficacité de nos campagnes promotionnelles.",
    },
    admin: {
      dashboard: "Tableau de Bord",
      subtitle: "Gérez le contenu de votre plateforme",
      add: "Ajouter",
      logout: "Déconnexion",
      searchPlaceholder: "Rechercher un {tab}...",
      table: {
        item: "Élément",
        category: "Catégorie",
        status: "Statut",
        date: "Date",
        actions: "Actions",
        published: "Publié",
        draft: "Brouillon",
        noData: "Aucune donnée disponible",
        loading: "Chargement...",
      },
      tabs: {
        all: "Tous",
        services: "Services",
        projects: "Projets",
        news: "Actualités",
        team: "Équipe",
        contacts: "Contacts",
        production_sites: "Sites de Production",
        media: "Média",
        mediatheque: "Médiathèque",
      },
      actions: {
        edit: "Modifier",
        delete: "Supprimer",
        view: "Voir",
        confirmDelete: "Voulez-vous vraiment supprimer \"{title}\" ?",
        deleteError: "Erreur lors de la suppression.",
      },
      editor: {
        back: "Retour",
        save: "Enregistrer",
        saving: "Sauvegarde...",
        success: "Enregistré avec succès",
        error: "Erreur lors de l'enregistrement",
        requiredFields: "Champs obligatoires manquants",
        spaces: {
          projet: "Espace Projet",
          actualite: "Espace Actualités",
          membre: "Espace Membres",
          contact: "Espace Contact",
          service: "Espace Service",
          production_site: "Espace Site",
          media: "Espace Média",
          mediatheque: "Espace Médiathèque",
        },
        fields: {
          title: "Titre",
          name: "Nom complet",
          category: "Secteur",
          description: "Description courte",
          content: "Contenu / Description",
          image: "Image principale",
          location: "Localisation",
          year: "Année",
          role: "Poste / Responsabilité",
          bio: "Biographie",
          email: "E-mail",
          phone: "Téléphone",
          isFeatured: "Projet Phare",
          isMainService: "Service Principal",
          mainServiceHint: "Afficher sur la page d'accueil",
          pdf: "Fiche technique (PDF)",
          objectives: "Objectifs",
          impacts: "Résultats & Impacts",
          detailTitle: "Titre Détail",
          detailShortDesc: "Description Gauche",
          detailLongDesc: "Description Longue",
          buttonText: "Texte du Bouton",
          facebook: "Lien Facebook",
          linkedin: "Lien LinkedIn",
        }
      },
      login: {
        title: "Espace Administration",
        email: "Adresse E-mail",
        password: "Mot de passe",
        forgot: "Mot de passe oublié ?",
        back: "Retour au site public",
        submit: "Se connecter",
        loading: "Identification...",
        notice: "Accès réservé au personnel autorisé uniquement.",
        errorTitle: "Oups...",
        errorDesc: "Login ou mot de passe incorrect",
      }
    },
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      projects: "Projects",
      news: "News",
      blog: "News",
      about: "About",
      team: "Team",
      production: "Production Sites",
      contact: "Contact",
      admin: "Admin",
      latestPosts: "Latest posts",
      mediaLibrary: "Our media library",
    },
    hero: {
      title: "Innovative Technologies for Sustainable Forest and Agriculture Management",
      subtitle: "DRONEK - Expert in drone mapping, sustainable forestry and agroforestry",
      cta1: "Contact",
      cta2: "Our Services",
      stat1: "Years of Expertise",
      stat2: "Completed Projects",
      stat3: "Partners",
      stat4: "Activity Sectors",
    },
    services: {
      title: "Our Areas of Expertise",
      subtitle: "Innovative solutions for sustainable development",
      forestry: {
        name: "Forestry",
        desc: "Forest inventory, management, reforestation, biomass and carbon",
        fullDesc:
          "Our team of forestry engineers supports you in all your sustainable forest resource management projects. We use cutting-edge technologies for accurate and reliable results.",
        items: [
          { title: "Forestry training", desc: "Training in forestry professions (nurserymen, silviculturists, forest managers)", image: "/images/hero-forest.jpg", pdfUrl: "/docs/formation_forestiere.pdf" },
          { title: "Market nurseries", desc: "Production of market garden plants through the establishment of nurseries", image: "/images/project-forest.jpg", pdfUrl: "/docs/pepinieres_maraicheres.pdf" },
          { title: "Wildlife inventory", desc: "Forest and wildlife inventory", image: "/images/hero-tech.jpg", pdfUrl: "/docs/inventaire_faunique.pdf" },
          { title: "Reforestation monitoring", desc: "Reforestation monitoring", image: "/images/drone-work.jpg", pdfUrl: "/docs/suivi_reboisement.pdf" },
          { title: "Compost production", desc: "Compost production", image: "/images/hero-forest.jpg", pdfUrl: "/docs/production_compost.pdf" },
          { title: "Remote sensing", desc: "Remote sensing and forest mapping", image: "/images/project-forest.jpg", pdfUrl: "/docs/teledetection_forestiere.pdf" },
          { title: "Fruit plants", desc: "Production of forest and fruit plants", image: "/images/hero-tech.jpg", pdfUrl: "/docs/plantes_fruitieres.pdf" },
          { title: "Forest management", desc: "Capacity building of actors on forest management", image: "/images/drone-work.jpg", pdfUrl: "/docs/gestion_forets.pdf" },
        ],
        benefits: ["Recognized local expertise", "Cutting-edge technologies", "Certified results", "Personalized support"],
      },
      drone: {
        name: "Drone AND Mapping",
        desc: "Mapping, orthomosaic, land use, remote sensing",
        fullDesc:
          "Thanks to our fleet of latest-generation drones and our expertise in geomatics, we produce high-precision cartographic data for your land use planning projects.",
        items: [
          { title: "TOPOGRAPHY.", desc: "Aerial topographic surveys, digital terrain models, contour lines, centimeter precision", image: "/images/hero-drone.jpg", pdfUrl: "/docs/topographie.pdf" },
          { title: "MODELING.", desc: "3D modeling by photogrammetry, LiDAR point clouds, high resolution orthophotos, digital models", image: "/images/project-carbon.jpg", pdfUrl: "/docs/modelisation.pdf" },
          { title: "INSPECTION.", desc: "Safe structure inspection, structural anomaly detection, detailed photographic report, recommendations", image: "/images/drone-work.jpg", pdfUrl: "/docs/inspection.pdf" },
          { title: "MONITORING.", desc: "BIM construction monitoring, volume measurement, progress control, photographic documentation", image: "/images/hero-tech.jpg", pdfUrl: "/docs/suivi_chantier.pdf" },
        ],
        benefits: ["High resolution", "Fast execution", "Georeferenced data", "Detailed reports"],
      },
      agroforestry: {
        name: "Agroforestry",
        desc: "Training, agroforestry plants, sustainable practices",
        fullDesc:
          "We promote integrated agroforestry systems that combine agricultural production and tree conservation, contributing to food security and environmental preservation.",
        items: [
          { title: "Training and awareness", desc: "Training programs on sustainable agricultural practices and agroforestry", pdfUrl: "/docs/agroforesterie_formation.pdf" },
          { title: "Production of plants", desc: "Production and transport of premium agroforestry plants", pdfUrl: "/docs/agroforesterie_plants.pdf" },
        ],
        benefits: ["Sustainable systems", "Capacity building", "Certified plants", "Technical support"],
      },
      agriculture: {
        name: "Agriculture",
        desc: "Audit, cooperative training, best practices, diversification",
        fullDesc:
          "Our team of agricultural economists supports farming cooperatives in adopting best agricultural practices to sustainably improve their yields and incomes.",
        items: [
          { title: "Agroeconomics", desc: "Audit, capacity building and advice in agroeconomics", image: "/images/hero-agriculture.jpg", pdfUrl: "/docs/agroeconomie.pdf" },
          { title: "Diversification", desc: "Support for the diversification of agricultural activities", image: "/images/cocoa-agroforestry.jpg", pdfUrl: "/docs/diversification_agricole.pdf" },
          { title: "Livestock", desc: "Training on livestock techniques", image: "/images/nursery-detail.jpg", pdfUrl: "/docs/techniques_elevage.pdf" },
          { title: "Agri practices", desc: "Training of producers on Good Agricultural Practices (GAP)", image: "/images/about-agriculture.jpg", pdfUrl: "/docs/bonnes_pratiques_agricoles.pdf" },
          { title: "Development", desc: "Development of perimeters", image: "/images/hero-agriculture.jpg", pdfUrl: "/docs/amenagement_perimetres.pdf" },
          { title: "Land use", desc: "Land use mapping", image: "/images/cocoa-agroforestry.jpg", pdfUrl: "/docs/occupation_sol.pdf" },
          { title: "Biomass", desc: "Biomass estimation", image: "/images/nursery-detail.jpg", pdfUrl: "/docs/estimation_biomasse.pdf" },
          { title: "Fertilization", desc: "Aerial nitrogen fertilization", image: "/images/about-agriculture.jpg", pdfUrl: "/docs/fertilisation_aerienne.pdf" },
          { title: "Marketing", desc: "Support for product marketing", image: "/images/hero-agriculture.jpg", pdfUrl: "/docs/commercialisation_produits.pdf" },
        ],
        benefits: ["Yield increase", "Diversification", "Practical training", "Continuous support"],
      },
      surveillance: {
        name: "Agroforestry",
        desc: "Sustainable agroforestry systems, technical advice, crop diversification",
        fullDesc:
          "We support producers in setting up sustainable agroforestry systems, combining agricultural productivity and environmental preservation.",
        items: [
          { title: "ADVICE.", desc: "Technical support for setting up agroforestry plots, species choice, planting densities", image: "/images/cocoa-agroforestry.jpg", pdfUrl: "/docs/conseil_agroforesterie.pdf" },
          { title: "PLANTS.", desc: "Supply of selected forest and fruit trees for association with perennial crops", image: "/images/nursery-detail.jpg", pdfUrl: "/docs/plants_agroforesterie.pdf" },
          { title: "TRAINING.", desc: "Practical training sessions on tree maintenance and pruning techniques in agricultural settings", image: "/images/project-training.jpg", pdfUrl: "/docs/formation_agroforesterie.pdf" },
          { title: "MONITORING.", desc: "Multi-year tree development monitoring and assessment of impact on agricultural yields", image: "/images/about-forest.jpg", pdfUrl: "/docs/suivi_agroforesterie.pdf" },
        ],
        benefits: ["Sustainable yields", "Income diversification", "Soil preservation", "Favorable microclimate"],
      },
      learnMore: "Learn more",
      downloadSheet: "Technical Sheets (PDF)",
      requestQuote: "Contact",
      consultationTitle: "Leave us a message",
      consultationSubtitle: "Let's talk about your project and how we can support you.",
      placeholders: {
        nom: "Last Name",
        prenom: "First Name",
        email: "Email",
        message: "Message",
      },
      sending: "Sending...",
      send: "Send",
      success: "Your request has been sent successfully.",
      error: "Sending failed. Please try again.",
      bannerDesc: {
        title: "Our Services",
        content: "In each of these activities, DRONEK offers a range of services to provide efficient and high-performance solutions."
      }
    },
    projects: {
      title: "Our Flagship Projects",
      subtitle: "Discover our achievements across Côte d'Ivoire",
      heroTitle: "Our Projects & Achievements",
      heroDesc: "Throughout our existence, DRONEK has participated in countless projects across the entire territory and with partners from all backgrounds. Dive into our history through our achievements.",
      learnMore: "Learn more",
      yearLabel: "Year",
      locationLabel: "Location",
      objectivesLabel: "Project Objectives",
      impactsLabel: "Results & Impacts",
      aboutTitle: "About",
      aboutText: "DRONEK supports you in your technological innovation projects related to agriculture. Our technology significantly lightens fieldwork by eliminating sampling and manual data collection, which can be a long-term task.\n\nWe use technology in the practice of agroforestry by using drones for information collection related to the implementation of state-of-the-art agroforestry systems.",
      close: "Close",
      all: "All",
      forestry: "Forestry",
      agriculture: "Agriculture",
      drone: "Drone AND Mapping",
      agroforestry: "Agroforestry",
      byYear: "By Year",
      viewProject: "View project",
      caseStudy: "Case Study",
      year: "Year",
      location: "Location",
      sector: "Sector",
      items: [
        {
          title: "Forest Inventory of Taï National Park",
          desc: "Complete mapping of 5000 hectares of primary forest with identification of over 300 plant species. Project carried out in collaboration with OIPR.",
          location: "Taï National Park",
          year: "2023",
          sector: "forestry",
          image: "project-forest.jpg",
          fullContent: "This ambitious project involved a complete forest inventory of Taï National Park, a UNESCO World Heritage Site. Over 5000 hectares, our team identified and mapped over 300 plant species, assessed forest biomass and carbon stocks. The collected data enabled the development of a sustainable management plan for the coming decades.",
        },
        {
          title: "Training of Southwest Cocoa Cooperatives",
          desc: "Training program for 200 farmers in best practices for sustainable cocoa cultivation and agroforestry.",
          location: "Soubgré, San Pedro",
          year: "2023",
          sector: "agriculture",
          image: "project-training.jpg",
          fullContent: "DRONEK implemented a comprehensive training program for cocoa cooperatives in southwestern Côte d'Ivoire. Over 200 farmers were trained in sustainable cocoa cultivation techniques, including agroforestry practices, integrated pest management and sustainable certification. This program led to an average 30% increase in yields.",
        },
        {
          title: "Drone Mapping for REDD+ Project",
          desc: "Drone mapping of 10000 hectares for the REDD+ project in the Sub-prefecture of Grabo.",
          location: "Grabo, Tabou",
          year: "2022",
          sector: "drone",
          image: "project-carbon.jpg",
          fullContent: "As part of the REDD+ project (Reducing Emissions from Deforestation and Forest Degradation), DRONEK carried out high-resolution drone mapping of 10000 hectares in the Grabo region. This mapping established a carbon stock baseline and monitored forest cover evolution with centimeter precision.",
        },
        {
          title: "Reforestation of Lamto Reserve",
          desc: "Planting of 50000 trees on 200 degraded hectares with adapted local species.",
          location: "Lamto, Tiassalé",
          year: "2022",
          sector: "forestry",
          image: "hero-forest.jpg",
          fullContent: "DRONEK coordinated an ambitious reforestation program in the Lamto Reserve, affected by degradation. A total of 50000 trees of 15 local species were planted on 200 hectares. The project includes drone monitoring every 6 months to assess plant survival and growth, with a success rate exceeding 85%.",
        },
        {
          title: "Agricultural Audit of Yamoussoukro Cooperatives",
          desc: "Complete diagnosis of 15 agricultural cooperatives with personalized improvement plan.",
          location: "Yamoussoukro",
          year: "2023",
          sector: "agriculture",
          image: "hero-agriculture.jpg",
          fullContent: "DRONEK conducted an in-depth audit of 15 agricultural cooperatives in the Yamoussoukro region. The audit covered technical, economic and environmental aspects of the farms. Each cooperative received a detailed report with personalized recommendations to improve productivity and sustainability.",
        },
        {
          title: "Abidjan Agroforestry Nursery",
          desc: "Establishment of a 5-hectare nursery with annual production capacity of 100000 plants.",
          location: "Abidjan, Cocody",
          year: "2021",
          sector: "agroforestry",
          image: "nursery.jpg",
          fullContent: "DRONEK created a modern agroforestry nursery in Abidjan, with a capacity of 100000 plants per year. The nursery produces local forest and agroforestry species adapted to different soil types and climates of Côte d'Ivoire. A drip irrigation system and greenhouses enable quality production year-round.",
        },
      ],
    },
    blog: {
      title: "Our News",
      subtitle: "News, tips and insights on forestry and sustainable agriculture",
      readMore: "Read more",
      categories: "Categories",
      tags: "Tags",
      recentPosts: "Recent Posts",
      all: "All",
      newsGrid: [
        {
          title: "Service and training centers in villages",
          desc: "We offer free training and make our services accessible to village communities to promote their development.",
          image: "/images/project-training.jpg"
        },
        {
          title: "Reduction of polluting agents",
          desc: "Our drone solutions in the agricultural sector allow for more efficient and precise field treatment, thus avoiding excessive use of harmful pesticides.",
          image: "/images/hero-agriculture.jpg"
        },
        {
          title: "Decrease in risky human interventions",
          desc: "Our drone solutions in the agricultural and industrial sectors enable more efficient and precise interventions, reducing human actions in risky areas.",
          image: "/images/drone-work.jpg"
        },
        {
          title: "Mapping and forest inventory",
          desc: "Thanks to our drones, we carry out precise forest inventories for the sustainable management of natural resources in Côte d'Ivoire.",
          image: "/images/hero-forest.jpg"
        },
        {
          title: "Plant production in nursery",
          desc: "Our nurseries produce quality forest and agroforestry plants to support reforestation and agroforestry programs.",
          image: "/images/nursery-detail.jpg"
        },
        {
          title: "Remote sensing and image processing",
          desc: "We use advanced remote sensing technologies to produce accurate land use maps and orthomosaics.",
          image: "/images/project-carbon.jpg"
        }
      ],
      articles: [
        {
          title: "The importance of drone mapping in forest management",
          excerpt: "Discover how drones are revolutionizing forest inventory and enabling more precise and sustainable management of our natural resources.",
          date: "January 15, 2024",
          category: "Technology",
          tags: ["drone", "mapping", "forestry"],
          content: "Drone mapping represents a major advance in forest management. Unlike traditional methods that require months of fieldwork, drones can map hundreds of hectares in just a few days. This technology offers centimeter resolution, allowing individual trees to be identified, their health assessed and biomass calculated with unprecedented precision. At DRONEK, we use drones equipped with multispectral and LiDAR sensors to produce data that feeds geographic information systems (GIS) and guides forest management decisions.",
        },
        {
          title: "Agroforestry: combining agriculture and conservation",
          excerpt: "Agroforestry offers a viable solution to reconcile agricultural production and environmental preservation in Côte d'Ivoire.",
          date: "December 28, 2023",
          category: "Agroforestry",
          tags: ["agroforestry", "agriculture", "sustainable"],
          content: "Agroforestry is an approach that involves integrating trees into agricultural production systems. In Côte d'Ivoire, this practice offers numerous advantages: improved soil fertility, reduced erosion, carbon sequestration and income diversification for farmers. DRONEK supports producers in implementing agroforestry systems adapted to their local contexts, with tree species carefully selected for their ecosystem services.",
        },
        {
          title: "Complete guide to forest carbon stock calculation",
          excerpt: "Understanding carbon stock calculation methodologies and their importance for REDD+ projects and carbon credits.",
          date: "November 10, 2023",
          category: "Environment",
          tags: ["carbon", "REDD+", "environment"],
          content: "Calculating forest carbon stock is an essential step in evaluating the contribution of forests to combating climate change. Methodologies rely on in situ measurements combined with remote sensing data. DRONEK uses allometric equations adapted to African tropical species to estimate above-ground and below-ground tree biomass. This data is crucial for REDD+ projects and carbon credit certification.",
        },
        {
          title: "Agricultural training: investing in human capital",
          excerpt: "Why training farmers is the key to adopting sustainable practices and improving yields.",
          date: "October 5, 2023",
          category: "Training",
          tags: ["training", "agriculture", "cooperatives"],
          content: "Agricultural training is a strategic investment for rural development. At DRONEK, we believe that skills transfer is the driver of sustainable change. Our training programs cover best agricultural practices, financial management of cooperatives and soil conservation techniques. The results are tangible: trained farmers see their yields increase by an average of 25 to 40% within two years of training.",
        },
        {
          title: "Trends in sustainable forestry in West Africa",
          excerpt: "An overview of innovations and policies shaping the future of forest management in West Africa.",
          date: "September 20, 2023",
          category: "Forestry",
          tags: ["forestry", "Africa", "policy"],
          content: "West Africa is experiencing rapid evolution in sustainable forestry. Governments are adopting stricter policy frameworks, remote sensing technologies are becoming more accessible and local communities are increasingly involved in resource management. DRONEK is at the forefront of this transformation, providing innovative technological solutions that address the specific challenges of the region.",
        },
      ],
    },
    actualite: {
      title: "News",
      loading: "Loading...",
      empty: "No news has been published yet.",
      subtitle: "Official posts published from the admin area appear here in a vertical feed."
    },
    training: {
      title: "Our Training Catalog",
      subtitle: "Develop your skills with our specialized training programs",
      register: "Register",
      modules: [
        {
          title: "Best Agricultural Practices",
          desc: "Master modern sustainable agriculture techniques to optimize your yields while preserving the environment. This module covers soil management, integrated pest control, irrigation and post-harvest.",
          duration: "5 days",
          level: "Beginner",
          topics: ["Sustainable soil management", "Integrated pest control", "Irrigation techniques", "Post-harvest conservation"],
        },
        {
          title: "Drone Mapping",
          desc: "Learn to use drones for professional mapping. From flight planning to data processing, this module trains you in essential photogrammetry skills.",
          duration: "7 days",
          level: "Intermediate",
          topics: ["Flight planning", "Photogrammetry", "Image processing", "GIS and mapping"],
        },
        {
          title: "Sustainable Forest Management",
          desc: "Deepen your knowledge in forest management, inventory and monitoring of forest ecosystems. This module combines theory and fieldwork for comprehensive training.",
          duration: "10 days",
          level: "Advanced",
          topics: ["Forest inventory", "Management planning", "Biomass and carbon", "Ecological monitoring"],
        },
        {
          title: "Practical Agroforestry",
          desc: "Discover how to design and implement high-performance agroforestry systems. This module includes field visits and practical nursery work.",
          duration: "5 days",
          level: "Beginner",
          topics: ["System design", "Species selection", "Nursery management", "Economic analysis"],
        },
      ],
      newsletter: {
        title: "Stay Informed",
        subtitle: "Subscribe to our newsletter to receive our latest news and training offers",
        placeholder: "Your email address",
        button: "Subscribe",
      },
      faq: {
        title: "Frequently Asked Questions",
        items: [
          {
            q: "How do I register for a training?",
            a: "You can register online via the form on our website, by email at contact@dronek.ci, or by phone at +225 07 07 73 22 64 / +225 27 21 51 41 49. An advisor will contact you to finalize your registration.",
          },
          {
            q: "Are the trainings certified?",
            a: "Yes, all our trainings are certified. At the end of each module, you will receive a training certificate recognized by professional institutions in the sector.",
          },
          {
            q: "Is financing available?",
            a: "DRONEK offers payment facilities and can direct you to financing organizations for cooperatives and professional organizations. Contact us for more information.",
          },
          {
            q: "Do trainings take place on-site or online?",
            a: "Our trainings combine on-site sessions at our training centers and online modules for theory. Practical work takes place exclusively in the field.",
          },
          {
            q: "What is the maximum number of participants per session?",
            a: "Our sessions are limited to 20 participants to ensure personalized follow-up and optimal learning quality. Drone trainings are limited to 10 participants.",
          },
        ],
      },
    },
    team: {
      title: "Our Team",
      heroBadge: "Our Team",
      heroTitle: "DRONEK Experts",
      subtitle: "A team of passionate experts dedicated to sustainable development",
      founderWord: {
        title: "Founder's Message",
        quote: "Putting technology at the service of nature and communities.",
        desc1: "Since the creation of DRONEK in 2017, our vision has not changed. As a forest engineer graduated from INP-HB, I have always believed that sustainable solutions arise at the intersection of science, technology and local know-how.",
        desc2: "Today, with a team of dedicated professionals and over 150 completed projects, we continue to innovate for a greener and more prosperous Africa. Every project we carry out is another building block in constructing a sustainable future.",
        name: "Kouacou Yao Elvis Franklin",
        signature: "Founder and CEO",
      },
      members: [],
    },
    production: {
      title: "Production Sites",
      heroBadge: "DRONEK",
      subtitle: "Currently, with our resources, DRONEK has an annual production capacity of over 2,000,000 plants. We leverage our geospatial hubs and operational centers to manage production, monitoring and quality control using sustainable best practices.",
      sites: [
        {
          name: "Bonoua Site",
          location: "Bonoua, Côte d'Ivoire",
          desc: "Operational headquarters coordinating aerial mapping missions in agricultural, agroforestry and forestry sectors. A center of excellence for strategic planning, data processing and quality control.",
          image: "/images/nursery.jpg",
          employees: "25+ Experts",
          services: ["Aerial Mapping", "Strategic Planning", "Quality Control"]
        },
        {
          name: "Yamoussoukro Site",
          location: "Yamoussoukro, Côte d'Ivoire",
          desc: "Advanced geospatial facility specialized in drone mapping, orthomosaic generation, vegetation analysis (NDVI), topographic surveys and 3D modeling for agricultural and industrial sectors.",
          image: "/images/project-forest.jpg",
          employees: "15+ Specialists",
          services: ["NDVI Analysis", "Topographic Surveys", "3D Modeling"]
        },
        {
          name: "San Pedro Site",
          location: "San Pedro, Côte d'Ivoire",
          desc: "Coastal excellence center specialized in maritime surveillance, wetlands mapping, and sustainable cocoa plantation management. A strategic hub for agro-industrial development in Southwestern Côte d'Ivoire.",
          image: "/images/nursery.jpg",
          employees: "12+ Specialists",
          services: ["Maritime Surveillance", "Wetlands Mapping", "Perennial Crops"]
        },
      ],
    },
    contact: {
      title: "Contact Us",
      subtitle: "We are here to discuss your project",
      address: "Abidjan Cocody 216 Logements - 15 BP 116 Abidjan 15",
      phone: "+225 07 07 73 22 64 / +225 27 21 51 41 49",
      email: "contact@dronek.ci",
      schedule: "Mon - Fri : 8:00 AM - 4:00 PM",
      formTitle: "Send Us a Message",
      name: "Full name",
      firstName: "First Name",
      lastName: "Last Name",
      emailField: "Email",
      phoneField: "Phone",
      subject: "Subject",
      subjects: {
        select: "Select a subject",
        quote: "Request a quote",
        info: "Request for information",
        partnership: "Partnership proposal",
        training: "Training registration",
        other: "Other",
      },
      message: "Your message",
      send: "Send",
      sending: "Sending...",
      success: "Message sent successfully! We will respond within 24 hours.",
      quoteTitle: "Contact",
      quoteDesc: "Contact us to discuss your project",
      appointmentTitle: "Book an Appointment",
      appointmentDesc: "Reserve a slot for a consultation with our experts",
      dateField: "Preferred date",
      timeField: "Time",
      description: "Brief description of your need",
      book: "Book Appointment",
      heroBadge: "DRONEK",
      heroSubtitle: "Contact us for any questions or inquiries.",
    },
    admin: {
      dashboard: "Dashboard",
      subtitle: "Manage your platform content",
      add: "Add",
      logout: "Logout",
      searchPlaceholder: "Search for a {tab}...",
      table: {
        item: "Item",
        category: "Category",
        status: "Status",
        date: "Date",
        actions: "Actions",
        published: "Published",
        draft: "Draft",
        noData: "No data available",
        loading: "Loading...",
      },
      tabs: {
        all: "All",
        services: "Services",
        projects: "Projects",
        news: "News",
        team: "Team",
        contacts: "Contacts",
        production_sites: "Production Sites",
        media: "Media",
        mediatheque: "Gallery",
      },
      actions: {
        edit: "Edit",
        delete: "Delete",
        view: "View",
        confirmDelete: "Are you sure you want to delete \"{title}\"?",
        deleteError: "Error during deletion.",
      },
      editor: {
        back: "Back",
        save: "Save",
        saving: "Saving...",
        success: "Saved successfully",
        error: "Error while saving",
        requiredFields: "Missing required fields",
        spaces: {
          projet: "Project Space",
          actualite: "News Space",
          membre: "Members Space",
          contact: "Contact Space",
          service: "Service Space",
          production_site: "Site Space",
          media: "Media Space",
          mediatheque: "Gallery Space",
        },
        fields: {
          title: "Title",
          name: "Full Name",
          category: "Sector",
          description: "Short Description",
          content: "Content / Description",
          image: "Main Image",
          location: "Location",
          year: "Year",
          role: "Position / Responsibility",
          bio: "Biography",
          email: "Email",
          phone: "Phone",
          isFeatured: "Featured Project",
          isMainService: "Main Service",
          mainServiceHint: "Display on home page",
          pdf: "Technical Sheet (PDF)",
          objectives: "Objectives",
          impacts: "Results & Impacts",
          detailTitle: "Detail Title",
          detailShortDesc: "Left Description",
          detailLongDesc: "Long Description",
          buttonText: "Button Text",
          facebook: "Facebook Link",
          linkedin: "LinkedIn Link",
        }
      },
      login: {
        title: "Administration Area",
        email: "Email Address",
        password: "Password",
        forgot: "Forgot password?",
        back: "Back to site",
        submit: "Login",
        loading: "Identifying...",
        notice: "Access restricted to authorized personnel only.",
        errorTitle: "Oops...",
        errorDesc: "Incorrect login or password",
      }
    },
    testimonials: {
      title: "What Our Clients Say",
      items: [
        {
          text: "DRONEK delivered an exceptional drone mapping for our cooperative. The precision of the data allowed us to optimize our forest management plan. A reliable and professional partner.",
          name: "Mr. Koné Ibrahim",
          role: "Director, Agricultural Cooperative of Daloa",
        },
        {
          text: "The best agricultural practices training provided by DRONEK transformed our farming approach. Our yields increased by 35% in a single season. I highly recommend their services.",
          name: "Ms. Bamba Aminata",
          role: "President, Union of Cooperatives of Soubré",
        },
        {
          text: "DRONEK's technical expertise in forest carbon is remarkable. Their contribution to our REDD+ project was decisive in obtaining certification.",
          name: "Dr. Ouattara Seydou",
          role: "Coordinator, REDD+ Project Grabo",
        },
      ],
    },
    cta: {
      title: "Need a Custom Solution?",
      desc: "Contact our experts to discuss your project",
      button: "Contact",
    },
    footer: {
      desc: "We share with our collaborators values of honesty, trust and fairness. Our love for nature and our respect for the environment guide our daily work in the field and in our offices.",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      followUs: "Follow Us",
      copyright: "All rights reserved © 2026 DRONEK",
      ticker: "Precision - Innovation - Security - Efficiency - Precision - Innovation - Security -",
      email: "Email",
      phone: "Phone",
    },
    cookie: {
      title: "We use cookies",
      desc: "We use cookies to improve your browsing experience, analyze site traffic and personalize content. By continuing to browse, you accept our use of cookies.",
      accept: "Accept all",
      reject: "Reject all",
      learnMore: "Manage preferences",
      secure: "Your data is protected",
      close: "Close",
      alwaysOn: "Always active",
      savePreferences: "Save",
      policyNote: "By clicking \"Accept all\", you consent to the use of all cookies. You can modify your preferences at any time from your browser settings.",
      prefNecessary: "Essential cookies",
      prefNecessaryDesc: "These cookies are necessary for the website to function and cannot be disabled. They enable navigation between pages and access to secure features.",
      prefAnalytics: "Analytics cookies",
      prefAnalyticsDesc: "These cookies allow us to collect anonymized data on how visitors use the site. They help us understand traffic and improve our services.",
      prefPersonalization: "Personalization cookies",
      prefPersonalizationDesc: "These cookies allow the site to remember your language choices and preferences to provide a personalized experience on your next visits.",
      prefMarketing: "Marketing cookies",
      prefMarketingDesc: "These cookies are used to track visitors on our site to display relevant advertisements and measure the effectiveness of our promotional campaigns.",
    },
  },
} as const;

export type Translations = typeof translations.fr;

export function translateProject(project: any, lang: string) {
  if (lang === 'fr' || !project) return project;
  
  const title = (project.title || '').toLowerCase().trim();
  
  if (title.includes('tai') || title.includes('taï')) {
    return {
      ...project,
      title: "Forest Inventory of Taï National Park",
      summary: "Complete mapping of 5000 hectares of primary forest with identification of over 300 plant species. Project carried out in collaboration with OIPR.",
      location: "Taï National Park",
      detail: "This ambitious project involved a complete forest inventory of Taï National Park, a UNESCO World Heritage Site. Over 5000 hectares, our team identified and mapped over 300 plant species, assessed forest biomass and carbon stocks. The collected data enabled the development of a sustainable management plan for the coming decades.",
      objectives: [
        "Identify dominant species and sensitive areas",
        "Produce reference maps for sustainable management",
        "Provide a monitoring baseline for conservation actions"
      ],
      impacts: [
        "Updated view of the park status in the studied areas",
        "Better prioritization of conservation actions",
        "Data directly usable by field teams"
      ]
    };
  }
  if (title.includes('cacao') || title.includes('sud-ouest')) {
    return {
      ...project,
      title: "Training of Southwest Cocoa Cooperatives",
      summary: "Training program for 200 farmers in best practices for sustainable cocoa cultivation and agroforestry.",
      location: "Soubré, San Pedro",
      detail: "DRONEK implemented a comprehensive training program for cocoa cooperatives in southwestern Côte d'Ivoire. Over 200 farmers were trained in sustainable cocoa cultivation techniques, including agroforestry practices, integrated pest management and sustainable certification. This program led to an average 30% increase in yields.",
      objectives: [
        "Professionalization of cultivation and farm management methods",
        "Sustainable optimization of yields through the adoption of innovative technical paths",
        "Integration of resilient agroforestry models in the face of climate challenges"
      ],
      impacts: [
        "Structural transformation of farmers' technical know-how",
        "Measurable adoption of agricultural practices respectful of biodiversity",
        "Consolidation of the value chain through certified local supervision"
      ]
    };
  }
  if (title.includes('redd')) {
    return {
      ...project,
      title: "Drone Mapping for REDD+ Project",
      summary: "Drone mapping of 10000 hectares for the REDD+ project in the Sub-prefecture of Grabo.",
      location: "Grabo, Tabou",
      detail: "As part of the REDD+ project (Reducing Emissions from Deforestation and Forest Degradation), DRONEK carried out high-resolution drone mapping of 10000 hectares in the Grabo region. This mapping established a carbon stock baseline and monitored forest cover evolution with centimeter precision.",
      objectives: [
        "Provide a usable orthomosaic for project management",
        "Measure cover evolutions with precision",
        "Support decisions related to the REDD+ project"
      ],
      impacts: [
        "Precision gain on monitored areas",
        "Deliverables adapted to project team needs",
        "Reduction of field intervention time"
      ]
    };
  }
  if (title.includes('irrigu') || title.includes('irrigation')) {
    return {
      ...project,
      title: "Development of Irrigated Areas in the North",
      summary: "Study and development of irrigation systems for market gardening.",
      location: "Korhogo, Côte d'Ivoire",
      detail: "This project aims to secure agricultural production during the dry season by installing efficient and sustainable irrigation systems.",
      objectives: [
        "Optimize water management",
        "Increase market gardening yields"
      ],
      impacts: [
        "Increase in producers' income",
        "Strengthened food security"
      ]
    };
  }
  if (title.includes('lamto')) {
    return {
      ...project,
      title: "Reforestation of Lamto Reserve",
      summary: "Planting of 50000 trees on 200 degraded hectares with adapted local species.",
      location: "Lamto, Tiassalé",
      detail: "DRONEK coordinated an ambitious reforestation program in the Lamto Reserve, affected by degradation. A total of 50000 trees of 15 local species were planted on 200 hectares. The project includes drone monitoring every 6 months to assess plant survival and growth, with a success rate exceeding 85%.",
      objectives: [
        "Restore the degraded ecosystem",
        "Favor the return of wild fauna"
      ],
      impacts: [
        "50,000 plants put into the ground",
        "Plant survival rate exceeding 90%"
      ]
    };
  }
  if (title.includes('palmeraie') || title.includes('sanitaire')) {
    return {
      ...project,
      title: "Sanitary Monitoring of Palm Groves by Drone",
      summary: "Early detection of diseases and nutritional deficiencies by multispectral imagery.",
      location: "Grand-Lahou",
      detail: "The use of multispectral sensors makes it possible to identify stressed trees before symptoms are visible to the eye.",
      objectives: [
        "Reduce pesticide use",
        "Target interventions precisely"
      ],
      impacts: [
        "Reduction in production losses",
        "Savings on agricultural inputs"
      ]
    };
  }
  if (title.includes('communautaire') || title.includes('pepiniere') && title.includes('adzop')) {
    return {
      ...project,
      title: "Community Agroforestry Nursery",
      summary: "Production of 100,000 fruit and forest plants for smallholders.",
      location: "Adzopé",
      detail: "Establishment of a local nursery to facilitate farmers' access to high-quality plants.",
      objectives: [
        "Democratize agroforestry",
        "Improve farmers' income"
      ],
      impacts: [
        "Empowerment of rural women",
        "Crop diversification"
      ]
    };
  }
  if (title.includes('biomasse') || title.includes('carbone')) {
    return {
      ...project,
      title: "Biomass and Carbon Inventory of the North",
      summary: "Assessment of carbon stocks for carbon offset projects.",
      location: "Ferkessédougou",
      detail: "Precise measurement of aboveground biomass to quantify the potential carbon credits of a protected area.",
      objectives: [
        "Estimate carbon stocks",
        "Support carbon certification"
      ],
      impacts: [
        "Robust scientific data",
        "Access to the carbon market"
      ]
    };
  }
  if (title.includes('audit')) {
    return {
      ...project,
      title: "Agro-Economic Audit of Cooperatives",
      summary: "Financial and technical diagnosis of 10 agricultural cooperatives.",
      location: "Yamoussoukro",
      detail: "Strengthening the governance and operational efficiency of producer organizations.",
      objectives: [
        "Identify growth drivers",
        "Improve financial transparency"
      ],
      impacts: [
        "More resilient cooperatives",
        "Better access to credit"
      ]
    };
  }
  if (title.includes('industriel') || title.includes('topographie')) {
    return {
      ...project,
      title: "Aerial Topography for Industrial Site",
      summary: "High-resolution topographic surveys for industrial site planning.",
      location: "San Pedro",
      detail: "Generation of digital terrain models and contour lines with centimeter accuracy.",
      objectives: [
        "Accelerate field surveys",
        "Provide accurate 3D data"
      ],
      impacts: [
        "Reduction in survey costs",
        "Optimized planning"
      ]
    };
  }
  
  return project;
}

export function translateNews(post: any, lang: string) {
  if (lang === 'fr' || !post) return post;
  const title = (post.title || post.titre || '').toLowerCase().trim();
  
  let translatedTitle = post.title || post.titre;
  let translatedContent = post.content || post.contenu || post.detail;
  let translatedSummary = post.summary || post.resume;
  
  if (title.includes('culture agricole')) {
    translatedTitle = "Agricultural Cultivation";
    translatedContent = "For Dronek, optimizing agricultural cultivation means using aerial tools to eliminate manual sampling. This includes:\n\nMultispectral remote sensing: Specific sensors analyze plant health (chlorophyll, water stress, diseases) directly from the sky.\n\nPlot mapping: Precise identification of soil conditions to know exactly where and how to plant.\n\nInput management: Reducing the use of chemicals by targeting only the diseased areas of the plantation.";
    translatedSummary = "For Dronek, optimizing agricultural cultivation means using aerial tools to eliminate manual sampling...";
  } else if (title.includes('restauration forestière') || title.includes('restauration forestiere')) {
    translatedTitle = "DRONEK at the service of forest restoration";
    translatedContent = "Faced with the climate emergency and the alarming rate of deforestation, DRONEK is committed to setting up quality nurseries, an essential link in the restoration of our forests and agroforests.\n\nOur know-how translates into the construction and management of modern infrastructures for the intensive production of forest plants:\n\n• Metal greenhouses with shade nets: robust, durable and modular, they provide up to 60% shade, thus ensuring optimal protection of young plants against excessive sunlight and extreme weather conditions.\n\n• Increased weather resistance and optimal working comfort for our teams.\n\n• Maximized production capacity, effectively meeting the needs of reforestation and agroforestry projects in Côte d'Ivoire.\n\n• Tailor-made irrigation systems adapted to the specific requirements of each client, for a controlled water supply.\n\n• Possibility of automating watering through the integration of smart sensors, allowing real-time monitoring of humidity and optimal water management.\n\nWe believe that every plant produced is a promise for the future, one step closer to restored forests and sustainable agriculture.";
    translatedSummary = "Faced with the climate emergency and the alarming rate of deforestation, DRONEK is committed to setting up quality nurseries...";
  } else if (title.includes('travail') || title.includes('1er mai')) {
    translatedTitle = "International Workers' Day";
    translatedContent = "On this International Workers' Day, DRONEK wishes to salute the commitment, rigor and passion of all those who work every day to build a better future.\n\nTo our employees, partners and all workers: thank you for your dedication. Happy Labour Day!\n\n#1stMay #LabourDay #DRONEK";
    translatedSummary = "On this International Workers' Day, DRONEK wishes to salute the commitment...";
  } else if (title.includes('planting') || title.includes('abengourou')) {
    translatedTitle = "Tree planting marathon in Abengourou";
    translatedContent = "On August 2, 2023, DRONEK took part in the second edition of the \"Forest Tree Planting Marathon\" operation organized by the General Directorate of the Ministry of Water and Forests in Abengourou.\n\nThis initiative aimed to safeguard the Assamela (Pericopsis Elata), a threatened precious tree species that naturally evolves only in the South-East of Côte d'Ivoire.\n\nIn total, 1,600 Assamela plants were planted and mapped over an area of two hectares by the organizers and their guests.\n\n\"The forest is everyone's business. That is why we are committed to restoring the forest cover,\" said the DRONEK representative.\n\nColonel Guy Charbel Gnago Ni, Regional Director of Water and Forests of Indénié, welcomed this civic commitment: \"Today, the situation is alarming. We must become aware to reverse the trend: plant instead of destroy.\"";
    translatedSummary = "On August 2, 2023, DRONEK took part in the second edition of the Forest Tree Planting Marathon...";
  } else if (title.includes('reforestation') && title.includes('phase 2')) {
    translatedTitle = "Contribution to reforestation - Phase 2";
    translatedContent = "DRONEK has proudly contributed to Phase 2 of the reforestation program of the Café Cacao Council of Côte d'Ivoire.\n\nThis phase was marked by the record production of 1,500,000 shade plants, distributed to coffee-cocoa cooperatives throughout the national territory.\n\nThis achievement demonstrates our ability to produce quality forest plants in large quantities, thanks to:\n• Our modern nursery infrastructure\n• Our qualified nursery team\n• Our rigorous quality management system.\n\nThese plants contribute to the regeneration of cocoa plantations and the preservation of the environment.";
    translatedSummary = "DRONEK has proudly contributed to Phase 2 of the reforestation program of the Café Cacao Council...";
  } else if (title.includes('reforestation') && title.includes('phase 3')) {
    translatedTitle = "Contribution to reforestation - Phase 3";
    translatedContent = "As part of our partnership with the Café Cacao Council of Côte d'Ivoire, DRONEK implemented Phase 3 of the reforestation program.\n\nThis phase enabled the production of 300,000 shade plants for coffee-cocoa cooperatives across the country.\n\nThe plants produced include various forest species adapted to cocoa production areas, thus making it possible to:\n• Improve the quality of plantations\n• Preserve biodiversity\n• Fight against climate change\n• Increase producers' income.\n\nThis contribution is part of the national strategy for reforestation and preservation of Ivorian forest ecosystems.";
    translatedSummary = "As part of our partnership with the Café Cacao Council, DRONEK implemented Phase 3...";
  } else if (title.includes('sara 2023')) {
    translatedTitle = "SARA 2023 - Presentation of Agroforestry";
    translatedContent = "From October 9 to 18, 2023, DRONEK participated in the International Exhibition of Agriculture and Animal Resources (SARA) at the Abidjan Exhibition Center in Port-Bouët.\n\nThis 6th edition of SARA was an opportunity for DRONEK to present its expertise in agroforestry and sustainable agriculture. Our General Manager hosted a conference on the benefits of agroforestry for Ivorian producers.\n\nSARA 2023 welcomed more than 400,000 visitors over 10 days, with:\n• 169 B2B meetings\n• 950 business meetings\n• 80 conferences, workshops and panels\n• 119 institutional visits.\n\nDRONEK thanks all the visitors who came to discover our innovative solutions for sustainable agriculture in Côte d'Ivoire.";
    translatedSummary = "From October 9 to 18, 2023, DRONEK participated in the International Exhibition of Agriculture...";
  } else if (title.includes('pionnier') || title.includes('agriculture durable')) {
    translatedTitle = "Dronek, pioneer of sustainable agriculture in Côte d'Ivoire";
    translatedContent = "Founded by Elvis Kouacou, a visionary agricultural engineer, DRONEK has established itself as a key player in promoting sustainable agricultural practices in Côte d'Ivoire. At the International Agricultural Show (SIA) 2024, DRONEK presented its innovative solutions combining technology and respect for the environment. Our approach combines:\n\n• The use of drones for mapping and crop monitoring\n• Training in good agricultural practices\n• Supporting producers in the transition to sustainable agriculture.\n\n\"Our mission is to show that it is possible to combine productivity and respect for the environment. Agroforestry is a winning solution for producers and the planet,\" explains the founder. DRONEK continues to develop its partnerships with cooperatives and institutions to democratize these practices throughout Côte d'Ivoire.";
    translatedSummary = "Founded by Elvis Kouacou, a visionary agricultural engineer, DRONEK has established itself...";
  } else if (title.includes('campagne') || title.includes('reboisement')) {
    translatedTitle = "REFORESTATION CAMPAIGN";
    translatedContent = "DRONEK launched a major reforestation campaign to restore degraded forests in Côte d'Ivoire. Through drone mapping and multispectral data analysis, we identify priority areas and precisely track the growth of young trees.";
    translatedSummary = "DRONEK launched a major reforestation campaign to restore degraded forests in Côte d'Ivoire.";
  } else if (title.includes('séminaire') || title.includes('seminaire') || title.includes('écologique') || title.includes('ecologique')) {
    translatedTitle = "ECOLOGICAL SEMINAR";
    translatedContent = "Active participation of DRONEK in the national seminar on the preservation of biodiversity. We presented our environmental monitoring solutions by drone, demonstrating the contribution of technology in the fight against deforestation and poaching.";
    translatedSummary = "Active participation of DRONEK in the national seminar on the preservation of biodiversity.";
  } else if (title.includes('innovation')) {
    translatedTitle = "DRONEK INNOVATION";
    translatedContent = "Introduction of new thermal and LiDAR sensors to optimize forest mapping under canopy. This technological innovation allows DRONEK to provide ultra-precise 3D models of forest massifs, facilitating conservation work.";
    translatedSummary = "Introduction of new thermal and LiDAR sensors to optimize forest mapping under canopy.";
  } else if (title.includes('protection') || title.includes('forêts') || title.includes('forets')) {
    translatedTitle = "FOREST PROTECTION";
    translatedContent = "Strengthened collaboration with local authorities for aerial surveillance of classified forests. Our regular drone patrols allow for the rapid detection of fire outbreaks and illegal logging activities.";
    translatedSummary = "Strengthened collaboration with local authorities for aerial surveillance of classified forests.";
  } else if (title.includes('cartographie tai')) {
    translatedTitle = "TAI MAPPING";
    translatedContent = "Launch of the new high-resolution mapping phase of the Taï National Park. This major project will update cartographic data and analyze the impact of climate change on the park's biodiversity.";
    translatedSummary = "Launch of the new high-resolution mapping phase of the Taï National Park.";
  } else if (title.includes('mission') || title.includes('réussie') || title.includes('reussie')) {
    translatedTitle = "SUCCESSFUL MISSION";
    translatedContent = "End of the health assessment mission for coffee-cocoa plantations in the east of the country. Detailed reports and multispectral maps were delivered to partner cooperatives, offering them unprecedented visibility into the health of their crops.";
    translatedSummary = "End of the mission of health evaluation of coffee-cocoa plantations in the East of the country.";
  }
  
  return {
    ...post,
    title: translatedTitle,
    titre: translatedTitle,
    content: translatedContent,
    contenu: translatedContent,
    detail: translatedContent,
    summary: translatedSummary,
    resume: translatedSummary
  };
}
