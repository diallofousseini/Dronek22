'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Calculate 50% of the page height
      const halfHeight = document.documentElement.scrollHeight / 2;
      
      // Show button when scrolled past the middle of the page
      if (window.scrollY > halfHeight) {
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
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] w-6 h-6 bg-dronek-green hover:bg-dronek-dark text-white rounded-full shadow-2xl flex items-center justify-center transition-colors group"
          aria-label="Back to top"
        >
          <ChevronUp className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
          
          {/* Centered subtle ring animation - slightly offset upwards */}
          <span className="absolute inset-0 -top-[0.5px] rounded-full border-[0.5px] border-dronek-green/40 animate-ping pointer-events-none" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
