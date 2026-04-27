"use client";
import React from "react";
import { Trans } from "@lingui/macro";

const FEATURES = [
  {
    icon: "inventory_2",
    title: "Stok Real-Time",
    desc: "Pantau level stok di seluruh gudang dan lini produksi secara langsung — tidak ada lagi selisih data.",
    color: "brand",
    span: "md:col-span-2",
  },
  {
    icon: "psychology",
    title: "Prediksi AI",
    desc: "Neural engine memprediksi permintaan sebelum terjadi dan menyarankan penyesuaian stok otomatis.",
    color: "violet",
    span: "",
  },
  {
    icon: "warehouse",
    title: "Multi-Gudang",
    desc: "Kelola banyak lokasi penyimpanan, transfer antar gudang, dan konsolidasi data dalam satu platform.",
    color: "emerald",
    span: "",
  },
  {
    icon: "bar_chart",
    title: "Laporan & Analitik",
    desc: "Dashboard interaktif dengan turnover rate, dead stock alert, dan laporan keuangan inventaris yang lengkap.",
    color: "amber",
    span: "md:col-span-2",
  },
  {
    icon: "shield",
    title: "Keamanan Enterprise",
    desc: "Role-based access control, audit trail lengkap, dan enkripsi data untuk melindungi aset bisnis Anda.",
    color: "rose",
    span: "",
  },
  {
    icon: "integration_instructions",
    title: "Integrasi Mudah",
    desc: "API terbuka dan webhook untuk integrasi dengan POS, ERP, marketplace, dan sistem akuntansi Anda.",
    color: "brand",
    span: "md:col-span-2",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  brand: {
    bg: "bg-brand-500/10 dark:bg-brand-500/15",
    text: "text-brand-500",
    border: "group-hover:border-brand-500/30",
  },
  violet: {
    bg: "bg-theme-purple-500/10",
    text: "text-theme-purple-500",
    border: "group-hover:border-theme-purple-500/30",
  },
  emerald: {
    bg: "bg-success-500/10",
    text: "text-success-500",
    border: "group-hover:border-success-500/30",
  },
  amber: {
    bg: "bg-warning-500/10",
    text: "text-warning-500",
    border: "group-hover:border-warning-500/30",
  },
  rose: {
    bg: "bg-error-500/10",
    text: "text-error-500",
    border: "group-hover:border-error-500/30",
  },
};

export default function LandingFeatures() {
  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-screen-2xl mx-auto" id="features">
      {/* Section heading */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 dark:bg-brand-500/15 rounded-full border border-brand-500/20 text-brand-500 text-xs font-bold tracking-widest uppercase mx-auto">
          <span className="material-symbols-outlined text-sm">star</span>
          <Trans>Fitur Unggulan</Trans>
        </div>
        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
          <Trans>Semua yang Bisnis Anda Butuhkan</Trans>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          <Trans>
            Platform inventaris lengkap yang dirancang untuk UMKM — dari pelacakan stok hingga analitik cerdas.
          </Trans>
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid md:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => {
          const colors = colorMap[f.color] || colorMap.brand;
          return (
            <div
              key={i}
              className={`${f.span} group relative bg-card p-8 lg:p-10 rounded-2xl border border-border ${colors.border} transition-all duration-500 hover:shadow-lg hover:shadow-gray-900/5 dark:hover:shadow-black/20 hover:-translate-y-1`}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center ${colors.text} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="material-symbols-outlined text-2xl">
                  {f.icon}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-xl lg:text-2xl font-semibold text-card-foreground mb-3">
                <Trans>{f.title}</Trans>
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                <Trans>{f.desc}</Trans>
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
