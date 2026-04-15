import { useState } from 'react';
import { showError } from '@/lib/toast';

/**
 * useApi simplifies standard API requests by automatically 
 * toggling loading states and dispensing consistent Toast errors.
 */
export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);

  const execute = async (apiCall: () => Promise<any>): Promise<T | null> => {
    setLoading(true);
    try {
      const res = await apiCall();
      // Handle standard nested backend response paradigms if applicable
      if (res && res.status === false) {
        showError(res.message || 'API request failed without specific details.');
        return null;
      }
      return res;
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || err?.message || 'An unexpected error occurred.';
      showError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, execute };
}
