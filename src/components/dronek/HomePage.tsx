'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  TreePine, Navigation, Sprout, Wheat, Quote, ArrowRight, ArrowDown,
  ShieldCheck, Cpu, Leaf, MapPin, Star, ChevronDown, ChevronLeft, ChevronRight,
  Award, Users, Briefcase, Layers, Calendar, Heart, MessageCircle, Share2, Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from './LanguageProvider';
import type { PageView } from './Navbar';
import { cn } from '@/lib/utils';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

/* ─────── Animation Helpers ─────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
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
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={stagger}
      className={cn('section-padding', className)}
    >
      {children}
    </motion.section>
  );
}

/* ─────── Hero Slideshow ─────── */
const heroImages = [
  '/images/hero-forest.jpg',
  '/images/hero-drone.jpg',
  '/images/hero-agroforestry.jpg',
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
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 6,
        duration: Math.random() * 8 + 8,
      }))
    );
  }, []);

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
   HOME PAGE
   ═══════════════════════════════════ */
export default function HomePage({ onNavigate }: HomePageProps) {
  const { t, lang } = useLanguage();
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [heroSloganIndex, setHeroSloganIndex] = useState(0);

  // Posts state for dynamic feed
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Nouveau projet de cartographie à Taï',
      content: 'Nous sommes fiers d\'annoncer le lancement d\'un nouveau projet de cartographie par drone dans le Parc National de Taï. Ce projet permettra de cartographier plus de 5 000 hectares de forêt primaire avec une précision centimétrique.',
      image: '/images/project-forest.jpg',
      date: 'Il y a 2 jours',
      likes: 24,
      liked: false,
    },
    {
      id: 2,
      title: 'Formation réussie à San Pedro',
      content: 'Plus de 50 agriculteurs ont été formés aux bonnes pratiques agricoles durables lors de notre dernière session de formation à San Pedro. Un grand merci à tous les participants !',
      image: '/images/project-training.jpg',
      date: 'Il y a 1 semaine',
      likes: 38,
      liked: false,
    },
    {
      id: 3,
      title: 'Partenariat avec la FAO',
      content: 'DRONEK signe un partenariat stratégique avec la FAO pour renforcer la surveillance des forêts en Côte d\'Ivoire grâce aux technologies de télédétection.',
      image: '/images/drone-work.jpg',
      date: 'Il y a 2 semaines',
      likes: 56,
      liked: false,
    },
  ]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  const handlePublishPost = useCallback(() => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const newPost = {
      id: Date.now(),
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      image: newPostImage.trim() || '/images/about-forest.jpg',
      date: "À l'instant",
      likes: 0,
      liked: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostImage('');
    setShowNewPost(false);
  }, [newPostTitle, newPostContent, newPostImage]);

  const toggleLike = useCallback((id: number) => {
    setPosts((prev) => prev.map((p) =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  }, []);

  const handleNav = useCallback((page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [onNavigate]);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const serviceCards = [
    { key: 'forestry' as const, icon: TreePine, image: '/images/hero-forest.jpg', page: 'services-forestry' as PageView },
    { key: 'drone' as const, icon: Navigation, image: '/images/hero-drone.jpg', page: 'services-drone' as PageView },
    { key: 'agroforestry' as const, icon: Sprout, image: '/images/hero-agroforestry.jpg', page: 'services-agroforestry' as PageView },
    { key: 'agriculture' as const, icon: Wheat, image: '/images/hero-agriculture.jpg', page: 'services-agriculture' as PageView },
  ];

  const featuredProjects = t.projects.items.slice(0, 3);

  const whyFeatures = [
    { num: '01', title: lang => lang === 'fr' ? 'Expertise Certifiée' : 'Certified Expertise', desc: lang => lang === 'fr' ? 'Une équipe diplômée et certifiée avec plus de 8 ans d\'expérience terrain en foresterie et agriculture.' : 'A certified team with 8+ years of field experience in forestry and agriculture.', icon: Award },
    { num: '02', title: lang => lang === 'fr' ? 'Technologies de Pointe' : 'Cutting-Edge Technologies', desc: lang => lang === 'fr' ? 'Flotte de drones de dernière génération et outils de cartographie haute précision.' : 'Latest-generation drone fleet and high-precision mapping tools.', icon: Cpu },
    { num: '03', title: lang => lang === 'fr' ? 'Approche Durable' : 'Sustainable Approach', desc: lang => lang === 'fr' ? 'Des solutions respectueuses de l\'environnement pour un impact positif à long terme.' : 'Environmentally friendly solutions for a positive long-term impact.', icon: Leaf },
    { num: '04', title: lang => lang === 'fr' ? 'Accompagnement Personnalisé' : 'Personalized Support', desc: lang => lang === 'fr' ? 'Un suivi sur-mesure de la consultation à la réalisation, adapté à vos besoins.' : 'Tailor-made support from consultation to implementation, adapted to your needs.', icon: Users },
  ];

  const partners = [
    { name: 'OIPR', fullName: 'Office Ivoirien des Parcs et Réserves', url: 'https://www.oipr.ci', color: '#2E7D32', initials: 'OIPR' },
    { name: 'SODEFOR', fullName: 'Société de Développement des Forêts', url: 'https://www.sodefor.ci', color: '#1565C0', initials: 'SDF' },
    { name: 'FAO', fullName: 'Organisation des Nations Unies pour l\'Alimentation', url: 'https://www.fao.org', color: '#1976D2', initials: 'FAO' },
    { name: 'PNUD', fullName: 'Programme des Nations Unies pour le Développement', url: 'https://www.undp.org', color: '#00796B', initials: 'PNUD' },
    { name: 'BAD', fullName: 'Banque Africaine de Développement', url: 'https://www.afdb.org', color: '#E65100', initials: 'BAD' },
    { name: 'MINSEDD', fullName: 'Ministère de l\'Environnement', url: '#', color: '#455A64', initials: 'MSD' },
  ];

  const rotatingPhrases = lang === 'fr'
    ? ['Foresterie Durable', 'Cartographie par Drone', 'Agroforesterie', 'Agriculture Innovante', 'Inventaire Forestier', 'SIG & Télédétection']
    : ['Sustainable Forestry', 'Drone Mapping', 'Agroforestry', 'Innovative Agriculture', 'Forest Inventory', 'GIS & Remote Sensing'];

  const heroSlogans = lang === 'fr'
    ? ['Gestion Durable des Forêts', 'Cartographie par Drone', 'Agroforesterie Innovante', 'Agriculture Durable', 'Inventaire Forestier', 'Technologies pour la Nature']
    : ['Sustainable Forest Management', 'Drone Mapping', 'Innovative Agroforestry', 'Sustainable Agriculture', 'Forest Inventory', 'Technology for Nature'];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroSloganIndex((prev) => (prev + 1) % heroSlogans.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlogans.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % rotatingPhrases.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [rotatingPhrases.length]);

  const prevHeroSlide = useCallback(() => {
    setHeroIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  }, []);

  const nextHeroSlide = useCallback(() => {
    setHeroIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  const testimonials = t.testimonials.items;
  const testimonialSlideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
    exit: (direction: number) => ({ x: direction > 0 ? -300 : 300, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }),
  };

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image Slideshow with Ken Burns */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={heroIndex}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[heroIndex]}
                alt="DRONEK"
                fill
                className="object-cover animate-ken-burns"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="hero-overlay absolute inset-0" />
        <FloatingParticles />

        {/* Left Arrow */}
        <button
          onClick={prevHeroSlide}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextHeroSlide}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8"
          >
            {/* Small uppercase tagline */}
            <motion.p
              variants={fadeInUp}
              className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/70 font-medium"
            >
              {lang === 'fr' ? 'LA GÉOMATIQUE ET L\'INNOVATION' : 'GEOMATICS AND INNOVATION'}
            </motion.p>

            {/* Title — Animated rotating slogan */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase text-white leading-[1.1] max-w-5xl mx-auto min-h-[2.5em] sm:min-h-[2.2em] flex flex-col items-center justify-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <div className="h-[1.2em] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={heroSloganIndex}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }}
                    exit={{ y: -40, opacity: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } }}
                    className="block text-center"
                  >
                    {heroSlogans[heroSloganIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-dronek-gold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {lang === 'fr' ? "& de l'Agriculture par Drone" : '& Agriculture by Drone'}
              </span>
            </motion.h1>

            {/* Rotating Text Effect */}
            <motion.div
              variants={fadeInUp}
              className="h-10 sm:h-12 flex items-center justify-center overflow-hidden"
            >
              <span className="text-lg sm:text-xl lg:text-2xl text-dronek-gold font-medium mr-1">
                {lang === 'fr' ? 'Nous sommes experts en' : 'We are experts in'}
              </span>
              <div className="relative inline-flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={rotatingIndex}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}
                    exit={{ y: -30, opacity: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }}
                    className="text-lg sm:text-xl lg:text-2xl text-white font-semibold"
                  >
                    {rotatingPhrases[rotatingIndex]}
                  </motion.span>
                </AnimatePresence>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse', ease: 'steps(2)' }}
                  className="text-lg sm:text-xl lg:text-2xl text-dronek-gold font-light ml-0.5"
                >
                  |
                </motion.span>
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed font-light"
            >
              {lang === 'fr' ? 'DRONEK — Expert ivoirien en technologies innovantes pour l\'environnement' : 'DRONEK — Ivorian expert in innovative technologies for the environment'}
            </motion.p>

            {/* CTA Buttons — Prominent */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => handleNav('contact')}
                size="lg"
                className="bg-gradient-to-r from-dronek-gold to-amber-500 hover:from-amber-500 hover:to-dronek-gold text-white rounded-full px-10 py-6 text-lg font-semibold shadow-lg shadow-dronek-gold/25 hover:shadow-dronek-gold/40 transition-all duration-300 hover:scale-105"
              >
                {t.hero.cta1}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                onClick={() => document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 rounded-full px-10 py-6 text-lg bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              >
                {t.hero.cta2}
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Stats Bar — Frosted Glass */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.4, 0, 0.2, 1] }}
            className="mt-16 lg:mt-20 max-w-4xl mx-auto"
          >
            <div className="glass rounded-2xl p-6 lg:p-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                {[
                  { end: 8, suffix: '+', label: t.hero.stat1 },
                  { end: 150, suffix: '+', label: t.hero.stat2 },
                  { end: 50, suffix: '+', label: t.hero.stat3 },
                  { end: 4, suffix: '', label: t.hero.stat4 },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center space-y-2">
                    <div className="h-0.5 w-8 bg-gradient-to-r from-dronek-green to-dronek-gold rounded-full mx-auto" />
                    <div className="text-4xl lg:text-5xl font-bold text-white">
                      <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                    </div>
                    <p className="text-white/80 text-xs lg:text-sm font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
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
            <span className="text-white/40 text-xs uppercase tracking-widest">Scroll</span>
            <ChevronDown className="w-5 h-5 text-white/50" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════
          SERVICES SECTION
          ═══════════════════════════════════ */}
      <section id="services-section" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-14 lg:mb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-4"
            >
              <motion.div variants={fadeInUp} className="flex justify-center">
                <div className="section-divider" />
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl lg:text-4xl font-bold text-dronek-text"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t.services.title}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-dronek-medium text-lg max-w-2xl mx-auto">
                {t.services.subtitle}
              </motion.p>
            </motion.div>
          </div>

          {/* Service cards grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {serviceCards.map((service) => {
              const Icon = service.icon;
              const serviceData = t.services[service.key];
              return (
                <motion.div key={service.key} variants={scaleIn}>
                  <div
                    className="card-premium group cursor-pointer bg-white rounded-2xl"
                    onClick={() => handleNav(service.page)}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={serviceData.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark/80 via-dronek-dark/30 to-transparent transition-all duration-500 group-hover:from-dronek-dark/60" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/0 group-hover:text-white/80 transition-all duration-300 translate-x-2 group-hover:translate-x-0" />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 pt-4">
                      <h3 className="text-lg font-bold text-dronek-text mb-2 group-hover:text-dronek-green transition-colors duration-300">{serviceData.name}</h3>
                      <p className="text-dronek-medium text-sm leading-relaxed line-clamp-2">{serviceData.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          POURQUOI CHOISIR DRONEK
          ═══════════════════════════════════ */}
      <Section className="bg-dronek-text relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pattern-dots-light opacity-30" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dronek-green/30 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14 lg:mb-20">
            <motion.div variants={fadeInUp} className="flex justify-center mb-4">
              <div className="section-divider" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl lg:text-4xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {lang === 'fr' ? 'Pourquoi Choisir DRONEK' : 'Why Choose DRONEK'}
            </motion.h2>
          </div>

          {/* Feature blocks */}
          <motion.div
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {whyFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.num} variants={fadeInUp} className="group">
                  <div className="relative p-6 lg:p-8 rounded-2xl border border-white/10 hover:border-dronek-green/30 transition-all duration-500 hover:bg-white/5">
                    <span
                      className="text-5xl font-bold text-dronek-green/20 absolute top-4 right-6"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {feature.num}
                    </span>
                    <div className="relative space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-dronek-green/10 flex items-center justify-center group-hover:bg-dronek-green/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-dronek-green" />
                      </div>
                      <h3 className="text-lg font-bold text-white">{feature.title(lang)}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.desc(lang)}</p>
                      <div className="h-0.5 w-8 bg-dronek-green/50 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
          FEATURED PROJECTS
          ═══════════════════════════════════ */}
      <Section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 lg:mb-20">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-4"
            >
              <motion.div variants={fadeInUp} className="flex justify-center">
                <div className="section-divider" />
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl lg:text-4xl font-bold text-dronek-text"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t.projects.title}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-dronek-medium text-lg max-w-2xl mx-auto">
                {t.projects.subtitle}
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {featuredProjects.map((project, idx) => (
              <motion.div key={idx} variants={scaleIn}>
                <div className="card-premium group cursor-pointer bg-white rounded-2xl" onClick={() => handleNav('projects')}>
                  <div className="relative h-72 overflow-hidden rounded-t-2xl">
                    <Image
                      src={`/images/${project.image}`}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/50" />
                    {/* Category badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-dronek-gold/90 text-white text-xs font-semibold backdrop-blur-sm">
                        {t.projects[project.sector as keyof typeof t.projects] || project.sector}
                      </span>
                    </div>
                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{project.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/70">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{project.location}</span>
                        <span>{project.year}</span>
                      </div>
                      {/* Hover button */}
                      <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        <span className="inline-flex items-center gap-1.5 text-sm text-white font-semibold">
                          {t.projects.caseStudy}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              className="border-dronek-green text-dronek-green hover:bg-dronek-green hover:text-white rounded-full px-8 transition-all duration-300 hover:scale-105"
              onClick={() => handleNav('projects')}
            >
              {t.projects.viewProject}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
          ACTUALITÉS — News Feed
          ═══════════════════════════════════ */}
      <Section className="bg-dronek-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="section-divider mx-auto mb-4" />
            <h2
              className="text-3xl lg:text-4xl font-bold text-dronek-text"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {lang === 'fr' ? 'Actualités' : 'News Feed'}
            </h2>
            <p className="text-dronek-medium mt-2 text-lg">
              {lang === 'fr' ? 'Suivez les dernières nouvelles de DRONEK' : 'Follow the latest DRONEK news'}
            </p>
          </div>

          {/* New Post Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setShowNewPost(!showNewPost)}
              className="bg-dronek-green hover:bg-dronek-dark text-white rounded-full px-6 py-2.5 text-sm font-semibold shadow-md transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              {lang === 'fr' ? 'Nouvelle publication' : 'New Post'}
            </Button>
          </div>

          {/* New Post Form */}
          <AnimatePresence>
            {showNewPost && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <Card className="border border-gray-200 shadow-lg p-6">
                  <CardContent className="p-0 space-y-4">
                    <div className="space-y-2">
                      <Label>{lang === 'fr' ? 'Titre' : 'Title'}</Label>
                      <Input
                        id="new-post-title"
                        placeholder={lang === 'fr' ? 'Titre de la publication...' : 'Post title...'}
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{lang === 'fr' ? 'Contenu' : 'Content'}</Label>
                      <Textarea
                        id="new-post-content"
                        placeholder={lang === 'fr' ? 'Décrivez votre actualité...' : 'Describe your news...'}
                        className="rounded-xl min-h-[80px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{lang === 'fr' ? 'URL de l\'image (optionnel)' : 'Image URL (optional)'}</Label>
                      <Input
                        id="new-post-image"
                        placeholder="https://..."
                        className="rounded-xl h-12"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowNewPost(false)}
                        className="rounded-full px-6"
                      >
                        {lang === 'fr' ? 'Annuler' : 'Cancel'}
                      </Button>
                      <Button
                        onClick={() => {
                          const titleInput = document.getElementById('new-post-title') as HTMLInputElement;
                          const contentInput = document.getElementById('new-post-content') as HTMLTextAreaElement;
                          const imageInput = document.getElementById('new-post-image') as HTMLInputElement;
                          const title = titleInput?.value?.trim();
                          const content = contentInput?.value?.trim();
                          const image = imageInput?.value?.trim();
                          if (title && content) {
                            setPosts(prev => [{
                              id: Date.now(),
                              title,
                              content,
                              image: image || '/images/hero-forest.jpg',
                              date: lang === 'fr' ? 'À l\'instant' : 'Just now',
                              likes: 0,
                              liked: false,
                            }, ...prev]);
                            setShowNewPost(false);
                            titleInput.value = '';
                            contentInput.value = '';
                            imageInput.value = '';
                          }
                        }}
                        className="bg-dronek-green hover:bg-dronek-dark text-white rounded-full px-6 shadow-md"
                      >
                        {lang === 'fr' ? 'Publier' : 'Publish'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Posts Feed */}
          <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: '#149655 #E8F5E9' }}>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardContent className="p-0">
                    {/* Post Header */}
                    <div className="flex items-center gap-3 p-5 pb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dronek-green to-dronek-dark flex items-center justify-center text-white font-bold text-sm shrink-0">
                        D
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-dronek-text text-sm">DRONEK</span>
                          <span
                            className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center cursor-help"
                            title={lang === 'fr' ? 'Page vérifiée' : 'Verified page'}
                          >
                            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          </span>
                        </div>
                        <p className="text-dronek-light-text text-xs">{post.date}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="px-5 pb-3">
                      <h3 className="font-bold text-dronek-text text-base mb-2">{post.title}</h3>
                      <p className="text-dronek-medium text-sm leading-relaxed">{post.content}</p>
                    </div>

                    {/* Post Image */}
                    {post.image && (
                      <div className="px-5 pb-3">
                        <div className="rounded-xl overflow-hidden aspect-[16/9] bg-gray-100">
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={600}
                            height={340}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center gap-6 px-5 py-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
                        }}
                        className="flex items-center gap-2 text-sm transition-colors duration-200"
                      >
                        <Heart className={cn('w-5 h-5 transition-colors duration-200', post.liked ? 'fill-red-500 text-red-500' : 'text-dronek-light-text hover:text-red-500')} />
                        <span className={cn('font-medium', post.liked ? 'text-red-500' : 'text-dronek-light-text')}>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-dronek-light-text hover:text-dronek-green transition-colors duration-200">
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">0</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-dronek-light-text hover:text-dronek-green transition-colors duration-200">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">{lang === 'fr' ? 'Partager' : 'Share'}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
          TESTIMONIALS — Carousel
          ═══════════════════════════════════ */}
      <Section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dronek-light via-white to-dronek-green/5" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with large quote mark */}
          <div className="text-center mb-14 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-4"
            >
              <motion.div variants={fadeIn} className="absolute -top-4 left-1/2 -translate-x-1/2 text-8xl text-dronek-green/10 leading-none select-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                &ldquo;
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl lg:text-4xl font-bold text-dronek-text pt-8"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t.testimonials.title}
              </motion.h2>
            </motion.div>
          </div>

          {/* Carousel */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={prevTestimonial}
              className="absolute -left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-dronek-medium hover:text-dronek-green hover:border-dronek-green/30 transition-all duration-300 hover:scale-110 hidden sm:flex"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={nextTestimonial}
              className="absolute -right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-dronek-medium hover:text-dronek-green hover:border-dronek-green/30 transition-all duration-300 hover:scale-110 hidden sm:flex"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Container */}
            <div className="overflow-hidden px-4 sm:px-10 lg:px-14">
              <AnimatePresence mode="wait" custom={1}>
                <motion.div
                  key={testimonialIndex}
                  custom={1}
                  variants={testimonialSlideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-50 text-center">
                    {/* Quote mark decoration */}
                    <div className="flex justify-center mb-6">
                      <div className="w-14 h-14 rounded-full bg-dronek-green/10 flex items-center justify-center">
                        <Quote className="w-7 h-7 text-dronek-green" />
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center justify-center gap-1.5 mb-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-dronek-gold text-dronek-gold" />
                      ))}
                    </div>

                    {/* Quote text */}
                    <p className="text-dronek-text text-lg lg:text-xl leading-relaxed italic max-w-3xl mx-auto mb-8">
                      &ldquo;{testimonials[testimonialIndex].text}&rdquo;
                    </p>

                    {/* Client info */}
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-dronek-green to-dronek-dark flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-dronek-green/20">
                        {testimonials[testimonialIndex].name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-dronek-text text-base">{testimonials[testimonialIndex].name}</p>
                        <p className="text-dronek-light-text text-sm">{testimonials[testimonialIndex].role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTestimonialIndex(idx)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    idx === testimonialIndex
                      ? 'w-8 h-2.5 bg-dronek-green'
                      : 'w-2.5 h-2.5 bg-dronek-green/25 hover:bg-dronek-green/40'
                  )}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            {/* Mobile arrows */}
            <div className="flex items-center justify-center gap-4 mt-4 sm:hidden">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-dronek-medium hover:text-dronek-green transition-all duration-300"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-dronek-medium hover:text-dronek-green transition-all duration-300"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════
          PARTNERS — Nos Partenaires
          ═══════════════════════════════════ */}
      <Section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-4"
            >
              <motion.div variants={fadeInUp} className="flex justify-center">
                <div className="section-divider" />
              </motion.div>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl lg:text-4xl font-bold text-dronek-text"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {lang === 'fr' ? 'Nos Partenaires' : 'Our Partners'}
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-dronek-medium text-lg max-w-2xl mx-auto">
                {lang === 'fr' ? 'Ils nous font confiance pour réaliser leurs projets' : 'They trust us to carry out their projects'}
              </motion.p>
            </motion.div>
          </div>

          {/* Auto-scrolling Partner Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden"
          >
            {/* Gradient fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            {/* Row 1 */}
            <div className="flex mb-6 hover:[animation-play-state:paused]" style={{ animation: 'marquee-scroll 30s linear infinite' }}>
              {[...partners, ...partners, ...partners].map((partner, idx) => (
                <a
                  key={`r1-${partner.name}-${idx}`}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 mx-3 group"
                >
                  <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 px-6 py-4 transition-all duration-300 hover:shadow-lg hover:border-dronek-green/30 hover:scale-105">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-110"
                      style={{ backgroundColor: partner.color }}
                    >
                      {partner.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-dronek-text text-sm group-hover:text-dronek-green transition-colors duration-300 whitespace-nowrap">
                        {partner.name}
                      </h3>
                      <p className="text-dronek-light-text text-xs truncate max-w-[160px]">
                        {partner.fullName}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Row 2 (reverse direction) */}
            <div className="flex hover:[animation-play-state:paused]" style={{ animation: 'marquee-scroll-reverse 30s linear infinite' }}>
              {[...partners.slice().reverse(), ...partners.slice().reverse(), ...partners.slice().reverse()].map((partner, idx) => (
                <a
                  key={`r2-${partner.name}-${idx}`}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 mx-3 group"
                >
                  <div className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 px-6 py-4 transition-all duration-300 hover:shadow-lg hover:border-dronek-green/30 hover:scale-105">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 transition-all duration-300 group-hover:shadow-lg group-hover:scale-110"
                      style={{ backgroundColor: partner.color }}
                    >
                      {partner.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-dronek-text text-sm group-hover:text-dronek-green transition-colors duration-300 whitespace-nowrap">
                        {partner.name}
                      </h3>
                      <p className="text-dronek-light-text text-xs truncate max-w-[160px]">
                        {partner.fullName}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Inline keyframe styles for marquee */}
          <style jsx>{`
            @keyframes marquee-scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
            @keyframes marquee-scroll-reverse {
              0% { transform: translateX(-33.333%); }
              100% { transform: translateX(0); }
            }
          `}</style>
        </div>
      </Section>

      {/* ═══════════════════════════════════
          RÉSERVATION DE RENDEZ-VOUS
          ═══════════════════════════════════ */}
      <Section className="bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-dronek-gold/10 text-dronek-gold border-dronek-gold/20 mb-4">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              {lang === 'fr' ? 'Prise de Rendez-vous' : 'Book Appointment'}
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-dronek-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              {lang === 'fr' ? 'Réservez Votre Consultation' : 'Book Your Consultation'}
            </h2>
            <div className="section-divider mx-auto mt-4" />
            <p className="text-dronek-medium mt-4 text-lg">
              {lang === 'fr' ? 'Prenez rendez-vous avec nos experts pour discuter de votre projet' : 'Meet with our experts to discuss your project'}
            </p>
          </div>

          <Card className="border border-gray-100 shadow-xl p-8 lg:p-10">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{lang === 'fr' ? 'Date souhaitée' : 'Preferred Date'}</Label>
                    <Input type="date" className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>{lang === 'fr' ? 'Créneau horaire' : 'Time Slot'}</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl h-12">
                        <SelectValue placeholder={lang === 'fr' ? 'Choisir un horaire' : 'Select a time'} />
                      </SelectTrigger>
                      <SelectContent>
                        {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{lang === 'fr' ? 'Votre nom' : 'Your name'}</Label>
                    <Input placeholder={lang === 'fr' ? 'Nom complet' : 'Full name'} className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label>{lang === 'fr' ? 'Sujet de la consultation' : 'Consultation topic'}</Label>
                    <Textarea placeholder={lang === 'fr' ? 'Décrivez brièvement votre besoin...' : 'Briefly describe your needs...'} className="rounded-xl min-h-[100px]" />
                  </div>
                </div>
              </div>
              <Button
                className="w-full mt-6 bg-gradient-to-r from-dronek-green to-dronek-dark hover:from-dronek-dark hover:to-dronek-green text-white rounded-full h-13 text-base font-semibold shadow-lg shadow-dronek-green/20"
                onClick={() => {
                  alert(lang === 'fr' ? 'Votre demande de rendez-vous a bien été envoyée ! Nous vous contacterons sous 24h.' : 'Your appointment request has been sent! We will contact you within 24h.');
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                {lang === 'fr' ? 'Confirmer le Rendez-vous' : 'Confirm Appointment'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
