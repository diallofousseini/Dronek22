'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Menu, X, Navigation, Sprout, TreePine, Wheat, Home, BriefcaseBusiness, Newspaper, Images, Users, MapPinned, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageProvider';
import { cn } from '@/lib/utils';

export type PageView =
  | 'home'
  | 'projects'
  | 'blog'
  | 'blog-impact'
  | 'team'
  | 'production'
  | 'services'
  | 'contact'
  | 'admin';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

const serviceIcons = {
  forestry: TreePine,
  drone: Navigation,
  surveillance: Sprout,
  agriculture: Wheat,
};

const serviceImages: Record<string, string> = {
  forestry: '/images/hero-forest.jpg',
  drone: '/images/hero-drone.jpg',
  surveillance: '/images/hero-contact.jpg',
  agriculture: '/images/hero-agriculture.jpg',
};

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { t, lang, setLang } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [mobileBlogOpen, setMobileBlogOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const serviceLinks = [
    { key: 'forestry' as const, section: 'forestry' },
    { key: 'drone' as const, section: 'drone' },
    { key: 'surveillance' as const, section: 'surveillance' },
    { key: 'agriculture' as const, section: 'agriculture' },
  ];

  const navLinks = [
    { label: t.nav.projects, page: 'projects' as PageView, icon: BriefcaseBusiness },
    { label: t.nav.team, page: 'team' as PageView, icon: Users },
    { label: t.nav.production, page: 'production' as PageView, icon: MapPinned },
    { label: t.nav.contact, page: 'contact' as PageView, icon: Mail },
  ];

  const isActive = (page: PageView) => {
    return page === currentPage;
  };

  const handleNav = useCallback(
    (page: PageView, sectionId?: string) => {
      // If we're going to a different page and have a sectionId, store it for the target page
      if (sectionId && page !== currentPage) {
        sessionStorage.setItem('scroll_to_service', sectionId);
      }
      
      onNavigate(page);
      
      if (sectionId) {
        // If we are already on the target page, scroll immediately
        if (page === currentPage) {
          const element = document.getElementById(sectionId);
          if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      setMobileOpen(false);
      setMobileServicesOpen(false);
      setMobileBlogOpen(false);
      setServicesOpen(false);
      setBlogOpen(false);
    },
    [onNavigate, currentPage],
  );

  const mobileMenuVariants = {
    hidden: { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: '100%', transition: { duration: 0.3 } },
  };

  const linkVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + index * 0.05, duration: 0.3 },
    }),
  };

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl transition-all duration-300',
          isScrolled ? 'shadow-sm' : 'shadow-none',
        )}
      >
        {/* ✨ Professional Scroll Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gray-100/30 overflow-hidden">
          <motion.div 
            className="h-full bg-dronek-green origin-left" 
            style={{ width: `${scrollProgress}%` }} 
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[auto_1fr_auto] items-center h-14 lg:h-16 gap-2 lg:gap-3">
            {/* Logo */}
            <button onClick={() => handleNav('home')} className="flex items-center justify-start shrink-0 py-1 pr-2">
              <span className="logo h-[36px] max-w-[320px] overflow-visible">
                <img 
                  src="/Typographie/logoV.png" 
                  alt="Dronek" 
                  className="h-full w-auto object-contain transition-transform duration-300" 
                  style={{ transform: 'translateY(-0.15cm) scale(1.15)', transformOrigin: 'center' }}
                />
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2 justify-center min-w-0 pr-2 lg:pr-3">
              <button
                onClick={() => handleNav('home')}
                className={cn(
                  'nav-link relative flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-105',
                  isActive('home') ? 'text-dronek-green' : 'text-dronek-dark hover:text-dronek-green',
                )}
              >
                {t.nav.home}
                {isActive('home') && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-dronek-green" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </button>

              <button
                onClick={() => handleNav('services')}
                className={cn(
                  'nav-link relative px-3.5 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 flex items-center gap-2 hover:scale-105',
                  (currentPage === 'services') ? 'text-dronek-green' : 'text-dronek-dark hover:text-dronek-green',
                )}
              >
                {t.nav.services}
                {currentPage === 'services' && (
                  <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-dronek-green" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
              </button>

              {/* Actualité Dropdown */}
              <div className="relative group/blog" onMouseEnter={() => setBlogOpen(true)} onMouseLeave={() => setBlogOpen(false)}>
                <button
                  className={cn(
                    'nav-link relative px-3.5 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 flex items-center gap-2 hover:scale-105',
                    (currentPage === 'blog' || currentPage === 'blog-impact') ? 'text-dronek-green' : 'text-dronek-dark hover:text-dronek-green',
                  )}
                >
                  {t.nav.blog}
                  <ChevronDown className="w-4 h-4 text-dronek-dark/40 transition-transform duration-300 group-hover/blog:rotate-180" />
                  {(currentPage === 'blog' || currentPage === 'blog-impact') && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-dronek-green" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                </button>

                <AnimatePresence>
                  {blogOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-none shadow-2xl border border-gray-100 p-1.5 overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 right-0 h-1 bg-dronek-green" />
                      <div className="flex flex-col gap-1">
                        <button onClick={() => handleNav('blog')} className="group/item flex items-center gap-3 p-3 rounded-none hover:bg-gray-100 transition-all duration-200 text-left">
                          <div className="w-10 h-10 rounded-none bg-gray-50 flex items-center justify-center shrink-0 group-hover/item:bg-dronek-green/10 transition-colors">
                            <Newspaper className="w-5 h-5 text-gray-400 group-hover/item:text-dronek-green transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[13px] text-dronek-dark uppercase tracking-wider">Derniers postes</h4>
                          </div>
                        </button>
                        <button onClick={() => handleNav('blog-impact')} className="group/item flex items-center gap-3 p-3 rounded-none hover:bg-gray-100 transition-all duration-200 text-left">
                          <div className="w-10 h-10 rounded-none bg-gray-50 flex items-center justify-center shrink-0 group-hover/item:bg-dronek-green/10 transition-colors">
                            <Images className="w-5 h-5 text-gray-400 group-hover/item:text-dronek-green transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-bold text-[13px] text-dronek-dark uppercase tracking-wider">Notre médiathèque</h4>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={cn(
                    'nav-link relative flex items-center gap-2 px-3.5 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-105',
                    isActive(link.page) ? 'text-dronek-green' : 'text-dronek-dark hover:text-dronek-green',
                  )}
                >
                  {link.label}
                  {isActive(link.page) && (
                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-dronek-green" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
                </button>
              ))}
            </div>

            {/* Language & Mobile Toggle */}
            <div className="flex items-center justify-end gap-3 lg:gap-5 pl-2 lg:pl-4">
              <div className="relative group/lang">
                <button
                  className="flex items-center gap-[9px] px-3 py-3 bg-transparent transition-all duration-300"
                >
                  <div className="w-[30px] h-[30px] rounded-none overflow-hidden">
                    <img
                      src={lang === 'fr' ? "/istockphoto-1226387448-612x612-removebg-preview.png" : "/istockphoto-542201926-612x612-removebg-preview.png"}
                      alt={lang}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <ChevronDown className="w-[21px] h-[21px] text-dronek-dark/40 transition-transform duration-300 group-hover/lang:rotate-180" />
                </button>

                <div className="absolute top-full right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-none shadow-2xl border border-gray-100 p-1.5 opacity-0 invisible group-hover/lang:opacity-100 group-hover/lang:visible transition-all duration-300 translate-y-2 group-hover/lang:translate-y-0">
                  <button
                    onClick={() => setLang('fr')}
                    className={cn(
                      "flex items-center gap-4 w-full p-3 rounded-none transition-all duration-300 text-left",
                      lang === 'fr' ? "bg-dronek-green text-white" : "text-dronek-dark hover:bg-gray-100"
                    )}
                  >
                    <img src="/istockphoto-1226387448-612x612-removebg-preview.png" className="w-[30px] h-[30px] rounded-none" />
                    <span className="text-[16px] font-bold">FRANÇAIS</span>
                  </button>
                  <button
                    onClick={() => setLang('en')}
                    className={cn(
                      "flex items-center gap-4 w-full p-3 rounded-none transition-all duration-300 text-left mt-1.5",
                      lang === 'en' ? "bg-dronek-green text-white" : "text-dronek-dark hover:bg-gray-100"
                    )}
                  >
                    <img src="/istockphoto-542201926-612x612-removebg-preview.png" className="w-[30px] h-[30px] rounded-none" />
                    <span className="text-[16px] font-bold">ENGLISH</span>
                  </button>
                </div>
              </div>

              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 transition-colors">
                {mobileOpen ? <X className="w-5 h-5 text-dronek-dark" /> : <Menu className="w-5 h-5 text-dronek-dark" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            variants={mobileMenuVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit" 
            className="fixed inset-0 z-[55] bg-white lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between px-4 h-20 border-b border-gray-100">
              <img src="/Typographie/logoV.png" alt="Dronek" className="h-10 w-auto" />
              <button onClick={() => setMobileOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100">
                <X className="w-6 h-6 text-dronek-dark" />
              </button>
            </div>

            <div className="px-6 py-8 space-y-2">
              <motion.button custom={0} variants={linkVariants} onClick={() => handleNav('home')} className="flex items-center gap-4 w-full p-4 rounded-2xl text-lg font-bold text-dronek-dark hover:bg-gray-50 transition-colors">
                <Home className="w-6 h-6 text-dronek-green" />
                {t.nav.home}
              </motion.button>

              <div className="space-y-1">
                <motion.button custom={1} variants={linkVariants} onClick={() => setMobileServicesOpen(!mobileServicesOpen)} className="flex items-center justify-between w-full p-4 rounded-2xl text-lg font-bold text-dronek-dark hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-4">
                    <BriefcaseBusiness className="w-6 h-6 text-dronek-green" />
                    {t.nav.services}
                  </span>
                  <ChevronDown className={cn('w-5 h-5 transition-transform duration-300', mobileServicesOpen && 'rotate-180')} />
                </motion.button>
                
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-14 pr-4">
                      <button onClick={() => handleNav('services')} className="w-full py-3 text-left text-base font-bold text-dronek-green border-b border-gray-100 mb-2">
                        {lang === 'fr' ? 'Voir tous les services' : 'View all services'}
                      </button>
                      {serviceLinks.map((link) => (
                        <button key={link.key} onClick={() => handleNav('services', link.section)} className="w-full py-3 text-left text-base font-medium text-dronek-dark/70 hover:text-dronek-green transition-colors">
                          {t.services[link.key].name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1">
                <motion.button custom={2} variants={linkVariants} onClick={() => setMobileBlogOpen(!mobileBlogOpen)} className="flex items-center justify-between w-full p-4 rounded-2xl text-lg font-bold text-dronek-dark hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-4">
                    <Newspaper className="w-6 h-6 text-dronek-green" />
                    ACTUALITÉS
                  </span>
                  <ChevronDown className={cn('w-5 h-5 transition-transform duration-300', mobileBlogOpen && 'rotate-180')} />
                </motion.button>

                <AnimatePresence>
                  {mobileBlogOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-14 pr-4">
                      <button onClick={() => handleNav('blog')} className="w-full py-3 text-left text-base font-medium text-dronek-dark/70 hover:text-dronek-green transition-colors">
                        Derniers postes
                      </button>
                      <button onClick={() => handleNav('blog-impact')} className="w-full py-3 text-left text-base font-medium text-dronek-dark/70 hover:text-dronek-green transition-colors">
                        Notre médiathèque
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link, index) => (
                <motion.button key={link.page} custom={index + 2} variants={linkVariants} onClick={() => handleNav(link.page)} className="flex items-center gap-4 w-full p-4 rounded-2xl text-lg font-bold text-dronek-dark hover:bg-gray-50 transition-colors">
                  <link.icon className="w-6 h-6 text-dronek-green" />
                  {link.label}
                </motion.button>
              ))}

              <motion.div custom={navLinks.length + 2} variants={linkVariants} className="pt-8">
                <Button onClick={() => handleNav('contact')} className="w-full bg-dronek-green hover:bg-dronek-dark text-white rounded-2xl py-7 text-lg font-bold shadow-lg shadow-dronek-green/20">
                  {t.hero.cta1}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
