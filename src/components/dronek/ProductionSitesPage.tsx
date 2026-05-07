'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from './LanguageProvider';
import Partners from './Partners';
import type { PageView } from './Navbar';
import InteractiveMap from './InteractiveMap';
import { nurseryZones } from './NurseriesMap';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

interface ProductionSitesPageProps {
  onNavigate?: (page: PageView) => void;
}

export default function ProductionSitesPage({ onNavigate }: ProductionSitesPageProps) {
  const { lang, t } = useLanguage();
  const [sites, setSites] = React.useState<any[]>(t.production.sites);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, 'production_sites'), 
      where('status', 'in', ['Publié', 'Published']),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedSites = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSites(fetchedSites);
      } else {
        // Fallback to i18n static data if Firestore is empty
        setSites(t.production.sites);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching production sites:", error);
      setSites(t.production.sites);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [t.production.sites]);

  // Coordinate mapping for production sites
  const getSiteCoords = (site: any) => {
    if (site.lat && site.lng) {
      const lat = parseFloat(site.lat);
      const lng = parseFloat(site.lng);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }

    const loc = (site.location + " " + site.name).toLowerCase();
    if (loc.includes('abidjan')) return { lat: 5.3600, lng: -3.9800 };
    if (loc.includes('yamoussoukro')) return { lat: 6.8216, lng: -5.2764 };
    if (loc.includes('bonoua')) return { lat: 5.2719, lng: -3.5950 };
    if (loc.includes('san-pédro') || loc.includes('san pedro')) return { lat: 4.7500, lng: -6.6400 };
    if (loc.includes('daloa')) return { lat: 6.8900, lng: -6.4500 };
    if (loc.includes('bouaké') || loc.includes('bouake')) return { lat: 7.6900, lng: -5.0300 };
    if (loc.includes('korhogo')) return { lat: 9.4580, lng: -5.6290 };
    if (loc.includes('man')) return { lat: 7.4100, lng: -7.5500 };
    if (loc.includes('abengourou')) return { lat: 6.7290, lng: -3.4960 };
    if (loc.includes('gagnoa')) return { lat: 6.1320, lng: -5.9500 };
    if (loc.includes('divo')) return { lat: 5.8380, lng: -5.3570 };
    
    // Default fallback
    return { 
      lat: 5.3 + (Math.random() - 0.5) * 4, 
      lng: -4.0 + (Math.random() - 0.5) * 4 
    };
  };

  const sitesWithCoords = React.useMemo(() => [
    ...sites.map((site, idx) => ({
      ...site,
      id: site.id || `main-site-${idx}`,
      center: getSiteCoords(site)
    })),
    ...nurseryZones.map(zone => ({
      id: `nursery-zone-${zone.id}`,
      name: zone.nursery,
      location: `${zone.city}, Côte d'Ivoire`,
      center: zone.center,
      desc: lang === 'fr' ? `Site de production spécialisé - Zone ${zone.city}` : `Specialized production site - ${zone.city} Zone`
    }))
  ], [sites, lang]);

  return (
    <div className="bg-white">
      {/* 🚀 BANNER HERO */}
      <AnimatedSection className="relative h-auto min-h-[400px] flex items-start overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl">
        <div className="absolute inset-0">
          <Image 
            src="/images/nursery.jpg" 
            alt="Production Sites" 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark to-dronek-green opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-36 lg:pt-48 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
            <motion.div initial="hidden" animate="visible" className="flex-1 min-w-0">
                <motion.h1 
                  className="text-2xl lg:text-5xl font-montserrat-extrabold text-white leading-[1.1] uppercase tracking-tight"
                >
                  {t.production.title.split('').map((char: string, i: number) => (
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
                {t.production.subtitle}
              </motion.p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="bg-white">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10 lg:space-y-24">
          {sites.map((site: any, index: number) => {

            const image = (
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-[400px] lg:h-[500px] w-full relative">
                <Image src={site.image || '/images/nursery.jpg'} alt={site.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            );

            const content = (
              <div className="max-w-xl w-full p-8 lg:p-12 rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100/50 backdrop-blur-sm relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-dronek-green/5 rounded-full blur-3xl group-hover:bg-dronek-green/10 transition-colors duration-500" />
                
                <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-10 bg-dronek-green rounded-full" />
                      <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-montserrat-extrabold text-[#0f4c2e] leading-tight uppercase tracking-tight">
                        {site.name}
                      </h2>
                    </div>
                    
                    <p className="flex items-center gap-2 text-[#71807e] text-sm font-bold uppercase tracking-widest">
                      <MapPin className="w-4 h-4 text-dronek-green" />
                      {site.location}
                    </p>
                  </div>

                  <p className="text-[#1d3b34] text-base lg:text-lg leading-relaxed font-medium opacity-90 border-l-2 border-gray-100 pl-6 italic">
                    {site.desc || site.description}
                  </p>

                  <button 
                    onClick={() => {
                      const mapSection = document.getElementById('network-map');
                      if (mapSection) mapSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group/btn flex items-center gap-3 px-6 py-3 bg-[#114f2e] hover:bg-[#0f4c2e] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-black/5 active:scale-95"
                  >
                    Voir sur la carte
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );

            return (
              <div 
                key={site.id || site.name} 
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center"
              >
                {index % 2 === 0 ? (
                  <>
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>{content}</motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>{image}</motion.div>
                  </>
                ) : (
                  <>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:order-1">{image}</motion.div>
                    <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:order-2">{content}</motion.div>
                  </>
                )}
              </div>
            );
          })}
        </section>
        
        {/* Interactive Map Section */}
        <section id="network-map" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl lg:text-4xl font-montserrat-extrabold text-[#0f4c2e] uppercase tracking-tight">
                {lang === 'fr' ? 'Notre Réseau en Côte d\'Ivoire' : 'Our Network in Ivory Coast'}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                {lang === 'fr' 
                  ? 'Explorez nos sites de production et centres technologiques répartis stratégiquement sur l\'ensemble du territoire national.' 
                  : 'Explore our production sites and technological centers strategically distributed across the national territory.'}
              </p>
            </div>

            <InteractiveMap sites={sitesWithCoords} />
          </motion.div>
        </section>
      </div>

    </div>
  );
}
