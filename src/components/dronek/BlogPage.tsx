import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, X, ImageIcon, Newspaper, Share2, Link as LinkIcon, ExternalLink, Play, Facebook, Youtube, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from './LanguageProvider';
import Partners from './Partners';
import type { PageView } from './Navbar';
import { supabase } from '@/lib/supabase';

interface BlogPageProps {
  onNavigate: (page: PageView) => void;
}

export default function BlogPage({ onNavigate }: BlogPageProps) {
  const { t, lang } = useLanguage();
  const [dynamicNews, setDynamicNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [mediatheque, setMediatheque] = useState<{ images: string[], videos: string[] }>({ images: Array(8).fill(''), videos: Array(8).fill('') });

  React.useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('actualites')
        .select('*');
      
      if (data) {
        setDynamicNews(data.map(n => {
          let imageUrl = n.image_url || '/images/hero-main.jpg';
          if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http')) imageUrl = '/images/hero-main.jpg';
          return {
            id: n.id,
            title: n.titre,
            desc: n.resume || n.contenu,
            image: imageUrl
          };
        }));
      }
      setLoading(false);
    };

    const fetchMediatheque = async () => {
      const { data } = await supabase.from('contacts').select('*').eq('sujet', 'Mediatheque').order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (data && data.message) {
        try {
          const parsed = JSON.parse(data.message);
          const sanitizeImage = (url: string | undefined, defaultUrl: string) => {
             if (!url) return defaultUrl;
             if (!url.startsWith('/') && !url.startsWith('http')) return defaultUrl;
             return url;
          };
          
          setMediatheque({
            images: [
              sanitizeImage(parsed.images?.[0], ''),
              sanitizeImage(parsed.images?.[1], ''),
              sanitizeImage(parsed.images?.[2], ''),
              sanitizeImage(parsed.images?.[3], ''),
              sanitizeImage(parsed.images?.[4], ''),
              sanitizeImage(parsed.images?.[5], ''),
              sanitizeImage(parsed.images?.[6], ''),
              sanitizeImage(parsed.images?.[7], ''),
            ],
            videos: parsed.videos || Array(8).fill('')
          });
        } catch (e) {}
      }
    };

    fetchNews();
    fetchMediatheque();
  }, []);

  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const allNews = [...dynamicNews, ...t.blog.newsGrid];
  const selectedNews = selectedNewsId ? allNews.find((n: any, i: number) => (n.id || String(i)) === selectedNewsId) : null;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <section className="relative h-auto min-h-[100px] lg:min-h-[120px] flex items-end overflow-hidden rounded-[2rem] mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3">
        <div className="absolute inset-0">
          <Image src="/images/hero-forest.jpg" alt="Actualités" fill className="object-cover" />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-dronek-green/35 to-black/75" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium mb-2">
              <Newspaper className="w-4 h-4" />
              <span>{lang === 'fr' ? 'Actualités & Médias' : 'News & Media'}</span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2 leading-tight uppercase">
              {(lang === 'fr' ? 'Nos dernières nouvelles' : 'Our Latest News').split('').map((char, i) => (
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
            </h1>
            <p className="text-white text-sm lg:text-base font-bold max-w-2xl">
              {lang === 'fr' 
                ? 'Suivez les dernières avancées de DRONEK dans la technologie agricole et la gestion forestière durable.'
                : 'Follow DRONEK\'s latest advances in agricultural technology and sustainable forest management.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Layout - Updated as requested */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="activities-grid"
        >
          {allNews.map((item: any, idx: number) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (idx % 2) * 0.1 }}
              className="activity-card"
              onClick={() => setSelectedNewsId(item.id || String(idx))}
            >
              <div className="activity-card-image">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                <div className="activity-card-actions">
                  <button 
                    className="action-btn"
                    title={lang === 'fr' ? 'Partager' : 'Share'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: item.title,
                          text: item.desc,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert(lang === 'fr' ? 'Lien copié !' : 'Link copied!');
                      }
                    }}
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button 
                    className="action-btn"
                    title={t.blog.readMore}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNewsId(item.id || String(idx));
                    }}
                  >
                    <LinkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-5 lg:p-6 bg-white flex flex-col flex-grow">
                <span className="text-[10px] font-bold text-[#71807e] uppercase tracking-[0.2em] mb-2 block">
                  {item.date || '8 Mai 2026'}
                </span>
                <h3 className="text-base lg:text-lg font-bold text-[#149655] leading-tight mb-3">
                  {item.title.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </h3>
                <p className="text-gray-500 text-xs lg:text-sm leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Médiathèque Section - Moved and Reformatted */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-50">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dronek-green/10 text-dronek-green text-[10px] font-bold uppercase tracking-widest mb-4">
            <ImageIcon className="w-3 h-3" />
            <span>{lang === 'fr' ? 'Médiathèque' : 'Media Library'}</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-dronek-text">
            {lang === 'fr' ? 'Notre Médiathèque' : 'Our Media Library'}
          </h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:auto-rows-[240px]">
          {/* Big Featured Image */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src={mediatheque.images[0] || "/images/hero-forest.jpg"} alt="Media 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 transition-colors" />
          </div>

          {/* Small Block 1 */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src={mediatheque.images[1] || "/images/project-training.jpg"} alt="Media 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Small Block 2 */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src={mediatheque.images[2] || "/images/hero-agriculture.jpg"} alt="Media 3" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Wide Block */}
          <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src={mediatheque.images[3] || "/images/drone-work.jpg"} alt="Media 4" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Medium/Wide Block */}
          <div className="col-span-2 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src={mediatheque.images[4] || "/images/project-carbon.jpg"} alt="Media 5" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Vertical/Large Block */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src={mediatheque.images[5] || "/images/hero-tech.jpg"} alt="Media 6" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>

          {/* Last small blocks to fill */}
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src={mediatheque.images[6] || "/images/nursery.jpg"} alt="Media 7" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            <Image src={mediatheque.images[7] || "/images/nursery-detail.jpg"} alt="Media 8" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        </div>

        {/* Videos Section */}
        {mediatheque.videos && mediatheque.videos.filter(v => v).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {mediatheque.videos.filter(v => v).slice(0, 2).map((vid, idx) => {
              const ytId = (() => {
                if (!vid) return '';
                if (vid.length === 11) return vid;
                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                const match = vid.match(regExp);
                return (match && match[2].length === 11) ? match[2] : '';
              })();
              const vimeoId = vid.match(/vimeo\.com\/(\d+)/)?.[1] || '';
              const isFacebook = vid.includes('facebook.com') || vid.includes('fb.watch');
              const isLocal = vid.includes('supabase') || vid.includes('/uploads/') || vid.endsWith('.mp4');

              const videoType = isLocal ? 'local' : isFacebook ? 'facebook' : vimeoId ? 'vimeo' : 'youtube';

              return (
                <div key={idx} className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-black group border-4 border-white"
                  >
                    {playingIndex === idx ? (
                      isLocal ? (
                        <video src={vid} className="w-full h-full" controls autoPlay playsInline />
                      ) : isFacebook ? (
                        <iframe src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(vid)}&show_text=0&autoplay=1`} className="w-full h-full border-none" allow="autoplay; encrypted-media" allowFullScreen />
                      ) : vimeoId ? (
                        <iframe src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`} className="w-full h-full border-none" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
                      ) : (
                        <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`} className="w-full h-full border-none" allow="autoplay; encrypted-media" allowFullScreen />
                      )
                    ) : (
                      <>
                        <img 
                          src={ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "/images/hero-forest.jpg"} 
                          alt="Video thumbnail" 
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                        <div 
                          onClick={() => setPlayingIndex(idx)}
                          className="absolute inset-0 flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <motion.div 
                            whileHover={{ scale: 1.1 }}
                            className={cn(
                              "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-md border border-white/30",
                              videoType === 'youtube' ? "bg-red-600/90" :
                              videoType === 'facebook' ? "bg-blue-700/90" :
                              videoType === 'vimeo' ? "bg-sky-500/90" :
                              "bg-[#149655]/90"
                            )}
                          >
                            {videoType === 'youtube' ? (
                               <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" fill="white"/>
                                 <polygon points="9.75 15.02 15.5 11.75 9.75 8.48" fill="#dc2626" />
                               </svg>
                            ) : videoType === 'facebook' ? (
                              <Facebook className="w-8 h-8 text-white fill-white" />
                            ) : videoType === 'vimeo' ? (
                               <Play className="w-8 h-8 text-white fill-white ml-1" />
                            ) : (
                              <Video className="w-8 h-8 text-white" />
                            )}
                          </motion.div>
                        </div>
                      </>
                    )}
                  </motion.div>

                  {/* 📝 Video Label with font-poppins font-black */}
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xl font-poppins font-black text-dronek-dark uppercase tracking-wider">
                      {lang === 'fr' ? `Vidéo ${idx + 1}` : `Video ${idx + 1}`}
                    </span>
                    <div className="flex items-center gap-3">
                      {videoType === 'youtube' && (
                        <div className="flex items-center gap-1.5 bg-red-600/10 px-3 py-1 rounded-full">
                          <Youtube className="w-4 h-4 text-red-600 fill-red-600/10" />
                          <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.1em]">YouTube</span>
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{videoType}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Premium Popup for News */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNewsId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[24px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedNewsId(null)}
                className="absolute top-4 right-4 z-50 md:hidden bg-white/80 backdrop-blur-md rounded-full p-2 shadow-lg"
              >
                <X className="w-6 h-6 text-dronek-text" />
              </button>

              <div className="md:w-1/2 relative h-64 md:h-auto bg-gray-100">
                <Image src={selectedNews.image} alt={selectedNews.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-semibold text-dronek-green uppercase tracking-widest">{lang === 'fr' ? 'Actualité' : 'News'}</span>
                    {selectedNews.date && <span className="text-[10px] font-semibold text-[#71807e] uppercase tracking-widest">| {selectedNews.date}</span>}
                  </div>
                  <button onClick={() => setSelectedNewsId(null)} className="hidden md:block hover:scale-110 transition-transform">
                    <X className="w-6 h-6 text-gray-300 hover:text-dronek-text" />
                  </button>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-[#149655] mb-4 leading-tight">
                  {selectedNews.title.toLowerCase().replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </h2>

                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {selectedNews.desc}
                  </p>
                  
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <h4 className="text-[10px] font-bold text-[#149655] uppercase tracking-widest mb-3">{lang === 'fr' ? 'En résumé' : 'In Summary'}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {lang === 'fr' 
                        ? 'DRONEK continue d\'innover pour offrir des solutions technologiques de pointe au service du développement durable en Afrique de l\'Ouest.'
                        : 'DRONEK continues to innovate to offer cutting-edge technological solutions for sustainable development in West Africa.'}
                    </p>
                  </div>
                </div>

                <div className="mt-10">
                  <Button 
                    onClick={() => setSelectedNewsId(null)}
                    className="w-full rounded-xl bg-dronek-green hover:bg-dronek-dark text-white font-bold py-6 h-auto shadow-lg shadow-dronek-green/20"
                  >
                    OK
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Partners />
    </div>
  );
}

