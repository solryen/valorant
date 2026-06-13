import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'el' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  toggleLanguage: () => {},
  setLanguage: () => {},
});

const LANGUAGE_STORAGE_KEY = 'todayler_language';

function readStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored === 'el' || stored === 'en' ? stored : null;
}

async function detectLanguageFromCountry(): Promise<Language> {
  try {
    const response = await fetch('https://api.country.is/', {
      cache: 'no-store',
    });

    if (!response.ok) {
      return 'en';
    }

    const data = (await response.json()) as { country?: string };
    return data.country === 'GR' ? 'el' : 'en';
  } catch {
    return 'en';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [ready, setReady] = useState(false);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'el' : 'en');
  };

  useEffect(() => {
    let mounted = true;

    const bootstrapLanguage = async () => {
      const storedLanguage = readStoredLanguage();
      if (storedLanguage) {
        if (mounted) {
          setLanguageState(storedLanguage);
          setReady(true);
        }
        return;
      }

      const detectedLanguage = await detectLanguageFromCountry();
      if (!mounted) return;

      setLanguageState(detectedLanguage);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLanguage);
      setReady(true);
    };

    void bootstrapLanguage();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
