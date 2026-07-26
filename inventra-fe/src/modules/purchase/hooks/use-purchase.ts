import { createResourceHooks } from '@/shared/lib/query-factory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/lib/axios';
import {
  supplierSchema,
  purchaseSchema,
  createPurchasePayloadSchema,
  CreatePurchasePayload,
} from '../schema/purchase.schema';
import { productQuery, inventoryLogQuery } from '@/modules/inventory/hooks/use-inventory';

export const supplierQuery = createResourceHooks({
  resource: 'suppliers',
  schema: supplierSchema,
  baseUrl: '/suppliers',
});

export const purchaseQuery = createResourceHooks({
  resource: 'purchases',
  schema: purchaseSchema,
  baseUrl: '/purchases',
});

export function useCreatePurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePurchasePayload) => {
      const validated = createPurchasePayloadSchema.parse(payload);
      const { data } = await axiosInstance.post('/purchases', validated);
      return data?.data ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: purchaseQuery.keys.all });
      qc.invalidateQueries({ queryKey: productQuery.keys.all });
      qc.invalidateQueries({ queryKey: inventoryLogQuery.keys.all });
    },
  });
}
