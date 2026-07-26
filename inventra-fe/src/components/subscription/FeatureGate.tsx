"use client";

import React from 'react';
import { Lock, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTenantSubscription } from '@/modules/subscription/hooks/use-subscription';
import { Trans } from "@lingui/macro";

interface FeatureGateProps {
  children: React.ReactNode;
  featureKey?: string;
  planRequired?: 'Professional' | 'Enterprise';
  addonSlug?: 'ai_forecasting' | 'erp_integration';
  title?: string;
  description?: string;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  children,
  featureKey,
  planRequired = 'Professional',
  addonSlug,
  title,
  description,
}) => {
  const router = useRouter();
  const { data, isLoading } = useTenantSubscription();

  if (isLoading) {
    return <>{children}</>;
  }

  const planName = data?.subscription?.plan?.name || data?.usage?.plan_name || 'Starter';
  const planSlug = data?.subscription?.plan?.slug || planName.toLowerCase();
  const activeAddons = data?.active_addons || [];

  // Enterprise overrides everything
  if (planSlug === 'enterprise') {
    return <>{children}</>;
  }

  let hasAccess = true;

  // Check plan hierarchy or featureKey
  if (featureKey) {
    const feat = data?.subscription?.plan?.features?.find((f) => f.feature_key === featureKey);
    if (feat !== undefined) {
      hasAccess = feat.enabled;
    } else if (planRequired === 'Professional' && planSlug !== 'professional' && planSlug !== 'enterprise') {
      hasAccess = false;
    } else if (planRequired === 'Enterprise' && planSlug !== 'enterprise') {
      hasAccess = false;
    }
  } else if (planRequired) {
    if (planRequired === 'Professional' && planSlug === 'starter') {
      hasAccess = false;
    } else if (planRequired === 'Enterprise' && planSlug !== 'enterprise') {
      hasAccess = false;
    }
  }

  // Check addon if needed (and not already enterprise)
  if (addonSlug && !hasAccess) {
    const hasAddon = activeAddons.some(
      (a) => (a.addon?.slug === addonSlug || String(a.addon_id) === addonSlug) && a.status === 'active'
    );
    if (hasAddon) {
      hasAccess = true;
    }
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  const lockTitle =
    title ||
    `Fitur Terkunci: Membutuhkan Paket ${planRequired || (addonSlug ? 'Add-on Tambahan' : 'Professional')}`;
  const lockDesc =
    description ||
    `Tingkatkan efisiensi dan kontrol operasional Anda dengan mengupgrade ke paket ${
      planRequired || 'yang lebih tinggi'
    } atau mengaktifkan add-on khusus.`;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/40 p-6 sm:p-10 text-center transition-all">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 mb-5 shadow-lg shadow-purple-500/5">
          <Lock className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider mb-3 border border-purple-300/50 dark:border-purple-700/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{/* @ts-ignore */}<Trans>Restricted Tier Feature</Trans></span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
          {lockTitle}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          {lockDesc}
        </p>

        <button
          type="button"
          onClick={() => router.push('/dashboard/settings/billing')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all active:scale-95"
        >
          <span>{/* @ts-ignore */}<Trans>Upgrade Sekarang</Trans></span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
