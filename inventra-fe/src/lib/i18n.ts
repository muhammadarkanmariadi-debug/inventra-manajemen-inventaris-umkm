import { i18n } from "@lingui/core";

export type Locale = "id" | "en";

const catalogs = {
  id: () => import("@/locales/id/messages"),
  en: () => import("@/locales/en/messages"),
};

export async function loadCatalog(locale: Locale) {
  const { messages } = await catalogs[locale]();
  i18n.load(locale, messages);
  i18n.activate(locale);
}

export { i18n };