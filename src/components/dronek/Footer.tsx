'use client';

import React from 'react';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface FooterProps {
  onNavigate: (page: 'home' | 'services' | 'projects' | 'blog' | 'team' | 'production' | 'contact' | 'admin') => void;
  onOpenNewsMenu?: () => void;
}

export default function Footer({ onNavigate, onOpenNewsMenu }: FooterProps) {
  const { t, lang } = useLanguage();

  const handleNav = (page: 'home' | 'services' | 'projects' | 'blog' | 'team' | 'production' | 'contact' | 'admin') => {
    if (page === 'admin') {
      window.location.href = '/admin/login';
      return;
    }
    
    if (page === 'blog' && onOpenNewsMenu) {
      onOpenNewsMenu();
      return;
    }

    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [dynamicInfo, setDynamicInfo] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchContactInfo = async () => {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .eq('sujet', 'Configuration')
        .single();
      
      if (data) {
        setDynamicInfo(data);
      }
    };

    fetchContactInfo();

    const sub = supabase.channel('footer-contact').on('postgres_changes', { event: '*', schema: 'public', table: 'contacts', filter: 'sujet=eq.Configuration' }, fetchContactInfo).subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);
  const quickLinks = [
    { label: t.nav.services, page: 'services' as const },
    { label: t.nav.projects, page: 'projects' as const },
    { label: t.nav.blog, page: 'blog' as const },
    { label: t.nav.production, page: 'production' as const },
    { label: t.nav.admin || 'Admin', page: 'admin' as const },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: 'https://www.facebook.com/Dronek.CI',
      label: 'Facebook',
      target: '_blank',
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/company/dronek/',
      label: 'LinkedIn',
      target: '_blank',
    },
  ];

  const socialTickerText = t.footer.ticker;

  return (
    <footer className="relative bg-green-900 overflow-hidden">
      {/* Subtile wavy lines background */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0
        }}
        viewBox="0 0 1440 300"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 120 Q 360 60 720 130 Q 1080 200 1440 120"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 0 150 Q 360 90 720 160 Q 1080 230 1440 150"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 0 180 Q 360 120 720 190 Q 1080 260 1440 180"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>

      {/* Footer content */}
      <div className="relative z-10 pt-10 pb-6 px-4 sm:px-6 lg:px-8 mt-0">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
            {/* Column 1: Logo & Description */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <img src="/images/AAAAAA-removebg-preview.png" alt="DRONEK" className="h-[72px] w-auto origin-left" />
              <p className="text-white text-sm leading-relaxed font-sans">
                {t.footer.desc}
              </p>
              <p className="text-white font-semibold text-base">
                RC : CI-SAS-2020-B-4402
              </p>
            </motion.div>

            {/* Column 2: Quick Links */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-white font-bold text-lg">
                {t.footer.quickLinks}
              </h3>
              <ul className="space-y-3 flex flex-col">
                {quickLinks.map((link) => (
                  <li key={link.page}>
                    <button
                      onClick={() => handleNav(link.page)}
                      className="text-white hover:text-white/80 transition-colors duration-300 text-sm font-normal"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Contact */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-white font-bold text-lg">
                {t.footer.contactUs}
              </h3>
              <div className="space-y-4 text-sm text-white font-sans">
                <div className="flex gap-3 items-start">
                  <MapPin className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {dynamicInfo?.message || "Cocody, en face de l'entrée principale de l'Hôtel Palm Club, Abidjan, Côte d'Ivoire"}
                  </p>
                </div>
                <div className="flex gap-3 items-center">
                  <Mail className="w-5 h-5 text-white shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{t.footer.email || 'Email'}</span>
                    <a href={`mailto:${dynamicInfo?.email || 'info@dronek.net'}`} className="text-white hover:text-white/80 transition-colors">
                      {dynamicInfo?.email || 'info@dronek.net'}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Phone className="w-5 h-5 text-white shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{t.footer.phone || (lang === 'fr' ? 'Téléphone' : 'Phone')}</span>
                    {dynamicInfo?.telephone ? (
                      dynamicInfo.telephone.split('\n').map((num: string, idx: number) => (
                        <a key={idx} href={`tel:${num.replace(/\s+/g, '')}`} className="text-white font-semibold hover:text-white/80 transition-colors">
                          {num}
                        </a>
                      ))
                    ) : (
                      <>
                        <a href="tel:+22507077322" className="text-white font-semibold hover:text-white/80 transition-colors">
                          +225 07 07 73 22 64
                        </a>
                        <a href="tel:+225272151" className="text-white font-semibold hover:text-white/80 transition-colors">
                          +225 27 21 51 41 49
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Column 4: Social Media */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-white font-bold text-lg">
                {t.footer.followUs}
              </h3>
              <div className="flex items-center gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.target}
                      rel={social.target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white hover:border-white hover:bg-white/20 transition-all duration-300 shadow-lg shadow-black/10 overflow-hidden"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </a>
                  );
                })}
              </div>

              <div className="social-ticker-wrapper" aria-label="Footer social values ticker">
                <div className="social-ticker-track">
                  <span className="social-ticker-text">{socialTickerText}</span>
                  <span className="social-ticker-text" aria-hidden="true">{socialTickerText}</span>
                </div>
              </div>
            </motion.div>
          </div>


          {/* Copyright */}
          <div className="text-center">
            <p className="text-white text-sm font-sans">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .social-ticker-wrapper {
          width: 100%;
          overflow: hidden;
          padding: 0.5rem 0;
        }

        .social-ticker-track {
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          min-width: max-content;
          animation: social-scroll-left 28s linear infinite;
        }

        .social-ticker-text {
          display: inline-block;
          padding-right: 2.5rem;
          font-size: 0.85rem;
          line-height: 1.2;
          color: #ffffff;
          opacity: 0.95;
          letter-spacing: 0.02em;
          font-weight: 700;
        }

        @keyframes social-scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </footer>
  );
}
