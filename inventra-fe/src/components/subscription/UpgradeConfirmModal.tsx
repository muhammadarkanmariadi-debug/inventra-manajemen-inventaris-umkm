"use client";

import React from 'react';
import { X, AlertCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useUpgradePlan, usePlans } from '@/modules/subscription/hooks/use-subscription';
import { toast } from 'sonner';
import { Trans } from "@lingui/macro";

interface UpgradeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlanSlug: string;
  selectedBillingCycle: 'monthly' | 'annual';
  currentPlanName?: string;
}

export const UpgradeConfirmModal: React.FC<UpgradeConfirmModalProps> = ({
  isOpen,
  onClose,
  selectedPlanSlug,
  selectedBillingCycle,
  currentPlanName = 'Starter',
}) => {
  const { data: plans } = usePlans();
  const upgradeMutation = useUpgradePlan();

  if (!isOpen) return null;

  const selectedPlan = plans?.find((p) => p.slug === selectedPlanSlug);
  if (!selectedPlan) return null;

  const price =
    selectedBillingCycle === 'annual'
      ? selectedPlan.price_base_annual
      : selectedPlan.price_base_monthly;

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleConfirm = () => {
    upgradeMutation.mutate(
      {
        plan_id: selectedPlan.id,
        billing_cycle: selectedBillingCycle,
      },
      {
        onSuccess: (data: any) => {
          toast.success(
            data?.message || `Berhasil mengupgrade langganan ke paket ${selectedPlan.name}!`
          );
          onClose();
        },
        onError: (err: any) => {
          const msg =
            err?.response?.data?.message || 'Gagal mengubah paket langganan. Silakan coba lagi.';
          toast.error(msg);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={upgradeMutation.isPending}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {/* @ts-ignore */}<Trans>Konfirmasi Perubahan Paket</Trans></h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {/* @ts-ignore */}<Trans>Perbarui batas kapasitas dan kemampuan sistem Anda</Trans></p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200 dark:border-slate-700/60 my-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">{/* @ts-ignore */}<Trans>Paket Saat Ini:</Trans></span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {currentPlanName}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">{/* @ts-ignore */}<Trans>Paket Tujuan:</Trans></span>
            <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <span>{selectedPlan.name}</span>
              <span className="text-xs uppercase bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">
                {selectedBillingCycle === 'annual' ? 'Tahunan' : 'Bulanan'}
              </span>
            </span>
          </div>
          <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-slate-200 dark:border-slate-700">
            <span className="text-slate-900 dark:text-white">{/* @ts-ignore */}<Trans>Total Tagihan:</Trans></span>
            <span className="text-slate-900 dark:text-white">{formatIDR(price)}</span>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-2 mb-6">
          <div className="flex items-start gap-2 font-semibold">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span>{/* @ts-ignore */}<Trans>Konsekuensi & Penyesuaian Kapasitas (</Trans>{selectedPlan.max_warehouses} {/* @ts-ignore */}<Trans>Gudang):</Trans></span>
          </div>
          <p className="pl-6 leading-relaxed text-amber-700 dark:text-amber-300/90">
            {/* @ts-ignore */}<Trans>Perubahan batas kapasitas akan diterapkan seketika.</Trans><strong>{/* @ts-ignore */}<Trans>Catatan Downgrade:</Trans></strong> {/* @ts-ignore */}<Trans>Apabila kuota paket baru lebih rendah dari jumlah gudang Anda saat ini, gudang sekunder di luar batas kuota (mis. gudang ke-2 dst) akan otomatis dialihkan ke status</Trans><em>{/* @ts-ignore */}<Trans>non-aktif / terkunci sementara</Trans></em> {/* @ts-ignore */}<Trans>hingga kuota diperbarui kembali.</Trans></p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={upgradeMutation.isPending}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {/* @ts-ignore */}<Trans>Batal</Trans></button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={upgradeMutation.isPending}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {upgradeMutation.isPending ? (
              <span>{/* @ts-ignore */}<Trans>Memproses...</Trans></span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>{/* @ts-ignore */}<Trans>Konfirmasi & Ubah Paket</Trans></span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
