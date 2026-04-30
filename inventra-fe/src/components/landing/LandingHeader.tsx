"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Trans } from "@lingui/macro";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import UserDropdown from "../header/UserDropdown";

import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import { useTranslate } from "@/hooks/useTranslate";
import { LanguageSwitcher } from "../common/LanguangeSwitch";
import { getProfile } from "../../../services/user.service";
import { User } from "../../../types";


import { useAuth } from "@/context/AuthContext";

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  const { _ } = useTranslate();


  const NAV_LINKS = [
    { href: "#features", label: _(msg`Fitur`) },
    { href: "#how-it-works", label: _(msg`Cara Kerja`) },
    { href: "#contact", label: _(msg`Kontak`) },
  ];
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? "bg-background/80 backdrop-blur-xl shadow-md border-b border-border"
        : "bg-transparent"
        }`}
    >
      <div className="flex items-center justify-between px-6 lg:px-8 py-4 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            className="dark:hidden"
            src="/images/logo/logo.svg"
            alt="Inventra Logo"
            width={140}
            height={36}
            priority
          />
          <Image
            className="hidden dark:block"
            src="/images/logo/logo-dark.svg"
            alt="Inventra Logo"
            width={140}
            height={36}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="relative font-medium px-4 py-2 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent active:scale-95"
            >
              <Trans>{label}</Trans>
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        {user ? (<div className="hidden md:flex items-center gap-3"><ThemeToggleButton /><LanguageSwitcher /><UserDropdown /></div>) : (<div className="hidden md:flex items-center gap-3">
          <ThemeToggleButton />
          <LanguageSwitcher />
          <Link
            href="/auth/signin"
            className="text-muted-foreground font-medium hover:text-foreground hover:bg-accent active:bg-accent/70 active:scale-95 transition-all duration-200 px-4 py-2 rounded-lg"
          >
            <Trans>Masuk</Trans>
          </Link>
          <Link href="/auth/signup">
            <Button
              variant="primary"
              className="relative overflow-hidden bg-brand-500 hover:bg-brand-600 active:bg-brand-700 active:scale-95 text-white font-semibold px-6 py-2.5 rounded-full shadow-[0_4px_14px_0_rgba(70,95,255,0.25)] hover:shadow-[0_6px_20px_0_rgba(70,95,255,0.35)] transition-all duration-200 border-none"
            >
              <Trans>Mulai Gratis</Trans>
            </Button>
          </Link>
        </div>)}



        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggleButton />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background/60 backdrop-blur-sm text-foreground transition-colors hover:bg-accent"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 items-center justify-center w-5">
              <span
                className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""
                  }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-0" : ""
                  }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-6 pb-6 pt-2 bg-background/95 backdrop-blur-xl border-b border-border space-y-1">
          {NAV_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              className="block font-medium px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Trans>{label}</Trans>
            </a>
          ))}
          <div className="pt-3 border-t border-border space-y-2">
            <Link
              href="/auth/signin"
              className="block text-center font-medium px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Trans>Masuk</Trans>
            </Link>
            <Link href="/auth/signup" className="block">
              <Button
                variant="primary"
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-3 rounded-lg border-none"
              >
                <Trans>Mulai Gratis</Trans>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}