'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import { X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import type { PageView } from './Navbar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import AnimatedSection from './AnimatedSection';
import { supabase } from '@/lib/supabase';
import { translateNews } from '@/lib/i18n';

type NewsPost = {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  gallery?: string | null;
  customDate?: string | null;
  createdAt: string;
  category?: string;
};

interface ActualitePageProps {
  onNavigate: (page: PageView) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function ActualitePage({ onNavigate }: ActualitePageProps) {
  const { lang, t } = useLanguage();

  const fallbackPosts: NewsPost[] = [
    { id: '1', title: lang === 'fr' ? 'CAMPAGNE DE REBOISEMENT' : 'REFORESTATION CAMPAIGN', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop', category: 'Actualités' },
    { id: '2', title: lang === 'fr' ? 'SÉMINAIRE ÉCOLOGIQUE' : 'ECOLOGICAL SEMINAR', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop', category: 'Actualités' },
    { id: '3', title: 'DRONEK INNOVATION', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2070&auto=format&fit=crop', category: 'Actualités' },
    { id: '4', title: 'PROTECTION FORÊTS', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop', category: 'Actualités' },
    { id: '5', title: 'CARTOGRAPHIE TAI', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1579389083395-4507e9f4c171?q=80&w=2070&auto=format&fit=crop', category: 'Actualités' },
    { id: '6', title: 'MISSION RÉUSSIE', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', category: 'Actualités' }
  ];

  const [posts, setPosts] = useState<NewsPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  // Lightbox state for gallery images
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  
  // Footer 3-image carousel state
  const [footerImgIndex, setFooterImgIndex] = useState(0);

  const isWithin6Months = (dateStr: string) => {
    const postDate = new Date(dateStr);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return postDate >= sixMonthsAgo;
  };

  const translatedPosts = posts.map(p => translateNews(p, lang));
  const carouselPosts = translatedPosts.slice(0, 12);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every 10 seconds for dynamic relative dates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeAgo = (dateStr: string, currentLang: string) => {
    const postDate = new Date(dateStr);
    const postTime = postDate.getTime();
    const diff = Math.floor((currentTime - postTime) / 1000);

    if (diff < 10) return currentLang === 'fr' ? "à l'instant" : "just now";
    if (diff < 60) return `${diff}s`;
    
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} min`;
    
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} h`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} j`;

    return postDate.toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short'
    });
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1536) setVisibleCount(6);
      else if (window.innerWidth >= 1280) setVisibleCount(5);
      else if (window.innerWidth >= 1024) setVisibleCount(4);
      else if (window.innerWidth >= 768) setVisibleCount(3);
      else setVisibleCount(2);
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  const [direction, setDirection] = useState<'f' | 'b'>('f');

  useEffect(() => {
    if (isHovered || carouselPosts.length <= visibleCount) return;
    const interval = setInterval(() => {
      if (direction === 'f') {
        if (currentIndex >= carouselPosts.length - visibleCount) {
          setDirection('b');
        } else {
          setCurrentIndex(prev => prev + 1);
        }
      } else {
        if (currentIndex <= 0) {
          setDirection('f');
        } else {
          setCurrentIndex(prev => prev - 1);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered, visibleCount, carouselPosts.length, direction, currentIndex]);

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    else {
      setDirection('f');
      setCurrentIndex(1);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < carouselPosts.length - visibleCount) setCurrentIndex(prev => prev + 1);
    else {
      setDirection('b');
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      // Fetch from Supabase
      const { data, error } = await supabase
        .from('actualites')
        .select('*')
        .in('statut', ['publie', 'Publié', 'Published'])
        .order('date_publication', { ascending: false })
        .limit(20);
      
      let allPosts: NewsPost[] = [];

      if (data) {
        let newsItems = data.map(n => {
          let imageUrl = n.image_url || null;
          if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) {
            imageUrl = null;
          }
          return {
            id: n.id,
            title: n.titre || '',
            content: n.contenu || n.resume || '',
            image: imageUrl,
            gallery: n.gallery || null,
            customDate: n.date_publication || null,
            createdAt: n.date_publication || new Date().toISOString(),
            category: 'Actualités'
          };
        });

        newsItems = newsItems.filter((post: any) => isWithin6Months(post.createdAt));
        allPosts = [...newsItems];
      }

      // Also fetch from local Prisma API
      try {
        const response = await fetch('/api/actualites', { cache: 'no-store' });
        const apiData = await response.json();
        if (Array.isArray(apiData?.posts)) {
          const localPosts: NewsPost[] = apiData.posts.map((p: any) => ({
            id: p.id,
            title: p.title || '',
            content: p.content || '',
            image: p.image || null,
            gallery: p.gallery || null,
            customDate: p.customDate || null,
            createdAt: p.createdAt || new Date().toISOString(),
            category: 'Actualités'
          }));
          allPosts = [...allPosts, ...localPosts];
        }
      } catch (e) {
        // Silently ignore local API errors
      }

      if (allPosts.length > 0) {
        // Sort by date descending
        allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPosts(allPosts);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  const totalPages = Math.ceil(translatedPosts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = translatedPosts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const section = document.getElementById('news-grid-start');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Format date for detail page
  const formatDetailDate = (post: NewsPost) => {
    const dateStr = post.customDate || post.createdAt;
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Format short date for badges/cards
  const formatShortDate = (dateStr?: string | null) => {
    if (!dateStr) return lang === 'fr' ? 'Actualité' : 'News';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Parse gallery images
  const getGalleryImages = (post: NewsPost): string[] => {
    if (!post.gallery) return [];
    try {
      const parsed = JSON.parse(post.gallery);
      if (Array.isArray(parsed)) return parsed.filter((s: any) => typeof s === 'string' && s.length > 0);
    } catch (e) {
      // ignore
    }
    return [];
  };

  // Open lightbox
  const openLightbox = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Handle selecting a post and scrolling to top
  const handleSelectPost = (post: NewsPost) => {
    setSelectedPost(post);
    setFooterImgIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle going back to list
  const handleBackToList = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================
  // ARTICLE DETAIL VIEW (Full Page)
  // ============================================
  if (selectedPost) {
    const galleryImages = getGalleryImages(selectedPost);
    
    // Combine main image + gallery images + other post images for 3-image horizontal carousel
    const allFooterImages = [
      selectedPost.image,
      ...galleryImages,
      ...posts.map(p => p.image)
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
              {lang === 'fr' ? 'Retour aux actualités' : 'Back to news'}
            </span>
          </motion.button>

          {/* Article Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111] leading-tight uppercase tracking-tight mb-4"
          >
            {selectedPost.title}
          </motion.h1>

          {/* Article Date */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm text-dronek-green font-semibold italic mb-8"
          >
            {formatDetailDate(selectedPost)}
          </motion.p>
        </div>

        {/* Main Image */}
        {selectedPost.image && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
          >
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-lg bg-gray-50">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title} 
                className="w-full max-h-[550px] object-cover"
                onError={(e) => { e.currentTarget.src = '/images/hero-forest.jpg'; }}
              />
            </div>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-[1.9] text-[15px] sm:text-base whitespace-pre-line text-justify">
              {selectedPost.content}
            </p>
          </div>
        </motion.div>

        {/* Horizontal 3-Image Carousel replacing bottom Back Button */}
        {allFooterImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12"
          >
            <div className="flex items-center justify-end mb-4">
              {/* Navigation buttons to cycle through photos */}
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
                    onError={(e) => { e.currentTarget.src = '/images/hero-forest.jpg'; }}
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
  // NEWS LIST VIEW
  // ============================================
  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* 🚀 BANNER HERO */}
      <AnimatedSection className="relative h-auto min-h-[400px] flex items-start overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl">
        <div className="absolute inset-0">
          <Image 
            src="/IMAGE SITE WEB/Page d'acceuil image 4.jpg" 
            alt="Actualités" 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-36 lg:pt-48 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-5xl font-montserrat-extrabold text-white leading-[1.1] uppercase tracking-tight">
                {lang === 'fr' ? 'Nos Actualités' : 'Our News'}
              </h1>
            </motion.div>

            <div className="lg:max-w-md">
              <p className="text-white text-sm lg:text-base font-bold leading-relaxed">
                {lang === 'fr' 
                  ? "Restez informé de nos dernières actualités. Découvrez comment DRONEK contribue au développement durable en Côte d'Ivoire."
                  : "Stay informed about our latest news. Discover how DRONEK contributes to sustainable development in Côte d'Ivoire."}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 🎠 PUBLICATIONS CAROUSEL (Articles récents au format Post Facebook compact réduit de moitié sans trait noir) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 overflow-hidden relative">
        <style dangerouslySetInnerHTML={{ __html: `
          .carousel-container { 
            overflow: hidden; 
            position: relative; 
            padding: 15px 0; 
            width: 100%;
          }
          .carousel-track { 
            display: flex; 
            gap: 1.25rem; 
            transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .publication-card {
            min-width: calc(20% - 1rem);
            max-width: 230px;
            height: 310px; 
            flex-shrink: 0;
          }
          .nav-btn {
            width: 38px; height: 38px; border-radius: 50%; background: white; border: 1px solid #e5e7eb;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05); cursor: pointer; display: flex; align-items: center; justify-content: center;
            z-index: 10; transition: all 0.3s ease; color: #374151;
          }
          .nav-btn:hover { background: #149655; color: white; border-color: #149655; transform: scale(1.05); }
          
          @media (min-width: 1536px) { .publication-card { min-width: calc(20% - 1rem); max-width: 230px; } }
          @media (max-width: 1280px) { .publication-card { min-width: calc(25% - 1rem); max-width: 230px; } }
          @media (max-width: 1024px) { .publication-card { min-width: calc(33.333% - 1rem); max-width: 230px; } }
          @media (max-width: 640px) { 
            .publication-card { min-width: calc(85% - 1rem); max-width: 260px; }
          }
        `}} />
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-dronek-text uppercase tracking-tight">
              {t.blog.recentPosts}
            </h2>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrev} className="nav-btn"><ChevronLeft size={16} /></button>
            <button onClick={handleNext} className="nav-btn"><ChevronRight size={16} /></button>
          </div>
        </div>

        <div 
          className="carousel-container"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * (100 / (carouselPosts.length < visibleCount ? carouselPosts.length : visibleCount))}%)` }}>
            {carouselPosts.map((pub, index) => {
              const imageUrl = pub.image || '/images/hero-forest.jpg';
              return (
                <div key={index} className="publication-card">
                  {/* Card Facebook Post Style compacte avec hauteur rallongée de 1.5 cm */}
                  <div 
                    className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col h-full border-0"
                    onClick={() => handleSelectPost(pub)}
                  >
                    {/* Header Facebook Post compact */}
                    <div className="flex items-center gap-2 px-3 pt-3 pb-1">
                      <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center font-bold overflow-hidden shrink-0 shadow-none border-0 p-0.5">
                        <img src="/Typographie/logoV.png" alt="DRONEK" className="h-full w-full object-contain" onError={(e) => { e.currentTarget.src = '/logo.svg'; }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-gray-900 text-xs tracking-tight block leading-none">DRONEK</span>
                        <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                          {lang === 'fr' ? `Publié ${formatTimeAgo(pub.createdAt, lang)}` : `Published ${formatTimeAgo(pub.createdAt, lang)}`}
                        </p>
                      </div>
                    </div>

                    {/* Titre en vert uniquement (sans description) */}
                    <div className="px-3 py-1">
                      <h3 className="text-xs font-bold text-[#149655] leading-tight line-clamp-2">
                        {pub.title}
                      </h3>
                    </div>

                    {/* Image rallongée en hauteur */}
                    {imageUrl && (
                      <div className="px-3 py-1">
                        <div className="rounded-xl overflow-hidden bg-gray-50 h-[145px] sm:h-[155px] relative border-0">
                          <img 
                            src={imageUrl} 
                            alt={pub.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => { e.currentTarget.src = '/images/hero-forest.jpg'; }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Date sous l'image */}
                    <div className="px-3 pt-1 pb-0.5">
                      <p className="text-[10px] font-semibold text-gray-400 italic">
                        {lang === 'fr' ? 'Réalisé le ' : 'Date: '}
                        {(() => {
                          const d = pub.customDate || pub.createdAt;
                          try {
                            return new Date(d).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            });
                          } catch (e) {
                            return d;
                          }
                        })()}
                      </p>
                    </div>

                    {/* Footer bouton compact */}
                    <div className="px-3 py-2 mt-auto flex items-center justify-end bg-gray-50/30 border-0">
                      <Button
                        className="rounded-full bg-dronek-green hover:bg-dronek-dark text-white px-3 py-1 h-7 text-[10px] font-bold shadow-none transition-all duration-300"
                      >
                        {t.blog.readMore}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 📰 CONTENT GRID (Cartes au format de la page Projets avec date de publication sur le badge) */}
      <section id="news-grid-start" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <AnimatePresence mode="wait">
          <motion.div key="news-posts-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {currentPosts.map((post, index) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                {/* Format exact des cartes de la page Projets avec date sur le badge */}
                <div 
                  className="group h-full rounded-2xl overflow-hidden bg-[#f7f7f5] shadow-[0_14px_35px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                  onClick={() => handleSelectPost(post)}
                >
                  <div className="relative h-[250px] sm:h-[280px] overflow-hidden">
                    <img 
                      src={post.image || '/images/hero-forest.jpg'} 
                      alt={post.title}
                      className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => { e.currentTarget.src = '/images/hero-forest.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-transparent" />
                    
                    {/* Badge remplacé par la date de publication du projet */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full border border-dronek-green/20 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-dronek-green shadow-sm backdrop-blur-sm">
                        {formatShortDate(post.customDate || post.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 lg:p-7 flex flex-col items-center text-center flex-1">
                    <h3 className="text-base lg:text-lg font-bold text-[#149655] leading-tight tracking-tight mb-5 line-clamp-3">
                      {post.title.toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    
                    <Button
                      className="mt-auto w-fit rounded-full bg-dronek-green hover:bg-green-700 text-white px-6 py-2 h-auto text-sm font-semibold"
                    >
                      {t.blog.readMore}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 🔢 PAGINATION */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-20 mb-10">
          <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="w-12 h-12 flex items-center justify-center border border-gray-300 bg-white shadow-sm transition-all hover:border-dronek-green disabled:opacity-30">
            <ChevronLeft size={20} className="text-dronek-dark" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => handlePageChange(page)} className={`w-12 h-12 flex items-center justify-center text-lg font-bold transition-all border ${currentPage === page ? 'bg-[#0a2118] text-white border-[#0a2118] shadow-lg' : 'bg-white border-gray-300 text-gray-900 hover:border-dronek-green hover:text-dronek-green'}`}>
              {page}
            </button>
          ))}
          <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="w-12 h-12 flex items-center justify-center border border-gray-300 bg-white shadow-sm transition-all hover:border-dronek-green disabled:opacity-30">
            <ChevronRight size={20} className="text-dronek-dark" />
          </button>
        </div>
      )}
    </div>
  );
}
