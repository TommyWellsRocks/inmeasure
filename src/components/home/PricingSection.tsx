"use client";

import { useState } from "react";
import { commafyNums } from "~/utils/commafyNums";
import {
  getReplayPrice,
  getStandardAnalyticsPrice,
} from "~/utils/pricingFunctions";

// Seats
// 1 (Free)
// 5 ($50 / month)
// 10 ($75 / month)
// Unlimited ($300 / month)

function PriceItem({
  name,
  defaultItemCount,
  priceSetter,
  priceFunc,
}: {
  name: "Standard Analytics" | "Session Recordings";
  defaultItemCount: number;
  priceSetter: React.Dispatch<
    React.SetStateAction<{
      "Standard Analytics": number;
      "Session Recordings": number;
    }>
  >;
  priceFunc: (visitorCount: number) => number;
}) {
  const [itemCount, setItemCount] = useState(defaultItemCount);
  return (
    <div className="flex justify-between gap-x-4">
      <span className="w-[200px]">{name}</span>
      <input
        type="numeric"
        value={commafyNums(itemCount)}
        className="w-[12ch] rounded-sm bg-transparent bg-zinc-900 px-2 py-1 text-xs"
        onInput={(e) => {
          const newCount =
            Number(e.currentTarget.value.replaceAll(",", "")) || 0;
          setItemCount(newCount);
          priceSetter((table) => ({ ...table, [name]: priceFunc(newCount) }));
        }}
      />
      <span className="w-24">Visitors</span>
    </div>
  );
}

export function PricingSection() {
  const DEFAULT_STANDARD_ANALYTICS_COUNT = 10_000;
  const DEFAULT_REPLAY_COUNT = 1_000;
  const [priceTable, setPriceTable] = useState({
    "Standard Analytics": getStandardAnalyticsPrice(
      DEFAULT_STANDARD_ANALYTICS_COUNT,
    ),
    "Session Recordings": getReplayPrice(DEFAULT_REPLAY_COUNT),
  });

  const totalPrice = Object.values(priceTable)
    .reduce((total, item) => total + item, 0)
    .toLocaleString();

  return (
    <section
      id="pricing"
      className="mx-auto flex w-full max-w-[500px] flex-col gap-y-4"
    >
      <span className="text-3xl font-semibold">Pricing</span>
      <div className="ml-4 flex w-full flex-col gap-y-2">
        <PriceItem
          name="Standard Analytics"
          defaultItemCount={DEFAULT_STANDARD_ANALYTICS_COUNT}
          priceSetter={setPriceTable}
          priceFunc={getStandardAnalyticsPrice}
        />
        <PriceItem
          name="Session Recordings"
          defaultItemCount={DEFAULT_REPLAY_COUNT}
          priceSetter={setPriceTable}
          priceFunc={getReplayPrice}
        />

        <div className="flex justify-between gap-x-4">
          <span className="w-[200px]">Seats</span>
          <span>1</span>
          <span className="w-24">Seat</span>
        </div>

        <div className="flex justify-between gap-x-4">
          <span className="w-[200px]">History</span>
          <span>7</span>
          <span className="w-24">Years</span>
        </div>

        <div className="flex justify-between">
          <span>Total</span>
          <span>${totalPrice}</span>
        </div>
      </div>
    </section>
  );
}
