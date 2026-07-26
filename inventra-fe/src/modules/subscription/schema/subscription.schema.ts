import { z } from 'zod';

export const planFeatureSchema = z.object({
  id: z.number().or(z.string()),
  plan_id: z.number().or(z.string()),
  feature_key: z.string(),
  enabled: z.boolean(),
});

export const planSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string(),
  slug: z.string(),
  price_base_monthly: z.number(),
  price_base_annual: z.number(),
  max_warehouses: z.number(),
  is_custom_quote: z.boolean(),
  description: z.string().nullable().optional(),
  features: z.array(planFeatureSchema).optional(),
});

export type Plan = z.infer<typeof planSchema>;
export type PlanFeature = z.infer<typeof planFeatureSchema>;

export const addonSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string(),
  slug: z.string(),
  pricing_model: z.string(),
  price_monthly: z.number(),
  price_annual: z.number(),
  description: z.string().nullable().optional(),
});

export type Addon = z.infer<typeof addonSchema>;

export const tenantSubscriptionSchema = z.object({
  id: z.number().or(z.string()),
  bussiness_id: z.number().or(z.string()),
  plan_id: z.number().or(z.string()),
  billing_cycle: z.string(),
  status: z.string(),
  current_period_start: z.string().nullable().optional(),
  current_period_end: z.string().nullable().optional(),
  warehouse_count_snapshot: z.number(),
  plan: planSchema.optional(),
});

export type TenantSubscription = z.infer<typeof tenantSubscriptionSchema>;

export const activeAddonSubscriptionSchema = z.object({
  id: z.number().or(z.string()),
  bussiness_id: z.number().or(z.string()),
  addon_id: z.number().or(z.string()),
  status: z.string(),
  activated_at: z.string().nullable().optional(),
  addon: addonSchema.optional(),
});

export type ActiveAddonSubscription = z.infer<typeof activeAddonSubscriptionSchema>;

export const usageSchema = z.object({
  warehouse_count: z.number(),
  max_warehouses: z.number(),
  sku_count: z.number(),
  plan_name: z.string().optional(),
  status: z.string().optional(),
});

export type Usage = z.infer<typeof usageSchema>;

export const tenantSubscriptionResponseSchema = z.object({
  subscription: tenantSubscriptionSchema.nullable(),
  active_addons: z.array(activeAddonSubscriptionSchema),
  usage: usageSchema,
});

export type TenantSubscriptionResponse = z.infer<typeof tenantSubscriptionResponseSchema>;
