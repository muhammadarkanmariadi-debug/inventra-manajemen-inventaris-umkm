"use client";
import React from "react";
import { Trans } from "@lingui/macro";
import Link from "next/link";
import Image from "next/image";

const PRODUCT_LINKS = [
  { label: "Fitur", href: "#features" },
  { label: "Cara Kerja", href: "#how-it-works" },
  { label: "Harga", href: "#pricing" },
  { label: "Dokumentasi", href: "#docs" },
];

const SUPPORT_LINKS = [
  { label: "Pusat Bantuan", href: "#help" },
  { label: "Kontak", href: "#contact" },
  { label: "Status Sistem", href: "#status" },
];

const LEGAL_LINKS = [
  { label: "Privasi", href: "#privacy" },
  { label: "Syarat & Ketentuan", href: "#terms" },
  { label: "Cookie", href: "#cookies" },
];

export default function LandingFooter() {
  return (
    <footer className="bg-card w-full border-t border-border">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column — takes 2 cols on lg */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Inventra"
                width={130}
                height={34}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Inventra"
                width={130}
                height={34}
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-sm text-sm">
              <Trans>
                Platform manajemen inventaris modern untuk UMKM Indonesia. Kelola stok, lacak pergerakan barang, dan optimalkan bisnis Anda dengan teknologi AI.
              </Trans>
            </p>
            {/* Social icons */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: "public", label: "Website" },
                { icon: "alternate_email", label: "Email" },
                { icon: "chat", label: "Chat" },
              ].map(({ icon, label }) => (
                <a
                  key={icon}
                  href="#!"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-brand-500 hover:bg-brand-500/10 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-foreground font-bold uppercase text-xs tracking-[0.2em]">
              <Trans>Produk</Trans>
            </h4>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-muted-foreground hover:text-brand-500 transition-colors text-sm"
                  >
                    <Trans>{label}</Trans>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-foreground font-bold uppercase text-xs tracking-[0.2em]">
              <Trans>Bantuan</Trans>
            </h4>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-muted-foreground hover:text-brand-500 transition-colors text-sm"
                  >
                    <Trans>{label}</Trans>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-foreground font-bold uppercase text-xs tracking-[0.2em]">
              <Trans>Legal</Trans>
            </h4>
            <ul className="space-y-3">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-muted-foreground hover:text-brand-500 transition-colors text-sm"
                  >
                    <Trans>{label}</Trans>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
          <div>
            <Trans>© 2026 Inventra. All rights reserved.</Trans>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success-500" />
            </span>
            <Trans>Sistem Operasional</Trans>
          </div>
        </div>
      </div>
    </footer>
  );
}
