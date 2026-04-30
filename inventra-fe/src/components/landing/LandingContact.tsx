"use client";
import React from "react";
import { Trans } from "@lingui/macro";
import Button from "@/components/ui/button/Button";
import { MessageSquare, Phone, Mail, Send } from "lucide-react";

export default function LandingContact() {
  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8 max-w-screen-2xl mx-auto" id="contact">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left — Info */}
        <div className="space-y-8 flex flex-col items-start pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-500/10 dark:bg-brand-500/15 rounded-full border border-brand-500/20 text-brand-500 text-xs font-bold tracking-widest uppercase">
            <MessageSquare className="w-4 h-4" />
            <Trans>Hubungi Kami</Trans>
          </div>

          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            <Trans>Siap Optimalkan</Trans>
            <br />
            <span className="text-brand-500">
              <Trans>Inventaris Anda?</Trans>
            </span>
          </h2>

          <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
            <Trans>
              Tim kami siap membantu Anda memulai. Hubungi kami untuk konsultasi gratis tentang kebutuhan manajemen inventaris bisnis Anda.
            </Trans>
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-brand-500/20 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 flex-shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  <Trans>Telepon</Trans>
                </div>
                <span className="text-foreground font-semibold">+62 812-3456-7890</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-brand-500/20 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 flex-shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                  <Trans>Email</Trans>
                </div>
                <span className="text-foreground font-semibold">support@inventra.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Form */}
        <div className="relative">
          {/* Glow */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-500/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative bg-card p-8 lg:p-10 rounded-2xl border border-border shadow-xl shadow-gray-900/5 dark:shadow-black/20">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Trans>Nama Lengkap</Trans>
                  </label>
                  <input
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-foreground placeholder:text-muted-foreground/50"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Trans>Email</Trans>
                  </label>
                  <input
                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-foreground placeholder:text-muted-foreground/50"
                    placeholder="john@perusahaan.com"
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <Trans>Ukuran Bisnis</Trans>
                </label>
                <select className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-foreground">
                  <option><Trans>Pilih ukuran...</Trans></option>
                  <option><Trans>1-10 karyawan</Trans></option>
                  <option><Trans>11-50 karyawan</Trans></option>
                  <option><Trans>51-200 karyawan</Trans></option>
                  <option><Trans>200+ karyawan</Trans></option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  <Trans>Pesan</Trans>
                </label>
                <textarea
                  className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-foreground placeholder:text-muted-foreground/50 resize-none"
                  placeholder="Ceritakan tantangan inventaris Anda..."
                  rows={4}
                />
              </div>
              <Button
                variant="primary"
                type="submit"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all border-none flex items-center justify-center"
              >
                <Trans>Kirim Pesan</Trans>
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
