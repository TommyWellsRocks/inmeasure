import { WhatSection } from "~/components/home/WhatSection";
import { FeaturesSection } from "~/components/home/FeaturesSection";
import { PricingSection } from "~/components/home/PricingSection";

export default function HomePage() {
  return (
    <main className="flex flex-col gap-y-64 px-10 pb-20">
      <WhatSection />
      <FeaturesSection />
      <PricingSection />
    </main>
  );
}
