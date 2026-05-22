'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, CheckCircle2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SuccessSection from './SuccessSection';
import { useLanguage } from './LanguageProvider';
import type { PageView } from './Navbar';
import { getProjectBySlug } from '@/lib/projects';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

interface ProjectDetailPageProps {
  slug: string;
  onNavigate: (page: PageView) => void;
}

export default function ProjectDetailPage({ slug, onNavigate }: ProjectDetailPageProps) {
  const { lang } = useLanguage();
  const project = getProjectBySlug(slug) ?? getProjectBySlug('inventaire-forestier-parc-national-tai');

  if (!project) return null;

  return (
    <div>
      <section className="relative min-h-[26rem] lg:min-h-[32rem] overflow-hidden flex items-end">
        <div className="absolute inset-0">
          <Image src={project.image} alt={project.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark/92 via-dronek-dark/65 to-dronek-dark/25" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12 w-full">
          <motion.div initial="hidden" animate="visible" className="max-w-4xl space-y-4">
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => onNavigate('projects')}
                className="rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {lang === 'fr' ? 'Retour aux projets' : 'Back to projects'}
              </Button>
              <Badge className="bg-white text-dronek-green border-0 text-xs font-semibold px-3 py-1.5 rounded-full">
                {project.categoryLabel}
              </Badge>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-3xl lg:text-6xl font-bold text-white leading-tight uppercase max-w-5xl">
              {project.title}
            </motion.h1>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-5 text-white/85 text-sm sm:text-base">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-dronek-green" />
                {project.location}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-dronek-green" />
                {project.year}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-10 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 lg:space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 lg:gap-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-white">
              <div className="relative h-[22rem] lg:h-[34rem]">
                <Image src={project.image} alt={project.title} fill className="object-cover" />
              </div>
            </motion.div>

            <div className="space-y-4 lg:space-y-6">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-3xl border border-gray-100 bg-[#f7f8f6] p-6 lg:p-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-dronek-text mb-4">{lang === 'fr' ? 'Description complète' : 'Full description'}</h2>
                <p className="text-dronek-medium leading-relaxed text-base lg:text-lg">{project.detail}</p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-3xl border border-gray-100 bg-white p-6 lg:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-dronek-text mb-4">{lang === 'fr' ? 'Objectifs' : 'Objectives'}</h3>
                <ul className="space-y-3">
                  {project.objectives.map((item) => (
                    <li key={item} className="flex gap-3 text-dronek-medium leading-relaxed">
                      <CheckCircle2 className="w-5 h-5 text-dronek-green mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:gap-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-3xl border border-gray-100 bg-white p-6 lg:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-dronek-text mb-4">{lang === 'fr' ? 'Résultats / impacts' : 'Results / impact'}</h3>
              <div className="space-y-3">
                {project.impacts.map((item) => (
                  <div key={item} className="rounded-2xl bg-dronek-light px-4 py-3 text-dronek-medium">
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="rounded-3xl border border-gray-100 bg-[#f7f8f6] p-6 lg:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-dronek-text mb-4">{lang === 'fr' ? 'Galerie' : 'Gallery'}</h3>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {project.gallery.map((image) => (
                  <div key={image} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image src={image} alt={project.title} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <SuccessSection onNavigate={onNavigate} />
    </div>
  );
}
