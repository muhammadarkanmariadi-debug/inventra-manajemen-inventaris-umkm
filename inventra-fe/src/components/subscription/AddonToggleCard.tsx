'use client';

import React from 'react';
import { Sparkles, Webhook, CheckCircle2, Loader2 } from 'lucide-react';
import { useAddons, useToggleAddon } from '@/modules/subscription/hooks/use-subscription';
import { ActiveAddonSubscription } from '@/modules/subscription/schema/subscription.schema';
import { toast } from 'sonner';
import { Trans } from "@lingui/macro";

interface AddonToggleCardProps {
  activeAddons: ActiveAddonSubscription[];
}

export const AddonToggleCard: React.FC<AddonToggleCardProps> = ({ activeAddons }) => {
  const { data: addons, isLoading } = useAddons();
  const toggleMutation = useToggleAddon();

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const isAddonActive = (addonId: number | string) => {
    return activeAddons.some((a) => String(a.addon_id) === String(addonId) && a.status === 'active');
  };

  const handleToggle = (addonId: number | string, currentStatus: boolean, addonName: string) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    toggleMutation.mutate(
      { addon_id: addonId, action },
      {
        onSuccess: (data: any) => {
          toast.success(
            data?.message ||
              `Add-on ${addonName} berhasil ${currentStatus ? 'dinonaktifkan' : 'diaktifkan'}.`
          );
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.message || 'Gagal mengubah status add-on.';
          toast.error(msg);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {/* @ts-ignore */}<Trans>Add-on & Fitur Modular</Trans></h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {/* @ts-ignore */}<Trans>Aktifkan fitur tambahan secara instan tanpa perlu beralih dari paket yang Anda gunakan
                            saat ini.</Trans></p>
      </div>

      <div className="space-y-4">
        {addons?.map((addon) => {
          const active = isAddonActive(addon.id);
          const isAi = addon.slug === 'ai_forecasting';
          const Icon = isAi ? Sparkles : Webhook;
          const iconBg = isAi
            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            : 'bg-blue-500/10 text-blue-500 border-blue-500/20';

          return (
            <div
              key={addon.id}
              className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                active
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/60'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl border ${iconBg} shrink-0 mt-0.5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">{addon.name}</h4>
                    {active && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3" /> {/* @ts-ignore */}<Trans>Aktif</Trans></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    {addon.description}
                  </p>
                  <div className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {formatIDR(addon.price_monthly)} {/* @ts-ignore */}<Trans>/ bulan (Flat di semua gudang)</Trans></div>
                </div>
              </div>

              <div className="flex items-center sm:self-center justify-end">
                <button
                  type="button"
                  disabled={toggleMutation.isPending}
                  onClick={() => handleToggle(addon.id, active, addon.name)}
                  className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    active ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                  role="switch"
                  aria-checked={active}
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                      active ? 'translate-x-7' : 'translate-x-0'
                    }`}
                  >
                    {toggleMutation.isPending && <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
