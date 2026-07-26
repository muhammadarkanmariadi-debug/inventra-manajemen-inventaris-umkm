"use client";

import React from 'react';
import { Building2, LayersIcon, ShieldCheck, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TenantSubscriptionResponse } from '@/modules/subscription/schema/subscription.schema';
import { Trans } from "@lingui/macro";

interface UsageBarCardProps {
  data: TenantSubscriptionResponse;
  isLoading?: boolean;
}

export const UsageBarCard: React.FC<UsageBarCardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
          <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const subscription = data.subscription;
  const usage = data.usage;
  const planName = usage?.plan_name || subscription?.plan?.name || 'Starter';
  const maxWarehouses = usage?.max_warehouses || subscription?.plan?.max_warehouses || 1;
  const usedWarehouses = usage?.warehouse_count || 0;
  const skuCount = usage?.sku_count || 0;

  const percentage = Math.min(Math.round((usedWarehouses / maxWarehouses) * 100), 100);
  const isAtLimit = usedWarehouses >= maxWarehouses;
  const isNearLimit = percentage >= 80 && !isAtLimit;

  let progressColor = 'bg-emerald-500';
  if (isAtLimit) progressColor = 'bg-rose-500';
  else if (isNearLimit) progressColor = 'bg-amber-500';

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Tidak ada tenggat';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {/* @ts-ignore */}<Trans>Paket Langganan Saat Ini</Trans></span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> {/* @ts-ignore */}<Trans>Aktif</Trans></span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            {planName}
            {planName.toLowerCase() === 'enterprise' && <ShieldCheck className="w-6 h-6 text-purple-500" />}
          </h2>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-blue-500 shrink-0" />
          <div className="text-sm">
            <div className="text-slate-500 dark:text-slate-400 text-xs">{/* @ts-ignore */}<Trans>Periode Akhir / Perpanjangan</Trans></div>
            <div className="font-semibold text-slate-800 dark:text-slate-200">
              {formatDate(subscription?.current_period_end)}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Bars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Warehouse Usage Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>{/* @ts-ignore */}<Trans>Penggunaan Gudang & Lokasi</Trans></span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {usedWarehouses} / {maxWarehouses >= 999 ? 'Tanpa Batas' : maxWarehouses}
            </span>
          </div>

          {maxWarehouses < 999 ? (
            <>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${progressColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{/* @ts-ignore */}<Trans>Terpakai</Trans>{percentage}{/* @ts-ignore */}<Trans>% kapasitas gudang</Trans></span>
                {isAtLimit && (
                  <span className="text-rose-500 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {/* @ts-ignore */}<Trans>Kapasitas Penuh</Trans></span>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {/* @ts-ignore */}<Trans>Kuota tidak terbatas untuk akun Enterprise</Trans></p>
          )}
        </div>

        {/* SKU Count Bar */}
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold text-sm">
              <LayersIcon className="w-4 h-4 text-purple-500" />
              <span>{/* @ts-ignore */}<Trans>Total SKU & Item Produk</Trans></span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              {skuCount} {/* @ts-ignore */}<Trans>SKU</Trans></span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
            {/* @ts-ignore */}<Trans>Semua paket Inventra mendukung penambahan SKU produk dan pencatatan transaksi tanpa batas kuota item.</Trans></p>
        </div>
      </div>
    </div>
  );
};
