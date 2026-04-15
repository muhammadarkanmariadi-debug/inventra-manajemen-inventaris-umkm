import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';

export const useTranslate = () => {
  const { _ } = useLingui();

  const t = (message: any, values?: Record<string, any>) => {
    return _(message, values);
  };

  return { t, _ };
};
