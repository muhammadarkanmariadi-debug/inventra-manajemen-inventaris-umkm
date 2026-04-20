"use client";
import React from 'react';
import { Trans } from "@lingui/macro";
import Button from '@/components/ui/button/Button';

export default function LandingHero() {
  return (
    <section className="relative min-h-[800px] flex items-center px-8 max-w-screen-2xl mx-auto overflow-hidden pt-24">
      {/* signature-glow */}
      <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none opacity-50" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)' }}></div>
      <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <div className="space-y-8 flex flex-col items-start gap-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">
              <Trans>Next-Gen Intelligence</Trans>
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground m-0 p-0">
            <Trans>Orchestrating <span className="text-primary italic">supply</span> with pure elegance.</Trans>
          </h1>
          <p className="text-muted-foreground text-lg lg:text-xl max-w-xl leading-relaxed m-0 p-0">
            <Trans>Moving beyond flat inventory tracking. Inventra provides a luminous, deep-data experience for modern commerce hubs.</Trans>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button className="bg-primary text-primary-foreground text-lg font-bold px-8 py-4 rounded-lg shadow-lg hover:shadow-primary/20 transition-all border-none">
              <Trans>Start Free Trial</Trans>
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border rounded-lg text-foreground font-semibold transition-all hover:bg-accent">
              <span className="material-symbols-outlined text-primary">play_circle</span>
              <Trans>Watch the Demo</Trans>
            </Button>
          </div>
        </div>
        <div className="relative group w-full">
            <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full transition-opacity group-hover:opacity-100"></div>
            <div className="relative bg-background rounded-xl border border-border overflow-hidden shadow-2xl">
              <img className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700" alt="Dashboard" src="/banner.png" />
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/80 backdrop-blur-xl rounded-lg border border-border shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider"><Trans>REAL-TIME ACCURACY</Trans></div>
                    <div className="text-2xl font-bold text-primary">99.98%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground text-xs font-bold mb-1 uppercase tracking-wider"><Trans>SYSTEM HEALTH</Trans></div>
                    <div className="flex gap-1 justify-end items-end h-6">
                      <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                      <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                      <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                      <div className="w-1.5 h-4 bg-primary/30 rounded-full"></div>
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
