"use client";
import React from 'react';
import { Trans } from "@lingui/macro";

export default function LandingFooter() {
  return (
    <footer className="bg-card w-full py-12 px-8 border-t border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between items-start gap-8 max-w-screen-2xl mx-auto text-sm tracking-wide">
        <div className="space-y-6 max-w-sm flex flex-col items-start pt-8 pb-4">
          <div className="text-lg font-semibold text-primary m-0 p-0">Inventra</div>
          <p className="text-muted-foreground leading-relaxed m-0 p-0 pt-2">
            <Trans>The premium standard for global supply chain orchestration. Built for the modern enterprise that values depth, intelligence, and visual soul.</Trans>
          </p>
          <div className="flex gap-4 p-0 m-0 pt-4">
            <a className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors" href="#!">
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-primary transition-colors" href="#!">
              <span className="material-symbols-outlined text-lg">alternate_email</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-24">
          <div className="space-y-4 flex flex-col items-start gap-0">
              <h4 className="text-foreground font-bold uppercase text-xs tracking-[0.2em] m-0 p-0 pb-2"><Trans>Product</Trans></h4>
              <ul className="space-y-3 flex flex-col m-0 p-0 gap-0">
                  <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#!"><Trans>Network</Trans></a></li>
                  <li><a className="text-muted-foreground hover:text-primary transition-colors mt-2" href="#!"><Trans>Documentation</Trans></a></li>
                  <li><a className="text-muted-foreground hover:text-primary transition-colors mt-2" href="#!"><Trans>Solutions</Trans></a></li>
              </ul>
          </div>
          <div className="space-y-4 flex flex-col items-start gap-0">
              <h4 className="text-foreground font-bold uppercase text-xs tracking-[0.2em] m-0 p-0 pb-2"><Trans>Support</Trans></h4>
              <ul className="space-y-3 flex flex-col m-0 p-0 gap-0">
                  <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#!"><Trans>Help Center</Trans></a></li>
                  <li><a className="text-muted-foreground hover:text-primary transition-colors mt-2" href="#!"><Trans>Contact</Trans></a></li>
                  <li><a className="text-muted-foreground hover:text-primary transition-colors mt-2" href="#!"><Trans>Status</Trans></a></li>
              </ul>
          </div>
          <div className="space-y-4 flex flex-col items-start gap-0">
              <h4 className="text-foreground font-bold uppercase text-xs tracking-[0.2em] m-0 p-0 pb-2"><Trans>Legal</Trans></h4>
              <ul className="space-y-3 flex flex-col m-0 p-0 gap-0">
                  <li><a className="text-muted-foreground hover:text-primary transition-colors" href="#!"><Trans>Privacy</Trans></a></li>
                  <li><a className="text-muted-foreground hover:text-primary transition-colors mt-2" href="#!"><Trans>Terms</Trans></a></li>
                  <li><a className="text-muted-foreground hover:text-primary transition-colors mt-2" href="#!"><Trans>Cookies</Trans></a></li>
              </ul>
          </div>
        </div>
      </div>
      <div className="max-w-screen-2xl mx-auto pt-12 mt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground/60">
        <div><Trans>© 2026 Inventra. Orchestrating supply with elegance.</Trans></div>
        <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/40"></span>
            <Trans>System Operational</Trans>
        </div>
      </div>
    </footer>
  );
}
