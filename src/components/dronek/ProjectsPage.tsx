'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { BriefcaseBusiness, X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import type { PageView } from './Navbar';
import SuccessSection from './SuccessSection';
import { projects as hardcodedProjects } from '@/lib/projects';
import { supabase } from '@/lib/supabase';
import { ScrollTitle } from './ScrollTitle';
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
  const { t, lang } = useLanguage();
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [dynamicProjects, setDynamicProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = [
    { id: 'Tous', label: lang === 'fr' ? 'Tous' : 'All' },
    { id: 'FORESTERIE', label: lang === 'fr' ? 'Foresterie' : 'Forestry' },
    { id: 'AGRICULTURE', label: lang === 'fr' ? 'Agriculture' : 'Agriculture' },
    { id: 'DRONE ET CARTOGRAPHIE', label: lang === 'fr' ? 'Drone et Cartographie' : 'Drone & Mapping' },
    { id: 'AGROFORESTERIE', label: lang === 'fr' ? 'Agroforesterie' : 'Agroforestry' },
  ];

  const isOlderThan6Months = (dateStr: string) => {
    if (!dateStr) return false;
    const postDate = new Date(dateStr);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return postDate < sixMonthsAgo;
  };

  React.useEffect(() => {
    setLoading(true);
    
    const loadData = async () => {
      try {
        const [projSnap, newsSnap] = await Promise.all([
          supabase.from('projets').select('*').in('statut', ['publie', 'Publié', 'Published']).order('created_at', { ascending: false }),
          supabase.from('actualites').select('*').in('statut', ['publie', 'Publié', 'Published']).order('date_publication', { ascending: false })
        ]);

        const projectsData = projSnap.data || [];
        const newsData = newsSnap.data || [];

        // Standard Projects
        const standardProjects: Project[] = projectsData.map(p => {
          let imageUrl = p.image_url || '/images/hero-main.jpg';
          if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
            imageUrl = '/images/hero-main.jpg';
          }
          return {
            slug: p.id,
            title: p.titre,
            summary: p.description_courte || p.description_complete || '',
            image: imageUrl,
            categoryLabel: p.categorie || 'Projet',
            location: p.localisation || (lang === 'fr' ? 'Sénégal' : 'Senegal'),
            year: p.year || '2023',
            objectives: p.objectives || [],
            impacts: p.impacts || [],
            detail: p.description_complete,
            isFeatured: p.is_featured || false
          };
        });

        // Archived News (> 6 months)
        const archivedNews: Project[] = newsData
          .filter(n => isOlderThan6Months(n.date_publication))
          .map(n => {
            let imageUrl = n.image_url || '/images/hero-main.jpg';
            if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
              imageUrl = '/images/hero-main.jpg';
            }
            return {
              slug: n.id,
              title: n.titre,
              summary: n.resume || n.contenu,
              image: imageUrl,
              categoryLabel: lang === 'fr' ? 'Archive Actualité' : 'News Archive',
              location: n.location || 'DRONEK',
              year: n.date_publication ? n.date_publication.split('-')[0] : new Date().getFullYear().toString(),
              detail: n.contenu
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

    const subProj = supabase.channel('projets-list').on('postgres_changes', { event: '*', schema: 'public', table: 'projets' }, loadData).subscribe();
    const subNews = supabase.channel('news-archive-list').on('postgres_changes', { event: '*', schema: 'public', table: 'actualites' }, loadData).subscribe();

    return () => {
      subProj.unsubscribe();
      subNews.unsubscribe();
    };
  }, [lang]);

  const allProjectsRaw = [...dynamicProjects, ...hardcodedProjects];
  const allProjects = selectedCategory === 'Tous' 
    ? allProjectsRaw 
    : allProjectsRaw.filter(p => p.categoryLabel === selectedCategory || p.category === selectedCategory);

  const totalPages = Math.ceil(allProjects.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = allProjects.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the categories section to show results
    const section = document.getElementById('projects-grid-start');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNav = (page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedProject = selectedProjectSlug ? allProjects.find((project) => project.slug === selectedProjectSlug) : null;

  return (
    <div>
      {/* Full Hero Section with Video and Overlays */}
      <section className="pt-0 pb-16 lg:pb-24 bg-white relative overflow-hidden mt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            {/* Left Content */}
            <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-xl relative min-h-[400px] flex flex-col justify-center">
              {/* Decorative background image for the left section - Optimized for full visibility */}
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
              {/* Main Circular Image */}
              <div className="absolute inset-4 sm:inset-6 rounded-full overflow-hidden border-[8px] border-[#f7f7f5] shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-black">
                <video src="https://res.cloudinary.com/dpcbr467k/video/upload/v1776869570/No-video-title-fdown.net_2_kuo0v5.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </div>
              
              {/* Watch Video Circle Overlay */}
              <div className="absolute bottom-6 left-0 sm:left-4 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300 z-10 border-4 border-white p-0 overflow-hidden">
                <img 
                  src="/images/ChatGPT Image 24 avr. 2026, 12_47_28.png" 
                  alt="DRONEK Logo" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Pill Image Overlay */}
              <div className="absolute bottom-12 right-0 sm:right-2 w-48 h-16 sm:w-56 sm:h-20 rounded-full overflow-hidden border-[5px] border-white shadow-xl z-10 hidden sm:block">
                 <Image src="/images/nursery-detail.jpg" alt="Soil detail" fill className="object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="bg-white pt-4 lg:pt-6 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 🏷️ TABS NAVIGATION — Project Filter */}
          <div id="projects-grid-start" className="flex items-center justify-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                  ${selectedCategory === category.id 
                    ? 'bg-dronek-green text-white shadow-lg shadow-dronek-green/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {category.label}
              </button>
            ))}
          </div>

          <motion.div 
            layout 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.1
                }
              }
            }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {currentProjects.map((project, index) => {
              // Determine direction based on index
              const directions = [
                { x: -100, y: 0 },   // From Left
                { x: 0, y: -100 },    // From Top
                { x: 100, y: 0 },    // From Right
                { x: 0, y: 100 },     // From Bottom
              ];
              const dir = directions[index % directions.length];

              return (
                <motion.article 
                  key={project.slug} 
                  initial={{ opacity: 0, ...dir }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.8, 
                    delay: (index % 3) * 0.1,
                    ease: [0.21, 1.11, 0.81, 0.99] // Smooth bounce-like ease
                  }}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <div 
                    className="group h-full rounded-2xl overflow-hidden bg-[#f7f7f5] shadow-[0_14px_35px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => setSelectedProjectSlug(project.slug)}
                  >
                    <div className="relative h-[300px] sm:h-[340px] overflow-hidden">
                      <Image 
                        src={project.image} 
                        alt={project.title} 
                        fill 
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <span className="inline-flex items-center rounded-full border border-dronek-green/20 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dronek-green shadow-sm backdrop-blur-sm">
                          {project.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 lg:p-7 flex flex-col items-center text-center h-[calc(100%-300px)] sm:h-[calc(100%-340px)]">
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

          {/* 🔢 PAGINATION */}
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

      {/* Premium Popup Implementation */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop Blur & Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProjectSlug(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            
            {/* Popup Container */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              {/* Close Button Mobile */}
              <button 
                onClick={() => setSelectedProjectSlug(null)}
                className="absolute top-4 right-4 z-50 md:hidden bg-white/80 backdrop-blur-md rounded-full p-2 shadow-lg"
              >
                <X className="w-6 h-6 text-dronek-text" />
              </button>

              {/* Image / Gallery Side */}
              <div className="md:w-1/2 relative h-64 md:h-auto bg-gray-100">
                <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content Side */}
              <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-dronek-green uppercase tracking-widest">{selectedProject.categoryLabel}</span>
                  <button onClick={() => setSelectedProjectSlug(null)} className="hidden md:block hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-gray-300 hover:text-dronek-text" />
                  </button>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-[#149655] mb-4 leading-tight">
                  {selectedProject.title.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                </h2>

                <div className="space-y-6">
                  {/* Detailed Description */}
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {(selectedProject as any).detail || selectedProject.summary}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.projects.locationLabel}</span>
                      <span className="text-sm font-semibold text-dronek-text">{selectedProject.location}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t.projects.yearLabel}</span>
                      <span className="text-sm font-semibold text-dronek-text">{(selectedProject as any).year || '2023'}</span>
                    </div>
                  </div>

                  {/* Objectives */}
                  {(selectedProject as any).objectives && (
                    <div>
                      <h4 className="text-sm font-bold text-[#149655] tracking-widest mb-3">{t.projects.objectivesLabel}</h4>
                      <ul className="space-y-2">
                        {(selectedProject as any).objectives.map((obj: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-dronek-green mt-1.5" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Results / Impacts */}
                  {(selectedProject as any).impacts && (
                    <div>
                      <h4 className="text-sm font-bold text-[#149655] tracking-widest mb-3">{t.projects.impactsLabel}</h4>
                      <ul className="space-y-2">
                        {(selectedProject as any).impacts.map((impact: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                            <div className="w-1.5 h-1.5 rounded-full bg-dronek-green mt-1.5" />
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Final Action */}
                <div className="mt-10">
                  <Button 
                    onClick={() => setSelectedProjectSlug(null)}
                    className="w-full rounded-xl bg-dronek-green hover:bg-dronek-dark text-white font-bold py-6 h-auto shadow-lg shadow-dronek-green/20"
                  >
                    {t.projects.close}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* About DRONEK Modal */}
      <AnimatePresence>
        {showAboutModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAboutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl p-8 md:p-12"
            >
              {/* Background Image Texture for Modal */}
              <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none flex items-center justify-center">
                <div className="relative w-full h-full p-12">
                  <Image 
                    src="/images/dronek_image3.png" 
                    alt="Modal Background" 
                    fill 
                    className="object-contain grayscale"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20" />
              </div>

              <button 
                onClick={() => setShowAboutModal(false)}
                className="absolute top-6 right-6 z-50 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-dronek-text" />
              </button>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                {/* Left side: Logo & Title */}
                <div className="md:col-span-4 flex flex-col items-center text-center">
                  <div className="w-64 h-40 flex items-center justify-center mb-6">
                    <img 
                      src="/Typographie/logoV.png" 
                      alt="Dronek Logo" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <h2 
                    className="text-2xl md:text-3xl font-black text-dronek-text uppercase leading-tight"
                    style={{ transform: 'translateY(-1.8667cm)' }}
                  >
                    {t.projects.aboutTitle}
                  </h2>
                </div>

                {/* Right side: Content & Action */}
                <div className="md:col-span-8 flex flex-col">
                  <div className="prose prose-sm prose-green max-w-none text-left">
                    <p className="text-gray-600 leading-relaxed text-base lg:text-lg whitespace-pre-line">
                      {t.projects.aboutText}
                    </p>
                  </div>
                  <div className="mt-8">
                    <Button 
                      onClick={() => setShowAboutModal(false)}
                      className="w-full md:w-fit rounded-xl bg-dronek-green hover:bg-dronek-dark text-white font-bold py-2 px-6 text-sm h-auto shadow-md shadow-dronek-green/10 uppercase tracking-widest transition-all duration-300"
                    >
                      {t.projects.close}
                    </Button>
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

