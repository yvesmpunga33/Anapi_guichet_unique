"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import { messages, languages, defaultLocale } from "@/locales";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState(defaultLocale);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Charger la langue depuis localStorage
    const savedLocale = localStorage.getItem("anapi-locale");
    if (savedLocale && messages[savedLocale]) {
      setLocale(savedLocale);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Mettre à jour la direction du document pour les langues RTL
    const language = languages.find((l) => l.code === locale);
    if (language) {
      document.documentElement.dir = language.dir;
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const changeLanguage = (newLocale) => {
    if (messages[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem("anapi-locale", newLocale);
    }
  };

  const currentLanguage = languages.find((l) => l.code === locale) || languages[0];

  // Éviter le flash de contenu avant le chargement de la langue
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        changeLanguage,
        languages,
        currentLanguage,
      }}
    >
      <IntlProvider
        locale={locale}
        messages={messages[locale]}
        defaultLocale={defaultLocale}
        onError={(err) => {
          // Ignorer les erreurs de traductions manquantes en développement
          if (process.env.NODE_ENV === "development") {
            console.warn("IntlProvider error:", err.message);
          }
        }}
      >
        {children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
