
export const statusLabels: Record<string, any> = {
  UNRELEASED: "Unreleased",
  ON_HOLD: "On Hold",
  REJECT: "Rejected",
  READY: "Ready",
  PENDING: "Pending",
  COMPLETED: "Completed",
  FAILED: "Failed",
};

export const getStatusTranslation = (status: string, _: any) => {
  const normalizedStatus = status.toUpperCase();
  if (statusLabels[normalizedStatus]) {
    return _(statusLabels[normalizedStatus]);
  }
  return status;
};
