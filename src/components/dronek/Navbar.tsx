'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import { cn } from '@/lib/utils';
import { TreePine, Navigation, Sprout, Wheat } from 'lucide-react';

export type PageView = 'home' | 'services-forestry' | 'services-drone' | 'services-agroforestry' | 'services-agriculture' | 'projects' | 'blog' | 'blog-article' | 'training' | 'team' | 'production' | 'contact';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

const serviceIcons = { forestry: TreePine, drone: Navigation, agroforestry: Sprout, agriculture: Wheat };
const serviceImages: Record<string, string> = {
  forestry: '/images/hero-forest.jpg',
  drone: '/images/hero-drone.jpg',
  agroforestry: '/images/hero-agroforestry.jpg',
  agriculture: '/images/hero-agriculture.jpg',
};

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { lang, t, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const serviceLinks = [
    { key: 'forestry' as const, page: 'services-forestry' as PageView },
    { key: 'drone' as const, page: 'services-drone' as PageView },
    { key: 'agroforestry' as const, page: 'services-agroforestry' as PageView },
    { key: 'agriculture' as const, page: 'services-agriculture' as PageView },
  ];

  const navLinks = [
    { label: t.nav.projects, page: 'projects' as PageView },
    { label: t.nav.blog, page: 'blog' as PageView },
    { label: t.nav.training, page: 'training' as PageView },
    { label: t.nav.team, page: 'team' as PageView },
    { label: t.nav.production, page: 'production' as PageView },
    { label: t.nav.contact, page: 'contact' as PageView },
  ];

  const isActive = (page: PageView) => {
    if (page === currentPage) return true;
    if (currentPage.startsWith('services-') && page === 'services-forestry') return true;
    return false;
  };

  const handleNav = useCallback((page: PageView) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [onNavigate]);

  const isHome = currentPage === 'home';

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: {
      opacity: 1, x: 0,
      transition: { duration: 0.4, cubicBezier: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0, x: '100%',
      transition: { duration: 0.3, cubicBezier: [0.4, 0, 0.2, 1] },
    },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number) => ({
      opacity: 1, x: 0,
      transition: { delay: 0.15 + i * 0.07, duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px]">
        <motion.div
          className="h-full bg-gradient-to-r from-dronek-dark via-dronek-green to-dronek-gold"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <nav
        className={cn(
          'fixed top-[3px] left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/[0.03]'
            : isHome
              ? 'bg-transparent'
              : 'bg-white/80 backdrop-blur-xl border-b border-white/20'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 shrink-0 group"
            >
              <Image
                src="/images/dronek-nav-icon.png"
                alt="DRONEK"
                width={80}
                height={80}
                className="h-12 lg:h-14 w-auto transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="flex flex-col">
                <span className={cn('text-lg lg:text-xl font-bold tracking-tight transition-colors duration-300', scrolled || !isHome ? 'text-dronek-text' : 'text-white')} style={{ fontFamily: "'Playfair Display', serif" }}>DRONEK</span>
                <span className={cn('text-[10px] lg:text-xs font-medium tracking-widest uppercase transition-colors duration-300', scrolled || !isHome ? 'text-dronek-green' : 'text-dronek-gold')}>SARL</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5">
              {/* Home */}
              <button
                onClick={() => handleNav('home')}
                className={cn(
                  'nav-link px-3 py-2 text-sm font-medium transition-colors duration-300',
                  isActive('home')
                    ? 'text-dronek-green active'
                    : scrolled
                      ? 'text-dronek-text hover:text-dronek-green'
                      : 'text-white/90 hover:text-white'
                )}
              >
                {t.nav.home}
              </button>

              {/* Services Mega-Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  className={cn(
                    'nav-link px-3 py-2 text-sm font-medium transition-colors duration-300 flex items-center gap-1',
                    currentPage.startsWith('services-')
                      ? 'text-dronek-green active'
                      : scrolled
                        ? 'text-dronek-text hover:text-dronek-green'
                        : 'text-white/90 hover:text-white'
                  )}
                >
                  {t.nav.services}
                  <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-300', servicesOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[560px] bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 p-4 overflow-hidden"
                    >
                      {/* Decorative gradient */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dronek-dark via-dronek-green to-dronek-gold" />
                      <div className="grid grid-cols-2 gap-2">
                        {serviceLinks.map((link) => {
                          const Icon = serviceIcons[link.key];
                          const serviceData = t.services[link.key];
                          return (
                            <button
                              key={link.page}
                              onClick={() => handleNav(link.page)}
                              className="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-dronek-light/60 transition-all duration-200 text-left"
                            >
                              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                <Image
                                  src={serviceImages[link.key]}
                                  alt={serviceData.name}
                                  fill
                                  className="object-cover group-hover/item:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-dronek-dark/30 flex items-center justify-center">
                                  <Icon className="w-6 h-6 text-white" />
                                </div>
                              </div>
                              <div className="pt-1 min-w-0">
                                <h4 className="font-semibold text-sm text-dronek-text group-hover/item:text-dronek-green transition-colors">{serviceData.name}</h4>
                                <p className="text-xs text-dronek-light-text mt-0.5 line-clamp-2">{serviceData.desc}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {/* Bottom CTA */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => handleNav('services-forestry')}
                          className="flex items-center gap-1.5 text-sm font-medium text-dronek-green hover:text-dronek-dark transition-colors mx-auto"
                        >
                          {t.services.learnMore}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Other nav links */}
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={cn(
                    'nav-link px-3 py-2 text-sm font-medium transition-colors duration-300',
                    isActive(link.page)
                      ? 'text-dronek-green active'
                      : scrolled
                        ? 'text-dronek-text hover:text-dronek-green'
                        : 'text-white/90 hover:text-white'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className={cn(
                'flex items-center rounded-full overflow-hidden transition-all duration-300',
                scrolled
                  ? 'border border-gray-200/60 bg-white/60'
                  : 'border border-white/20 bg-white/10 backdrop-blur-sm'
              )}>
                <button
                  onClick={() => setLang('fr')}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-semibold transition-all duration-300',
                    lang === 'fr'
                      ? 'bg-dronek-green text-white shadow-sm'
                      : scrolled
                        ? 'text-dronek-text hover:bg-gray-50'
                        : 'text-white/80 hover:text-white'
                  )}
                >
                  FR
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={cn(
                    'px-2.5 py-1.5 text-xs font-semibold transition-all duration-300',
                    lang === 'en'
                      ? 'bg-dronek-green text-white shadow-sm'
                      : scrolled
                        ? 'text-dronek-text hover:bg-gray-50'
                        : 'text-white/80 hover:text-white'
                  )}
                >
                  EN
                </button>
              </div>

              {/* Desktop CTA */}
              <Button
                onClick={() => handleNav('contact')}
                className={cn(
                  'hidden lg:inline-flex rounded-full px-5 text-sm font-semibold transition-all duration-300',
                  scrolled
                    ? 'bg-gradient-to-r from-dronek-green to-dronek-dark hover:from-dronek-dark hover:to-dronek-green text-white shadow-lg shadow-dronek-green/20 hover:shadow-dronek-green/30'
                    : 'bg-white/15 backdrop-blur-sm border border-white/25 text-white hover:bg-white hover:text-dronek-dark'
                )}
              >
                {t.hero.cta1}
              </Button>

              {/* Mobile menu trigger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
              >
                {mobileOpen ? (
                  <X className={cn('w-5 h-5', scrolled ? 'text-dronek-text' : 'text-white')} />
                ) : (
                  <Menu className={cn('w-5 h-5', scrolled ? 'text-dronek-text' : 'text-white')} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[55] bg-white lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Image src="/images/dronek-nav-icon.png" alt="DRONEK" width={60} height={60} className="h-10 w-auto" />
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-dronek-text tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>DRONEK</span>
                  <span className="text-[10px] font-medium text-dronek-green tracking-widest uppercase">SARL</span>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100">
                <X className="w-5 h-5 text-dronek-text" />
              </button>
            </div>

            {/* Links */}
            <div className="px-6 py-8 space-y-1">
              <motion.button
                custom={0}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                onClick={() => handleNav('home')}
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left text-lg font-medium text-dronek-text hover:bg-dronek-light/60 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-dronek-green" />
                {t.nav.home}
              </motion.button>

              {/* Services accordion */}
              <div>
                <motion.button
                  custom={1}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-left text-lg font-medium text-dronek-text hover:bg-dronek-light/60 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-dronek-green" />
                    {t.nav.services}
                  </span>
                  <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', mobileServicesOpen && 'rotate-180')} />
                </motion.button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden ml-6"
                    >
                      <div className="space-y-1 py-2 border-l-2 border-dronek-green/20 pl-4">
                        {serviceLinks.map((link, idx) => {
                          const Icon = serviceIcons[link.key];
                          return (
                            <motion.button
                              key={link.page}
                              custom={idx + 2}
                              variants={linkVariants}
                              initial="hidden"
                              animate="visible"
                              onClick={() => handleNav(link.page)}
                              className="flex items-center gap-3 w-full px-3 py-2.5 text-left text-sm rounded-lg text-dronek-medium hover:bg-dronek-light/60 hover:text-dronek-green transition-colors"
                            >
                              <Icon className="w-4 h-4 text-dronek-green" />
                              {t.services[link.key].name}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.page}
                  custom={idx + 3}
                  variants={linkVariants}
                  initial="hidden"
                  animate="visible"
                  onClick={() => handleNav(link.page)}
                  className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left text-lg font-medium text-dronek-text hover:bg-dronek-light/60 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-dronek-green" />
                  {link.label}
                </motion.button>
              ))}
            </div>

            {/* CTA at bottom */}
            <div className="px-6 pb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <Button
                  onClick={() => handleNav('contact')}
                  className="w-full bg-gradient-to-r from-dronek-green to-dronek-dark hover:from-dronek-dark hover:to-dronek-green text-white rounded-full py-6 text-base font-semibold shadow-lg shadow-dronek-green/20"
                >
                  {t.hero.cta1}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
