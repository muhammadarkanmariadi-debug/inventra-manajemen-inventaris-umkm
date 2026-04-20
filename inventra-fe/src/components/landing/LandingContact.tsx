"use client";
import React from 'react';
import { Trans } from "@lingui/macro";
import Button from '@/components/ui/button/Button';

export default function LandingContact() {
  return (
    <section className="py-24 px-8 max-w-screen-2xl mx-auto" id="contact">
      <div className="grid lg:grid-cols-2 gap-20 items-start">
        <div className="space-y-10 flex flex-col items-start pt-8 pb-8">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground m-0 p-0">
            <Trans>Scale your operation.</Trans> <br/><span className="text-primary"><Trans>Talk to an expert.</Trans></span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-lg m-0 p-0">
            <Trans>Ready to optimize? Our team of logistics architects is standing by to build a custom implementation plan for your global network.</Trans>
          </p>
          <div className="space-y-6 flex flex-col gap-0 items-start p-0 m-0 pt-4">
            <div className="flex items-center gap-4 m-0 p-0 mt-4 h-10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">call</span>
              </div>
              <span className="text-foreground font-medium">+1 (555) INVENTRA</span>
            </div>
            <div className="flex items-center gap-4 m-0 p-0 mt-4 h-10">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">mail</span>
              </div>
              <span className="text-foreground font-medium">concierge@inventra.io</span>
            </div>
          </div>
        </div>

        <div className="bg-card p-8 lg:p-12 rounded-xl border border-border shadow-xl relative">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/5 blur-2xl rounded-full"></div>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 flex flex-col items-start gap-0">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest"><Trans>Full Name</Trans></label>
                <input className="w-full bg-background border-border rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground mt-2 border" placeholder="John Doe" type="text"/>
              </div>
              <div className="space-y-2 flex flex-col items-start gap-0">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest"><Trans>Work Email</Trans></label>
                <input className="w-full bg-background border-border rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground mt-2 border" placeholder="john@company.com" type="email"/>
              </div>
            </div>
            <div className="space-y-2 flex flex-col items-start gap-0">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest"><Trans>Organization Size</Trans></label>
              <select className="w-full bg-background border border-border rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground mt-2 inline-block">
                <option><Trans>Select size...</Trans></option>
                <option><Trans>1-50 employees</Trans></option>
                <option><Trans>51-500 employees</Trans></option>
                <option><Trans>500+ employees</Trans></option>
              </select>
            </div>
            <div className="space-y-2 flex flex-col items-start gap-0">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest"><Trans>Message</Trans></label>
              <textarea className="w-full bg-background border border-border rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground mt-2 inline-block" placeholder="Tell us about your inventory challenges..." rows={4}></textarea>
            </div>
            <Button className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-lg shadow-lg hover:shadow-primary/20 transition-all border-none" type="submit">
              <Trans>Request Implementation Audit</Trans>
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
