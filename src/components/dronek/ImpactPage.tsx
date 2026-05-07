'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ScrollTitle } from './ScrollTitle';
import AnimatedSection from './AnimatedSection';
import { Play, Youtube, ExternalLink } from 'lucide-react';

export default function ImpactPage() {
  const title = "Notre impact en images";

  return (
    <div className="bg-white min-h-screen pt-4 pb-20 font-sans">
      {/* 🚀 BANNER HERO — Centered Dronek Style (Matches Contact Page) */}
      <AnimatedSection className="relative h-auto min-h-[160px] lg:min-h-[180px] flex items-start overflow-hidden rounded-[2.5rem] lg:rounded-[4rem] lg:rounded-tl-[8rem] lg:rounded-br-[8rem] mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl bg-[#1a4a2e]">
        {/* Background Accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-dronek-dark via-[#0a2118] to-dronek-green/20 opacity-90" />
        <div className="absolute inset-0 pattern-dots-light opacity-10" />
        
        {/* Custom Background Image on the Right */}
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

      <section className="bg-white py-10 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
             {/* Row 1: Large Left, Small Right */}
             <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer"
             >
               <Image src="/images/team-photo.jpg" alt="Impact 1" fill className="object-cover transition-transform duration-1000" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-1 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer"
             >
               <Image src="/images/about-forest.jpg" alt="Impact 2" fill className="object-cover transition-transform duration-1000" />
             </motion.div>

             {/* Row 2: Small Left, Large Right */}
             <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-1 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer"
             >
               <Image src="/images/hero-forest.jpg" alt="Impact 3" fill className="object-cover transition-transform duration-1000" />
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer"
             >
               <Image src="/images/project-training.jpg" alt="Impact 4" fill className="object-cover transition-transform duration-1000" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
             </motion.div>

             {/* Row 3: Large Left, Small Right (Additional) */}
             <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer"
             >
               <Image src="/images/nursery.jpg" alt="Impact 5" fill className="object-cover transition-transform duration-1000" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-1 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer"
             >
               <Image src="/images/hero-drone.jpg" alt="Impact 6" fill className="object-cover transition-transform duration-1000" />
             </motion.div>

             {/* Row 4: Small Left, Large Right (Additional) */}
             <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-1 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer"
             >
               <Image src="/images/hero-agriculture.jpg" alt="Impact 7" fill className="object-cover transition-transform duration-1000" />
             </motion.div>

             <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="md:col-span-2 relative h-[240px] md:h-[350px] rounded-none overflow-hidden group cursor-pointer"
             >
               <Image src="/images/project-carbon.jpg" alt="Impact 8" fill className="object-cover transition-transform duration-1000" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
             </motion.div>
          </div>
        </div>
      </section>

      {/* 🎬 VIDEO SECTION — YouTube Gallery */}
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full -mt-20">
            {[{ id: '1', title: 'Reforestation Communautaire', url: '#', thumb: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80' },
              { id: '2', title: 'Cérémonie de Planting à Kirifi', url: '#', thumb: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80' }
            ].map((video, idx) => (
              <motion.a
                key={video.id}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 2.0, delay: idx * 0.4, ease: "easeOut" }}
                viewport={{ once: true }}
                className="group relative h-[240px] lg:h-[380px] rounded-none overflow-hidden shadow-lg bg-gray-200"
              >
                <img 
                  src={video.thumb} 
                  alt={video.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay with YouTube play button style */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-16 h-12 bg-[#FF0000] rounded-xl flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>

                {/* Bottom Bar — Matching the Image */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white" />
                    </div>
                    <span className="text-white text-[10px] font-bold uppercase tracking-wide truncate max-w-[120px]">
                      {video.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 group-hover:bg-dronek-green transition-colors">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                      Regarder sur
                    </span>
                    <Youtube className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Header Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white p-1.5 shadow-md">
                    <img src="/images/dronek-nav-icon.png" alt="Dronek" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-[10px] font-black leading-none drop-shadow-md">DRONEK TV</span>
                    <span className="text-white/70 text-[8px] font-bold leading-none drop-shadow-md">S'abonner</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
