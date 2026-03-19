'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language } from '@/lib/translations';

type TranslationKeys = keyof typeof translations['en'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_FLAGS: Record<Language, string> = {
  en: '🇬🇧',
  ar: '🇲🇦',
  fr: '🇫🇷',
};

export { LANGUAGE_FLAGS };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ilywear-lang') as Language;
    if (saved && (saved === 'en' || saved === 'ar' || saved === 'fr')) {
      setLangState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLangState(lang);
    localStorage.setItem('ilywear-lang', lang);
    // Handle RTL
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
    }
  }, []);

  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = useCallback((key: TranslationKeys): string => {
    const section = translations[language];
    return (section as any)[key] || translations['en'][key] || key;
  }, [language]);

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div className={`${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
