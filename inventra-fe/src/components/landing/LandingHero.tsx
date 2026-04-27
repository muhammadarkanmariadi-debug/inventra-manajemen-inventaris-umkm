"use client";
import React from "react";
import { Trans } from "@lingui/macro";
import Link from "next/link";
import Button from "@/components/ui/button/Button";

export default function LandingHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand-400) 0%, transparent 70%)",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl animate-pulse"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand-600) 0%, transparent 70%)",
            animationDuration: "6s",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-brand-500) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-gray-400) 1px, transparent 1px), linear-gradient(90deg, var(--color-gray-400) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text content */}
          <div className="space-y-8 flex flex-col items-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-brand-500/10 dark:bg-brand-500/15 rounded-full border border-brand-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-xs font-bold text-brand-500 tracking-widest uppercase">
                <Trans>Platform Inventaris UMKM</Trans>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] tracking-tight text-foreground">
              <Trans>
                Kelola Inventaris{" "}
                <span className="text-brand-500 italic">Cerdas</span> untuk
                Bisnis Modern.
              </Trans>
            </h1>

            {/* Subheadline */}
            <p className="text-muted-foreground text-lg lg:text-xl max-w-xl leading-relaxed">
              <Trans>
                Dari pelacakan stok real-time hingga prediksi AI — Inventra
                membantu UMKM mengelola inventaris dengan akurasi, kecepatan,
                dan efisiensi tinggi.
              </Trans>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/auth/signup">
                <Button
                  variant="primary"
                  className="bg-brand-500 hover:bg-brand-600 text-white text-base font-bold px-8 py-4 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300 border-none hover:-translate-y-0.5"
                >
                  <Trans>Mulai Gratis</Trans>
                  <span className="material-symbols-outlined text-lg ml-1">
                    arrow_forward
                  </span>
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border rounded-xl text-foreground font-semibold transition-all hover:bg-accent hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-brand-500">
                  play_circle
                </span>
                <Trans>Lihat Demo</Trans>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success-500 text-base">
                  check_circle
                </span>
                <Trans>Gratis 14 hari</Trans>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success-500 text-base">
                  check_circle
                </span>
                <Trans>Tanpa kartu kredit</Trans>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-success-500 text-base">
                  check_circle
                </span>
                <Trans>Setup 5 menit</Trans>
              </div>
            </div>
          </div>

          {/* Right — Dashboard preview */}
          <div className="relative group w-full">
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-brand-500/10 blur-3xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative bg-background rounded-2xl border border-border overflow-hidden shadow-2xl shadow-gray-900/10 dark:shadow-black/30">
              <img
                className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-700"
                alt="Inventra Dashboard Preview"
                src="/banner.png"
              />
              {/* Overlay stats bar */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-5 bg-background/85 backdrop-blur-xl rounded-xl border border-border shadow-lg">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <Trans>Akurasi Real-Time</Trans>
                    </div>
                    <div className="text-2xl font-bold text-brand-500">
                      99.98%
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <Trans>Produk Terlacak</Trans>
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      12,847
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      <Trans>Status Sistem</Trans>
                    </div>
                    <div className="flex gap-1 items-end h-6 mt-1">
                      {[6, 5, 6, 6, 4, 5, 6].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 rounded-full bg-success-500"
                          style={{ height: `${h * 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
