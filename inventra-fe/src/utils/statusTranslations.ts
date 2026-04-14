import { msg } from '@lingui/core/macro';

export const statusLabels: Record<string, any> = {
  UNRELEASED: msg`Unreleased`,
  ON_HOLD: msg`On Hold`,
  REJECT: msg`Rejected`,
  READY: msg`Ready`,
  PENDING: msg`Pending`,
  COMPLETED: msg`Completed`,
  FAILED: msg`Failed`,
};

export const getStatusTranslation = (status: string, _: any) => {
  const normalizedStatus = status.toUpperCase();
  if (statusLabels[normalizedStatus]) {
    return _(statusLabels[normalizedStatus]);
  }
  return status;
};
