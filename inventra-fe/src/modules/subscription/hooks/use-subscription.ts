import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '../api/subscription.api';

export const subscriptionKeys = {
  all: ['subscription'] as const,
  plans: () => ['subscription', 'plans'] as const,
  addons: () => ['subscription', 'addons'] as const,
  tenant: () => ['subscription', 'tenant'] as const,
  usage: () => ['subscription', 'usage'] as const,
};

export function usePlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: subscriptionApi.getPlans,
  });
}

export function useAddons() {
  return useQuery({
    queryKey: subscriptionKeys.addons(),
    queryFn: subscriptionApi.getAddons,
  });
}

export function useTenantSubscription() {
  return useQuery({
    queryKey: subscriptionKeys.tenant(),
    queryFn: subscriptionApi.getTenantSubscription,
  });
}

export function useTenantUsage() {
  return useQuery({
    queryKey: subscriptionKeys.usage(),
    queryFn: subscriptionApi.getUsage,
  });
}

export function useUpgradePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.upgradePlan,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.tenant() });
      qc.invalidateQueries({ queryKey: subscriptionKeys.usage() });
    },
  });
}

export function useToggleAddon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionApi.toggleAddon,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.tenant() });
      qc.invalidateQueries({ queryKey: subscriptionKeys.usage() });
    },
  });
}
