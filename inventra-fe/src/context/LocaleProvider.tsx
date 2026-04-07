"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { loadCatalog, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({
  locale: "id",
  setLocale: () => {},
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("id");
  const [ready, setReady] = useState(false); // ← tambah ini
  
  useEffect(() => {
    loadCatalog("id").then(() => setReady(true));
  }, []);

  const handleSetLocale = async (newLocale: Locale) => {
    await loadCatalog(newLocale);
    setLocale(newLocale);
  };

  if (!ready) return null; // atau <>{children}</> kalau mau tetap render

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      <I18nProvider i18n={i18n}>
        {children}
      </I18nProvider>
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);