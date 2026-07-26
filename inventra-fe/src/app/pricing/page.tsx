"use client";

import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { PricingComparisonTable } from '@/components/pricing/PricingComparisonTable';
import { AddonsSection } from '@/components/pricing/AddonsSection';
import { Sparkles } from 'lucide-react';
import { Trans } from "@lingui/macro";

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground font-outfit selection:bg-brand-500/20 selection:text-brand-500">
      <LandingHeader />
      <main className="pt-28 pb-24 px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {/* @ts-ignore */}<Trans>Transparan & Tanpa Biaya Tersembunyi</Trans></div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight mb-6">
            {/* @ts-ignore */}<Trans>Pilih Paket yang Sesuai dengan</Trans><span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent italic">{/* @ts-ignore */}<Trans>Skala Bisnis Anda</Trans></span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            {/* @ts-ignore */}<Trans>Mulai gratis untuk toko tunggal, upgrade seiring bertambahnya gudang dan tim operasional, atau pilih Enterprise untuk kustomisasi penuh dan integrasi ERP.</Trans></p>
        </div>

        {/* Pricing Comparison Table & Toggle */}
        <PricingComparisonTable />

        {/* Addons Section */}
        <AddonsSection />
      </main>
      <LandingFooter />
    </div>
  );
}
