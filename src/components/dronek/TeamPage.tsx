'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Linkedin, Mail, X, Quote, Facebook } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from './LanguageProvider';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore';
import SuccessSection from './SuccessSection';
import { ScrollTitle } from './ScrollTitle';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  email?: string;
  facebook?: string;
  linkedin?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

export default function TeamPage() {
  const { t, lang } = useLanguage();
  const [dynamicMembers, setDynamicMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, 'team'), 
      where('status', 'in', ['Publié', 'Published']),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setDynamicMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TeamMember)));
    });
    return () => unsubscribe();
  }, []);

  const members = [...dynamicMembers, ...t.team.members];

  return (
    <div className="bg-white min-h-screen">
      {/* 🚀 BANNER HERO — Standardized Dronek Style */}
      <AnimatedSection className="relative h-auto min-h-[400px] flex items-start overflow-hidden rounded-xl mx-4 sm:mx-6 lg:mx-8 mt-2 lg:mt-3 shadow-2xl">
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-tech.jpg" 
            alt="Team" 
            fill 
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dronek-dark to-dronek-green opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full pl-0 pr-4 sm:pr-6 lg:pr-8 pt-48 lg:pt-64 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12">
            <motion.div initial="hidden" animate="visible" variants={stagger} className="flex-1 min-w-0">
                <ScrollTitle as="h1" className="text-xl lg:text-3xl font-montserrat-extrabold text-white leading-[1.1] uppercase tracking-tight ml-[26px]">
                  {t.team.heroTitle.split('').map((char: string, i: number) => (
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
                </ScrollTitle>
            </motion.div>

            <div className="lg:max-w-md">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-white/80 text-sm lg:text-base font-medium leading-relaxed"
              >
                {t.team.subtitle}
              </motion.p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Founder Word */}
      <section className="pt-12 lg:pt-16 pb-6 lg:pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            <motion.div variants={fadeInUp} className="lg:col-span-4 relative">
              <div className="aspect-[4/5] rounded-[3rem] rounded-tl-[8rem] overflow-hidden shadow-2xl relative z-10 bg-[#ac96af]">
                <Image 
                  src="/images/founder.jpg" 
                  alt="Founder" 
                  fill 
                  className="object-cover object-top mix-blend-multiply opacity-90" 
                />
              </div>


            </motion.div>

            <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-6">
              <ScrollTitle className="inline-flex items-center gap-2 text-dronek-green font-bold tracking-widest uppercase text-xs">
                <div className="h-px w-6 bg-dronek-green" />
                {t.team.founderWord.title}
              </ScrollTitle>
              <h2 className="text-2xl lg:text-3xl font-bold text-dronek-text leading-tight italic">
                {t.team.founderWord.quote}
              </h2>
              <div className="space-y-4 text-dronek-medium text-base leading-relaxed font-sans">
                <p>{t.team.founderWord.desc1}</p>
                <p>{t.team.founderWord.desc2}</p>
                <div className="flex flex-col pt-2">
                  <span className="text-xl font-bold text-dronek-text">{t.team.founderWord.name}</span>
                  <span className="text-sm font-semibold">{t.team.founderWord.signature}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="pt-6 lg:pt-8 pb-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div className="max-w-2xl">
            </div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          >
            {members.map((member, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 150 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 2.0, delay: idx * 0.4, ease: "easeOut" }}
                className="h-full"
              >
                <div className="group flex flex-col items-center text-center p-4">
                  {/* Circular Image with Hover Socials (No border) */}
                  <div className="relative w-48 h-48 sm:w-60 sm:h-60 lg:w-64 lg:h-64 rounded-full overflow-hidden shadow-2xl mb-8 group-hover:shadow-dronek-green/20 transition-all duration-500">
                    <Image
                      src={member.image.startsWith('http') ? member.image : `/images/${member.image}`}
                      alt={member.name}
                      fill
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 px-4">
                      {[
                        { icon: Facebook, href: member.facebook },
                        { icon: Linkedin, href: member.linkedin },
                        { icon: Mail, href: member.email ? `mailto:${member.email}` : null }
                      ].map((social, sIdx) => social.href ? (
                        <a
                          key={sIdx}
                          href={social.href}
                          target={social.icon === Mail ? "_self" : "_blank"}
                          rel="noopener noreferrer"
                          className="w-10 h-10 sm:w-12 sm:h-12 bg-dronek-green rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
                        >
                          <social.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </a>
                      ) : null)}
                    </div>
                  </div>

                  {/* Name & Role — Matches image style */}
                  <div className="space-y-4 max-w-xs">
                    <h3 className="text-2xl lg:text-3xl font-black text-black leading-[1.1] uppercase tracking-tighter">
                      {member.name}
                    </h3>
                    <p className="text-dronek-green font-semibold text-lg lg:text-xl leading-snug">
                      {member.role}
                    </p>
                    {/* Bio removed to match image style, can be restored if needed */}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}
