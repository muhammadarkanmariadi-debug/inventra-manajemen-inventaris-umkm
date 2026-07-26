"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { loadCatalog, type Locale } from "@/lib/i18n";
import { setCookie, getCookie } from "cookies-next";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({
  locale: "id",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("id");
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    const cookieLocale = getCookie("APP_LOCALE") as Locale;
    const storageLocale = localStorage.getItem("APP_LOCALE") as Locale;
    const initialLocale = (cookieLocale || storageLocale || "id") as Locale;

    loadCatalog(initialLocale).then(() => {
      setLocale(initialLocale);
      setReady(true);
    });
  }, []);

  const handleSetLocale = async (newLocale: Locale) => {
    await loadCatalog(newLocale);
    setLocale(newLocale);
    localStorage.setItem("APP_LOCALE", newLocale);
    setCookie("APP_LOCALE", newLocale, { maxAge: 60 * 60 * 24 * 365, path: "/" });
  };

  if (!ready) return null;

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <I18nProvider i18n={i18n}>
        {children}
      </I18nProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);