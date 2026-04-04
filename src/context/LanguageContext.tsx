// Language Context - Manages app language state
import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import { type LanguageCode, getSavedLanguage, LANGUAGE_CONFIGS, getTranslations, type I18nStrings } from '../lib/i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  config: typeof LANGUAGE_CONFIGS[LanguageCode];
  strings: I18nStrings;
  t: I18nStrings;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageCode>(() => getSavedLanguage());

  const setLanguage = useCallback((newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    try {
      localStorage.setItem('shieldride_language', newLanguage);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const config = useMemo(() => LANGUAGE_CONFIGS[language], [language]);
  const strings = useMemo(() => getTranslations(language), [language]);

  // t is an alias for strings to support t.key syntax
  const t = strings;

  useEffect(() => {
    // Update language attributes and typography variables for each locale.
    if (typeof document !== 'undefined') {
      document.body.style.fontFamily = config.fontFamily;
      document.body.style.setProperty('--sr-font-body', config.fontFamily);
      document.body.style.setProperty('--sr-font-display', config.displayFontFamily);
      document.body.dataset.language = language;
      document.documentElement.lang = language.split('-')[0];
      document.documentElement.dir = config.direction;
    }
  }, [config, language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    config,
    strings,
    t
  }), [language, setLanguage, config, strings, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Alias for easier migration
export const useI18n = useLanguage;
