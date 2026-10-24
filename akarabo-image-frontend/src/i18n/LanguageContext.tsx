import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { translate, type Locale, type TranslationKey } from './translations';

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = 'akarabo-locale';

function storedLocale(): Locale {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'rw' || saved === 'fr' ? saved : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>(storedLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale: (next) => {
      window.localStorage.setItem(STORAGE_KEY, next);
      updateLocale(next);
    },
    t: (key) => translate(locale, key),
  }), [locale]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used within LanguageProvider');
  return value;
}
