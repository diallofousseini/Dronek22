'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import type { PageView } from './Navbar';
import SuccessSection from './SuccessSection';
import { projects as hardcodedProjects } from '@/lib/projects';
import { supabase } from '@/lib/supabase';
import { translateProject } from '@/lib/i18n';

const getCategoryLabel = (category: string, lang: string) => {
  if (!category) return lang === 'fr' ? 'Projet' : 'Project';
  const catUpper = category.toUpperCase().trim();
  if (catUpper === 'FORESTERIE') return lang === 'fr' ? 'Foresterie' : 'Forestry';
  if (catUpper === 'AGRICULTURE') return lang === 'fr' ? 'Agriculture' : 'Agriculture';
  if (catUpper === 'DRONE ET CARTOGRAPHIE' || catUpper === 'DRONE') return lang === 'fr' ? 'Drone et Cartographie' : 'Drone & Mapping';
  if (catUpper === 'AGROFORESTERIE') return lang === 'fr' ? 'Agroforesterie' : 'Agroforestry';
  if (catUpper === 'ARCHIVE ACTUALITÉ' || catUpper === 'NEWS ARCHIVE') return lang === 'fr' ? 'Archive Actualité' : 'News Archive';
  return category;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface Project {
  slug: string;
  title: string;
  summary: string;
  image: string;
  categoryLabel: string;
  location: string;
  isFeatured?: boolean;
}

interface ProjectsPageProps {
  onNavigate: (page: PageView) => void;
}

export default function ProjectsPage({ onNavigate }: ProjectsPageProps) {
  const { lang, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dynamicProjects, setDynamicProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  // Lightbox state for project detail view
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  
  // Footer 3-image carousel state
  const [footerImgIndex, setFooterImgIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data: supaProjects, error: supaError } = await supabase
          .from('projets')
          .select('*')
          .order('created_at', { ascending: false });

        let standardProjects: any[] = [];
        if (supaProjects && supaProjects.length > 0) {
          standardProjects = supaProjects.map((p: any) => ({
            slug: p.id,
            title: p.titre || '',
            summary: p.resume || p.contenu || '',
            detail: p.contenu || p.resume || '',
            image: p.image_url || '/images/dronek_image3.png',
            categoryLabel: p.categorie || 'FORESTERIE',
            location: p.localisation || 'Côte d\'Ivoire',
            year: p.annee || '2024',
            objectives: p.objectifs ? (Array.isArray(p.objectifs) ? p.objectifs : [p.objectifs]) : [],
            impacts: p.impacts ? (Array.isArray(p.impacts) ? p.impacts : [p.impacts]) : [],
            gallery: p.gallery || null,
            isFeatured: p.is_featured || false
          }));
        }

        const { data: newsData } = await supabase
          .from('actualites')
          .select('*')
          .in('statut', ['publie', 'Publié', 'Published'])
          .order('date_publication', { ascending: false });

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const archivedNews = (newsData || [])
          .filter((n: any) => new Date(n.date_publication || n.created_at) < sixMonthsAgo)
          .map((n: any) => {
            let imageUrl = n.image_url || null;
            if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
              imageUrl = null;
            }
            return {
              slug: `news-${n.id}`,
              title: n.titre || '',
              summary: n.resume || n.contenu || '',
              detail: n.contenu || n.resume || '',
              image: imageUrl || '/images/hero-forest.jpg',
              categoryLabel: 'ARCHIVE ACTUALITÉ',
              location: "Côte d'Ivoire",
              year: new Date(n.date_publication || n.created_at).getFullYear().toString(),
              objectives: [],
              impacts: [],
              gallery: n.gallery || null,
              isFeatured: false
            };
          });

        setDynamicProjects([...standardProjects, ...archivedNews].sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        }));
      } catch (error) {
        console.error("Error loading projects/news:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [lang]);

  const allProjectsRaw = (dynamicProjects.length > 0 ? dynamicProjects : hardcodedProjects).map((p: any) => translateProject(p, lang));
  const allProjects = selectedCategory === 'Tous' 
    ? allProjectsRaw 
    : allProjectsRaw.filter((p: any) => p.categoryLabel === selectedCategory || p.category === selectedCategory);

  const totalPages = Math.ceil(allProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = allProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const section = document.getElementById('projects-grid-start');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (slug: string) => {
    setSelectedProjectSlug(slug);
    setFooterImgIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedProjectSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProject = selectedProjectSlug ? allProjects.find((project) => project.slug === selectedProjectSlug) : null;

  // Open lightbox
  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // ============================================
  // PROJECT DETAIL VIEW (Exact same full page format as Actualités)
  // ============================================
  if (selectedProject) {
    let galleryImages: string[] = [];
    if ((selectedProject as any).gallery) {
      try {
        const parsed = JSON.parse((selectedProject as any).gallery);
        if (Array.isArray(parsed)) galleryImages = parsed.filter((s: any) => typeof s === 'string' && s.length > 0);
      } catch (e) {}
    }

    const allFooterImages = [
      selectedProject.image,
      ...galleryImages,
      ...allProjects.map(p => p.image)
    ].filter((img): img is string => !!img && typeof img === 'string' && img.length > 0);

    const currentFooterImages = Array.from({ length: Math.min(3, allFooterImages.length) }, (_, i) => {
      return allFooterImages[(footerImgIndex + i) % allFooterImages.length];
    });

    const handlePrevFooterImg = () => {
      setFooterImgIndex((prev) => (prev === 0 ? allFooterImages.length - 1 : prev - 1));
    };

    const handleNextFooterImg = () => {
      setFooterImgIndex((prev) => (prev + 1) % allFooterImages.length);
    };

    return (
      <div className="bg-white min-h-screen pb-20 font-sans">
        {/* Back Button Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 lg:pt-32">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-dronek-green transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm uppercase tracking-widest">
              {lang === 'fr' ? 'Retour aux projets' : 'Back to projects'}
            </span>
          </motion.button>

          {/* Project Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111] leading-tight uppercase tracking-tight mb-4"
          >
            {selectedProject.title}
          </motion.h1>

          {/* Project Metadata / Category & Location */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm text-dronek-green font-semibold italic mb-8"
          >
            {getCategoryLabel(selectedProject.categoryLabel, lang)} • {selectedProject.location} • {(selectedProject as any).year || '2024'}
          </motion.p>
        </div>

        {/* Main Image */}
        {selectedProject.image && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
          >
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg bg-gray-50">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title} 
                className="w-full max-h-[550px] object-cover"
                onError={(e) => { e.currentTarget.src = '/images/dronek_image3.png'; }}
              />
            </div>
          </motion.div>
        )}

        {/* Project Content & Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 space-y-8"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-[1.9] text-[15px] sm:text-base whitespace-pre-line text-justify">
              {(selectedProject as any).detail || selectedProject.summary}
            </p>
          </div>

          {/* Objectives */}
          {(selectedProject as any).objectives && (selectedProject as any).objectives.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-base font-bold text-[#149655] tracking-wide mb-4 uppercase">
                {t.projects.objectivesLabel}
              </h3>
              <ul className="space-y-3">
                {(selectedProject as any).objectives.map((obj: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-dronek-green mt-2 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Impacts */}
          {(selectedProject as any).impacts && (selectedProject as any).impacts.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-base font-bold text-[#149655] tracking-wide mb-4 uppercase">
                {t.projects.impactsLabel}
              </h3>
              <ul className="space-y-3">
                {(selectedProject as any).impacts.map((impact: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-dronek-green mt-2 shrink-0" />
                    <span>{impact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Horizontal 3-Image Carousel at Bottom with controls */}
        {allFooterImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12"
          >
            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevFooterImg}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-dronek-green hover:text-white hover:border-dronek-green transition-all"
                  title={lang === 'fr' ? 'Précédent' : 'Previous'}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNextFooterImg}
                  className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-700 hover:bg-dronek-green hover:text-white hover:border-dronek-green transition-all"
                  title={lang === 'fr' ? 'Suivant' : 'Next'}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* 3 Horizontal Images */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {currentFooterImages.map((imgUrl, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.03 }}
                  className="aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm cursor-pointer group"
                  onClick={() => openLightbox(allFooterImages, (footerImgIndex + idx) % allFooterImages.length)}
                >
                  <img
                    src={imgUrl}
                    alt={`Photo ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = '/images/dronek_image3.png'; }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && lightboxImages.length > 0 && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setLightboxOpen(false)} 
                className="absolute inset-0 bg-black/80 backdrop-blur-md" 
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.9 }} 
                className="relative max-w-5xl w-full max-h-[85vh]"
              >
                <button 
                  onClick={() => setLightboxOpen(false)} 
                  className="absolute -top-12 right-0 z-50 bg-white/20 backdrop-blur-md rounded-full p-2 hover:bg-white/40 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>

                <img 
                  src={lightboxImages[lightboxIndex]} 
                  alt={`Photo ${lightboxIndex + 1}`} 
                  className="w-full max-h-[85vh] object-contain rounded-xl" 
                />

                {lightboxImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev === 0 ? lightboxImages.length - 1 : prev - 1)); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/40 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev === lightboxImages.length - 1 ? 0 : prev + 1)); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md rounded-full p-3 hover:bg-white/40 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {lightboxImages.map((_, idx) => (
                        <button 
                          key={idx} 
                          onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${idx === lightboxIndex ? 'bg-white scale-125' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ============================================
  // PROJECTS LIST VIEW
  // ============================================
  return (
    <div>
      {/* Full Hero Section with Video and Overlays */}
      <section className="pt-0 pb-16 lg:pb-24 bg-white relative overflow-hidden mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl relative min-h-[250px] flex flex-col justify-center">
              <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none select-none flex items-center justify-center lg:justify-start">
                <div className="relative w-full h-full max-w-[650px] max-h-[650px]">
                  <Image 
                    src="/images/dronek_image3.png" 
                    alt="" 
                    fill
                    className="object-contain grayscale"
                    priority
                  />
                </div>
              </div>

              <div className="relative z-10">
                <motion.h2 
                  variants={fadeInUp}
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dronek-text leading-[1.1] mb-6 tracking-tight"
                >
                  {t.projects.heroTitle.split(' ').map((word: string, wordIdx: number) => (
                    <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.2em]">
                      {word.split('').map((char: string, charIdx: number) => (
                        <motion.span
                          key={charIdx}
                          variants={{
                            hidden: { opacity: 0, y: 10 },
                            visible: { opacity: 1, y: 0 }
                          }}
                          transition={{ duration: 0.1, delay: (wordIdx * 5 + charIdx) * 0.03 }}
                          className="inline-block"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                  ))}
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-dronek-medium text-lg leading-relaxed mb-0">
                  {t.projects.heroDesc}
                </motion.p>
              </div>
            </motion.div>

            {/* Right Content - Circular Image with overlays */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative mx-auto lg:mx-0 lg:ml-auto w-full max-w-[480px] aspect-square">
              <div className="absolute inset-4 sm:inset-6 rounded-full overflow-hidden border-[8px] border-[#f7f7f5] shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-black">
                <video src="https://res.cloudinary.com/dpcbr467k/video/upload/v1776869570/No-video-title-fdown.net_2_kuo0v5.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Grid Section */}
      <section id="projects-grid-start" className="py-16 bg-[#fcfcfb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-semibold text-dronek-green uppercase tracking-widest block mb-2">{t.projects.tagline}</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-dronek-text uppercase">{t.projects.sectionTitle}</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {['Tous', 'Foresterie', 'Agriculture', 'Drone et Cartographie', 'Agroforesterie'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${selectedCategory === cat ? 'bg-dronek-green text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Container */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {currentProjects.map((project, index) => {
              return (
                <motion.article 
                  key={project.slug} 
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <div 
                    className="group h-full rounded-2xl overflow-hidden bg-[#f7f7f5] shadow-[0_14px_35px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                    onClick={() => handleSelectProject(project.slug)}
                  >
                    <div className="relative h-[250px] sm:h-[280px] overflow-hidden">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full border border-dronek-green/20 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dronek-green shadow-sm backdrop-blur-sm">
                          {getCategoryLabel(project.categoryLabel, lang)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 lg:p-7 flex flex-col items-center text-center flex-1">
                      <h3 className="text-base lg:text-lg font-bold text-[#149655] leading-tight tracking-tight mb-5">
                        {project.title.toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h3>
                      
                      <Button
                        className="mt-auto w-fit rounded-full bg-dronek-green hover:bg-green-700 text-white px-6 py-2 h-auto text-sm font-semibold"
                      >
                        {t.projects.learnMore}
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-16 mb-8">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 flex items-center justify-center border border-gray-100 bg-white shadow-sm transition-all hover:border-dronek-green disabled:opacity-30 disabled:hover:border-gray-100"
              >
                <ChevronLeft className="w-5 h-5 text-dronek-dark" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`
                    w-12 h-12 flex items-center justify-center text-lg font-bold transition-all
                    ${currentPage === page 
                      ? 'bg-[#0a2118] text-white shadow-lg' 
                      : 'bg-white border border-gray-100 text-gray-400 hover:border-dronek-green hover:text-dronek-green'}
                  `}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-12 h-12 flex items-center justify-center border border-gray-100 bg-white shadow-sm transition-all hover:border-dronek-green disabled:opacity-30 disabled:hover:border-gray-100"
              >
                <ChevronRight className="w-5 h-5 text-dronek-dark" />
              </button>
            </div>
          )}
        </div>
      </section>

      <SuccessSection onNavigate={handleNav} />
    </div>
  );
}
