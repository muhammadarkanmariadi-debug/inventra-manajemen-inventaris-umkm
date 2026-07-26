import { useLingui } from "@lingui/react";

export const useTranslate = () => {
  const { i18n } = useLingui();

  const t = (message: any, values?: Record<string, any>) => {
    return i18n._(message, values);
  };

  return { t, _: i18n._.bind(i18n) };
};
