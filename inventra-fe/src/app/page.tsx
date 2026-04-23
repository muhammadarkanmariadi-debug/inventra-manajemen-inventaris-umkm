import React from 'react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingContact from '@/components/landing/LandingContact';
import LandingGlobalPresence from '@/components/landing/LandingGlobalPresence';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata = {
  title: 'Inventra | Orchestrating Supply with Elegance',
  description: 'Moving beyond flat inventory tracking. Inventra provides a luminous, deep-data experience for modern commerce hubs.',
};

export default function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* <LandingHeader /> */}
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
