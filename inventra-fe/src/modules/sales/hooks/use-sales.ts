import { createResourceHooks } from '@/shared/lib/query-factory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/shared/lib/axios';
import { saleSchema, createSalePayloadSchema, CreateSalePayload } from '../schema/sales.schema';
import { productQuery, inventoryLogQuery } from '@/modules/inventory/hooks/use-inventory';

export const saleQuery = createResourceHooks({
  resource: 'sales',
  schema: saleSchema,
  baseUrl: '/sales',
});

export function useCreateSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateSalePayload) => {
      const validated = createSalePayloadSchema.parse(payload);
      const { data } = await axiosInstance.post('/sales', validated);
      return data?.data ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: saleQuery.keys.all });
      qc.invalidateQueries({ queryKey: productQuery.keys.all });
      qc.invalidateQueries({ queryKey: inventoryLogQuery.keys.all });
    },
  });
}

export function useDeleteSale() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      const { data } = await axiosInstance.delete(`/sales/${id}`);
      return data?.data ?? data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: saleQuery.keys.all });
      qc.invalidateQueries({ queryKey: productQuery.keys.all });
      qc.invalidateQueries({ queryKey: inventoryLogQuery.keys.all });
    },
  });
}
