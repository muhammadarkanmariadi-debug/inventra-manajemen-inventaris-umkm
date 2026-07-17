import { axiosInstance } from '@/shared/lib/axios';
import { CreateSalePayload, createSalePayloadSchema } from '../schema/sales.schema';

export const salesApi = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await axiosInstance.get('/sales', { params });
    return data;
  },
  getById: async (id: number | string) => {
    const { data } = await axiosInstance.get(`/sales/${id}`);
    return data;
  },
  create: async (payload: CreateSalePayload) => {
    const validated = createSalePayloadSchema.parse(payload);
    const { data } = await axiosInstance.post('/sales', validated);
    return data;
  },
  delete: async (id: number | string) => {
    const { data } = await axiosInstance.delete(`/sales/${id}`);
    return data;
  },
};
