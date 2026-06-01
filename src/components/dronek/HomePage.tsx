'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  TreePine, Navigation, Sprout, Wheat, Quote, ArrowRight, ArrowDown,
  ShieldCheck, Cpu, Leaf, Star, ChevronDown, ChevronLeft, ChevronRight,
  Award, Users, Briefcase, Layers, Heart, MessageCircle, Share2, X, Link as LinkIcon, ExternalLink,
  Rocket, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from './LanguageProvider';
import { ScrollTitle, ScrollBold } from './ScrollTitle';
import type { PageView } from './Navbar';
import { cn } from '@/lib/utils';
import { partners } from '@/lib/partners';
import Partners from './Partners';
import ContactCTA from './ContactCTA';
import { supabase } from '@/lib/supabase';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

/* ─────── Animation Helpers ─────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 100, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const expertiseSectionVariants = {
  hidden: {
    opacity: 0,
    y: 70,
    scale: 0.985,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      when: 'beforeChildren',
      staggerChildren: 0.14,
      delayChildren: 0.12,
    },
  },
};

const expertiseHeaderVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const expertiseCardVariants = {
  hidden: { opacity: 0, y: 34, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7 },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -150 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 150 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: 'easeOut' } },
};

/* ─────── Animated Counter ─────── */
function AnimatedCounter({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const step = end / (duration / 16);
          let current = 0;
          const timer = setInterval(() => {
            current += step;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, 16);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="tabular-nums">
      {count}{suffix}
    </div>
  );
}



/* ─────── Section Wrapper ─────── */
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.9, staggerChildren: 0.15, ease: [0.22, 1, 0.36, 1] as const },
        },
      }}
      className={cn('py-4 lg:py-6', className)}
    >
      {children}
    </motion.section>
  );
}

/* ─────── Hero Slideshow ─────── */
/* ─────── Hero Slideshow ─────── */
const defaultHeroImages = [
  '/images/hero-forest.jpg',
  '/images/hero-drone.jpg',
  '/images/hero-contact.jpg',
];

/* ─────── Floating Particles ─────── */
function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 6,
      duration: Math.random() * 8 + 8,
    }));
    setParticles(newParticles);
  }, [setParticles]);

  // Avoid hydration mismatch — render nothing on first pass (SSR uses empty array)
  if (particles.length === 0) {
    return <div className="absolute inset-0 overflow-hidden pointer-events-none" />;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white/10"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════ */
const featuredProjectsFallback = [
  {
    title: 'INVENTAIRE FORESTIER DU PARC NATIONAL DE TAI',
    image: '/images/hero-forest.jpg',
    service: 'FORESTERIE',
    desc: 'Cartographie complète et inventaire de la biodiversité dans le Parc National de Taï.',
    location: 'Parc National de Taï',
    year: '2023',
    objectives: [
      'Identifier les essences dominantes et les zones sensibles',
      'Produire des cartes de référence pour la gestion durable',
      'Fournir une base de suivi pour les actions de conservation'
    ],
    impacts: [
      'Vision actualisée de l\'état du parc sur les zones étudiées',
      'Meilleure priorisation des actions de conservation',
      'Données directement exploitables par les équipes terrain'
    ]
  },
  {
    title: 'FORMATION DES COOPÉRATIVES DE CACAO DU SUD-OUEST',
    image: '/images/hero-agriculture.jpg',
    service: 'AGRICULTURE',
    desc: 'Accompagnement et formation des producteurs aux bonnes pratiques agricoles.',
    location: 'Sud-Ouest, CI',
    year: '2023'
  },
  {
    title: 'CARTOGRAPHIE DRONE POUR LE PROJET REDD+',
    image: '/images/hero-drone.jpg',
    service: 'DRONE ET CARTOGRAPHIE',
    desc: 'Suivi de la couverture forestière et mesure de la biomasse par drone.',
    location: 'Région de la Nawa',
    year: '2022'
  },
  {
    title: 'RESTAURATION DES MANGROVES PAR DRONE',
    image: '/images/project-forest.jpg',
    service: 'REBOISEMENT',
    desc: 'Programme innovant de semis aérien pour la restauration des écosystèmes côtiers.',
    location: 'Grand-Lahou',
    year: '2024'
  },
  {
    title: 'SUIVI DES PLANTATIONS DE PALMIERS À HUILE',
    image: '/images/about-agriculture.jpg',
    service: 'AGRICULTURE',
    desc: 'Analyse de santé végétale et optimisation des intrants par imagerie multispectrale.',
    location: 'San-Pédro',
    year: '2023'
  },
  {
    title: 'INVENTAIRE CARBONE ET BIOMASSE',
    image: '/images/project-carbon.jpg',
    service: 'FORESTERIE',
    desc: 'Évaluation précise des stocks de carbone pour la certification de projets de compensation.',
    location: 'Forêt Classée du Haut-Sassandra',
    year: '2024'
  },
  {
    title: 'SURVEILLANCE DES ZONES PROTÉGÉES',
    image: '/images/hero-agroforestry.jpg',
    service: 'SURVEILLANCE & SÉCURITÉ',
    desc: 'Détection précoce des feux de brousse et lutte contre l\'orpaillage clandestin.',
    location: 'Zone Nord',
    year: '2023'
  },
  {
    title: 'CARTOGRAPHIE SIG DU RÉSEAU HYDROGRAPHIQUE',
    image: '/images/hero-tech.jpg',
    service: 'SIG & TÉLÉDÉTECTION',
    desc: 'Modélisation hydrologique pour la gestion durable des ressources en eau.',
    location: 'Bassin du Bandama',
    year: '2022'
  },
];

const getFallbackServices = (lang: string) => [
  {
    id: 'agriculture',
    titre: lang === 'fr' ? 'Agriculture' : 'Agriculture',
    description: lang === 'fr' ? "Soutenir les acteurs de la chaîne de valeur agricole grâce à l'agriculture de précision." : "Supporting agricultural value chain players through precision agriculture.",
    image: '/images/hero-agriculture.jpg'
  },
  {
    id: 'drone',
    titre: lang === 'fr' ? 'Drone et Cartographie' : 'Drone and Mapping',
    description: lang === 'fr' ? "Analyse de précision et cartographie aérienne haute résolution." : "Precision analysis and high-resolution aerial mapping.",
    image: '/images/drone-work.jpg'
  },
  {
    id: 'agroforestry',
    titre: lang === 'fr' ? 'Agroforesterie' : 'Agroforestry',
    description: lang === 'fr' ? "Intégration durable d'arbres dans vos systèmes agricoles." : "Sustainable integration of trees into your farming systems.",
    image: '/images/hero-agroforestry.jpg'
  },
  {
    id: 'forestry',
    titre: lang === 'fr' ? 'Foresterie' : 'Forestry',
    description: lang === 'fr' ? "Développer la performance des secteurs de la foresterie et du reboisement durable." : "Developing the performance of forestry and sustainable reforestation sectors.",
    image: '/images/hero-forest.jpg'
  }
];

const getGridStyle = (count: number) => {
  if (count <= 2) return {
    gridTemplateColumns: `repeat(${count}, 1fr)`,
    gridTemplateRows: '1fr',
    height: '50vh',
    minHeight: '400px'
  }
  if (count === 3) return {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr',
    height: '50vh',
    minHeight: '400px'
  }
  if (count === 4) return {
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: '1fr 1fr',
    height: '80vh',
    minHeight: '680px'
  }
  if (count === 5) return {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(2, 1fr)',
    height: '80vh',
    gap: '2px'
  };
  const rows = Math.ceil(count / 3);
  return {
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    height: 'auto',
    minHeight: `${rows * 340}px`
  }
}

const getCardStyle = (index: number, total: number) => {
  if (total === 4) {
    if (index === 0) return { gridRow: '1 / 3' }
    if (index === 3) return { gridRow: '1 / 3', gridColumn: '3' }
  }
  if (total === 5) {
    if (index === 0) return { gridRow: '1 / 3' }
  }
  return {}
}

const getCardLabel = (s: any, lang: string) => {
  if (s.label) return s.label;
  if (s.service_type) {
    const st = s.service_type.toLowerCase();
    if (st === 'forestry') return lang === 'fr' ? 'Foresterie' : 'Forestry';
    if (st === 'agriculture') return lang === 'fr' ? 'Agriculture' : 'Agriculture';
    if (st === 'drone') return lang === 'fr' ? 'Drone & Cartographie' : 'Drone & Mapping';
    if (st === 'agroforestry') return lang === 'fr' ? 'Agroforesterie' : 'Agroforestry';
    return s.service_type;
  }
  const id = (s.id || '').toLowerCase();
  if (id.includes('agriculture')) return lang === 'fr' ? 'Secteur' : 'Sector';
  if (id.includes('drone')) return lang === 'fr' ? 'Drone & Cartographie' : 'Drone & Mapping';
  if (id.includes('agroforestry')) return lang === 'fr' ? 'Agroforesterie' : 'Agroforestry';
  if (id.includes('forestry')) return lang === 'fr' ? 'Foresterie' : 'Forestry';
  if (id.includes('academy')) return lang === 'fr' ? 'Innovation' : 'Innovation';
  if (id.includes('boutique')) return lang === 'fr' ? 'Boutique' : 'Shop';
  return lang === 'fr' ? 'Expertise' : 'Expertise';
};

/* ═══════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════ */

export default function HomePage({ onNavigate }: HomePageProps) {
  const { t, lang } = useLanguage();
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [heroSloganIndex, setHeroSloganIndex] = useState(0);
  const [dynamicProjects, setDynamicProjects] = useState<any[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [selectedHomeProject, setSelectedHomeProject] = useState<any>(null);

  const handleNav = useCallback((page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigate]);

  const getInitials = (name: string) => {
    if (!name) return 'DK';
    const clean = name.trim();
    if (!clean.includes(' ')) return clean.slice(0, 2).toUpperCase();
    
    const parts = clean.split(' ').filter(Boolean);
    const label = parts
      .slice(0, 3)
      .map((part) => part[0])
      .join('')
      .replace(/[^A-Za-z0-9]/g, '')
      .slice(0, 6);

    return label || name.slice(0, 6);
  };

  const [dynamicHeroImages, setDynamicHeroImages] = useState<string[]>(defaultHeroImages);
  const [dynamicServices, setDynamicServices] = useState<any[]>([]);

  const timeAgo = (date: any) => {
    if (!date) return '';
    const now = new Date();
    const past = (date && date.toDate) ? date.toDate() : new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInSecs = Math.floor(diffInMs / 1000);
    const diffInMins = Math.floor(diffInSecs / 60);
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSecs < 60) return lang === 'fr' ? 'À l\'instant' : 'Just now';
    if (diffInMins < 60) return lang === 'fr' ? `Il y a ${diffInMins} min` : `${diffInMins}m ago`;
    if (diffInHours < 24) return lang === 'fr' ? `Il y a ${diffInHours} h` : `${diffInHours}h ago`;
    if (diffInDays < 7) return lang === 'fr' ? `Il y a ${diffInDays} j` : `${diffInDays}d ago`;
    return past.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  useEffect(() => {
    const fetchAll = async () => {
      // 1. Fetch Projects
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('projets')
          .select('*')
          .in('statut', ['publie', 'Publié', 'Published'])
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (projectsError) {
          console.error('[HomePage Fetch] Error fetching projects:', projectsError);
        } else if (projectsData) {
          setDynamicProjects(projectsData.map(p => {
            let imageUrl = p.image_url || '/images/hero-main.jpg';
            if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) imageUrl = '/images/hero-main.jpg';
            return {
              ...p,
              title: (lang === 'en' && p.titre_en) ? p.titre_en : (p.titre || p.title || ''),
              image: imageUrl,
              service: (lang === 'en' && p.categorie_en) ? p.categorie_en : (p.categorie || 'PROJET')
            };
          }));
        }
      } catch (err) {
        console.error('[HomePage Fetch] Exception fetching projects:', err);
      }

      // 2. Fetch Featured Projects
      try {
        const { data: featuredData, error: featuredError } = await supabase
          .from('projets')
          .select('*')
          .eq('is_featured', true)
          .in('statut', ['publie', 'Publié', 'Published'])
          .order('created_at', { ascending: false })
          .limit(6);
        
        if (featuredError) {
          console.error('[HomePage Fetch] Error fetching featured projects:', featuredError);
        }
        
        if (featuredData && !featuredError) {
          setFeaturedProjects(featuredData.map(p => {
            let imageUrl = p.image_url || '/images/hero-main.jpg';
            if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) imageUrl = '/images/hero-main.jpg';
            return {
              ...p,
              title: (lang === 'en' && p.titre_en) ? p.titre_en : (p.titre || p.title || ''),
              image: imageUrl,
              service: (lang === 'en' && p.categorie_en) ? p.categorie_en : (p.categorie || (lang === 'en' ? 'FEATURED PROJECT' : 'PROJET PHARE'))
            };
          }));
        } else {
          // Fallback
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('projets')
            .select('*')
            .in('statut', ['publie', 'Publié', 'Published'])
            .order('created_at', { ascending: false })
            .limit(6);
          
          if (fallbackError) {
            console.error('[HomePage Fetch] Error fetching fallback projects:', fallbackError);
          } else if (fallbackData) {
            setFeaturedProjects(fallbackData.map(p => {
              let imageUrl = p.image_url || '/images/hero-main.jpg';
              if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) imageUrl = '/images/hero-main.jpg';
              return {
                ...p,
                title: (lang === 'en' && p.titre_en) ? p.titre_en : (p.titre || p.title || ''),
                image: imageUrl,
                service: (lang === 'en' && p.categorie_en) ? p.categorie_en : (p.categorie || 'PROJET')
              };
            }));
          }
        }
      } catch (err) {
        console.error('[HomePage Fetch] Exception fetching featured projects:', err);
      }

      // 4. Fetch Services
      try {
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .in('statut', ['publie', 'Publié', 'Published'])
          .order('created_at', { ascending: false });
        
        if (servicesError) {
          console.error('[HomePage Fetch] Error fetching services:', servicesError);
          setDynamicServices(getFallbackServices(lang));
        } else if (servicesData) {
          // Fetch MainServices config from contacts table
          const { data: config } = await supabase.from('contacts').select('*').eq('sujet', 'MainServices').single();
          let mainIds: string[] = [];
          if (config && config.message) {
            try { mainIds = JSON.parse(config.message); } catch (e) {}
          }

          const mapped = servicesData.map(s => {
            let imageUrl = s.image_url || s.image || '/images/hero-forest.jpg';
            if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) imageUrl = '/images/hero-forest.jpg';
            return {
              ...s,
              id: s.id,
              titre: (lang === 'en' && s.titre_en) ? s.titre_en : (s.titre || s.title),
              description: (lang === 'en' && s.description_en) ? s.description_en : (s.description_courte || s.description),
              image: imageUrl,
              is_main_service: mainIds.includes(s.id)
            };
          });
          
          const mainServices = mapped.filter((s: any) => s.is_main_service === true);
          setDynamicServices(mainServices.length > 0 ? mainServices : getFallbackServices(lang));
        } else {
          setDynamicServices(getFallbackServices(lang));
        }
      } catch (err) {
        console.error('[HomePage Fetch] Exception fetching services:', err);
        setDynamicServices(getFallbackServices(lang));
      }

      // 5. Fetch Hero Media
      try {
        const { data: mediaData, error: mediaError } = await supabase
          .from('media')
          .select('*')
          .eq('type', 'hero')
          .in('statut', ['publie', 'Publié', 'Published']);
        
        if (mediaError) {
          console.error('[HomePage Fetch] Error fetching media:', mediaError);
        } else if (mediaData && mediaData.length > 0) {
          setDynamicHeroImages(mediaData.map(m => m.url));
        }
      } catch (err) {
        console.error('[HomePage Fetch] Exception fetching media:', err);
      }
    };

    fetchAll();
  }, [lang]);
 // Added lang to dependencies

  // Auto-rotate hero items
  const heroItems = [
    ...dynamicHeroImages.map(img => ({ type: 'image', image: img }))
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroItems.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroItems.length]);

  const serviceCards = [
    { key: 'forestry' as const, icon: TreePine, image: '/images/hero-forest.jpg', page: 'services' as PageView },
    { key: 'drone' as const, icon: Navigation, image: '/images/hero-drone.jpg', page: 'services' as PageView },
    { key: 'surveillance' as const, icon: ShieldCheck, image: '/images/hero-agroforestry.jpg', page: 'services' as PageView },
    { key: 'agriculture' as const, icon: Wheat, image: '/images/hero-agriculture.jpg', page: 'services' as PageView },
  ];
  const allFeaturedProjects = [...featuredProjects, ...featuredProjectsFallback].slice(0, 6);

  const whyFeatures = [
    { num: '01', title: (lang: string) => lang === 'fr' ? 'Collecte' : 'Collection', desc: (lang: string) => lang === 'fr' ? 'Collecte de données précises sur le terrain.' : 'Precise data collection in the field.', icon: Award, image: '/images/product-delivery.png' },
    { num: '02', title: (lang: string) => lang === 'fr' ? 'Traitement' : 'Processing', desc: (lang: string) => lang === 'fr' ? 'Analyse et traitement avancé des données récoltées.' : 'Advanced analysis and processing of collected data.', icon: Cpu, image: '/images/secure-payment.png' },
    { num: '03', title: (lang: string) => lang === 'fr' ? 'Exploitation' : 'Exploitation', desc: (lang: string) => lang === 'fr' ? 'Exploitation stratégique des informations pour vos projets.' : 'Strategic use of information for your projects.', icon: Leaf, image: '/images/female-services-support.png' },
    { num: '04', title: (lang: string) => lang === 'fr' ? 'Livraison' : 'Delivery', desc: (lang: string) => lang === 'fr' ? 'Remise des résultats finaux et accompagnement.' : 'Delivery of final results and support.', icon: Users, image: '/images/delivery-truck.png' },
  ];

  const rotatingPhrases = lang === 'fr'
    ? ['Foresterie Durable', 'Cartographie 3D', 'Agroforesterie', 'Solutions Innovantes', 'Inventaire Forestier', 'SIG & Télédétection']
    : ['Sustainable Forestry', '3D Mapping', 'Agroforestry', 'Innovative Solutions', 'Forest Inventory', 'GIS & Remote Sensing'];

  const heroSlogans = lang === 'fr'
    ? ['Gestion Durable des Forêts', 'Analyses Végétales', 'Surveillance Agricole', 'Agriculture de Précision', 'Inventaire Forestier', 'Technologies pour la Nature']
    : ['Sustainable Forest Management', 'Vegetation Analysis', 'Agricultural Monitoring', 'Precision Agriculture', 'Forest Inventory', 'Technology for Nature'];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSloganIndex((prev) => (prev + 1) % heroSlogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroSlogans.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [rotatingPhrases.length]);

  const prevHeroSlide = useCallback(() => {
    setHeroIndex((prev) => (prev === 0 ? heroItems.length - 1 : prev - 1));
  }, [heroItems.length]);

  const nextHeroSlide = useCallback(() => {
    setHeroIndex((prev) => (prev + 1) % heroItems.length);
  }, [heroItems.length]);

  const prevHeroSlogan = useCallback(() => {
    setHeroSloganIndex((prev) => (prev === 0 ? heroSlogans.length - 1 : prev - 1));
  }, [heroSlogans.length]);

  const nextHeroSlogan = useCallback(() => {
    setHeroSloganIndex((prev) => (prev + 1) % heroSlogans.length);
  }, [heroSlogans.length]);

  const testimonials = t.testimonials.items;
  const testimonialAvatars = ['/images/team1.jpg', '/images/team2.jpg', '/images/team3.jpg'];

  const testimonialSlideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0, transition: { duration: 0.3 } }),
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center justify-center gap-1.5 mb-6" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'w-5 h-5 transition-colors',
            index < rating ? 'fill-dronek-gold text-dronek-gold' : 'text-dronek-gold/25'
          )}
        />
      ))}
    </div>
  );

  const prevTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  }, [testimonials.length]);

  const nextTestimonial = useCallback(() => {
    setTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  }, [testimonials.length]);

  return (
    <div>
      {/* ═══════════════════════════════════
          HERO SECTION — FULL WOW EFFECT
          ═══════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

        {/* Image Slideshow with Ken Burns */}
        <motion.div
          className="absolute inset-0"
        >
          <AnimatePresence>
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={heroItems[heroIndex]?.image || '/images/hero-main.jpg'}
                alt="DRONEK"
                fill
                className="object-cover animate-ken-burns"
                priority
              />
              
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Professional subtle overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 pointer-events-none" />
        <FloatingParticles />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            transition={{ duration: 0.8 }}
            className="space-y-7 mt-[-16px] drop-shadow-2xl"
          >
            {/* Title — Animated rotating slogan */}
            <motion.h1
              variants={fadeInUp}
              className="text-white font-bold uppercase leading-[1.05] max-w-6xl mx-auto flex flex-col items-center justify-center gap-1 sm:gap-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]"
              style={{ fontSize: 'clamp(1.75rem, 8vw, 5rem)' }}
            >
              <div className="min-h-[1.5em] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={heroSloganIndex}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
                    exit={{ y: -40, opacity: 0, transition: { duration: 0.35 } }}
                    className="block text-center leading-[1.08] font-bold"
                  >
                    {heroSlogans[heroSloganIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="w-full flex items-center justify-center gap-2 sm:gap-5">
                <button
                  onClick={prevHeroSlogan}
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                  aria-label="Previous headline"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 h-5" />
                </button>
                <span className="leading-[1.08] font-bold" style={{ fontSize: 'clamp(1.5rem, 6vw, 4.5rem)' }}>
                  {lang === 'fr' ? "& DE LA TECHNOLOGIE PAR DRONE" : '& DRONE TECHNOLOGY'}
                </span>
                <button
                  onClick={nextHeroSlogan}
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white/10 border border-white/25 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                  aria-label="Next headline"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 h-5" />
                </button>
              </div>
            </motion.h1>

            {/* Rotating Text Effect */}
            <motion.div
              variants={fadeInUp}
              className="min-h-[3rem] sm:min-h-[3.5rem] flex flex-wrap items-center justify-center overflow-visible px-4"
            >
              <span className="text-sm sm:text-lg lg:text-2xl font-medium mr-1.5 text-white whitespace-nowrap">
                {lang === 'fr' ? 'Notre expertise :' : 'Our expertise:'}
              </span>
              <div className="relative inline-flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { duration: 0.4 } }}
                    exit={{ y: -20, opacity: 0, transition: { duration: 0.3 } }}
                    className="text-sm sm:text-lg lg:text-2xl text-white font-bold"
                  >
                    {rotatingPhrases[rotatingIndex]}
                  </motion.span>
                </AnimatePresence>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                  className="text-lg sm:text-xl lg:text-2xl text-dronek-green font-light ml-0.5"
                >
                  |
                </motion.span>
              </div>
            </motion.div>

            {/* CTA Buttons — Prominent */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Button
                onClick={() => handleNav('contact')}
                size="lg"
                className="w-full sm:w-auto bg-dronek-green hover:bg-green-700 text-white rounded-full px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg shadow-dronek-green/30 transition-all duration-300 hover:scale-105"
              >
                {t.hero.cta1}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
              <Button
                onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 rounded-full px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                {t.hero.cta2}
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </motion.div>

          </motion.div>

          {/* Animated Stats Bar — Frosted Glass */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-8 lg:mt-12 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { end: 8, suffix: '+', label: t.hero.stat1 },
                { end: 150, suffix: '+', label: t.hero.stat2 },
                { end: 50, suffix: '+', label: t.hero.stat3 },
                { end: 4, suffix: '', label: t.hero.stat4 },
              ].map((stat, idx) => (
                <div 
                  key={idx} 
                  className="relative group py-[4px] sm:py-[6px] px-2 flex flex-col items-center justify-center min-h-[70px] sm:min-h-[80px] lg:min-h-[110px] transition-all duration-300 hover:scale-105"
                >
                  <div 
                    className="absolute inset-0 bg-[#064e3b]"
                    style={{ 
                      filter: 'url(#rough-edge)',
                      WebkitFilter: 'url(#rough-edge)'
                    }}
                  />

                  <div className="text-center space-y-0 relative z-10">
                    <div className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tighter">
                      <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                    </div>
                    <p className="text-white text-[9px] sm:text-[11px] lg:text-[13px] font-bold tracking-tight uppercase px-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2">
            <ChevronDown className="w-5 h-5 text-white/50" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          ABOUT & VALUES SECTION
          ═══════════════════════════════════ */}
      <section className="bg-white pt-4 pb-4 lg:pt-8 lg:pb-8 about-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">
            {/* Left Content: About & Values — defines section height */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col about-left"
            >
              <div>
                <motion.h2 
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={stagger}
                  className="mb-12 text-center"
                >
                  <span className="block text-3xl lg:text-5xl leading-tight tracking-normal text-center flex items-baseline justify-center flex-nowrap whitespace-nowrap gap-2">
                    <span className="text-black font-[var(--font-montserrat)] font-black tracking-tighter uppercase flex">
                      {(lang === 'fr' ? 'Qui sommes-' : 'Who are ').split('').map((char, i) => (
                        <motion.span
                          key={i}
                          variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          transition={{ duration: 0.2, delay: i * 0.06 }}
                          className="inline-block"
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      ))}
                    </span>
                    <motion.span 
                      variants={{
                        hidden: { opacity: 0, y: 15 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.2, delay: (lang === 'fr' ? 11 : 8) * 0.06 }}
                      className="text-[#149655] font-['Brush_Script_MT',cursive] font-normal inline-block text-[1.5em] ml-1"
                    >
                      {lang === 'fr' ? 'nous ?' : 'we?'}
                    </motion.span>
                  </span>
                  <div className="flex justify-center mt-4">
                    <div className="section-divider-wide" />
                  </div>
                </motion.h2>
                
                <div className="prose prose-lg text-dronek-text max-w-none space-y-8">
                  <ScrollBold className="leading-relaxed text-base lg:text-lg">
                    {lang === 'fr' ? (
                      <>
                        DRONEK SARL est un cabinet de conseil spécialisé en agriculture, foresterie et agroforesterie. Avec DRONEK, vous bénéficiez d'une <span className="text-dronek-green font-bold">expertise</span> inégalée dans le domaine du reboisement et de la restauration des écosystèmes.
                      </>
                    ) : (
                      <>
                        DRONEK SARL is a consulting firm specialized in agriculture, forestry, and agroforestry. With DRONEK, you benefit from unparalleled <span className="text-dronek-green font-bold">expertise</span> in reforestation and ecosystem restoration.
                      </>
                    )}
                  </ScrollBold>
                  <ScrollBold className="leading-relaxed text-base lg:text-lg">
                    {lang === 'fr' ? (
                      <>
                        Nous sommes fiers de collaborer avec des entreprises soucieuses de leur empreinte environnementale, car nous croyons que la <span className="text-dronek-green font-bold">réussite</span> commerciale peut aller de pair avec la préservation de notre planète.
                      </>
                    ) : (
                      <>
                        We are proud to collaborate with companies concerned about their environmental footprint, as we believe business <span className="text-dronek-green font-bold">success</span> can go hand-in-hand with preserving our planet.
                      </>
                    )}
                  </ScrollBold>
                  <ScrollBold className="leading-relaxed text-base lg:text-lg">
                    {lang === 'fr' ? (
                      <>
                        En sélectionnant DRONEK comme partenaire, vous rejoignez une communauté d'entreprises engagées dans la durabilité. Faites le choix de la <span className="text-dronek-green font-bold">qualité</span>, de l'écoresponsabilité et de l'engagement environnemental.
                      </>
                    ) : (
                      <>
                        By selecting DRONEK as a partner, you join a community of companies committed to sustainability. Choose <span className="text-dronek-green font-bold">quality</span>, eco-responsibility, and environmental commitment.
                      </>
                    )}
                  </ScrollBold>
                </div>
              </div>

              {/* Values Sub-section: Image Background Model */}
              <div className="mt-12 lg:mt-16 relative rounded-[20px] p-6 sm:p-8 lg:p-10 flex-shrink-0 overflow-hidden group min-h-[400px] sm:min-h-[500px] flex flex-col justify-center">
                <Image 
                  src="/images/481011329_1158296419329664_1600869458483497827_n.jpg" 
                  alt="Nature Background" 
                  fill 
                  priority
                  className="object-cover transition-transform duration-[3000ms] group-hover:scale-110"
                />
                {/* Dark Glass Overlay (Vitre noire transparente) */}
                <div className="absolute inset-0 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-dronek-green/30 pointer-events-none" />

                <div className="flex flex-col gap-4">
                  {[
                    { 
                      img: "/images/ChatGPT_Image_29_avr._2026__14_15_35-removebg-preview.png", 
                      title: lang === 'fr' ? "Innovation" : "Innovation", 
                      desc: lang === 'fr' 
                        ? "Nous adoptons les technologies les plus avancées pour offrir des solutions à la pointe de l'innovation." 
                        : "We adopt the most advanced technologies to offer solutions at the cutting edge of innovation." 
                    },
                    { 
                      img: "/images/ChatGPT_Image_29_avr._2026__14_23_04-removebg-preview.png", 
                      title: lang === 'fr' ? "Expertise" : "Expertise", 
                      desc: lang === 'fr' 
                        ? "Notre équipe d'experts qualifiés apporte son savoir-faire pour garantir la réussite de vos projets." 
                        : "Our team of qualified experts brings its know-how to guarantee the success of your projects." 
                    },
                    { 
                      img: "/images/31add1fe-1be9-4ec0-afd7-0063dd695d4a-removebg-preview.png", 
                      title: lang === 'fr' ? "Proximité" : "Proximity", 
                      desc: lang === 'fr' 
                        ? "Nous sommes présents localement pour mieux comprendre et répondre aux besoins de nos clients." 
                        : "We are present locally to better understand and meet our clients' needs." 
                    }
                  ].map((val, i) => {
                    return (
                      <motion.div 
                        key={i} 
                        initial={{ 
                          opacity: 0, 
                          x: i % 2 === 0 ? -60 : 60, 
                          scale: 0.9,
                          rotate: i % 2 === 0 ? -2 : 2
                        }}
                        whileInView={{ 
                          opacity: 1, 
                          x: 0, 
                          scale: 1, 
                          rotate: 0
                        }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 70,
                          damping: 20,
                          duration: 0.8,
                          delay: i * 0.15
                        }}
                        className="bg-white rounded-[16px] p-6 shadow-none flex flex-col items-start text-left relative z-10"
                      >
                        <div className="flex items-center justify-between w-full mb-6">
                          <div className="flex flex-col">
                            <h4 className="text-2xl lg:text-3xl font-bold text-dronek-green">{val.title}</h4>
                            <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: val.title === "Innovation" || val.title === "Expertise" || val.title === "Proximité" ? 48 : 0 }}
                              transition={{ delay: 0.5, duration: 0.8 }}
                              className="h-1 bg-dronek-green mt-1 rounded-full"
                            />
                          </div>
                          <div className="w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center flex-shrink-0">
                            <img 
                              src={val.img} 
                              alt={val.title} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed font-medium text-sm lg:text-base">{val.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Right Column: Sticky Image Aligned at Start and End */}
            <div className="hidden lg:block relative about-right">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="sticky top-32 h-[90vh] w-full overflow-hidden shadow-2xl group rounded-2xl -translate-x-4"
              >
                <div className="relative w-full h-full">
                  <Image 
                    src="/images/about-forest.jpg" 
                    alt="DRONEK Vision" 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>
            
            {/* Mobile Image (not sticky) */}
            <motion.div className="block lg:hidden h-[400px] relative mt-12">
               <Image 
                  src="/images/about-forest.jpg" 
                  alt="DRONEK Vision" 
                  fill 
                  className="object-cover" 
                />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SERVICES SECTION
          ═══════════════════════════════════ */}
      <motion.section
        id="services-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={expertiseSectionVariants}
        className="relative overflow-hidden bg-[#ffffff] pt-0 pb-0 lg:pt-0 lg:pb-0"
      >

        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-0">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-10 mt-6 lg:mt-10">
            <div
              className="relative inline-flex flex-col items-center group max-w-3xl"
            >
              {/* Decorative Leaf - Top Left with slow animation */}
              <motion.div 
                initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="absolute -top-4 -left-8 sm:-top-6 sm:-left-12 lg:-top-8 lg:-left-16 pointer-events-none"
              >
                <img
                  src="/images/partners/ChatGPT_Image_24_avr._2026__15_44_37-removebg-preview.png"
                  alt="Leaf"
                  className="w-12 h-10 sm:w-16 sm:h-12 lg:w-20 lg:h-16 object-contain opacity-100"
                />
              </motion.div>

              <div className="text-center">
                <span className="block text-black text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight mb-1">
                  {(() => {
                    const text = lang === 'fr' ? "Nos domaines" : "Our areas of";
                    const words = text.split(' ');
                    let charCount = 0;
                    return words.map((word, wIdx) => (
                      <span key={wIdx} className="inline-block mr-[0.2em] last:mr-0">
                        {word.split('').map((char, cIdx) => {
                          const delayIdx = charCount++;
                          return (
                            <motion.span
                              key={cIdx}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: delayIdx * 0.04, ease: "easeOut" }}
                              className="inline-block"
                            >
                              {char}
                            </motion.span>
                          );
                        })}
                      </span>
                    ));
                  })()}
                </span>
                <h2 className="text-[#149655] text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight">
                  {(() => {
                    const text = lang === 'fr' ? "d'expertises" : "expertise";
                    const words = text.split(' ');
                    let charCount = 12;
                    return words.map((word, wIdx) => (
                      <span key={wIdx} className="inline-block mr-[0.2em] last:mr-0">
                        {word.split('').map((char, cIdx) => {
                          const delayIdx = charCount++;
                          return (
                            <motion.span
                              key={cIdx}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: delayIdx * 0.04, ease: "easeOut" }}
                              className="inline-block"
                            >
                              {char}
                            </motion.span>
                          );
                        })}
                      </span>
                    ));
                  })()}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Service cards grid - Dynamic & Full-bleed layout */}
        <div 
          className="expertise-grid mt-12 gap-2 px-2 lg:gap-4 lg:px-4" 
          style={getGridStyle(dynamicServices.length)}
        >
          {dynamicServices.map((s, index) => (
            <motion.div 
              key={`${s.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="expertise-card card group"
              style={getCardStyle(index, dynamicServices.length)}
              onClick={() => {
                sessionStorage.setItem('scroll_to_service', s.id);
                handleNav('services');
              }}
            >
              {s.image && (
                <Image 
                  src={s.image} 
                  alt={s.titre} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              )}
              <div className="expertise-card-overlay" />
              <div className="expertise-card-content p-6 h-full flex flex-col justify-between">
                {/* Title Centered */}
                <div className="flex-1 flex items-center justify-center pointer-events-none z-10">
                  <h3 className="expertise-card-title text-center text-3xl md:text-4xl px-2 opacity-100 transition-opacity duration-300 group-hover:opacity-0">{s.titre}</h3>
                </div>
                
                {/* Bottom Section */}
                <div className="expertise-card-bottom flex justify-between items-end mt-auto z-10 pointer-events-none opacity-100 transition-opacity duration-300 group-hover:opacity-0">
                  <p className="expertise-card-description line-clamp-3 text-sm md:text-base pr-4">
                    {s.description}
                  </p>
                  <div className="expertise-card-arrow bg-white text-black rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#149655] group-hover:text-white shrink-0 pointer-events-auto">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════
          POURQUOI CHOISIR DRONEK
          ═══════════════════════════════════ */}
      <Section className="py-6 lg:py-8 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dronek-green/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <div
              className="relative inline-flex flex-col items-center group max-w-2xl"
            >
              {/* Decorative Leaf - Top Left with slow animation */}
              <motion.div 
                initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="absolute -top-2 -left-10 sm:-top-4 sm:-left-[56px] lg:-top-6 lg:-left-[72px] pointer-events-none"
              >
                <img
                  src="/images/partners/ChatGPT_Image_24_avr._2026__15_44_37-removebg-preview.png"
                  alt="Leaf"
                  className="w-12 h-10 sm:w-16 sm:h-12 lg:w-20 lg:h-16 object-contain opacity-100"
                />
              </motion.div>

              <div className="text-center">
                <h2 className="text-black text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight mb-1">
                  {(() => {
                    const words = lang === 'fr' 
                      ? [
                          { text: "Pourquoi", isGreen: false, isSlanted: false },
                          { text: "nous", isGreen: false, isSlanted: false },
                          { text: "choisir", isGreen: true, isSlanted: true },
                          { text: "?", isGreen: true, isSlanted: false },
                        ]
                      : [
                          { text: "Why", isGreen: false, isSlanted: false },
                          { text: "choose", isGreen: true, isSlanted: true },
                          { text: "us", isGreen: false, isSlanted: false },
                          { text: "?", isGreen: true, isSlanted: false },
                        ];
                    let globalIdx = 0;
                    return words.map((w, wIdx) => (
                      <span key={wIdx} className="inline-block mr-[0.22em] last:mr-0">
                        {w.text.split('').map((char, cIdx) => {
                          const idx = globalIdx++;
                          return (
                            <motion.span
                              key={cIdx}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: idx * 0.05, ease: "easeOut" }}
                              className={`inline-block ${
                                w.isGreen ? 'text-[#149655]' : 'text-black'
                              } ${
                                w.isSlanted ? 'slanted-text font-style-normal' : ''
                              }`}
                            >
                              {char}
                            </motion.span>
                          );
                        })}
                      </span>
                    ));
                  })()}
                </h2>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-[#444] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium"
            >
              {lang === 'fr' 
                ? "DRONEK propose une large gamme de services en foresterie, agroforesterie, gestion de l'environnement et en agriculture. Notre technologie permet d'alléger considérablement le travail de terrain par l'élimination de l'échantillonnage et la prise de données manuelles."
                : "DRONEK offers a wide range of services in forestry, agroforestry, environmental management, and agriculture. Our technology significantly reduces fieldwork by eliminating sampling and manual data collection."
              }
            </motion.p>
          </div>

          {/* Feature blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {whyFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              // Define individual animations based on index to match footer style
              const animProps = [
                { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, delay: 0 },
                { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, delay: 0.1 },
                { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, delay: 0.2 },
                { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, delay: 0.3 },
              ][idx] || { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, delay: 0 };

              return (
                <motion.div 
                  key={feature.num} 
                  initial={animProps.initial}
                  whileInView={animProps.whileInView}
                  transition={{ duration: 0.8, delay: animProps.delay, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="group h-full"
                >
                  <div className="relative h-full p-6 lg:p-8 rounded-2xl border border-black/10 bg-white/80 hover:border-dronek-green/30 transition-all duration-500 hover:bg-white">
                    <div className="absolute top-4 right-4 w-16 h-16 pointer-events-none opacity-100">
                      <Image src={feature.image} alt={feature.title(lang)} fill className="object-contain" />
                    </div>
                    <div className="relative space-y-4">
                      <h3 className="text-xl lg:text-2xl font-bold text-dronek-text">{feature.title(lang)}</h3>
                      <p className="text-dronek-medium text-base lg:text-lg leading-relaxed">{feature.desc(lang)}</p>
                      <div className="h-0.5 w-12 bg-dronek-green/50 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
          TESTIMONIALS — Carousel
          ═══════════════════════════════════ */}
      {/* ═══════════════════════════════════
          FEATURED PROJECTS HEADER (OUTSIDE)
          ═══════════════════════════════════ */}
      <Section className="bg-white pb-0">
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 lg:mb-8">
            <div
              className="relative inline-flex flex-col items-center group max-w-3xl"
            >
              {/* Decorative Leaf - Top Left with slow animation */}
              <motion.div 
                initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                className="absolute -top-4 -left-8 sm:-top-6 sm:-left-12 lg:-top-8 lg:-left-16 pointer-events-none"
              >
                <img
                  src="/images/partners/ChatGPT_Image_24_avr._2026__15_44_37-removebg-preview.png"
                  alt="Leaf"
                  className="w-12 h-10 sm:w-16 sm:h-12 lg:w-20 lg:h-16 object-contain opacity-100"
                />
              </motion.div>

              <div className="text-center">
                <span className="block text-black text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight mb-1">
                  {"Nos Projets".split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </span>
                <h2 className="text-[#149655] text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] tracking-tight">
                  {"phares".split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (i + 11) * 0.08, ease: "easeOut" }}
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </h2>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-[#444] text-base sm:text-lg max-w-3xl mx-auto leading-relaxed font-medium"
            >
              {lang === 'fr'
                ? "Dronek se distingue par une solide expertise technique et une maîtrise des innovations technologiques dans les secteurs de la foresterie et de l'agriculture."
                : "Dronek distinguishes itself with solid technical expertise and mastery of technological innovations in the forestry and agriculture sectors."
              }
            </motion.p>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
          FEATURED PROJECTS CARDS (WITH BACKGROUND)
          ═══════════════════════════════════ */}
      <Section className="relative overflow-hidden pt-8 pb-12 lg:py-16">
        {/* Background Image with Overlay — Only for cards */}
        <div className="absolute inset-0 z-0 overflow-hidden -top-[76px]">
          <Image 
            src="/images/hero-agriculture.jpg" 
            alt="Dronek Projects" 
            fill 
            className="object-cover" 
            priority
          />
          <div className="absolute inset-0 transition-all" />
          
          {/* Abstract Shadow Background Transition — Premium look restored */}
          <div className="absolute top-0 left-0 right-0 h-96 z-10 pointer-events-none overflow-hidden hidden md:block">
            <Image 
              src="/images/abstract-shadow.png" 
              alt="Abstract Shadow" 
              fill 
              className="object-cover object-top opacity-100"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {allFeaturedProjects.map((project, index) => {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: (index % 3) * 0.15, 
                    ease: "easeOut" 
                  }}
                  viewport={{ once: true }}
                  className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-dronek-green/10 cursor-pointer"
                  onClick={() => setSelectedHomeProject(project)}
                >
                <div className="flex flex-col h-full p-1 pt-2 pb-0">
                  <div className="relative h-72 overflow-hidden rounded-2xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover apple-zoom-image"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full border border-dronek-green/20 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dronek-green backdrop-blur-sm">
                        {project.service}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 bg-[#f1f1f1] flex-1 flex flex-col items-center text-center">
                    <h3 className="text-base lg:text-lg font-bold text-[#149655] leading-tight tracking-tight mb-5">
                      {(project.title || '').toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    <Button
                      className="mt-auto w-fit rounded-full bg-dronek-green hover:bg-green-700 text-white px-6 py-2 h-auto text-sm font-semibold"
                    >
                      {t.services.learnMore}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              className="bg-white/95 hover:bg-white text-dronek-dark rounded-full px-10 py-6 text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto border border-white/20"
              onClick={() => handleNav('projects')}
            >
              VOIR PLUS
            </Button>
          </motion.div>
        </div>
      </Section>

      <Partners />




      <style jsx>{`
        .success-logos-container {
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
          mask-image: linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%);
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
        }

        .success-logos-track {
          display: flex;
          gap: 12px;
          align-items: center;
          width: max-content;
          animation: scroll-left 24s linear infinite;
        }

        .success-logos-stack {
          display: grid;
          gap: 12px;
        }

        .success-logos-track-reverse {
          animation-direction: reverse;
          animation-duration: 26s;
        }

        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      {/* Project Detail Modal for Home Page - Synchronized with ProjectsPage */}
      <AnimatePresence>
        {selectedHomeProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop Blur & Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedHomeProject(null)}
              className="absolute inset-0 transition-all"
            />
            
            {/* Popup Container */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Close Button Mobile */}
              <button 
                onClick={() => setSelectedHomeProject(null)}
                className="absolute top-4 right-4 z-50 md:hidden bg-white/80 backdrop-blur-md rounded-full p-2 shadow-lg"
              >
                <X className="w-6 h-6 text-dronek-text" />
              </button>
 
              {/* Image / Gallery Side */}
              <div className="md:w-1/2 relative h-64 md:h-auto bg-gray-100">
                <Image src={selectedHomeProject.image} alt={selectedHomeProject.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
 
              {/* Content Side */}
              <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-dronek-green uppercase tracking-[0.2em]">{selectedHomeProject.service}</span>
                  <button onClick={() => setSelectedHomeProject(null)} className="hidden md:block hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-gray-300 hover:text-dronek-text" />
                  </button>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-[#149655] mb-6 leading-tight text-center">
                  {selectedHomeProject.title.toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h2>
 
                <div className="space-y-6">
                  {/* Detailed Description */}
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {selectedHomeProject.description || selectedHomeProject.content || selectedHomeProject.summary || selectedHomeProject.desc}
                  </p>
 
                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{lang === 'fr' ? 'Localisation' : 'Location'}</span>
                      <span className="text-sm font-semibold text-dronek-text">{selectedHomeProject.location || 'Côte d\'Ivoire'}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{lang === 'fr' ? 'Année' : 'Year'}</span>
                      <span className="text-sm font-semibold text-dronek-text">{selectedHomeProject.year || '2023'}</span>
                    </div>
                  </div>
 
                  {/* Objectives */}
                  {selectedHomeProject.objectives && Array.isArray(selectedHomeProject.objectives) && (
                    <div>
                      <h4 className="text-xs font-bold text-dronek-text uppercase tracking-widest mb-3">{lang === 'fr' ? 'Objectifs du projet' : 'Project Objectives'}</h4>
                      <ul className="space-y-2">
                        {selectedHomeProject.objectives.map((obj: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-dronek-green mt-1.5" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
 
                  {/* Results / Impacts */}
                  {selectedHomeProject.impacts && Array.isArray(selectedHomeProject.impacts) && (
                    <div>
                      <h4 className="text-xs font-bold text-dronek-text uppercase tracking-widest mb-3">{lang === 'fr' ? 'Résultats & Impacts' : 'Results & Impacts'}</h4>
                      <ul className="space-y-2">
                        {selectedHomeProject.impacts.map((impact: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-dronek-green mt-1.5" />
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
 
                {/* Final Action */}
                <div className="mt-10">
                  <Button 
                    onClick={() => setSelectedHomeProject(null)}
                    className="w-full rounded-xl bg-dronek-green hover:bg-dronek-dark text-white font-bold py-6 h-auto shadow-lg shadow-dronek-green/20"
                  >
                    {lang === 'fr' ? 'Fermer' : 'Close'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <filter id="rough-edge">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
        </filter>
      </svg>
    </div>
  );
}

