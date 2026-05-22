'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, ChevronDown, ChevronUp, X, Info, BarChart3, Target, Settings } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

type ConsentStatus = 'accepted' | 'rejected' | 'custom' | null;

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

export default function CookieConsent() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const consent = localStorage.getItem('dronek-cookie-consent') as ConsentStatus;
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    } else if (consent === 'custom') {
      const savedPrefs = localStorage.getItem('dronek-cookie-preferences');
      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          setPreferences(parsed);
        } catch {
          setPreferences(defaultPreferences);
        }
      }
    }
  }, [setPreferences]);

  const saveConsent = (status: ConsentStatus) => {
    if (status) {
      localStorage.setItem('dronek-cookie-consent', status);
    }
    if (status === 'custom') {
      localStorage.setItem('dronek-cookie-preferences', JSON.stringify(preferences));
    }
    setVisible(false);
  };

  const handleAccept = () => {
    setPreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    });
    saveConsent('accepted');
  };

  const handleReject = () => {
    setPreferences(defaultPreferences);
    saveConsent('rejected');
  };

  const handleSavePreferences = () => {
    saveConsent('custom');
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Always enabled
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieCategories = [
    {
      key: 'necessary' as keyof CookiePreferences,
      icon: Shield,
      title: t.cookie.prefNecessary || 'Cookies indispensables',
      desc: t.cookie.prefNecessaryDesc || 'Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés. Ils permettent notamment la navigation entre les pages et l\'accès aux fonctionnalités sécurisées.',
    },
    {
      key: 'analytics' as keyof CookiePreferences,
      icon: BarChart3,
      title: t.cookie.prefAnalytics || 'Cookies analytiques',
      desc: t.cookie.prefAnalyticsDesc || 'Ces cookies nous permettent de collecter des données anonymisées sur la façon dont les visiteurs utilisent le site. Ils nous aident à comprendre le trafic et à améliorer nos services.',
    },
    {
      key: 'personalization' as keyof CookiePreferences,
      icon: Target,
      title: t.cookie.prefPersonalization || 'Cookies de personnalisation',
      desc: t.cookie.prefPersonalizationDesc || 'Ces cookies permettent au site de mémoriser vos choix linguistiques et vos préférences pour offrir une expérience personnalisée lors de vos prochaines visites.',
    },
    {
      key: 'marketing' as keyof CookiePreferences,
      icon: Info,
      title: t.cookie.prefMarketing || 'Cookies marketing',
      desc: t.cookie.prefMarketingDesc || 'Ces cookies sont utilisés pour suivre les visiteurs sur notre site afin d\'afficher des publicités pertinentes et de mesurer l\'efficacité de nos campagnes promotionnelles.',
    },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleReject}
          />

          {/* Banner */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={handleReject}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
              aria-label={t.cookie.close || 'Fermer'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with icon */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-start gap-4">
                {/* Cookie Icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shrink-0 border border-amber-200/50">
                  <Cookie className="w-6 h-6 text-amber-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {t.cookie.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs text-green-700 font-medium">
                      {t.cookie.secure || 'Vos données sont protégées'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body text */}
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                {t.cookie.desc}
              </p>

              {/* Learn more / toggle preferences */}
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-dronek-green hover:text-dronek-dark transition-colors group"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{t.cookie.learnMore || 'Gérer les préférences'}</span>
                {showPreferences ? (
                  <ChevronUp className="w-4 h-4 transition-transform" />
                ) : (
                  <ChevronDown className="w-4 h-4 transition-transform" />
                )}
              </button>
            </div>

            {/* Preferences Panel */}
            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4 space-y-3">
                      {cookieCategories.map((category) => {
                        const IconComp = category.icon;
                        const isNecessary = category.key === 'necessary';
                        const isEnabled = preferences[category.key];

                        return (
                          <div
                            key={category.key}
                            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100"
                          >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isNecessary ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                            }`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-semibold text-gray-800">
                                  {category.title}
                                  {isNecessary && (
                                    <span className="ml-1.5 text-[10px] font-medium text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                                      {t.cookie.alwaysOn || 'Toujours actif'}
                                    </span>
                                  )}
                                </span>
                                {/* Toggle switch */}
                                <button
                                  onClick={() => togglePreference(category.key)}
                                  disabled={isNecessary}
                                  className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${
                                    isEnabled
                                      ? 'bg-dronek-green'
                                      : 'bg-gray-300'
                                  } ${isNecessary ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}
                                  role="switch"
                                  aria-checked={isEnabled}
                                >
                                  <motion.div
                                    layout
                                    className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-all ${
                                      isEnabled ? 'left-[22px]' : 'left-0.5'
                                    }`}
                                  />
                                </button>
                              </div>
                              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                                {category.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="px-6 pb-6 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Refuser */}
                <button
                  onClick={handleReject}
                  className="flex-1 order-2 sm:order-1 px-5 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all"
                >
                  {t.cookie.reject}
                </button>

                {/* Accepter */}
                <button
                  onClick={handleAccept}
                  className="flex-1 order-1 sm:order-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-dronek-green hover:bg-dronek-dark active:scale-[0.98] transition-all shadow-lg shadow-dronek-green/20"
                >
                  {t.cookie.accept}
                </button>

                {/* Save Preferences (only visible when preferences shown) */}
                <AnimatePresence>
                  {showPreferences && (
                    <motion.button
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 'auto', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      onClick={handleSavePreferences}
                      className="hidden sm:flex items-center justify-center px-5 py-3 rounded-xl text-sm font-semibold text-dronek-green border-2 border-dronek-green hover:bg-dronek-green/5 active:scale-[0.98] transition-all overflow-hidden whitespace-nowrap"
                    >
                      {t.cookie.savePreferences || 'Enregistrer'}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Small text */}
              <p className="mt-3 text-[11px] text-gray-400 text-center leading-relaxed">
                {t.cookie.policyNote || 'En cliquant sur « Accepter », vous consentez à l\'utilisation de tous les cookies. Vous pouvez modifier vos préférences à tout moment depuis les paramètres de votre navigateur.'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
