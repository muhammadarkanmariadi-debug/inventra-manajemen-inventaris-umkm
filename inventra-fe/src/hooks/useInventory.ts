'use client';

import { useState } from 'react';
import { scanInventory, updateInventoryStatus } from '../../services/inventory.service';

export const useInventory = () => {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const scan = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await scanInventory(code);
      if (res.status) {
        setInventory(res.data);
      } else {
        setError(res.message || 'Inventory not found');
        setInventory(null);
      }
      return res;
    } catch (err: any) {
      const msg = err?.message || 'Error scanning QR';
      setError(msg);
      setInventory(null);
      return { status: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string, notes?: string, location_id?: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await updateInventoryStatus(id, status, notes, location_id);
      if (res.status) {
        // Full inventory returned from backend — replace entirely for fresh logs
        setInventory(res.data);
      } else {
        setError(res.message || 'Error updating status');
      }
      return res;
    } catch (err: any) {
      const msg = err?.message || 'Error updating status';
      setError(msg);
      return { status: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return { inventory, setInventory, loading, error, scan, updateStatus };
};
