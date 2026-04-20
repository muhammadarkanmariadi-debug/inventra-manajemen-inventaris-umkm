"use client";
import React from 'react';
import { Trans } from "@lingui/macro";

export default function LandingInventoryFeatures() {
  return (
    <section className="py-24  border-y border-border">
      <div className="max-w-screen-2xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">

          {/* LEFT */}
          <div className="lg:w-1/3 space-y-6 flex flex-col items-start gap-0">
            <h2 className="text-3xl font-bold text-foreground">
              <Trans>Kenapa Platform Kami</Trans>
            </h2>
            <p className="text-muted-foreground leading-relaxed pt-4">
              <Trans>
                Sistem manajemen inventaris yang dirancang untuk dunia manufaktur,
                distribusi, dan logistik — visibilitas penuh atas stok dan rantai pasok secara real-time.
              </Trans>
            </p>
            <div className="space-y-3 pt-10 flex flex-col h-auto w-full">
              {[
                { label: "Stok Real-Time", desc: "Pantau level stok seluruh gudang tanpa jeda" },
                { label: "Audit Trail Lengkap", desc: "Rekam setiap transaksi masuk, keluar & transfer" },
                { label: "Integrasi ERP / MES", desc: "Sinkronisasi otomatis dengan sistem produksi" },
              ].map((item, i) => (
                <div key={i} className="p-4 bg-background rounded-lg border border-border shadow-sm flex flex-col items-start">
                  <div className="font-bold text-primary">{item.label}</div>
                  <div className="text-muted-foreground text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:w-2/3 w-full bg-background rounded-xl overflow-hidden border border-border shadow-lg">
            <div className="grid grid-cols-2 divide-x divide-y divide-border">
              {[
                { title: "Manajemen Stok", desc: "Pantau stok di semua gudang dan lini produksi secara langsung." },
                { title: "Pelacakan Pergerakan", desc: "Catat setiap transaksi barang masuk, keluar, dan antar lokasi." },
                { title: "Laporan & Analitik", desc: "Forecast permintaan, turnover rate, dan dead stock alert." },
                { title: "Multi-Gudang", desc: "Kelola banyak lokasi penyimpanan dalam satu platform terpadu." },
              ].map((f, i) => (
                <div key={i} className="p-6 flex flex-col items-start gap-2">
                  <div className="font-bold text-foreground">{f.title}</div>
                  <div className="text-muted-foreground text-sm leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="px-8 py-4 border-t border-border flex gap-2">
              <div className="px-4 py-2 bg-primary/10 backdrop-blur-md rounded-full border border-primary/20 text-primary text-xs font-bold">
                <Trans>Manufaktur</Trans>
              </div>
              <div className="px-4 py-2 bg-background/50 backdrop-blur-md rounded-full border border-border text-foreground text-xs font-bold">
                <Trans>Distribusi</Trans>
              </div>
              <div className="px-4 py-2 bg-background/50 backdrop-blur-md rounded-full border border-border text-foreground text-xs font-bold">
                <Trans>Logistik</Trans>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}