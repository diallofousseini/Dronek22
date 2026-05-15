'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Linkedin, Mail, X, Quote, Facebook } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useLanguage } from './LanguageProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
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
    const fetchTeam = async () => {
      const { data, error } = await supabase
        .from('equipe')
        .select('*')
        .in('statut', ['publie', 'Publié', 'Published', 'actif']) // Match SQL schema status
        .order('created_at', { ascending: false });
      
      if (data) {
        setDynamicMembers(data.map(m => {
          let imageUrl = m.photo_url || 'hero-main.jpg'; // just the filename so it prepends /images/ correctly below
          if (imageUrl && !imageUrl.startsWith('/') && !imageUrl.startsWith('http') && !imageUrl.includes('.')) {
             imageUrl = 'hero-main.jpg'; // Fallback if it's completely invalid text
          } else if (imageUrl && imageUrl.startsWith('/images/')) {
             imageUrl = imageUrl.replace('/images/', '');
          }
          return {
            id: m.id,
            name: `${m.prenom} ${m.nom}`,
            role: m.poste,
            image: imageUrl,
            bio: m.biographie,
            email: m.email,
            linkedin: m.linkedin
          };
        }));
      }
    };

    fetchTeam();

    const subscription = supabase.channel('team-news').on('postgres_changes', { event: '*', schema: 'public', table: 'equipe' }, fetchTeam).subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const members = React.useMemo(() => {
    const staticMembers = t.team.members || [];
    // Normalize names to compare (lowercase, trimmed)
    const dynamicNames = new Set(dynamicMembers.map(m => m.name.toLowerCase().trim()));
    const filteredStatic = staticMembers.filter((m: any) => !dynamicNames.has(m.name.toLowerCase().trim()));
    return [...dynamicMembers, ...filteredStatic];
  }, [dynamicMembers, t.team.members]);

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
              <div className="aspect-[4/5] rounded-[2rem] sm:rounded-[3rem] lg:rounded-tl-[8rem] overflow-hidden shadow-2xl relative z-10 bg-[#ac96af]">
                <Image 
                  src="/images/founder.jpg" 
                  alt="Founder" 
                  fill 
                  className="object-cover object-top mix-blend-multiply opacity-90" 
                />
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 text-dronek-green font-bold tracking-widest uppercase text-xs">
                <div className="h-px w-6 bg-dronek-green" />
                {t.team.founderWord.title.split('').map((char: string, i: number) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.1, delay: i * 0.05 }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-dronek-text leading-tight italic">
                {t.team.founderWord.quote}
              </h2>
              <div className="space-y-4 text-dronek-medium text-base leading-relaxed font-sans">
                <p>{t.team.founderWord.desc1}</p>
                <p>{t.team.founderWord.desc2}</p>
                <div className="flex flex-col pt-2">
                  <span className="text-xl font-bold text-dronek-text">{t.team.founderWord.name}</span>
                  <span className="text-sm font-semibold text-dronek-green">{t.team.founderWord.signature}</span>
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 max-w-6xl mx-auto"
          >
            {members.map((member, idx) => (
              <MemberCard key={member.id || idx} member={member} idx={idx} />
            ))}
          </motion.div>
        </div>
      </section>

    </div>
  );
}

function MemberCard({ member, idx }: { member: TeamMember; idx: number }) {
  const [imageError, setImageError] = useState(false);
  const { lang } = useLanguage();

  // Handle name repetition: If prenom and nom were same or name already has repetition
  const formattedName = React.useMemo(() => {
    let name = member.name.trim();
    const parts = name.split(' ');
    
    // If name has 4 parts and first two are same as last two, it's a duplication
    if (parts.length === 4 && 
        parts[0].toLowerCase() === parts[2].toLowerCase() && 
        parts[1].toLowerCase() === parts[3].toLowerCase()) {
      name = `${parts[0]} ${parts[1]}`;
    } else if (parts.length === 2 && parts[0].toLowerCase() === parts[1].toLowerCase()) {
      name = parts[0];
    }

    return name.toLowerCase().split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }, [member.name]);

  const imgSrc = imageError 
    ? '/images/founder.jpg' // Use founder as high-quality fallback or a specific team-placeholder
    : (member.image.startsWith('http') || member.image.startsWith('/') ? member.image : `/images/${member.image}`);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 150 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay: idx * 0.2, ease: "easeOut" }}
      className="h-full"
    >
      <div className="group flex flex-col items-center text-center p-2 sm:p-4">
        {/* Circular Image with Hover Socials (No border) */}
        <div className="relative rounded-full overflow-hidden shadow-2xl mb-6 lg:mb-8 group-hover:shadow-dronek-green/20 transition-all duration-500 bg-gray-100"
             style={{ 
               width: 'clamp(140px, 40vw, 256px)', 
               height: 'clamp(140px, 40vw, 256px)' 
             }}
        >
          <img
            src={imgSrc}
            alt={member.name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
            onError={() => setImageError(true)}
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

        {/* Name & Role — Matches project card style */}
        <div className="flex flex-col items-center text-center h-full">
          <h3 className="text-xl lg:text-2xl font-bold text-[#149655] leading-tight tracking-tight mb-3">
            {formattedName}
          </h3>
          <p className="text-[#71807e] font-medium text-base lg:text-xl leading-relaxed whitespace-pre-line">
            {member.role}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
