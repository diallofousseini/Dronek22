'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, User, Layers, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import type { PageView } from './Navbar';

interface ProductionSitesPageProps {
  onNavigate: (page: PageView) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function ProductionSitesPage({ onNavigate }: ProductionSitesPageProps) {
  const { t } = useLanguage();

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-80 sm:h-96 lg:h-[28rem] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/nursery.jpg" alt="Production Sites" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark/90 via-dronek-dark/50 to-dronek-dark/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl lg:text-5xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.production.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-2xl">
              {t.production.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Sites Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {t.production.sites.map((site, idx) => (
              <motion.div key={idx} variants={scaleIn}>
                <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white border border-gray-100 h-full group">
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={`/images/${site.image}`}
                      alt={site.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white">{site.name}</h3>
                      <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {site.location}
                      </p>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-5">
                    <p className="text-dronek-medium text-sm leading-relaxed">{site.desc}</p>

                    {/* Capacity stats with visual bar */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-dronek-green uppercase tracking-wider flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5" />
                            Capacité
                          </span>
                          <span className="text-sm font-bold text-dronek-text">{site.capacity}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-dronek-green to-dronek-gold rounded-full"
                            style={{ width: idx === 0 ? '100%' : '60%' }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-dronek-green uppercase tracking-wider flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            Superficie
                          </span>
                          <span className="text-sm font-bold text-dronek-text">{site.area}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-dronek-dark to-dronek-green rounded-full"
                            style={{ width: idx === 0 ? '100%' : '60%' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Manager info */}
                    <div className="flex items-center gap-3 bg-dronek-light/50 rounded-xl p-3.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dronek-green to-dronek-dark flex items-center justify-center text-white text-sm font-bold">
                        {site.manager.split(' ').pop()?.[0]}
                      </div>
                      <div>
                        <p className="text-dronek-text font-semibold text-sm">{site.manager}</p>
                        <p className="text-dronek-light-text text-xs">{site.managerRole}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-padding bg-muted relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-10">
            <h2 className="text-2xl lg:text-3xl font-bold text-dronek-text mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Localisation de nos Sites
            </h2>
            <p className="text-dronek-medium">Retrouvez nos pépinières sur la carte</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative h-80 lg:h-[400px] rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-200"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-dronek-green/10 flex items-center justify-center mx-auto animate-pulse-glow">
                  <MapPin className="w-8 h-8 text-dronek-green" />
                </div>
                <div>
                  <p className="font-semibold text-dronek-text text-lg">Côte d&apos;Ivoire</p>
                  <p className="text-sm text-dronek-medium">Abidjan • Yamoussoukro</p>
                </div>
                <div className="flex items-center justify-center gap-6 text-sm text-dronek-medium">
                  <span className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-dronek-green" />
                    Pépinière d&apos;Abidjan
                  </span>
                  <span className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-dronek-gold" />
                    Pépinière de Yamoussoukro
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 opacity-5">
              <svg width="100%" height="100%" className="text-dronek-green">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-dronek-dark to-dronek-green relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots-light opacity-15" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.cta.title}
          </h2>
          <p className="text-white/80 mb-6">{t.cta.desc}</p>
          <Button
            onClick={() => handleNav('contact')}
            size="lg"
            className="bg-dronek-gold hover:bg-amber-600 text-white rounded-full px-10 font-semibold shadow-lg shadow-dronek-gold/25 transition-all duration-300 hover:scale-105"
          >
            {t.cta.button}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
