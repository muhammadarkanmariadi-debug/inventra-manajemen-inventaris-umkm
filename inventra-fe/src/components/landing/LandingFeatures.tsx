"use client";
import React from 'react';
import { Trans } from "@lingui/macro";

export default function LandingFeatures() {
  return (
    <section className="py-24 px-8 max-w-screen-2xl mx-auto" id="features">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground"><Trans>The Digital Curator</Trans></h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg"><Trans>Sophisticated asymmetry meets high-end enterprise utility. Experience the future of supply chain management.</Trans></p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="md:col-span-2 bg-card p-10 rounded-xl border border-border flex flex-col justify-between group hover:border-primary/20 transition-all duration-500 min-h-[400px] shadow-sm">
            <div className="space-y-4 flex flex-col gap-0 items-start">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">analytics</span>
              </div>
              <h3 className="text-base sm:text-3xl font-semibold text-card-foreground m-0 p-0"><Trans>Predictive AI Analytics</Trans></h3>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md m-0 p-0 pt-4"><Trans>Our neural engine anticipates demand spikes 48 hours before they happen, suggesting precise stock adjustments automatically.</Trans></p>
            </div>
            <div className="mt-8 overflow-hidden rounded-lg border border-border">
              <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground grayscale group-hover:grayscale-0 transition-all duration-700">
                <Trans>AI Data Visualization</Trans>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-card p-10 rounded-xl border border-border flex flex-col justify-between group hover:border-primary/20 transition-all shadow-sm">
            <div className="space-y-4 flex flex-col items-start gap-0">
              <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-8">
                <span className="material-symbols-outlined text-3xl">location_on</span>
              </div>
              <h3 className="text-2xl font-semibold text-card-foreground m-0 p-0"><Trans>Real-Time Tracking</Trans></h3>
              <p className="text-muted-foreground leading-relaxed pt-2 m-0 p-0"><Trans>Geofenced inventory visibility across 24 countries. From factory floor to final mile delivery.</Trans></p>
            </div>
            <div className="pt-12 text-5xl font-extrabold text-muted-foreground/20 group-hover:text-primary/30 transition-colors">
              <Trans>LIVE</Trans>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-card p-10 rounded-xl border border-border group hover:border-primary/20 transition-all shadow-sm">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-8">
              <span className="material-symbols-outlined text-3xl">shield</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-card-foreground"><Trans>Enterprise Security</Trans></h3>
            <p className="text-muted-foreground leading-relaxed"><Trans>Military-grade encryption and granular access control for global supply chains.</Trans></p>
          </div>

          {/* Card 4 */}
          <div className="md:col-span-2 bg-card p-10 rounded-xl border border-border flex flex-col md:flex-row gap-12 items-center shadow-sm">
            <div className="flex-1 space-y-4 flex flex-col gap-0 items-start">
              <div className="text-primary font-bold tracking-widest text-xs uppercase m-0 p-0"><Trans>Ecosystem Integration</Trans></div>
              <h3 className="text-3xl font-semibold text-card-foreground m-0 p-0 pt-2"><Trans>Plays well with others.</Trans></h3>
              <p className="text-muted-foreground text-lg m-0 p-0 pt-4"><Trans>Connect seamlessly with SAP, Oracle, and over 400+ third-party logistics providers via our robust API.</Trans></p>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border text-muted-foreground"><span className="material-symbols-outlined">extension</span></div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border text-muted-foreground"><span className="material-symbols-outlined">hub</span></div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border text-muted-foreground"><span className="material-symbols-outlined">api</span></div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border text-muted-foreground"><span className="material-symbols-outlined">database</span></div>
              <div className="aspect-square bg-primary rounded-lg flex items-center justify-center text-primary-foreground"><span className="material-symbols-outlined">add</span></div>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center border border-border text-muted-foreground"><span className="material-symbols-outlined">settings</span></div>
            </div>
          </div>
      </div>
    </section>
  );
}
