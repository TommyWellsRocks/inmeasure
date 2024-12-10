import { WhatSection } from "~/components/home/WhatSection";
import { PlatformFeatures } from "~/components/home/features/PlatformFeatures";
import { AnalyticsFeatures } from "~/components/home/features/AnalyticsFeatures";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col gap-y-64 px-10 pb-60">
      <WhatSection />

      <PlatformFeatures />

      <AnalyticsFeatures />
    </main>
  );
}
