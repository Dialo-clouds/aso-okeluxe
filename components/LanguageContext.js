'use client';

import { createContext, useContext, useState } from 'react';
import { i18n } from '../lib/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    const dict = i18n[lang] || i18n.en;
    return dict[key] !== undefined ? dict[key] : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used inside a <LanguageProvider>');
  }
  return ctx;
}
