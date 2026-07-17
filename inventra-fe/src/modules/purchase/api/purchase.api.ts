import { axiosInstance } from '@/shared/lib/axios';
import { CreatePurchasePayload, createPurchasePayloadSchema, Supplier, supplierSchema } from '../schema/purchase.schema';

export const purchaseApi = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await axiosInstance.get('/purchases', { params });
    return data;
  },
  getById: async (id: number | string) => {
    const { data } = await axiosInstance.get(`/purchases/${id}`);
    return data;
  },
  create: async (payload: CreatePurchasePayload) => {
    const validated = createPurchasePayloadSchema.parse(payload);
    const { data } = await axiosInstance.post('/purchases', validated);
    return data;
  },
};

export const supplierApi = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await axiosInstance.get('/suppliers', { params });
    return data;
  },
  getById: async (id: number | string) => {
    const { data } = await axiosInstance.get(`/suppliers/${id}`);
    return data;
  },
  create: async (payload: Supplier) => {
    const validated = supplierSchema.parse(payload);
    const { data } = await axiosInstance.post('/suppliers', validated);
    return data;
  },
  update: async (id: number | string, payload: Partial<Supplier>) => {
    const { data } = await axiosInstance.put(`/suppliers/${id}`, payload);
    return data;
  },
  delete: async (id: number | string) => {
    const { data } = await axiosInstance.delete(`/suppliers/${id}`);
    return data;
  },
};
