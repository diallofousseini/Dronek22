'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Header, { type PageView } from '@/components/dronek/Header';
import Footer from '@/components/dronek/Footer';
import HomePage from '@/components/dronek/HomePage';
import ProjectsPage from '@/components/dronek/ProjectsPage';
import ActualitePage from '@/components/dronek/ActualitePage';
import ProductionSitesPage from '@/components/dronek/ProductionSitesPage';
import ContactPage from '@/components/dronek/ContactPage';
import CookieConsent from '@/components/dronek/CookieConsent';
import ImpactPage from '@/components/dronek/ImpactPage';
import AllServicesPage from '@/components/dronek/AllServicesPage';
import WelcomePage from '@/components/dronek/WelcomePage';
import DsmPage from '@/components/dronek/DsmPage';

const pageTransition = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
};

interface AppContentProps {
  initialPage: PageView;
}
function AppContent({ initialPage }: AppContentProps) {
  const [currentPage, setCurrentPage] = useState<PageView>(initialPage);
  const [loading, setLoading] = useState(false);
  const [triggerNewsMenu, setTriggerNewsMenu] = useState(false);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  useEffect(() => {
    // No persistence: always load initialPage (home) on refresh
  }, []);

  const handleNavigate = useCallback((page: PageView) => {
    if (page !== currentPage) {
      // Save for persistence
      localStorage.setItem('dronek_current_page', page);
      
      setLoading(true);
      // Small delay for loading state
      setTimeout(() => {
        setCurrentPage(page);
        setLoading(false);
      }, 150);
    }
  }, [currentPage]);

  const handleOpenNewsMenu = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Small delay to allow scroll to start before triggering menu
    setTimeout(() => {
      setTriggerNewsMenu(true);
      // Reset trigger after a short delay so it can be triggered again
      setTimeout(() => setTriggerNewsMenu(false), 500);
    }, 100);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'services':
        return <AllServicesPage onNavigate={handleNavigate} />;
      case 'projects':
        return <ProjectsPage onNavigate={handleNavigate} />;
      case 'blog':
        return <ActualitePage onNavigate={handleNavigate} />;
      case 'blog-impact':
        return <ImpactPage />;
      case 'production':
        return <ProductionSitesPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'dsm':
        return <DsmPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        triggerNewsMenu={triggerNewsMenu}
      />
      <AnimatePresence mode="wait">
        {loading ? (
          <div key="loader" className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
              <span className="logo">
                <img src="/Typographie/logoV.png" alt="Dronek - Foresterie Agriculture Technologie" className="logo-dronek logo-dronek-header" />
              </span>
              <div className="w-8 h-8 border-2 border-dronek-green/30 border-t-dronek-green rounded-full animate-spin" />
              <span className="text-dronek-light-text text-sm">Chargement...</span>
            </div>
          </div>
        ) : (
          <main key={currentPage}>{renderPage()}</main>
        )}
      </AnimatePresence>
      <Footer onNavigate={handleNavigate} onOpenNewsMenu={handleOpenNewsMenu} />
      <ScrollToTop />
      <CookieConsent />
    </div>
  );
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[150] w-10 h-10 bg-dronek-green text-white rounded-[4px] flex items-center justify-center shadow-[0_-4px_12px_rgba(20,150,85,0.2),0_4px_12px_rgba(0,0,0,0.1)] hover:brightness-95 transition-all duration-300 active:scale-90"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

interface DronekAppProps {
  initialPage?: PageView;
}

export function DronekApp({ initialPage = 'home' }: DronekAppProps) {
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user already saw the welcome page in this session
    const hasSeenWelcome = sessionStorage.getItem('dronek_welcome_seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem('dronek_welcome_seen', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomePage onEnter={handleEnter} />;
  }

  return (
    <AppContent initialPage={initialPage} />
  );
}

export default function Page() {
  return <DronekApp initialPage="home" />;
}
