'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from './LanguageProvider';
import { cn } from '@/lib/utils';
import type { PageView } from './Navbar';

interface ProjectsPageProps {
  onNavigate: (page: PageView) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const filters = [
    { key: 'all', label: t.projects.all },
    { key: 'forestry', label: t.projects.forestry },
    { key: 'agriculture', label: t.projects.agriculture },
    { key: 'drone', label: t.projects.drone },
    { key: 'agroforestry', label: t.projects.agroforestry },
  ];

  const filteredProjects = filter === 'all'
    ? t.projects.items
    : t.projects.items.filter((p) => p.sector === filter);

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selected = selectedProject !== null ? t.projects.items[selectedProject] : null;

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative h-80 sm:h-96 lg:h-[28rem] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/project-forest.jpg" alt="Projects" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark/90 via-dronek-dark/60 to-dronek-dark/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-4">
              <span>DRONEK</span>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-3xl lg:text-5xl font-bold text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.projects.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-2xl">
              {t.projects.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Projects Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-12"
          >
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  'px-5 py-2 rounded-full text-sm font-medium transition-all duration-300',
                  filter === f.key
                    ? 'bg-dronek-green text-white shadow-md shadow-dronek-green/20'
                    : 'bg-muted text-dronek-medium hover:bg-dronek-light hover:text-dronek-green border border-transparent hover:border-dronek-green/20'
                )}
              >
                {f.label}
              </button>
            ))}
          </motion.div>

          {/* Masonry-style grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => {
                const isLarge = idx % 5 === 0;
                return (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={isLarge ? 'md:col-span-2' : ''}
                  >
                    <div
                      className="group cursor-pointer rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white border border-gray-100 h-full"
                      onClick={() => setSelectedProject(idx)}
                    >
                      <div className={`relative overflow-hidden ${isLarge ? 'h-80' : 'h-60'}`}>
                        <Image
                          src={`/images/${project.image}`}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/50" />
                        {/* Badge */}
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
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{project.year}</span>
                          </div>
                          {/* Hover reveal */}
                          <div className="mt-3 max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500">
                            <p className="text-white/80 text-sm line-clamp-2">{project.desc}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Case Study Modal */}
      <Dialog open={selectedProject !== null} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selected && (
            <>
              {/* Modal image */}
              <div className="relative h-64 overflow-hidden rounded-t-xl">
                <Image src={`/images/${selected.image}`} alt={selected.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="bg-dronek-gold text-white text-xs">{t.projects[selected.sector as keyof typeof t.projects]}</Badge>
                </div>
              </div>

              <div className="p-6 lg:p-8 space-y-4">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-dronek-text" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {selected.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-4 text-sm text-dronek-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-dronek-green" />{selected.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-dronek-green" />{selected.year}</span>
                </div>
                <p className="text-dronek-medium leading-relaxed">{selected.fullContent}</p>
                <Button
                  onClick={() => {
                    setSelectedProject(null);
                    handleNav('contact');
                  }}
                  className="w-full bg-gradient-to-r from-dronek-green to-dronek-dark hover:from-dronek-dark hover:to-dronek-green text-white rounded-full py-6 shadow-lg shadow-dronek-green/15"
                >
                  {t.services.requestQuote}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
