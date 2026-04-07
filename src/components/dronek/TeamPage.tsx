'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Quote, PenLine } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

export default function TeamPage() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Banner with team photo */}
      <section className="relative h-80 sm:h-96 lg:h-[28rem] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/team-photo.jpg" alt="DRONEK Team" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark/90 via-dronek-dark/50 to-dronek-dark/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.h1
              variants={fadeInUp}
              className="text-3xl lg:text-5xl font-bold text-white mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.team.title}
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-white/80 text-lg max-w-2xl">
              {t.team.subtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {t.team.members.map((member, idx) => (
              <motion.div key={idx} variants={scaleIn}>
                <div className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white border border-gray-100 h-full">
                  {/* Image with overlay */}
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={`/images/${member.image}`}
                      alt={member.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/60" />
                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="text-dronek-gold text-sm font-medium">{member.role}</p>
                    </div>
                    {/* Social links on hover */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                      <a href="#" className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-dronek-green border border-white/20 transition-colors">
                        <Linkedin className="w-4 h-4 text-white" />
                      </a>
                      <a href="#" className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center hover:bg-dronek-green border border-white/20 transition-colors">
                        <Mail className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </div>
                  {/* Bio */}
                  <div className="p-5">
                    <p className="text-dronek-medium text-sm leading-relaxed">{member.bio}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Founder's Word */}
      <section className="section-padding bg-dronek-light relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16"
          >
            {/* Founder Photo */}
            <motion.div variants={fadeInUp} className="shrink-0">
              <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-2xl shadow-dronek-green/10">
                <Image src="/images/founder.jpg" alt={t.team.members[0].name} fill className="object-cover object-top" />
                {/* Decorative frame */}
                <div className="absolute inset-3 rounded-2xl border-2 border-white/20 pointer-events-none" />
              </div>
              {/* Decorative element behind */}
              <div className="absolute -z-10 w-full h-full rounded-3xl border-2 border-dronek-green/15 translate-x-4 translate-y-4" />
            </motion.div>

            {/* Quote content */}
            <motion.div variants={fadeInUp} className="flex-1 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Quote className="w-6 h-6 text-dronek-green/40" />
                <h2
                  className="text-2xl lg:text-3xl font-bold text-dronek-text"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t.team.founderWord.title}
                </h2>
              </div>

              <blockquote className="text-dronek-medium text-lg leading-relaxed italic border-l-4 border-dronek-green pl-6 bg-white/50 rounded-r-2xl py-4 pr-4">
                {t.team.founderWord.quote}
              </blockquote>

              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-dronek-green/20" />
                <div className="flex items-center gap-2 text-dronek-text">
                  <PenLine className="w-4 h-4 text-dronek-green" />
                  <span className="font-semibold">{t.team.founderWord.signature}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
