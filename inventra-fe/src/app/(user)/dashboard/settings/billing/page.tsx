'use client';

import React, { useState } from 'react';
import { useTenantSubscription } from '@/modules/subscription/hooks/use-subscription';
import { UsageBarCard } from '@/components/subscription/UsageBarCard';
import { AddonToggleCard } from '@/components/subscription/AddonToggleCard';
import { PricingComparisonTable } from '@/components/pricing/PricingComparisonTable';
import { UpgradeConfirmModal } from '@/components/subscription/UpgradeConfirmModal';
import { ShieldCheck, CreditCard } from 'lucide-react';
import { Trans } from "@lingui/macro";

export default function DashboardBillingPage() {
  const { data, isLoading, isError } = useTenantSubscription();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlanSlug, setSelectedPlanSlug] = useState<string>('starter');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectPlan = (planSlug: string, billingCycle: 'monthly' | 'annual') => {
    setSelectedPlanSlug(planSlug);
    setSelectedBillingCycle(billingCycle);
    setModalOpen(true);
  };

  const currentPlanSlug = data?.subscription?.plan?.slug || data?.usage?.plan_name?.toLowerCase() || 'starter';
  const currentPlanName = data?.subscription?.plan?.name || data?.usage?.plan_name || 'Starter';

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-rose-500 font-semibold">{/* @ts-ignore */}<Trans>Gagal memuat data langganan. Silakan muat ulang halaman.</Trans></p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-1">
          <CreditCard className="w-4 h-4" />
          <span>{/* @ts-ignore */}<Trans>Pengaturan & Billing</Trans></span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {/* @ts-ignore */}<Trans>Langganan, Kapasitas & Add-on</Trans></h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {/* @ts-ignore */}<Trans>Kelola kapasitas gudang, kuota sistem, serta add-on analitik dan integrasi ERP Anda di sini.</Trans></p>
      </div>

      {/* Usage & Active Subscription Summary Card */}
      {data ? (
        <UsageBarCard data={data} isLoading={isLoading} />
      ) : (
        <UsageBarCard data={{} as any} isLoading={true} />
      )}

      {/* Addons Toggle Section */}
      {data && (
        <AddonToggleCard activeAddons={data.active_addons || []} />
      )}

      {/* Pricing Comparison for Upgrade/Downgrade */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            {/* @ts-ignore */}<Trans>Perbandingan & Perubahan Paket</Trans></h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {/* @ts-ignore */}<Trans>Ingin menambah batas kapasitas gudang atau mengaktifkan fitur operasional tingkat lanjut?
                                  Pilih tier yang sesuai di bawah ini.</Trans></p>
        </div>

        <PricingComparisonTable
          isDashboard={true}
          currentPlanSlug={currentPlanSlug}
          onSelectPlan={handleSelectPlan}
        />
      </div>

      {/* Upgrade Confirmation Modal */}
      <UpgradeConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedPlanSlug={selectedPlanSlug}
        selectedBillingCycle={selectedBillingCycle}
        currentPlanName={currentPlanName}
      />
    </div>
  );
}
