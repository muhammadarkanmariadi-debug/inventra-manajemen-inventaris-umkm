
export const statusLabels: Record<string, string> = {
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
  switch (normalizedStatus) {
    case "UNRELEASED":
      return _("Unreleased");
    case "ON_HOLD":
      return _("On Hold");
    case "REJECT":
      return _("Rejected");
    case "READY":
      return _("Ready");
    case "PENDING":
      return _("Pending");
    case "COMPLETED":
      return _("Completed");
    case "FAILED":
      return _("Failed");
    default:
      return status;
  }
};
