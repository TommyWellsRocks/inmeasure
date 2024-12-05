"use client";

import { useState } from "react";
import {
  getStandardAnalyticsPrice,
  getPlaybackAnalyticsPrice,
  getSeatsPrice,
} from "~/utils/pricingFunctions";
import { Seats } from "./Seats";
import { StandardAnalytics } from "./StandardAnalytics";
import { PlaybackAnalytics } from "./PlaybackAnalytics";
import { HowWePrice } from "./HowWePrice";

const DEFAULT_STANDARD_ANALYTICS_COUNT = 10_000;
const DEFAULT_PLAYBACK_COUNT = 1_000;
const DEFAULT_SEATS_COUNT = "1";

export function PricingSection() {
  const [priceTable, setPriceTable] = useState({
    "Standard Analytics": getStandardAnalyticsPrice(
      DEFAULT_STANDARD_ANALYTICS_COUNT,
    ),
    "Session Recordings": getPlaybackAnalyticsPrice(DEFAULT_PLAYBACK_COUNT),
    Seats: getSeatsPrice(DEFAULT_SEATS_COUNT),
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
        <StandardAnalytics
          priceSetter={setPriceTable}
          defaultCount={DEFAULT_STANDARD_ANALYTICS_COUNT}
        />

        <PlaybackAnalytics
          priceSetter={setPriceTable}
          defaultCount={DEFAULT_PLAYBACK_COUNT}
        />

        <Seats priceSetter={setPriceTable} defaultSeats={DEFAULT_SEATS_COUNT} />

        <div className="flex justify-between gap-x-4">
          <span className="w-[200px]">History</span>
          <span className="w-[12ch] pl-3 text-xs">7</span>
          <span className="w-24 text-end">Years</span>
        </div>

        <div className="flex justify-between">
          <span>Total</span>
          <span className="text-end">${totalPrice} / month</span>
        </div>

        <div className="flex items-start justify-between text-zinc-500">
          <div className="flex flex-col text-sm">
            <span>One charge, at the end of the month.</span>
            <span>Volume based pricing.</span>
            <span className="pt-2 text-xs">
              Meaning, higher visitors = lower cost per total visitor.
            </span>
          </div>
          <HowWePrice />
        </div>
      </div>
    </section>
  );
}
