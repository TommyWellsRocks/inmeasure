import { WhatSection } from "~/components/home/WhatSection";
import { PlatformFeatures } from "~/components/home/features/PlatformFeatures";
import { AboutSection } from "~/components/home/about/AboutSection";
import { AnalyticsFeatures } from "~/components/home/features/AnalyticsFeatures";
import { PricingSection } from "~/components/home/pricing/PricingSection";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-y-64 px-10 pb-20">
      <WhatSection />

      <PlatformFeatures />

      <AboutSection />

      <AnalyticsFeatures />

      <PricingSection />
    </main>
  );
}
