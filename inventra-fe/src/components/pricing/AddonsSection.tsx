'use client';

import React from 'react';
import { Sparkles, Webhook, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Trans } from "@lingui/macro";

export const AddonsSection: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth() || {};
  const isAuthenticated = !!user;

  const addons = [
    {
      id: 'ai_forecasting',
      name: 'AI Forecasting & Prediksi Stok',
      slug: 'ai_forecasting',
      priceMonthly: 150000,
      pricingModel: 'Flat / Bulan (Seluruh Gudang)',
      description:
        'Tingkatkan akurasi pemesanan stok dan cegah kehabisan barang atau dead stock menggunakan analitik prediktif berbasis Gemini AI. Menganalisis tren musiman dan laju penjualan harian.',
      icon: Sparkles,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      highlights: [
        'Prediksi kehabisan stok (Stockout Alert)',
        'Analisis barang terlaris dan slow-moving per gudang',
        'Rekomendasi kuantitas restock otomatis',
      ],
    },
    {
      id: 'erp_integration',
      name: 'ERP Integration API & Webhook',
      slug: 'erp_integration',
      priceMonthly: 250000,
      pricingModel: 'Flat / Bulan (Seluruh Gudang)',
      description:
        'Akses penuh ke REST API dan Webhook real-time untuk menghubungkan Inventra sebagai side-system ERP perusahaan Anda seperti SAP, Odoo, Accurate, atau sistem akuntansi internal.',
      icon: Webhook,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      highlights: [
        'Akses ke seluruh endpoint API v1 (Produk, Mutasi, QC)',
        'Webhook notifikasi instan saat status barang berubah',
        'Jaminan rate limit tinggi (100 req/menit) & Idempotency Key',
      ],
    },
  ];

  const handleAddonAction = () => {
    if (isAuthenticated) {
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
    <div className="w-full max-w-7xl mx-auto mt-20 pt-16 border-t border-border">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
          {/* @ts-ignore */}<Trans>Add-on & Kemampuan Tambahan</Trans></h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {/* @ts-ignore */}<Trans>Butuh fitur tertentu tanpa harus upgrade ke paket Enterprise? Aktifkan add-on terpisah dengan model biaya flat yang terjangkau dan langsung terintegrasi di seluruh gudang Anda.</Trans></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {addons.map((addon) => {
          const Icon = addon.icon;
          return (
            <div
              key={addon.id}
              className="bg-background border border-border hover:border-border/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className={`p-3.5 rounded-xl border ${addon.iconColor} shrink-0`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                      {formatIDR(addon.priceMonthly)}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium mt-0.5">
                      {addon.pricingModel}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3">
                  {addon.name}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {addon.description}
                </p>

                <div className="space-y-2.5 mb-8">
                  {addon.highlights.map((point, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddonAction}
                className="w-full py-3 px-6 rounded-xl font-semibold text-sm bg-muted hover:bg-muted/80 text-foreground border border-border hover:border-border/80 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{/* @ts-ignore */}<Trans>Aktifkan Add-on</Trans></span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
