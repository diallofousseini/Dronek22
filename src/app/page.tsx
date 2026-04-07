'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from '@/components/dronek/LanguageProvider';
import Navbar, { type PageView } from '@/components/dronek/Navbar';
import Footer from '@/components/dronek/Footer';
import HomePage from '@/components/dronek/HomePage';
import ServicesPage from '@/components/dronek/ServicesPage';
import ProjectsPage from '@/components/dronek/ProjectsPage';
import BlogPage from '@/components/dronek/BlogPage';
import FormationPage from '@/components/dronek/FormationPage';
import TeamPage from '@/components/dronek/TeamPage';
import ProductionSitesPage from '@/components/dronek/ProductionSitesPage';
import ContactPage from '@/components/dronek/ContactPage';
import CookieConsent from '@/components/dronek/CookieConsent';
import ChatBot from '@/components/dronek/ChatBot';

const pageTransition = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0, y: -10, scale: 0.99,
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  },
};

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [loading, setLoading] = useState(false);

  const handleNavigate = useCallback((page: PageView) => {
    if (page !== currentPage) {
      setLoading(true);
      // Small delay for loading state
      setTimeout(() => {
        setCurrentPage(page);
        setLoading(false);
      }, 150);
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'services-forestry':
        return <ServicesPage service="forestry" onNavigate={handleNavigate} />;
      case 'services-drone':
        return <ServicesPage service="drone" onNavigate={handleNavigate} />;
      case 'services-agroforestry':
        return <ServicesPage service="agroforestry" onNavigate={handleNavigate} />;
      case 'services-agriculture':
        return <ServicesPage service="agriculture" onNavigate={handleNavigate} />;
      case 'projects':
        return <ProjectsPage onNavigate={handleNavigate} />;
      case 'blog':
      case 'blog-article':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'training':
        return <FormationPage onNavigate={handleNavigate} />;
      case 'team':
        return <TeamPage />;
      case 'production':
        return <ProductionSitesPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
        >
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-dronek-green/30 border-t-dronek-green rounded-full animate-spin" />
                <span className="text-dronek-light-text text-sm">Chargement...</span>
              </div>
            </div>
          ) : (
            <main>{renderPage()}</main>
          )}
        </motion.div>
      </AnimatePresence>
      <Footer onNavigate={handleNavigate} />
      <CookieConsent />
      <ChatBot />
    </div>
  );
}

export default function Page() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
