'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ScrollTitle } from './ScrollTitle';
import AnimatedSection from './AnimatedSection';
import { Play, Youtube, X, ExternalLink, Facebook, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from './LanguageProvider';
import { supabase } from '@/lib/supabase';

export default function ImpactPage() {
  const { lang } = useLanguage();
  const title = lang === 'fr' ? "Notre impact en images" : "Our impact in images";
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null);
  const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);
  const [mediatheque, setMediatheque] = React.useState<{ images: string[], videos: string[] }>({
    images: Array(8).fill(''),
    videos: Array(2).fill('')
  });

  React.useEffect(() => {
    const fetchMediatheque = async () => {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('sujet', 'Mediatheque')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data && data.message) {
        try {
          const parsed = JSON.parse(data.message);
          setMediatheque({
            images: parsed.images || Array(8).fill(''),
            videos: parsed.videos || Array(2).fill('')
          });
        } catch (e) {
          console.error("Error parsing mediatheque data", e);
        }
      }

    };
    fetchMediatheque();
  }, []);

  const getYouTubeId = (url: string) => {
    if (!url) return '';
    if (url.length === 11) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const getVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : '';
  };

  const videoList = mediatheque.videos
    .filter(Boolean)
    .map((val, idx) => {
      const ytId = getYouTubeId(val);
      const vimeoId = getVimeoId(val);
      const isFacebook = val.includes('facebook.com') || val.includes('fb.watch');
      const isLocal = val.includes('supabase') || val.includes('/uploads/') || val.endsWith('.mp4');
      
      let type = 'youtube';
      if (isLocal) type = 'local';
      else if (isFacebook) type = 'facebook';
      else if (vimeoId) type = 'vimeo';

      return {
        url: val,
        id: ytId || vimeoId || val,
        type,
        title: 'Vidéo Dronek',
        thumb: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : 
               vimeoId ? null : 
               null
      };
    });

  const images = mediatheque.images;

  return (
    <div className="bg-white min-h-screen pt-4 pb-20 font-sans">
      {/* 🚀 BANNER HERO — Centered Dronek Style */}
      <AnimatedSection className="relative h-auto min-h-[160px] lg:min-h-[180px] flex items-start overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] lg:rounded-tl-[8rem] lg:rounded-br-[8rem] mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl bg-[#1a4a2e]">
        <div className="absolute inset-0 bg-gradient-to-br from-dronek-dark via-[#0a2118] to-dronek-green/20 opacity-90" />
        <div className="absolute inset-0 pattern-dots-light opacity-10" />
        
        <img 
          src="/images/dronek_image3-removebg-preview.png" 
          alt="" 
          className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-[400px] lg:w-[600px] h-auto opacity-20 pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 pt-12 lg:pt-14 pb-8 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center relative flex flex-col items-center w-full"
          >
            <div className="flex items-center justify-center gap-3 sm:gap-4 lg:gap-6">
              <h1 className="text-xl sm:text-3xl lg:text-5xl font-poppins font-black text-white uppercase tracking-[0.1em] lg:tracking-[0.15em] leading-tight m-0">
                {title.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h1>
            </div>
            <div className="w-16 h-1 bg-white mx-auto mt-4 rounded-full opacity-80" />
          </motion.div>
        </div>
      </AnimatedSection>

      {/* 🖼️ IMAGE GALLERY */}
      <section className="bg-white py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl lg:text-4xl font-poppins font-black text-dronek-dark uppercase tracking-widest">
              {lang === 'fr' ? 'Galerie Photo' : 'Photo Gallery'}
            </h2>
            <div className="w-12 h-1 bg-dronek-green mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer">
               <img src={images[0] || "/images/team-photo.jpg"} alt="Impact 1" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 transition-colors" />
             </motion.div>
             <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-1 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer">
               <img src={images[1] || "/images/about-forest.jpg"} alt="Impact 2" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             </motion.div>
             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-1 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer">
               <img src={images[2] || "/images/hero-forest.jpg"} alt="Impact 3" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             </motion.div>
             <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer">
               <img src={images[3] || "/images/project-training.jpg"} alt="Impact 4" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 transition-colors" />
             </motion.div>
             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer">
               <img src={images[4] || "/images/nursery.jpg"} alt="Impact 5" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 transition-colors" />
             </motion.div>
             <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-1 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer">
               <img src={images[5] || "/images/hero-drone.jpg"} alt="Impact 6" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             </motion.div>
             <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-1 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer">
               <img src={images[6] || "/images/hero-agriculture.jpg"} alt="Impact 7" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
             </motion.div>
             <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="md:col-span-2 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer">
               <img src={images[7] || "/images/project-carbon.jpg"} alt="Impact 8" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               <div className="absolute inset-0 transition-colors" />
             </motion.div>
          </div>
        </div>
      </section>

      {/* 🎬 VIDEO SECTION — YouTube Gallery */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-4xl font-poppins font-black text-dronek-dark uppercase tracking-widest">
              {lang === 'fr' ? 'Vidéothèque' : 'Video Library'}
            </h2>
            <div className="w-12 h-1 bg-dronek-green mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full -mt-10">
            {videoList.map((video, idx) => (
              <div key={video.id + idx} className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 150 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="group relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border-4 border-white"
                >
                  {playingIndex === idx ? (
                    video.type === 'local' ? (
                      <video 
                        src={video.url} 
                        className="w-full h-full" 
                        controls 
                        autoPlay 
                        playsInline
                      />
                    ) : video.type === 'facebook' ? (
                      <iframe 
                        src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(video.url)}&show_text=0&autoplay=1`} 
                        className="w-full h-full border-none" 
                        allow="autoplay; encrypted-media" 
                        allowFullScreen 
                      />
                    ) : video.type === 'vimeo' ? (
                      <iframe 
                        src={`https://player.vimeo.com/video/${video.id}?autoplay=1`} 
                        className="w-full h-full border-none" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        allowFullScreen 
                      />
                    ) : (
                      <iframe 
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`} 
                        className="w-full h-full border-none" 
                        allow="autoplay; encrypted-media" 
                        allowFullScreen 
                      />
                    )
                  ) : (
                    <>
                      <img 
                        src={video.type === 'youtube' ? `https://img.youtube.com/vi/${video.id}/hqdefault.jpg` : (video.thumb || "/images/hero-forest.jpg")} 
                        alt={video.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" 
                      />
                      
                      <div 
                        onClick={() => setPlayingIndex(idx)}
                        className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transition-all duration-300 border border-white/30",
                            video.type === 'youtube' ? "bg-red-600/90 hover:bg-red-700" :
                            video.type === 'facebook' ? "bg-blue-700/90 hover:bg-blue-800" :
                            video.type === 'vimeo' ? "bg-sky-500/90 hover:bg-sky-600" :
                            "bg-dronek-green/90 hover:bg-dronek-dark"
                          )}
                        >
                          {video.type === 'youtube' ? (
                            <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" fill="white"/>
                              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48" fill="#dc2626" />
                            </svg>
                          ) : video.type === 'facebook' ? (
                            <Facebook className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white" />
                          ) : video.type === 'vimeo' ? (
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current ml-1" />
                          ) : (
                            <Video className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                          )}
                        </motion.div>
                      </div>

                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideo(video.id || video.url);
                        }}
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-dronek-green backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all group-hover:scale-110 shadow-lg"
                        title={lang === 'fr' ? "Agrandir la vidéo" : "Enlarge video"}
                      >
                        <ExternalLink size={18} />
                      </button>
                    </>
                  )}
                </motion.div>
                
                {/* Labels supprimés comme demandé */}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📺 VIDEO MODAL (LIGHTBOX) */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-sm" onClick={() => setActiveVideo(null)}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              onClick={() => setActiveVideo(null)}
            >
              <X size={20} />
            </button>
            {activeVideo.includes('http') && !activeVideo.includes('youtu') ? (
               <video src={activeVideo} className="w-full h-full" controls autoPlay />
            ) : (
              <iframe 
                src={`https://www.youtube.com/embed/${activeVideo.length === 11 ? activeVideo : getYouTubeId(activeVideo)}?autoplay=1&rel=0`} 
                className="w-full h-full border-none" 
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowFullScreen 
              />
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
