'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import { ArrowRight, X, ChevronLeft, ChevronRight, Phone, Share2, Link as LinkIcon } from 'lucide-react';
import type { PageView } from './Navbar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import AnimatedSection from './AnimatedSection';
import { supabase } from '@/lib/supabase';

type NewsPost = {
  id: string;
  title: string;
  content: string;
  image?: string | null;
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
    { id: '1', title: lang === 'fr' ? 'CAMPAGNE DE REBOISEMENT' : 'REFORESTATION CAMPAIGN', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2026&auto=format&fit=crop', category: 'Actualité' },
    { id: '2', title: lang === 'fr' ? 'SÉMINAIRE ÉCOLOGIQUE' : 'ECOLOGICAL SEMINAR', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop', category: lang === 'fr' ? 'Actualité' : 'News' },
    { id: '3', title: 'DRONEK INNOVATION', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2070&auto=format&fit=crop', category: 'Technologie' },
    { id: '4', title: 'PROTECTION FORÊTS', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop', category: 'Environnement' },
    { id: '5', title: 'CARTOGRAPHIE TAI', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1579389083395-4507e9f4c171?q=80&w=2070&auto=format&fit=crop', category: 'Actualité' },
    { id: '6', title: 'MISSION RÉUSSIE', content: '...', createdAt: new Date().toISOString(), image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop', category: 'Actualité' }
  ];

  const [posts, setPosts] = useState<NewsPost[]>(fallbackPosts);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  
  const isWithin6Months = (dateStr: string) => {
    const postDate = new Date(dateStr);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return postDate >= sixMonthsAgo;
  };

  const carouselPosts = posts.slice(0, 12);
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

    if (diff < 10) return currentLang === 'fr' ? "À l'instant" : "Just now";
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
      const { data, error } = await supabase
        .from('actualites')
        .select('*')
        .in('statut', ['publie', 'Publié', 'Published'])
        .order('date_publication', { ascending: false })
        .limit(20);
      
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
            createdAt: n.date_publication || new Date().toISOString(),
            category: n.categorie || 'Actualité'
          };
        });

        newsItems = newsItems.filter((post: any) => isWithin6Months(post.createdAt));

        if (newsItems.length > 0) {
          setPosts(newsItems);
        }
      }
      setLoading(false);
    };

    fetchNews();

    const sub = supabase.channel('actualites-page').on('postgres_changes', { event: '*', schema: 'public', table: 'actualites' }, fetchNews).subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  const totalPages = Math.ceil(posts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const section = document.getElementById('news-grid-start');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };


  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      {/* 🚀 BANNER HERO */}
      <AnimatedSection className="relative h-auto min-h-[400px] flex items-start overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl">
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-forest.jpg" 
            alt="Actualités" 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark to-dronek-green opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-36 lg:pt-48 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex-1 min-w-0">
              <h1 className="text-2xl lg:text-5xl font-montserrat-extrabold text-white leading-[1.1] uppercase tracking-tight">
                {lang === 'fr' ? 'Nos Actualités' : 'Our News'}
              </h1>
            </motion.div>

            <div className="lg:max-w-md">
              <p className="text-white/80 text-sm lg:text-base font-medium leading-relaxed">
                {lang === 'fr' 
                  ? "Restez informé de nos dernières actualités. Découvrez comment DRONEK contribue au développement durable en Côte d'Ivoire."
                  : "Stay informed about our latest news. Discover how DRONEK contributes to sustainable development in Côte d'Ivoire."}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* 🎠 PUBLICATIONS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 overflow-hidden relative">
        <style dangerouslySetInnerHTML={{ __html: `
          .carousel-container { 
            overflow: hidden; 
            position: relative; 
            padding: 20px 0; 
            width: 100%;
          }
          .carousel-track { 
            display: flex; 
            gap: 1.5rem; 
            transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .publication-card {
            min-width: calc(16.66% - 1.5rem);
            height: 480px; 
            background: white; 
            border-radius: 1.25rem;
            padding: 1rem; 
            box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
            flex-shrink: 0;
            display: flex; 
            flex-direction: column; 
            border: 1px solid #f0f0f0; 
            cursor: pointer; 
            transition: all 0.3s ease;
          }
          .publication-card:hover { transform: translateY(-6px); box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
          .nav-btn {
            width: 42px; height: 42px; border-radius: 50%; background: white; border: 1px solid #e5e7eb;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05); cursor: pointer; display: flex; align-items: center; justify-content: center;
            z-index: 10; transition: all 0.3s ease; color: #374151;
          }
          .nav-btn:hover { background: #149655; color: white; border-color: #149655; transform: scale(1.05); }
          
          @media (min-width: 1536px) { .publication-card { min-width: calc(16.66% - 1.5rem); } }
          @media (max-width: 1535px) { .publication-card { min-width: calc(20% - 1.5rem); } }
          @media (max-width: 1280px) { .publication-card { min-width: calc(25% - 1.5rem); } }
          @media (max-width: 1024px) { .publication-card { min-width: calc(33.333% - 1.5rem); } }
          @media (max-width: 768px) { .publication-card { min-width: calc(50% - 1.5rem); } }
          @media (max-width: 640px) { 
            .publication-card { min-width: 100%; }
          }
        `}} />

        <div className="flex flex-col items-center mb-2">
          <h2 className="text-xl sm:text-2xl font-black text-dronek-dark uppercase tracking-widest">
            {lang === 'fr' ? 'DERNIERS POSTS' : 'LATEST POSTS'}
          </h2>
        </div>        <div className="flex justify-center items-center gap-4 mb-4">
          <motion.button onClick={handlePrev} className="nav-btn"><ChevronLeft size={24} /></motion.button>
          <motion.button onClick={handleNext} className="nav-btn"><ChevronRight size={24} /></motion.button>
        </div>
 
        <div className="carousel-container" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
          <div className="carousel-track" style={{ transform: `translateX(-${currentIndex * (100 / (carouselPosts.length < visibleCount ? carouselPosts.length : visibleCount))}%)` }}>
            {carouselPosts.map((pub, index) => {
              const timeAgoText = formatTimeAgo(pub.createdAt, lang);

              return (
                <div key={index} className="publication-card" onClick={() => setSelectedPost(pub)}>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 shadow-sm">
                        <Image src="/images/dronek-nav-icon.png" alt="Logo" width={32} height={32} className="object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900 leading-tight">DRONEK</span>
                        <span className="text-[11px] text-gray-500 font-medium">{timeAgoText}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-[13px] font-bold text-[#149655] leading-tight mb-2 line-clamp-2">
                      {pub.title.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    </h3>
                  </div>

                  {/* Compact Image Container */}
                  <div className="relative h-[240px] w-full rounded-xl overflow-hidden mt-auto bg-gray-100 shadow-sm group">
                    <img 
                      src={pub.image || '/images/hero-forest.jpg'} 
                      alt={pub.title} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" 
                      onError={(e) => { e.currentTarget.src = '/images/hero-forest.jpg'; }} 
                    />
                    
                    {/* Hover Overlay with Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20 backdrop-blur-[2px]">
                       <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: '#149655', color: '#fff' }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (navigator.share) {
                              navigator.share({ title: pub.title, url: window.location.href });
                            } else {
                              alert("Partage non supporté sur ce navigateur");
                            }
                          }}
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-xl transition-all duration-300"
                          title="Partager"
                       >
                          <Share2 size={20} />
                       </motion.button>
                       <motion.button 
                          whileHover={{ scale: 1.1, backgroundColor: '#149655', color: '#fff' }}
                          whileTap={{ scale: 0.9 }}
                          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-xl transition-all duration-300"
                          title="En savoir plus"
                       >
                          <LinkIcon size={20} />
                       </motion.button>
                    </div>


                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* 📰 CONTENT GRID */}
      <section id="news-grid-start" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <AnimatePresence mode="wait">
            <motion.div key="news-posts-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {currentPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <div 
                    className="group h-full rounded-2xl overflow-hidden bg-[#f7f7f5] shadow-[0_14px_35px_rgba(0,0,0,0.08)] transition-transform duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="relative h-[300px] sm:h-[340px] overflow-hidden bg-gray-100">
                      <img 
                        src={post.image || '/images/hero-forest.jpg'} 
                        alt={post.title}
                        className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = '/images/hero-forest.jpg'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-black/0 to-transparent" />
                      
                      <div className="absolute top-4 left-0 right-0 flex justify-center">
                        <span className="inline-flex items-center rounded-full border border-white/60 bg-white/90 px-4 py-1.5 text-[10px] font-semibold text-[#71807e] shadow-sm backdrop-blur-sm uppercase tracking-widest">
                          {formatTimeAgo(post.createdAt, lang)}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 lg:p-7 space-y-4 flex flex-col flex-1 items-center text-center">
                      <h3 className="text-base lg:text-lg font-bold text-[#149655] leading-snug line-clamp-3">
                        {post.title.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      </h3>
                      
                      <div className="mt-auto">
                        <Button
                          className="w-fit rounded-full bg-dronek-green hover:bg-dronek-dark text-white px-6 py-4 text-sm font-medium shadow-none transition-all duration-300"
                        >
                          {lang === 'fr' ? 'En savoir plus' : 'Learn more'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

      </section>

      {/* 🚀 MODAL POPUP */}
      <AnimatePresence>
        {selectedPost && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop Blur & Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedPost(null)} 
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
                onClick={() => setSelectedPost(null)} 
                className="absolute top-4 right-4 z-50 md:hidden bg-white/80 backdrop-blur-md rounded-full p-2 shadow-lg"
              >
                <X className="w-6 h-6 text-dronek-text" />
              </button>

              {/* Image / Gallery Side */}
              <div className="md:w-1/2 relative h-64 md:h-auto bg-gray-100 overflow-hidden">
                <img 
                  src={selectedPost.image || '/images/hero-forest.jpg'} 
                  alt={selectedPost.title} 
                  className="object-cover w-full h-full" 
                  onError={(e) => { e.currentTarget.src = '/images/hero-forest.jpg'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content Side */}
              <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-dronek-green uppercase tracking-[0.2em]">{new Date(selectedPost.createdAt).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <button onClick={() => setSelectedPost(null)} className="hidden md:block hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-gray-300 hover:text-dronek-text" />
                  </button>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-[#149655] mb-4 leading-tight">
                  {selectedPost.title.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </h2>

                <div className="space-y-6">
                  {/* Detailed Description */}
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                    {selectedPost.content}
                  </p>

                </div>

                {/* Final Action */}
                <div className="mt-10">
                  <Button 
                    onClick={() => setSelectedPost(null)}
                    className="w-full rounded-xl bg-dronek-green hover:bg-dronek-dark text-white font-bold py-6 h-auto shadow-lg shadow-dronek-green/20 uppercase tracking-widest text-xs"
                  >
                    {lang === 'fr' ? 'Fermer' : 'Close'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
