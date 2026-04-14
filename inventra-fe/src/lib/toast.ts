import { toast } from 'sonner';

/**
 * Centralized utility for firing consistent toast notifications across the app.
 * By pulling this out of React components, we can trigger toasts from standard TS/JS files
 * (like Axios interceptors) without requiring Hooks syntax.
 */

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 4000,
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000,
  });
};

export const showWarning = (message: string) => {
  toast.warning(message, {
    duration: 5000,
  });
};

export const showInfo = (message: string) => {
  toast.info(message, {
    duration: 4000,
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};
