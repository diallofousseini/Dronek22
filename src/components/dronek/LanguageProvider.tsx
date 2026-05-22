'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { translations, type Language, type Translations } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr');

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
  }, []);

  const t = translations[lang] as unknown as Translations;

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
