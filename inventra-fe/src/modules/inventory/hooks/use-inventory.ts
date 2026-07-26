import { createResourceHooks } from '@/shared/lib/query-factory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/lib/axios';
import {
  productSchema,
  categorySchema,
  locationSchema,
  inventoryLogSchema,
  stockAdjustmentSchema,
  StockAdjustment,
} from '../schema/inventory.schema';

export const productQuery = createResourceHooks({
  resource: 'products',
  schema: productSchema,
  baseUrl: '/products',
});

export const categoryQuery = createResourceHooks({
  resource: 'categories',
  schema: categorySchema,
  baseUrl: '/categories',
});

export const locationQuery = createResourceHooks({
  resource: 'locations',
  schema: locationSchema,
  baseUrl: '/locations',
});

export const inventoryLogQuery = createResourceHooks({
  resource: 'inventory-logs',
  schema: inventoryLogSchema,
  baseUrl: '/inventory/logs',
});

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: StockAdjustment) => {
      const validated = stockAdjustmentSchema.parse(payload);
      const { data } = await axiosInstance.post('/inventory/adjust', validated);
      return data?.data ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productQuery.keys.all });
      qc.invalidateQueries({ queryKey: inventoryLogQuery.keys.all });
    },
  });
}
