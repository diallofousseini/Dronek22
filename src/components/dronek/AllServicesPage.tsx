'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, TreePine, Navigation, Sprout, Wheat, ShieldCheck, X, Download, Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import AnimatedSection from './AnimatedSection';
import Partners from './Partners';
import type { PageView } from './Navbar';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const serviceIcons: Record<string, any> = {
  forestry: TreePine,
  drone: Navigation,
  surveillance: ShieldCheck,
  agriculture: Wheat,
};

const serviceImages: Record<string, string> = {
  forestry: '/images/hero-forest.jpg',
  drone: '/images/hero-drone.jpg',
  surveillance: '/images/hero-agroforestry.jpg',
  agriculture: '/images/hero-agriculture.jpg',
};

interface AllServicesPageProps {
  onNavigate: (page: PageView) => void;
}

export default function AllServicesPage({ onNavigate }: AllServicesPageProps) {
  const { lang, t } = useLanguage();
  const defaultServices = [
    {
      id: 'forestry',
      title: t.services.forestry?.name || (lang === 'fr' ? 'Foresterie' : 'Forestry'),
      description: lang === 'fr' ? 'Nous proposons de nombreux services dans l\'accompagnement des projets d\'agroforesterie, de reboisement et d\'aménagement des forêts.' : 'We offer numerous services in supporting agroforestry, reforestation, and forest management projects.',
      image: '/images/hero-forest.jpg',
      pdfUrl: '/pdf/fiche-technique-forestry.pdf',
      items: t.services.forestry?.items || [
        { title: "Formations aux métiers forestiers (pépiniéristes, sylviculteurs, aménagistes forestiers)" },
        { title: "Production de plantes maraîchers par la mise en place de pépinières" },
        { title: "Inventaire forestier et faunique" },
        { title: "Suivi de reboisement" }
      ]
    },
    {
      id: 'drone',
      title: t.services.drone?.name || (lang === 'fr' ? 'Drone et Cartographie' : 'Drone and Mapping'),
      description: '',
      image: '/images/hero-drone.jpg',
      pdfUrl: '/pdf/fiche-technique-drone.pdf',
      items: t.services.drone?.items || [
        { title: "TOPOGRAPHIE. Relevés topographiques aériens, modèles numériques de terrain..." },
        { title: "MODÉLISATION. Modélisation 3D par photogrammétrie, nuages de points LiDAR..." },
        { title: "INSPECTION. Inspection d'ouvrages sans risque, détection d'anomalies structurelles..." },
        { title: "SUIVI. Suivi de chantier BIM, mesure de volumes, contrôle d'avancement..." }
      ]
    },
    {
      id: 'surveillance',
      title: t.services.surveillance?.name || (lang === 'fr' ? 'Agroforesterie' : 'Agroforestry'),
      description: '',
      image: '/images/hero-agroforestry.jpg',
      pdfUrl: '/pdf/fiche-technique-surveillance.pdf',
      items: t.services.surveillance?.items || [
        { title: "CONSEIL. Accompagnement technique pour la mise en place de parcelles agroforestières..." },
        { title: "PLANTS. Fourniture de plants forestiers et fruitiers sélectionnés..." },
        { title: "FORMATION. Sessions de formation pratique sur les techniques d'entretien..." },
        { title: "SUIVI. Suivi pluriannuel du développement des arbres et évaluation de l'impact..." }
      ]
    },
    {
      id: 'agriculture',
      title: t.services.agriculture?.name || (lang === 'fr' ? 'Agriculture' : 'Agriculture'),
      description: '',
      image: '/images/hero-agriculture.jpg',
      pdfUrl: '/pdf/fiche-technique-agriculture.pdf',
      items: t.services.agriculture?.items || [
        { title: "Audit, renforcement des capacités et conseils en agroéconomie" },
        { title: "Appui à la diversification des activités agricoles" },
        { title: "Formation sur les techniques d'élevage" },
        { title: "Formation des producteurs sur les bonnes pratiques agricoles (BPA)" }
      ]
    }
  ];

  const [selectedService, setSelectedService] = React.useState<any | null>(null);
  const [services, setServices] = React.useState<any[]>(defaultServices);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!db) return;
    
    const q = query(
      collection(db, 'services'), 
      where('status', 'in', ['Publié', 'Published']),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedServices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (fetchedServices.length > 0) {
        setServices(fetchedServices);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [lang, t]);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Logic to scroll to a specific service if requested (from Home page)
    const scrollToId = sessionStorage.getItem('scroll_to_service');
    if (scrollToId) {
      // Small delay to ensure the cards are rendered and the stack effect is ready
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) {
          const yOffset = -100; // Account for header height
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
        sessionStorage.removeItem('scroll_to_service');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const initScrollEffect = () => {
      const cards = document.querySelectorAll('.stack-card');
      if (cards.length === 0) return;

      const handleScroll = () => {
        cards.forEach((card, index) => {
          const nextCard = cards[index + 1];
          if (!nextCard) return;

          const rect = nextCard.getBoundingClientRect();
          const nextStickyTop = 120; 
          const triggerDistance = 400; 
          
          const distance = rect.top - nextStickyTop;
          
          if (distance < triggerDistance) {
            const progress = Math.max(0, Math.min(1, 1 - (distance / triggerDistance)));
            (card as HTMLElement).style.transform = `scale(${1 - progress * 0.05})`;
            (card as HTMLElement).style.filter = `brightness(${1 - progress * 0.25})`;
            (card as HTMLElement).style.opacity = `${1 - progress * 0.2}`;
          } else {
            (card as HTMLElement).style.transform = 'scale(1)';
            (card as HTMLElement).style.filter = 'brightness(1)';
            (card as HTMLElement).style.opacity = '1';
          }
        });
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    };

    initScrollEffect();
  }, []);

  return (
    <div className="bg-white">
      {/* 🚀 BANNER HERO */}
      <AnimatedSection className="relative h-auto min-h-[400px] flex items-start overflow-hidden rounded-[2.5rem] lg:rounded-tl-[10rem] lg:rounded-br-[10rem] mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl">
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-agriculture.jpg" 
            alt="Dronek Services" 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark to-dronek-green opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-36 lg:pt-48 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
            <motion.div initial="hidden" animate="visible" className="flex-1 min-w-0">
                <motion.h1 
                  className="text-2xl lg:text-5xl font-montserrat-extrabold text-white leading-[1.1] uppercase tracking-tight"
                >
                  {t.nav.services.split('').map((char: string, i: number) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.1, delay: i * 0.03 }}
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </motion.h1>
            </motion.div>

            <div className="lg:max-w-md">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-white/80 text-sm lg:text-base font-medium leading-relaxed"
              >
                {lang === 'fr' 
                  ? 'Découvrez l\'ensemble de nos solutions technologiques au service de la nature et de l\'agriculture.' 
                  : 'Discover all our technological solutions serving nature and agriculture.'}
              </motion.p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 🌟 INTRODUCTION SECTION */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h2 className="text-2xl lg:text-3xl font-montserrat-extrabold text-dronek-dark uppercase tracking-tight">
            DRONEK propose plusieurs services
          </h2>
          <div className="w-16 h-1 bg-dronek-green mx-auto mb-6" />
          <p className="text-base lg:text-lg text-dronek-medium leading-relaxed font-medium">
            Dronek se distingue par une solide expertise technique et une maîtrise des innovations technologiques, 
            lui permettant de fournir des services efficaces et performants dans les secteurs de la foresterie et de l'agriculture.
          </p>
        </motion.div>
      </div>
      
      {/* Services List — Sticky Stack */}
      <div 
        id="stack-container"
        className="relative pt-12 pb-0" 
        style={{ 
          minHeight: `${Math.max(1, services.length) * 85}vh`,
        }}
      >
        {/* Decorative Fixed Background Image */}
        <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none select-none flex items-center justify-center">
          <div className="relative w-full h-screen max-w-[800px] sticky top-20">
            <Image 
              src="/images/dronek_image3.png" 
              alt="" 
              fill
              className="object-contain grayscale"
              priority
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="relative block">
            {services.map((service, sIdx) => {
              
              return (
                <motion.div
                  key={service.id}
                  id={service.id}
                  initial={{ clipPath: 'inset(100% 0 0 0)' }}
                  whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-50px" }}
                  style={{
                    position: 'sticky',
                    top: `${100 + sIdx * 30}px`,
                    zIndex: 20 + sIdx,
                    height: '70vh',
                    marginBottom: sIdx === services.length - 1 ? '10vh' : '40vh',
                    background: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                  }}
                  className={`stack-card stack-card-${sIdx} w-full group`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] h-full">
                    {/* Left side: Image */}
                    <div className="relative h-64 md:h-full overflow-hidden cursor-pointer rounded-r-[2rem] z-10" onClick={() => setSelectedService(service)}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={service.image || '/images/hero-forest.jpg'}
                          alt={service.title}
                          fill
                          className="object-cover"
                          priority={sIdx === 0}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      </motion.div>
                    </div>

                    {/* Right side: Content */}
                    <div className="p-8 lg:p-14 flex flex-col justify-center h-full relative overflow-hidden bg-white/90 backdrop-blur-sm z-0">
                      <div className="relative z-10">


                        <h2 className="text-4xl lg:text-5xl font-black text-black leading-[1.05] mb-6 uppercase tracking-tight">
                          {service.title}
                        </h2>

                        {service.description && (
                          <p className="text-gray-600 font-medium text-lg lg:text-xl leading-relaxed mb-6 line-clamp-3">
                            {service.description}
                          </p>
                        )}

                        {/* Items List - Restored for exact match */}
                        {service.items && service.items.length > 0 && (
                          <div className="flex flex-col gap-3 mb-10 w-full">
                            {service.items.slice(0, 4).map((item: any, iIdx: number) => (
                              <div key={iIdx} className="flex items-start gap-3 group/item">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dronek-green shrink-0" />
                                <span className="text-[14px] lg:text-[15px] text-gray-700 font-semibold leading-snug group-hover/item:text-dronek-green transition-colors">
                                  {item.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <button 
                          onClick={() => setSelectedService(service)}
                          className="inline-flex items-center gap-3 bg-dronek-green hover:bg-dronek-dark text-white px-8 py-5 rounded-full font-bold transition-all shadow-lg shadow-dronek-green/30 group/btn"
                        >
                          <span className="uppercase tracking-widest text-sm">{lang === 'fr' ? 'En savoir plus' : 'Learn more'}</span>
                          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>



      {/* 🚀 Premium Popup for Services */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Close Button Mobile */}
              <button 
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 z-50 md:hidden bg-white/80 backdrop-blur-md rounded-full p-2 shadow-lg"
              >
                <X className="w-6 h-6 text-black" />
              </button>
              
              {/* Intro Text Side */}
              <div className="md:w-1/2 relative min-h-[300px] md:h-auto bg-[#1a4a2e] flex flex-col justify-center p-8 lg:px-12 lg:pb-12 lg:pt-10 text-white overflow-hidden">
                {/* Subtle background texture */}
                <div className="absolute inset-0 z-0 opacity-10 grayscale brightness-200 p-10 lg:p-20">
                  <Image 
                    src={selectedService.image || "/images/dronek_image3-removebg-preview.png"} 
                    alt="" 
                    fill 
                    className="object-cover opacity-30 mix-blend-overlay" 
                  />
                </div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center">
                   <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight mb-4">
                      {selectedService.title}
                   </h2>
                </div>
              </div>

              {/* Content Side */}
              <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto">
                <div className="flex items-center justify-end mb-4">
                  <button onClick={() => setSelectedService(null)} className="hidden md:block hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-gray-300 hover:text-black" />
                  </button>
                </div>

                <div className="space-y-8">
                  {selectedService.description && (
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base font-medium">
                      {selectedService.description}
                    </p>
                  )}

                  {/* Restored Modal Items */}
                  {selectedService.items && selectedService.items.length > 0 && (
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-1 gap-3">
                        {selectedService.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-dronek-green" />
                            <p className="text-sm text-gray-700 font-medium">{item.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-6 space-y-3">
                    {selectedService.pdfUrl && (
                      <a 
                        href={selectedService.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white border-2 border-dronek-green text-dronek-green hover:bg-dronek-green hover:text-white font-extrabold py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 shadow-sm"
                      >
                        <Download className="w-5 h-5" />
                        <span>{lang === 'fr' ? 'Télécharger la fiche technique' : 'Download technical sheet'}</span>
                      </a>
                    )}

                    <button 
                      onClick={() => setSelectedService(null)}
                      className="w-full bg-dronek-green hover:bg-dronek-dark text-white font-extrabold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3"
                    >
                      <span>{lang === 'fr' ? 'Fermer' : 'Close'}</span>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
