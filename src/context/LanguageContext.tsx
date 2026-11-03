'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '@/lib/i18n';

export interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: Translations;
}

const defaultContextValue: LanguageContextType = {
  lang: 'vi',
  setLang: () => {},
  toggleLang: () => {},
  t: translations.vi,
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('vi');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kids_shorts_lang') as Language;
      if (saved === 'en' || saved === 'vi') {
        setLangState(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('kids_shorts_lang', newLang);
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleLang = () => {
    setLang(lang === 'vi' ? 'en' : 'vi');
  };

  const t = translations[lang] || translations.vi;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  return context || defaultContextValue;
}
