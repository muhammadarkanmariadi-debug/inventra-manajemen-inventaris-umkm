import { axiosInstance } from '@/shared/lib/axios';
import {
  Plan,
  Addon,
  TenantSubscriptionResponse,
  Usage,
  planSchema,
  addonSchema,
  tenantSubscriptionResponseSchema,
  usageSchema,
} from '../schema/subscription.schema';
import { z } from 'zod';

export const subscriptionApi = {
  getPlans: async (): Promise<Plan[]> => {
    const { data } = await axiosInstance.get('/v1/plans');
    const rawList = data?.data ?? data;
    return z.array(planSchema).parse(rawList);
  },

  getAddons: async (): Promise<Addon[]> => {
    const { data } = await axiosInstance.get('/v1/addons');
    const rawList = data?.data ?? data;
    return z.array(addonSchema).parse(rawList);
  },

  getTenantSubscription: async (): Promise<TenantSubscriptionResponse> => {
    const { data } = await axiosInstance.get('/v1/tenant/subscription');
    const raw = data?.data ?? data;
    return tenantSubscriptionResponseSchema.parse(raw);
  },

  upgradePlan: async (payload: { plan_id: number | string; billing_cycle: 'monthly' | 'annual' }) => {
    const { data } = await axiosInstance.post('/v1/tenant/subscription/upgrade', payload);
    return data?.data ?? data;
  },

  toggleAddon: async (payload: { addon_id: number | string; action: 'activate' | 'deactivate' }) => {
    const { data } = await axiosInstance.post('/v1/tenant/subscription/addons', payload);
    return data?.data ?? data;
  },

  getUsage: async (): Promise<Usage> => {
    const { data } = await axiosInstance.get('/v1/tenant/usage');
    const raw = data?.data ?? data;
    return usageSchema.parse(raw);
  },
};
