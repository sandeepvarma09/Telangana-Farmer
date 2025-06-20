
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { DEFAULT_LANGUAGE } from '../constants';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, ...args: (string | number)[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE as Language);

  const setLanguage = useCallback((language: Language) => {
    setCurrentLanguage(language);
    document.documentElement.lang = language; 
  }, []);

  const t = useCallback((key: string, ...args: (string | number)[]): string => {
    let translation = translations[currentLanguage]?.[key] || translations[Language.English]?.[key] || key;
    if (args.length > 0) {
      args.forEach((arg, index) => {
        translation = translation.replace(`{${index}}`, String(arg));
      });
    }
    return translation;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
