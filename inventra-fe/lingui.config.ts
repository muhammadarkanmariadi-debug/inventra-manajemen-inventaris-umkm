import { defineConfig } from "@lingui/cli";

export default defineConfig({
  sourceLocale: "id",
  locales: ["id", "en"],
  fallbackLocales: {
    default: "id"
  },
  catalogs: [
    {
      path: "<rootDir>/src/locales/{locale}/messages",
      include: ["src"]
    }
  ],
  format: "po"
});