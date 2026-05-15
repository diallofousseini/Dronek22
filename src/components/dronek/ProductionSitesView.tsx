'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Layers } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { supabase } from '@/lib/supabase';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

type Stat = {
  label: string;
  value: string;
  progress: number;
  icon: any;
  color: string;
};

type ProductionCard = {
  badge: string;
  title: string;
  location: string;
  desc: string;
  employees: string;
  services: string[];
  image: string;
  stats?: Stat[];
};

export default function ProductionSitesView() {
  const { lang } = useLanguage();
  const [dynamicCards, setDynamicCards] = React.useState<ProductionCard[]>([]);

  React.useEffect(() => {
    const fetchSites = async () => {
      const { data } = await supabase
        .from('production_sites')
        .select('*')
        .in('statut', ['publie', 'Publié', 'Published', 'actif'])
        .order('created_at', { ascending: true });
      
      if (data && data.length > 0) {
        const dynamic = data.map(site => {
          let imageUrl = site.image_url || site.image || '/images/hero-forest.jpg';
          return {
            badge: lang === 'fr' ? 'Site Opérationnel' : 'Operational Site',
            title: site.nom || site.name || 'Site',
            location: site.localisation || site.location || '',
            desc: site.description || site.desc || site.description_courte || site.content || (lang === 'fr' ? 'Installation spécialisée.' : 'Specialized facility.'),
            employees: site.employees || (lang === 'fr' ? 'Équipe Dronek' : 'Dronek Team'),
            services: site.services ? site.services.split(',').map((s: string) => s.trim()) : [],
            image: imageUrl,
            stats: [
              { label: 'CAPACITÉ', value: site.capacite || site.capacity || 'N/A', progress: 85, icon: Layers, color: 'bg-[#114f2e]' },
              { label: 'SUPERFICIE', value: site.surface || 'N/A', progress: 100, icon: MapPin, color: 'bg-[#114f2e]' }
            ]
          };
        });

        // Deduplicate
        const staticNames = new Set(defaultCards.map(c => c.title.toLowerCase().trim()));
        const filteredDynamic = dynamic.filter(card => !staticNames.has(card.title.toLowerCase().trim()));

        setDynamicCards(filteredDynamic);
      }
    };

    fetchSites();

    const sub = supabase.channel('sites-all').on('postgres_changes', { event: '*', schema: 'public', table: 'production_sites' }, fetchSites).subscribe();
    return () => { sub.unsubscribe(); };
  }, [lang]);

  const defaultCards: ProductionCard[] = [
    {
      badge: lang === 'fr' ? 'Centre Opérationnel' : 'Operational Center',
      title: lang === 'fr' ? 'Site de Bonoua' : 'Bonoua Site',
      location: lang === 'fr' ? "Bonoua, Cote d'Ivoire" : 'Bonoua, Côte d’Ivoire',
      desc: lang === 'fr'
        ? "Siège opérationnel coordonnant les missions de cartographie aérienne en secteurs agricole, agroforestier et forestier. Centre d'excellence pour la planification stratégique, le traitement des données et le contrôle qualité."
        : 'Operational headquarters coordinating aerial mapping missions in agricultural, agroforestry and forestry sectors. A center of excellence for strategic planning, data processing and quality control.',
      employees: lang === 'fr' ? '46 personnes' : '46 people',
      services: [lang === 'fr' ? 'Agroforesterie' : 'Agroforestry', lang === 'fr' ? 'Traitement données' : 'Data processing', lang === 'fr' ? 'Assurance qualité' : 'Quality assurance'],
      image: '/images/nursery.jpg',
      stats: [
        { 
          label: lang === 'fr' ? 'CAPACITÉ' : 'CAPACITY', 
          value: '150 000 plants/an', 
          progress: 85, 
          icon: Layers, 
          color: 'bg-gradient-to-r from-[#114f2e] to-[#c5a059]' 
        },
        { 
          label: lang === 'fr' ? 'SUPERFICIE' : 'SURFACE', 
          value: '8 hectares', 
          progress: 100, 
          icon: MapPin, 
          color: 'bg-[#114f2e]' 
        },
      ]
    },
    {
      badge: lang === 'fr' ? 'Hub Géospatial' : 'Geospatial Hub',
      title: lang === 'fr' ? 'Site de Yamoussoukro' : 'Yamoussoukro Site',
      location: lang === 'fr' ? "Yamoussoukro, Cote d'Ivoire" : 'Yamoussoukro, Côte d’Ivoire',
      desc: lang === 'fr'
        ? "Installation géospatiale avancée spécialisée en cartographie par drone, génération d'orthomosaïques, analyse végétale (NDVI), levés topographiques et modélisation 3D pour secteurs agricoles et industriels."
        : 'Advanced geospatial facility specialized in drone mapping, orthomosaic generation, vegetation analysis (NDVI), topographic surveys and 3D modeling for agricultural and industrial sectors.',
      employees: lang === 'fr' ? '29 personnes' : '29 people',
      services: [lang === 'fr' ? 'Cartographie par drone' : 'Drone mapping', 'Analyse NDVI', 'Modélisation 3D'],
      image: '/images/project-forest.jpg',
      stats: [
        { 
          label: lang === 'fr' ? 'CAPACITÉ' : 'CAPACITY', 
          value: '100 000 plants/an', 
          progress: 95, 
          icon: Layers, 
          color: 'bg-gradient-to-r from-[#114f2e] to-[#c5a059]' 
        },
        { 
          label: lang === 'fr' ? 'SUPERFICIE' : 'SURFACE', 
          value: '5 hectares', 
          progress: 100, 
          icon: MapPin, 
          color: 'bg-[#114f2e]' 
        },
      ]
    },
  ];

  const cards = dynamicCards.length > 0 ? [...defaultCards, ...dynamicCards] : defaultCards;

  return (
    <div className="bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10 lg:space-y-16">
        {cards.map((card, index) => {
            const image = (
              <div className="rounded-[1.25rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)] aspect-[1200/760] relative">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="absolute inset-0 w-full h-full object-cover" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/images/hero-forest.jpg') {
                      target.src = '/images/hero-forest.jpg';
                    }
                  }}
                />
              </div>
            );

          const text = (
            <div className="max-w-xl">
              <span className="inline-flex items-center rounded-full bg-[#114f2e] px-4 py-1.5 text-sm font-semibold text-white">
                {card.badge}
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.4rem] font-bold text-[#0f4c2e] leading-tight">
                {card.title}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-[#71807e] text-sm">
                <MapPin className="w-4 h-4" />
                {card.location}
              </p>
              <p className="mt-4 text-[#1d3b34] text-[15px] sm:text-lg leading-7">
                {card.desc}
              </p>

              {card.stats && (
                <div className="mt-8 space-y-6">
                  {card.stats.map((stat, sIdx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={sIdx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                              <Icon className="w-4 h-4 text-[#114f2e]" />
                            </div>
                            <span className="text-xs font-black text-[#114f2e] uppercase tracking-widest">
                              {stat.label}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-[#0f2a24]">
                            {stat.value}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stat.progress}%` }}
                            transition={{ duration: 1, delay: 0.3 + (sIdx * 0.2) }}
                            className={`h-full rounded-full ${stat.color}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-10 space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-[#71807e] uppercase tracking-[0.2em]">Employés</p>
                    <p className="text-lg font-bold text-[#0f4c2e]">{card.employees}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-[#71807e] uppercase tracking-[0.2em]">Services</p>
                    <div className="mt-1 flex flex-wrap gap-1.5 justify-end">
                      {card.services.map((label) => (
                        <span key={label} className="text-[11px] font-bold text-[#0f4c2e] bg-[#f3f4f5] px-2.5 py-1 rounded-md">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">
              {index % 2 === 0 ? (
                <>
                  {text}
                  {image}
                </>
              ) : (
                <>
                  {image}
                  {text}
                </>
              )}
            </motion.div>
          );
        })}
      </section>
    </div>
  );
}
