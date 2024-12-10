import { WhatSection } from "~/components/home/WhatSection";
import { PlatformFeatures } from "~/components/home/features/PlatformFeatures";
import { AnalyticsFeatures } from "~/components/home/features/AnalyticsFeatures";
import { PricingSection } from "~/components/home/pricing/PricingSection";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-y-64 px-10 pb-20">
      <WhatSection />

      <PlatformFeatures />

      <AnalyticsFeatures />

      <PricingSection />
    </main>
  );
}
