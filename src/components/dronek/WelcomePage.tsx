import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomePageProps {
  onEnter: () => void;
}

export default function WelcomePage({ onEnter }: WelcomePageProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const titles = ["WELCOME", "BIENVENUE"];

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2000); // 2 seconds interval
    return () => clearInterval(interval);
  }, [titles.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center font-sans bg-[#0f3e28]">
      {/* Background Image with Blur and Green Overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
          style={{ filter: 'blur(10px)' }}
          src="https://res.cloudinary.com/dpcbr467k/video/upload/v1776869570/No-video-title-fdown.net_2_kuo0v5.mp4"
        />
        {/* Color Overlays to match the image tint */}
        <div className="absolute inset-0 bg-[#08482f]/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a4a2e]/60 via-transparent to-[#1a4a2e]/80" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle, transparent 20%, #0a2e1d 150%)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl w-full h-full justify-between py-12 sm:py-20">
        
        {/* Top Spacer */}
        <div className="flex-1" />

        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center mb-8 sm:mb-12 w-full"
        >
          {/* We use next/image to display the logo. If logoV.png is the white one, use it. Otherwise use logo.png */}
          <div className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[380px] h-20 sm:h-24 md:h-32 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
             <Image 
              src="/images/AAAAAA-removebg-preview.png" 
              alt="Dronek" 
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-white/90 text-[13px] sm:text-[16px] md:text-[18px] font-semibold tracking-wide mt-2 text-center px-2">
            Foresterie - Agriculture - Technologie
          </h2>
        </motion.div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="space-y-6 flex flex-col items-center flex-1 w-full"
        >
          <div className="relative h-12 md:h-16 flex items-center justify-center w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.h1
                key={titleIndex}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-[0.2em] uppercase drop-shadow-md whitespace-nowrap"
              >
                {titles[titleIndex].split(' ').map((word: string, wordIdx: number) => (
                  <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.2em]">
                    {word.split('').map((char: string, charIdx: number) => (
                      <motion.span
                        key={charIdx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: (wordIdx * 5 + charIdx) * 0.03 }}
                        className="inline-block"
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.h1>
            </AnimatePresence>
          </div>
          
          <p className="text-white/95 text-xs sm:text-base lg:text-lg max-w-3xl font-medium leading-relaxed mt-4 drop-shadow-sm text-center px-2">
            Solutions innovantes par drone pour l'agriculture, l'inventaire forestier et la surveillance environnementale. Technologie au service de la durabilité.
          </p>

          <div className="pt-6 sm:pt-8">
            <button
              onClick={onEnter}
              className="group bg-white text-[#154f30] font-bold text-[14px] sm:text-[15px] uppercase tracking-[0.1em] px-10 sm:px-12 py-3.5 sm:py-4 rounded-sm shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:shadow-[0_15px_50px_rgba(0,0,0,0.4)] flex items-center justify-center gap-3"
            >
              DÉCOUVRIR <span className="group-hover:translate-x-1 transition-transform font-light">→</span>
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
