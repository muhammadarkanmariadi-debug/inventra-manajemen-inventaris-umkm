'use client';

import { useState } from 'react';
import { processTransactions } from '../../services/inventory.service';

export const useTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transact = async (type: 'ADJUSTMENT_ADD' | 'ADJUSTMENT_SUB', items: any[], notes?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await processTransactions({ type, items, notes });
      if (!res.status) {
        setError(res.message || 'Transaction failed');
      }
      return res;
    } catch (err: any) {
      const msg = err?.message || 'Error processing transaction';
      setError(msg);
      return { status: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, transact };
};
