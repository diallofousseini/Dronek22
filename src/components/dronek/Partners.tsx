'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { partners } from '@/lib/partners';
import { useLanguage } from './LanguageProvider';

import Image from 'next/image';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function Partners() {
  const { lang, t } = useLanguage();
  const getPartnerFallbackLabel = (name: string) => {
    const label = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .replace(/[^A-Za-z0-9]/g, '')
      .slice(0, 6);

    return label || name.slice(0, 6);
  };

  return (
    <section className="py-8 lg:py-10 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="relative inline-flex flex-col items-center group max-w-3xl">
            {/* Decorative Leaf - Top Left with slow animation */}
            <motion.div 
              initial={{ opacity: 0, rotate: -20, scale: 0.8, x: -20 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
              className="absolute -top-4 -left-8 sm:-top-6 sm:-left-12 lg:-top-8 lg:-left-16 pointer-events-none"
            >
              <img
                src="/images/partners/ChatGPT_Image_24_avr._2026__15_44_37-removebg-preview.png"
                alt="Leaf"
                className="w-12 h-10 sm:w-16 sm:h-12 lg:w-20 lg:h-16 object-contain opacity-100"
              />
            </motion.div>

            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-center">
                {lang === 'fr' ? (
                  <>
                    <span className="text-black">Ils nous font </span>
                    <span className="text-[#149655]">confiance</span>
                  </>
                ) : (
                  <>
                    <span className="text-black">They trust </span>
                    <span className="text-[#149655]">us</span>
                  </>
                )}
              </h2>
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "5rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-1.5 bg-black rounded-full mt-6 mx-auto" 
              />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="partners-carousel-wrapper relative w-full"
        >
          <div className="partners-carousel-track hover:[animation-play-state:paused] py-2">
            {[...partners, ...partners, ...partners].map((partner, idx) => (
              <a 
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                key={`${partner.name}-${idx}`} 
                className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-black/5 h-20 sm:h-24 w-[140px] sm:w-[180px] flex items-center justify-center p-2 flex-none mx-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-dronek-green/10"
              >
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-contain transition-all duration-300"
                  loading="lazy"
                  onError={(event) => {
                    const image = event.currentTarget;
                    image.style.display = 'none';
                    const fallback = image.nextElementSibling as HTMLSpanElement | null;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <span className="hidden items-center justify-center text-center text-sm font-bold text-dronek-medium uppercase leading-tight px-2">
                  {getPartnerFallbackLabel(partner.name)}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .partners-carousel-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .partners-carousel-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: partners-scroll 45s linear infinite;
        }

        @keyframes partners-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        @media (max-width: 640px) {
          .partners-carousel-track {
            animation-duration: 35s;
          }
        }
      `}</style>
    </section>
  );
}
