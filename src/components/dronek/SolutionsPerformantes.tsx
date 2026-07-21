'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Network, Users, Cloud, ArrowRight, ChevronRight, Server, TreePine, Navigation, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from './LanguageProvider';

export default function SolutionsPerformantes() {
  const { lang } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const leftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section className="pt-4 pb-16 md:pt-8 md:pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col lg:flex-row gap-8 lg:gap-6 items-center"
        >
          {/* Left Column */}
          <motion.div variants={leftVariants} className="w-full lg:w-[30%] flex flex-col items-start space-y-4">

            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tight">
              {lang === 'fr' ? (
                <>
                  <span className="block text-green-900">Profitez du</span>
                  <span className="block text-black">meilleur de la</span>
                  <span className="block text-green-900">technologie</span>
                </>
              ) : (
                <>
                  <span className="block text-green-900">Enjoy the</span>
                  <span className="block text-black">best of</span>
                  <span className="block text-green-900">technology</span>
                </>
              )}
            </h2>
          </motion.div>

          {/* Right Column (Main Card) */}
          <motion.div variants={rightVariants} className="w-full lg:w-[70%] relative">
            <div className="bg-green-900 rounded-[20px] p-4 md:p-6 lg:p-8 relative shadow-2xl">
              {/* Decorative Background Pattern */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-transparent"></div>
                {/* Subtle intersecting circles like in the design */}
                <div className="absolute top-[20%] left-[10%] w-32 h-32 rounded-full border-[20px] border-white/5 mix-blend-overlay"></div>
                <div className="absolute bottom-[10%] left-[30%] w-48 h-48 rounded-full border-[30px] border-white/5 mix-blend-overlay"></div>
                
                {/* Custom Background Image */}
                <img 
                  src="/images/dronek_image3-removebg-preview.png" 
                  alt="" 
                  className="absolute -right-20 -bottom-20 w-[600px] h-auto opacity-20 pointer-events-none"
                />
              </div>

              <div className="relative z-10">
                <div className="text-white/90 text-xs md:text-sm leading-relaxed mb-6 max-w-4xl">
                  <p className="text-base md:text-lg font-bold text-white">
                    {lang === 'fr' 
                      ? "Dans chacune de ces activités, DRONEK propose un panel de services afin de fournir des prestations efficaces et performantes."
                      : "In each of these activities, DRONEK offers a range of services to provide efficient and high-performance solutions."}
                  </p>
                </div>

                {/* 3 Services Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end relative">
                  
                  {/* Left: SERRE MODERNE */}
                  <motion.button 
                    onClick={() => {
                      const el = document.getElementById('agriculture') || document.getElementById('serre');
                      if (el) {
                        const yOffset = -120; 
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    variants={itemVariants} 
                    className="flex flex-col items-center text-center pb-6 group cursor-pointer"
                  >
                    <div className="relative mb-4">
                      <img 
                        src="/images/44444-removebg-preview.png" 
                        alt="Serre Moderne" 
                        className="w-20 h-20 object-contain transition-transform group-hover:scale-110" 
                      />
                    </div>
                    <h3 className="text-white text-base font-bold group-hover:text-green-400 transition-colors uppercase">
                      {lang === 'fr' ? 'CONSTRUCTION DE SERRE MODERNE' : 'MODERN GREENHOUSE CONSTRUCTION'}
                    </h3>
                  </motion.button>

                  <motion.div 
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white rounded-[16px] p-4 flex flex-col items-center text-center shadow-[0_15px_30px_rgba(0,0,0,0.3)] relative z-20 md:scale-105 md:translate-y-12 cursor-pointer group"
                    onClick={() => {
                      const el = document.getElementById('drone');
                      if (el) {
                        const yOffset = -120; 
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                  >
                    <div className="relative">
                      <img 
                        src="/images/5555-removebg-preview.png" 
                        alt="Drone et Cartographie" 
                        className="w-[120px] h-[120px] object-contain -mb-2" 
                      />
                    </div>
                    <h3 className="text-green-900 text-lg font-bold uppercase mt-2">
                      {lang === 'fr' ? 'Drone et Cartographie' : 'Drone & Mapping'}
                    </h3>
                    <div className="mt-2 w-8 h-8 rounded-full bg-green-900 flex items-center justify-center text-white hover:bg-green-800 transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </motion.div>

                  {/* Right: AGRICULTURE */}
                  <motion.button 
                    onClick={() => {
                      const el = document.getElementById('agriculture');
                      if (el) {
                        const yOffset = -120; 
                        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                      }
                    }}
                    variants={itemVariants} 
                    className="flex flex-col items-center text-center pb-6 group cursor-pointer"
                  >
                    <div className="relative mb-4">
                      <img 
                        src="/images/44444-removebg-preview.png" 
                        alt="AGRICULTURE" 
                        className="w-20 h-20 object-contain transition-transform group-hover:scale-110" 
                      />
                    </div>
                    <h3 className="text-white text-base font-bold group-hover:text-green-400 transition-colors uppercase">
                      {lang === 'fr' ? 'AGRICULTURE' : 'AGRICULTURE'}
                    </h3>
                  </motion.button>

                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
