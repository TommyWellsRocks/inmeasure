"use client";

import { useState } from "react";
import { commafyNums } from "~/utils/commafyNums";
import { getStandardAnalyticsPrice } from "~/utils/pricingFunctions";

export function StandardAnalytics({
  defaultCount,
  priceSetter,
}: {
  defaultCount: number;
  priceSetter: React.Dispatch<
    React.SetStateAction<{
      "Standard Analytics": number;
      "Session Recordings": number;
      Seats: number;
    }>
  >;
}) {
  const [standardAnalyticsCount, setStandardAnalyticsCount] =
    useState(defaultCount);

  return (
    <div className="flex justify-between gap-x-4">
      <span className="w-[200px]">Standard Analytics</span>
      <input
        type="numeric"
        value={commafyNums(standardAnalyticsCount)}
        className="w-[12ch] rounded-sm bg-transparent bg-zinc-900 px-2 py-1 text-xs"
        onInput={(e) => {
          const newCount =
            Number(e.currentTarget.value.replaceAll(",", "")) || 0;
          setStandardAnalyticsCount(newCount);
          priceSetter((table) => ({
            ...table,
            "Standard Analytics": getStandardAnalyticsPrice(newCount),
          }));
        }}
      />
      <span className="w-24">Visitors</span>
    </div>
  );
}
