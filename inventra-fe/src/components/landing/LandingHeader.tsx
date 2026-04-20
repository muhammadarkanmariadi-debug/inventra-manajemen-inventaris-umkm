"use client";
import React, { useState } from 'react';
import { Trans } from "@lingui/macro";
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import Image from 'next/image';
import { ThemeToggleButton } from '../common/ThemeToggleButton';

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#solutions", label: "Solutions" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function LandingHeader() {
  const [activeLink, setActiveLink] = useState<string>("#features");

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-[40px] antialiased shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-8 py-4 max-w-screen-2xl mx-auto">
        <>
          <Image
            className="dark:hidden"
            src={'/images/logo/logo.svg'}
            alt="Logo"
            width={150}
            height={40}
          />
          <Image
            className="hidden dark:block"
            src={'/images/logo/logo-dark.svg'}
            alt="Logo"
            width={150}
            height={40}
          />
        </>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = activeLink === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setActiveLink(href)}
                className={`
                  relative font-medium px-4 py-2 rounded-lg transition-all duration-200
                  ${isActive
                    ? "text-primary bg-primary/10 font-semibold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-4/5 after:h-[2px] after:rounded-full after:bg-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent active:scale-95 active:bg-accent/70"
                  }
                `}
              >
                <Trans>{label}</Trans>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <button className="hidden md:block text-muted-foreground font-medium hover:text-foreground hover:bg-accent active:bg-accent/70 active:scale-95 transition-all duration-200 px-4 py-2 rounded-lg">
            <Trans>Sign In</Trans>
          </button>
          <Button
            variant="primary"
            className="
              relative overflow-hidden
              bg-primary hover:bg-primary/90 active:bg-primary/80
              active:scale-95
              text-primary-foreground
              font-semibold
              px-5 py-2.5
              rounded-full
              shadow-[0_0_0_0_hsl(var(--primary)/0.4)]
              hover:shadow-[0_4px_14px_0_hsl(var(--primary)/0.35)]
              transition-all duration-200
              border border-primary/20
            "
          >
            <Trans>Get Started</Trans>
          </Button>
        </div>
      </div>
    </nav>
  );
}