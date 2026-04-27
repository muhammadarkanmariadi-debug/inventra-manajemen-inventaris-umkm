"use client";
import React from "react";
import { Trans } from "@lingui/macro";

const STEPS = [
  {
    icon: "person_add",
    title: "Daftar Akun",
    desc: "Buat akun gratis dalam hitungan detik — cukup email dan password, tanpa kartu kredit.",
    step: "01",
  },
  {
    icon: "storefront",
    title: "Setup Bisnis",
    desc: "Isi profil bisnis Anda, tambahkan gudang, dan impor data produk dari file CSV atau input manual.",
    step: "02",
  },
  {
    icon: "monitoring",
    title: "Kelola & Pantau",
    desc: "Dashboard real-time siap digunakan. Catat transaksi, pantau stok, dan biarkan AI bekerja untuk Anda.",
    step: "03",
  },
];

export default function LandingHowItWorks() {
  return (
    <section className="py-20 lg:py-28 border-y border-border bg-muted/30 dark:bg-gray-900/50" id="how-it-works">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8">
        {/* Section heading */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 dark:bg-brand-500/15 rounded-full border border-brand-500/20 text-brand-500 text-xs font-bold tracking-widest uppercase mx-auto">
            <span className="material-symbols-outlined text-sm">route</span>
            <Trans>Cara Kerja</Trans>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground">
            <Trans>Mulai dalam 3 Langkah Mudah</Trans>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            <Trans>
              Tidak perlu pengaturan rumit. Dari pendaftaran hingga pengelolaan penuh — semuanya bisa dilakukan dalam hitungan menit.
            </Trans>
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-brand-500/20 via-brand-500/40 to-brand-500/20" />

          {STEPS.map((s, i) => (
            <div key={i} className="relative flex flex-col items-center text-center group">
              {/* Step number badge */}
              <div className="relative z-10 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-background border-2 border-brand-500/20 group-hover:border-brand-500 flex items-center justify-center shadow-lg shadow-gray-900/5 dark:shadow-black/20 transition-all duration-300 group-hover:shadow-brand-500/10 group-hover:-translate-y-1">
                  <span className="material-symbols-outlined text-brand-500 text-3xl">
                    {s.icon}
                  </span>
                </div>
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-500 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {s.step}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                <Trans>{s.title}</Trans>
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">
                <Trans>{s.desc}</Trans>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}