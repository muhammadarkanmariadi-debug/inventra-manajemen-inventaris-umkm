import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingContact from '@/components/landing/LandingContact';
import LandingGlobalPresence from '@/components/landing/LandingGlobalPresence';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata = {
  title: 'Inventra | Platform Manajemen Inventaris Cerdas untuk UMKM',
  description: 'Kelola inventaris bisnis Anda dengan Inventra — pelacakan stok real-time, prediksi AI, multi-gudang, dan laporan analitik lengkap untuk UMKM Indonesia.',
};

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground font-outfit selection:bg-brand-500/20 selection:text-brand-500">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingGlobalPresence />
        <LandingContact />
      </main>
      <LandingFooter />
    </div>
  );
}
