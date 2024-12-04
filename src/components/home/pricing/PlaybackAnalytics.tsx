"use client";

import { useState } from "react";
import { commafyNums } from "~/utils/commafyNums";
import { getPlaybackAnalyticsPrice } from "~/utils/pricingFunctions";

export function PlaybackAnalytics({
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
  const [playbackAnalyticsCount, setPlaybackAnalyticsCount] =
    useState(defaultCount);

  return (
    <div className="flex justify-between gap-x-4">
      <span className="w-[200px]">Playback Analytics</span>
      <input
        type="numeric"
        value={commafyNums(playbackAnalyticsCount)}
        className="w-[12ch] rounded-sm bg-transparent bg-zinc-900 px-2 py-1 text-xs"
        onInput={(e) => {
          const newCount =
            Number(e.currentTarget.value.replaceAll(",", "")) || 0;
          setPlaybackAnalyticsCount(newCount);
          priceSetter((table) => ({
            ...table,
            "Session Recordings": getPlaybackAnalyticsPrice(newCount),
          }));
        }}
      />
      <span className="w-24">Visitors</span>
    </div>
  );
}
