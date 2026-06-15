'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Loader2 } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from './LanguageProvider';
import Partners from './Partners';
import type { PageView } from './Navbar';
import dynamic from 'next/dynamic';
const InteractiveMap = dynamic(() => import('./InteractiveMap'), { ssr: false });
import { nurseryZones } from './NurseriesMap';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

interface ProductionSitesPageProps {
  onNavigate?: (page: PageView) => void;
}

export default function ProductionSitesPage({ onNavigate }: ProductionSitesPageProps) {
  const { lang, t } = useLanguage();
  const [sites, setSites] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [focusedSiteId, setFocusedSiteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSites = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('production_sites')
        .select('*')
        .in('statut', ['publie', 'Publié', 'Published'])
        .order('created_at', { ascending: false });
      
      if (data && data.length > 0) {
        const dynamicSites = data.map(site => {
          let imageUrl = site.image_url || site.image || '';
          return {
            ...site,
            name: site.nom || site.name || 'Site de production',
            location: site.localisation || site.location || '',
            image: imageUrl,
            desc: site.description || site.desc || site.description_courte || site.content || ''
          };
        });
        
        setSites(dynamicSites);
      } else {
        setSites([]);
      }
      setLoading(false);
    };

    fetchSites();
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
    if (loc.includes('tiassalé') || loc.includes('tiassale')) return { lat: 5.8983, lng: -4.8239 };
    if (loc.includes('agboville')) return { lat: 5.9271, lng: -4.2188 };
    if (loc.includes('lakota')) return { lat: 5.8475, lng: -5.6820 };
    if (loc.includes('soubré') || loc.includes('soubre')) return { lat: 5.7875, lng: -6.5878 };
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

  const sitesWithCoords = React.useMemo(() => {
    const allSites = [
      ...sites.map((site, idx) => ({
        ...site,
        id: site.id || `main-site-${idx}`,
        center: getSiteCoords(site)
      }))
    ];

    return allSites;
  }, [sites, lang]);

  return (
    <div className="bg-white">
      {/* 🚀 BANNER HERO */}
      <AnimatedSection className="relative h-auto min-h-[250px] flex items-start overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl">
        <div className="absolute inset-0">
          <Image 
            src="/IMAGE SITE WEB/Bannière site de production.jpg" 
            alt="Production Sites" 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-12">
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
                className="text-white text-sm lg:text-base font-bold leading-relaxed"
              >
                {t.production.subtitle}
              </motion.p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <div className="bg-white">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10 lg:space-y-24">
          {sitesWithCoords.filter(s => !s.id.startsWith('nursery-zone')).map((site: any, index: number) => {

            const image = (
              <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] h-[300px] sm:h-[400px] lg:h-[500px] w-full relative">
                <img 
                  src={site.image || '/images/nursery.jpg'} 
                  alt={site.name} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/images/nursery.jpg') {
                      target.src = '/images/nursery.jpg';
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            );

            const content = (
              <div className="max-w-xl w-full p-8 lg:p-12 relative overflow-hidden group flex flex-col items-center text-center">
                <div className="relative z-10 space-y-8 flex flex-col items-center">
                  <div className="space-y-4 flex flex-col items-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-montserrat-extrabold text-[#0f4c2e] leading-tight uppercase tracking-tight">
                      {site.name}
                    </h2>
                    
                    <p className="flex items-center gap-2 text-[#71807e] text-sm font-bold uppercase tracking-widest">
                      <MapPin className="w-4 h-4 text-dronek-green" />
                      {site.location}
                    </p>
                  </div>

                  <div className="mt-10 flex justify-center">
                    <button 
                      onClick={() => {
                        setFocusedSiteId(site.id);
                        const mapSection = document.getElementById('network-map');
                        if (mapSection) mapSection.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group/btn flex items-center gap-3 px-8 py-3.5 bg-green-900 hover:bg-green-800 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-lg shadow-black/5 active:scale-95"
                    >
                      {lang === 'fr' ? 'Voir sur la carte' : 'View on map'}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
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
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>{content}</motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>{image}</motion.div>
                  </>
                ) : (
                  <>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:order-1">{image}</motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:order-2">{content}</motion.div>
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
              <p className="text-[#71807e] max-w-2xl mx-auto text-lg font-medium">
                {lang === 'fr' 
                  ? 'Explorez nos sites de production et centres technologiques répartis stratégiquement sur l\'ensemble du territoire national.' 
                  : 'Explore our production sites and technological centers strategically distributed across the national territory.'}
              </p>
            </div>

            <InteractiveMap sites={sitesWithCoords} focusedSiteId={focusedSiteId} />
          </motion.div>
        </section>
      </div>

    </div>
  );
}
