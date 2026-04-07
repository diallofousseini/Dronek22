'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Download, TreePine, Navigation, Sprout, Wheat, BookOpen, Eye, BarChart3, ClipboardList, CalendarCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from './LanguageProvider';
import type { PageView } from './Navbar';
import { cn } from '@/lib/utils';

interface ServicesPageProps {
  service: 'forestry' | 'drone' | 'agroforestry' | 'agriculture';
  onNavigate: (page: PageView) => void;
}

const serviceConfig = {
  forestry: { icon: TreePine, image: '/images/hero-forest.jpg', color: 'from-dronek-dark to-dronek-green' },
  drone: { icon: Navigation, image: '/images/hero-drone.jpg', color: 'from-gray-800 to-gray-600' },
  agroforestry: { icon: Sprout, image: '/images/hero-agroforestry.jpg', color: 'from-green-800 to-green-600' },
  agriculture: { icon: Wheat, image: '/images/hero-agriculture.jpg', color: 'from-amber-800 to-amber-600' },
};

const allServiceKeys: Array<'forestry' | 'drone' | 'agroforestry' | 'agriculture'> = ['forestry', 'drone', 'agroforestry', 'agriculture'];

const processSteps = [
  { icon: Eye, labelFr: 'Consultation', labelEn: 'Consultation' },
  { icon: BarChart3, labelFr: 'Analyse', labelEn: 'Analysis' },
  { icon: ClipboardList, labelFr: 'Mise en Œuvre', labelEn: 'Implementation' },
  { icon: CalendarCheck, labelFr: 'Suivi', labelEn: 'Follow-up' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function ServicesPage({ service, onNavigate }: ServicesPageProps) {
  const { t, lang } = useLanguage();
  const config = serviceConfig[service];
  const data = t.services[service];
  const Icon = config.icon;

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-80 sm:h-96 lg:h-[28rem] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={config.image} alt={data.name} fill className="object-cover" priority />
          <div className={`absolute inset-0 bg-gradient-to-t ${config.color} opacity-85`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4">
              <span>{t.nav.services}</span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl lg:text-5xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {data.name}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-2xl leading-relaxed">
              {data.fullDesc}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-muted border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-dronek-light-text">
            <button onClick={() => handleNav('home')} className="hover:text-dronek-green transition-colors">{t.nav.home}</button>
            <span>/</span>
            <span className="text-dronek-green font-medium">{data.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Left: Services list with numbered items */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={stagger}
              className="lg:col-span-3 space-y-4"
            >
              <motion.h2
                variants={fadeInUp}
                className="text-2xl lg:text-3xl font-bold text-dronek-text mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {data.name}
              </motion.h2>
              <motion.div variants={fadeInUp} className="section-divider mb-8" />

              {data.items.map((item, idx) => (
                <motion.div key={idx} variants={scaleIn}>
                  <div className="group p-5 rounded-2xl border border-gray-100 hover:border-dronek-green/20 hover:bg-dronek-light/30 transition-all duration-300 hover:shadow-md cursor-default">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-dronek-green text-white flex items-center justify-center text-sm font-bold">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-semibold text-dronek-text mb-1 group-hover:text-dronek-green transition-colors">{item.title}</h3>
                        <p className="text-dronek-medium text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right: Sticky image + benefits card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={stagger}
              className="lg:col-span-2 space-y-6 lg:sticky lg:top-28 lg:self-start"
            >
              {/* Image */}
              <motion.div variants={fadeInUp} className="relative h-64 rounded-2xl overflow-hidden shadow-lg">
                <Image src={config.image} alt={data.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark/40 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="glass rounded-xl px-4 py-2 flex items-center gap-2">
                    <Icon className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-sm">{data.name}</span>
                  </div>
                </div>
              </motion.div>

              {/* Benefits glass card */}
              <motion.div variants={fadeInUp}>
                <div className="rounded-2xl p-6 border border-dronek-green/10 bg-dronek-green/[0.03]">
                  <h3 className="text-lg font-bold text-dronek-text mb-4">
                    ✅ {lang === 'fr' ? 'Avantages Clés' : 'Key Benefits'}
                  </h3>
                  <div className="space-y-3">
                    {data.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-dronek-green/10 flex items-center justify-center shrink-0">
                          <CheckCircle className="w-3 h-3 text-dronek-green" />
                        </div>
                        <span className="text-sm text-dronek-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => handleNav('contact')}
                  className="flex-1 bg-gradient-to-r from-dronek-green to-dronek-dark hover:from-dronek-dark hover:to-dronek-green text-white rounded-full px-6 shadow-lg shadow-dronek-green/15"
                >
                  {t.services.requestQuote}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-dronek-green/30 text-dronek-green hover:bg-dronek-light rounded-full px-6"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t.services.downloadSheet}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process / Steps */}
      <section className="section-padding bg-muted pattern-dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.div variants={fadeInUp} className="flex justify-center mb-4">
              <div className="section-divider" />
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl font-bold text-dronek-text"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {lang === 'fr' ? 'Notre Processus' : 'Our Process'}
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {processSteps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <motion.div key={idx} variants={scaleIn} className="text-center group">
                  <div className="relative mx-auto w-20 h-20 rounded-2xl bg-white border border-gray-100 shadow-md flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:border-dronek-green/20 transition-all duration-300 group-hover:-translate-y-1">
                    <StepIcon className="w-8 h-8 text-dronek-green" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-dronek-green text-white text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-semibold text-dronek-text">{lang === 'fr' ? step.labelFr : step.labelEn}</h3>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-dronek-dark to-dronek-green relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots-light opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="space-y-6"
          >
            <motion.h2 variants={fadeInUp} className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.cta.title}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/80">{t.cta.desc}</motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                onClick={() => handleNav('contact')}
                size="lg"
                className="bg-dronek-gold hover:bg-amber-600 text-white rounded-full px-10 font-semibold shadow-lg shadow-dronek-gold/25 transition-all duration-300 hover:scale-105"
              >
                {t.cta.button}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
