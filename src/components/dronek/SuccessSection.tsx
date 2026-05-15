'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import { partners } from '@/lib/partners';
import type { PageView } from './Navbar';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

function getPartnerFallbackLabel(name: string) {
  const label = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 6);

  return label || name.slice(0, 6);
}

interface SuccessSectionProps {
  onNavigate: (page: PageView) => void;
}

export default function SuccessSection({ onNavigate }: SuccessSectionProps) {
  const { lang } = useLanguage();

  return (
    <motion.section className="relative overflow-hidden bg-white py-12 lg:py-16" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="max-w-xl mx-auto lg:mx-0 lg:mr-auto">
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-dronek-text">
              <span className="text-dronek-green">
                {"Succès".split('').map((char, i) => (
                  <motion.span
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    transition={{ duration: 0.1, delay: i * 0.03 }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </span>
              {" prouvé".split('').map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.1, delay: (i + 6) * 0.03 }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <br />
              {"sur le terrain".split('').map((char, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.1, delay: (i + 13) * 0.03 }}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.h2>
            <motion.p variants={fadeInUp} className="mt-6 text-dronek-medium text-lg lg:text-xl leading-relaxed">
              {lang === 'fr'
                ? 'Des agriculteurs aux grandes exploitations forestières, DRONEK a aidé des centaines de clients à améliorer leur efficacité et à obtenir de meilleurs rendements.'
                : 'From farmers to large forestry operations, DRONEK has helped hundreds of clients improve efficiency and achieve better yields.'}
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button
                className="mt-8 rounded-xl bg-dronek-green hover:bg-dronek-dark text-white px-10 py-4 h-auto text-xl font-bold shadow-lg shadow-dronek-green/20"
                onClick={() => onNavigate('contact')}
              >
                {lang === 'fr' ? 'Contactez-nous' : 'Contact us'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>

          <div className="w-full">
            <div className="success-carousel-wrapper">
              <div className="success-carousel-track hover:[animation-play-state:paused]">
                {/* Double the array for infinite scroll effect */}
                {[...partners, ...partners].map((partner, idx) => (
                  <div key={`partner-${partner.name}-${idx}`} className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-black/5 h-20 sm:h-24 w-[140px] sm:w-[160px] flex items-center justify-center p-3 flex-none mx-3 transition-transform duration-300 hover:-translate-y-1">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="max-w-full max-h-10 sm:max-h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
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
                  </div>
                ))}
              </div>
            </div>
            
            <div className="success-carousel-wrapper mt-6">
              <div className="success-carousel-track success-carousel-track-reverse hover:[animation-play-state:paused]">
                {/* Reverse the order for the second row */}
                {[...partners.reverse(), ...partners.reverse()].map((partner, idx) => (
                  <div key={`partner-rev-${partner.name}-${idx}`} className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-black/5 h-20 sm:h-24 w-[140px] sm:w-[160px] flex items-center justify-center p-3 flex-none mx-3 transition-transform duration-300 hover:-translate-y-1">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="max-w-full max-h-10 sm:max-h-12 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .success-carousel-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }

        .success-carousel-wrapper::before,
        .success-carousel-wrapper::after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          width: 15%;
          z-index: 2;
          pointer-events: none;
        }

        .success-carousel-wrapper::before {
          left: 0;
          background: linear-gradient(to right, #ffffff, transparent);
        }

        .success-carousel-wrapper::after {
          right: 0;
          background: linear-gradient(to left, #ffffff, transparent);
        }

        .success-carousel-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: carousel-scroll 40s linear infinite;
        }

        .success-carousel-track-reverse {
          animation: carousel-scroll-reverse 45s linear infinite;
        }

        @keyframes carousel-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes carousel-scroll-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>
    </motion.section>
  );
}
