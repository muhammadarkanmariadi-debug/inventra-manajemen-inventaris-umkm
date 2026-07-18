'use client';

import React, { useState } from 'react';
import { Check, X, Sparkles, Building2, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Trans } from "@lingui/macro";

interface PricingComparisonTableProps {
  onSelectPlan?: (planSlug: string, billingCycle: 'monthly' | 'annual') => void;
  currentPlanSlug?: string;
  isDashboard?: boolean;
}

interface PlanFeatureItem {
  name: string;
  enabled: boolean;
  note?: string;
  highlighted?: boolean;
}

export const PricingComparisonTable: React.FC<PricingComparisonTableProps> = ({
  onSelectPlan,
  currentPlanSlug,
  isDashboard = false,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const router = useRouter();
  const { user } = useAuth() || {};
  const isAuthenticated = !!user;

  const plans = [
    {
      name: 'Starter',
      slug: 'starter',
      tagline: 'Ideal untuk UMKM & toko tunggal yang baru beralih ke digital.',
      priceMonthly: 199000,
      priceAnnual: 1990000,
      maxWarehouses: '1 Gudang / Lokasi',
      isPopular: false,
      isCustomQuote: false,
      ctaText: currentPlanSlug === 'starter' ? 'Paket Saat Ini' : 'Pilih Starter',
      features: [
        { name: 'Manajemen Stok & Mutasi', enabled: true },
        { name: 'Pencatatan Penjualan & Pembelian', enabled: true },
        { name: 'Batas 1 Gudang / Lokasi', enabled: true },
        { name: 'Alur QC & Inspeksi Barang', enabled: false },
        { name: 'Ekspor Laporan Lanjutan (Excel/PDF)', enabled: false },
        { name: 'RBAC & Hak Akses Granular', enabled: false },
        { name: 'AI Forecasting & Prediksi Stok', enabled: false },
        { name: 'Integrasi ERP API & Webhook', enabled: false },
      ] as PlanFeatureItem[],
    },
    {
      name: 'Professional',
      slug: 'professional',
      tagline: 'Solusi terbaik untuk bisnis berkembang dengan beberapa cabang gudang.',
      priceMonthly: 499000,
      priceAnnual: 4990000,
      maxWarehouses: '5 Gudang / Lokasi',
      isPopular: true,
      isCustomQuote: false,
      ctaText: currentPlanSlug === 'professional' ? 'Paket Saat Ini' : 'Pilih Professional',
      features: [
        { name: 'Manajemen Stok & Mutasi', enabled: true },
        { name: 'Pencatatan Penjualan & Pembelian', enabled: true },
        { name: 'Batas hingga 5 Gudang / Lokasi', enabled: true },
        { name: 'Alur QC & Inspeksi Barang', enabled: true },
        { name: 'Ekspor Laporan Lanjutan (Excel/PDF)', enabled: true },
        { name: 'RBAC & Hak Akses Granular', enabled: true },
        { name: 'AI Forecasting & Prediksi Stok', enabled: false, note: 'Tersedia via Add-on' },
        { name: 'Integrasi ERP API & Webhook', enabled: false, note: 'Tersedia via Add-on' },
      ] as PlanFeatureItem[],
    },
    {
      name: 'Enterprise',
      slug: 'enterprise',
      tagline: 'Skala penuh tanpa batas untuk perusahaan besar & integrasi ERP ekstensif.',
      priceMonthly: 0,
      priceAnnual: 0,
      maxWarehouses: '999+ Gudang (Kustom)',
      isPopular: false,
      isCustomQuote: true,
      ctaText: currentPlanSlug === 'enterprise' ? 'Paket Saat Ini' : 'Hubungi Sales',
      features: [
        { name: 'Manajemen Stok & Mutasi', enabled: true },
        { name: 'Pencatatan Penjualan & Pembelian', enabled: true },
        { name: 'Gudang / Lokasi Tanpa Batas', enabled: true },
        { name: 'Alur QC & Inspeksi Barang', enabled: true },
        { name: 'Ekspor Laporan Lanjutan (Excel/PDF)', enabled: true },
        { name: 'RBAC & Hak Akses Granular', enabled: true },
        { name: 'AI Forecasting & Prediksi Stok', enabled: true, highlighted: true },
        { name: 'Integrasi ERP API & Webhook', enabled: true, highlighted: true },
      ] as PlanFeatureItem[],
    },
  ];

  const handleAction = (planSlug: string, isCustomQuote: boolean) => {
    if (currentPlanSlug === planSlug) return;
    if (isCustomQuote) {
      window.open('https://wa.me/6281112345678?text=Halo%20Tim%20Inventra,%20saya%20tertarik%20dengan%20paket%20Enterprise.', '_blank');
      return;
    }
    if (onSelectPlan) {
      onSelectPlan(planSlug, billingCycle);
    } else if (isAuthenticated) {
      router.push('/dashboard/settings/billing');
    } else {
      router.push('/auth/register');
    }
  };

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full">
      {/* Billing Cycle Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <div className="inline-flex items-center bg-muted/50 p-1.5 rounded-full border border-border shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              billingCycle === 'monthly'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {/* @ts-ignore */}<Trans>Bayar Bulanan</Trans></button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              billingCycle === 'annual'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>{/* @ts-ignore */}<Trans>Bayar Tahunan</Trans></span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] px-2 py-0.5 rounded-full font-bold">
              {/* @ts-ignore */}<Trans>Hemat 17%</Trans></span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
          const isCurrent = currentPlanSlug === plan.slug;

          return (
            <div
              key={plan.slug}
              className={`relative rounded-2xl flex flex-col transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-background via-background to-brand-950/20 border-2 border-brand-500/80 shadow-2xl shadow-brand-500/10 scale-105 z-10'
                  : 'bg-background border border-border hover:border-border/80 shadow-xl'
              } p-6 sm:p-8`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg shadow-blue-500/30 flex items-center gap-1.5 border border-blue-400/30">
                  <Sparkles className="w-3.5 h-3.5" /> {/* @ts-ignore */}<Trans>Rekomendasi Terpopuler</Trans></div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2 flex items-center justify-between">
                  {plan.name}
                  {plan.slug === 'enterprise' && <ShieldCheck className="w-5 h-5 text-purple-400" />}
                  {plan.slug === 'professional' && <Building2 className="w-5 h-5 text-brand-400" />}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed min-h-[40px]">
                  {plan.tagline}
                </p>
              </div>

              <div className="mb-6 pb-6 border-b border-border">
                {plan.isCustomQuote ? (
                  <div>
                    <div className="text-3xl font-extrabold text-foreground">{/* @ts-ignore */}<Trans>Custom Quote</Trans></div>
                    <p className="text-xs text-muted-foreground mt-1">{/* @ts-ignore */}<Trans>Disesuaikan dengan skala dan kebutuhan ERP perusahaan Anda</Trans></p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                        {formatIDR(price)}
                      </span>
                      <span className="text-muted-foreground text-sm font-medium">
                        /{billingCycle === 'annual' ? 'tahun' : 'bulan'}
                      </span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-xs text-emerald-400 font-medium mt-1">
                        {/* @ts-ignore */}<Trans>Setara</Trans>{formatIDR(Math.round(price / 12))}{/* @ts-ignore */}<Trans>/bulan (Ditagih tahunan)</Trans></p>
                    )}
                  </div>
                )}
                <div className="mt-4 bg-muted rounded-lg px-3.5 py-2 text-xs text-foreground font-semibold flex items-center gap-2 border border-border">
                  <Building2 className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>{/* @ts-ignore */}<Trans>Kapasitas:</Trans>{plan.maxWarehouses}</span>
                </div>
              </div>

              <div className="flex-1 space-y-3.5 mb-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {/* @ts-ignore */}<Trans>Fitur yang Termasuk:</Trans></p>
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    {feat.enabled ? (
                      <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${
                        feat.highlighted ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="mt-0.5 p-0.5 rounded-full shrink-0 bg-muted text-muted-foreground">
                        <X className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className={`${
                      feat.enabled 
                        ? feat.highlighted 
                          ? 'text-purple-400 font-medium' 
                          : 'text-foreground' 
                        : 'text-muted-foreground line-through'
                    }`}>
                      {feat.name}
                      {feat.note && (
                        <span className="ml-1 text-[11px] text-amber-500 font-normal no-underline block sm:inline">
                          ({feat.note})
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                disabled={isCurrent}
                onClick={() => handleAction(plan.slug, plan.isCustomQuote)}
                className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  isCurrent
                    ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                    : plan.isPopular
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white shadow-lg shadow-brand-600/30 hover:shadow-brand-600/50'
                    : plan.isCustomQuote
                    ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-500 border border-purple-500/40 hover:border-purple-500/60'
                    : 'bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-border/80'
                }`}
              >
                <span>{plan.ctaText}</span>
                {!isCurrent && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
