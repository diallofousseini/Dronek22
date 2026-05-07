import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Rocket, Users, MapPin } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import Image from 'next/image';

export default function Values() {
  const { lang } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Animation plus visible: L'image s'étend verticalement et horizontalement
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    [
      "inset(15% 15% 15% 15% round 4rem)", 
      "inset(0% 0% 0% 0% round 0rem)",
      "inset(0% 0% 0% 0% round 0rem)",
      "inset(15% 15% 15% 15% round 4rem)"
    ]
  );

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0.4]);
  const scale = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [1.1, 1, 1, 1.1]);

  const values = [
    {
      icon: Rocket,
      title: lang === 'fr' ? 'Innovation' : 'Innovation',
      desc: lang === 'fr' 
        ? 'Nous adoptons les technologies les plus avancées pour offrir des solutions à la pointe de l\'innovation.' 
        : 'We adopt the most advanced technologies to offer solutions at the cutting edge of innovation.'
    },
    {
      icon: Users,
      title: lang === 'fr' ? 'Expertise' : 'Expertise',
      desc: lang === 'fr' 
        ? 'Notre équipe d\'experts qualifiés apporte son savoir-faire pour garantir la réussite de vos projets.' 
        : 'Our team of qualified experts brings its know-how to guarantee the success of your projects.'
    },
    {
      icon: MapPin,
      title: lang === 'fr' ? 'Proximité' : 'Proximity',
      desc: lang === 'fr' 
        ? 'Nous sommes présents localement pour mieux comprendre et répondre aux besoins de nos clients.' 
        : 'We are present locally to better understand and meet our clients\' needs.'
    }
  ];

  return (
    <section ref={containerRef} className="relative min-h-[100vh] flex items-center py-24 overflow-hidden bg-white">
      {/* Animated Background Image */}
      <motion.div 
        style={{ clipPath, opacity, y }}
        className="absolute inset-0 z-0"
      >
        <motion.div style={{ scale }} className="relative w-full h-full">
          <Image
            src="/images/hero-tech.jpg" 
            alt="Values Background"
            fill
            className="object-cover brightness-[0.3]"
            priority
          />
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
          >
            {lang === 'fr' ? 'Nos valeurs' : 'Our Values'}
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true }}
            className="h-1.5 bg-dronek-green mx-auto mb-8 rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/80 text-xl font-light max-w-2xl mx-auto"
          >
            {lang === 'fr' 
              ? 'Des principes qui guident notre action au quotidien' 
              : 'Principles that guide our daily action'}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.8 }}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-12 flex flex-col items-center text-center space-y-8 hover:bg-white/10 transition-all duration-500 hover:border-dronek-green/30"
              >
                <div className="w-20 h-20 rounded-3xl bg-dronek-green/20 flex items-center justify-center text-dronek-green group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-12 h-12 stroke-[1.5]" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-white">
                    {value.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed text-lg font-normal">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
