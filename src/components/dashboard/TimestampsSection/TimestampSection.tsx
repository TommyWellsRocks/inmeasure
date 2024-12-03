"use client";

import { LineChart } from "./LineChart";
import { TotalVisitorsTable } from "../TotalVisitorsTable";
import { useState } from "react";
import { timeToMS } from "~/utils/timeToMS";
import { DatePicker } from "./DatePicker";

export function TimestampSection({
  connectionTimestamps,
}: {
  connectionTimestamps: number[];
}) {
  const [minTimestamp, setMinTimestamp] = useState(
    Date.now() - timeToMS(7, "days"),
  );
  const [maxTimestamp, setMaxTimestamp] = useState(
    Date.now() + timeToMS(1, "days"),
  );

  const xDates: string[] = [];

  // Initialize timestampTally as "Aug 12" = 0;
  const timestampTally: Record<string, number> = {};
  for (
    let ts = minTimestamp;
    formatDate(ts) !== formatDate(maxTimestamp);
    ts += timeToMS(1, "days")
  ) {
    const fd = formatDate(ts);
    timestampTally[fd] = 0;
    xDates.push(fd);
  }
  // Put Timestamps Within Window To Timestamp Tally
  const targetTimestamps = connectionTimestamps
    .filter((ts) => maxTimestamp >= ts && minTimestamp <= ts)
    .reduce((score, ts) => {
      // Get date of ts
      const formattedDate = formatDate(ts);
      score[formattedDate] = (score[formattedDate] || 0) + 1;
      return score;
    }, timestampTally);

  return (
    <section className="flex w-full flex-col gap-y-10">
      <div className="flex justify-end">
        <DatePicker
          minTimestamp={minTimestamp}
          maxTimestamp={maxTimestamp}
          setMinTimestamp={setMinTimestamp}
          setMaxTimestamp={setMaxTimestamp}
        />
      </div>

      <div className="flex w-full flex-col justify-center gap-y-5 text-sm md:max-h-[450px] md:flex-row md:gap-x-10 md:text-base">
        <div className="flex flex-col items-start">
          <TotalVisitorsTable connectionTimestamps={connectionTimestamps} />
        </div>
        {/* X:Time Y:Count */}
        <div className="w-full max-w-[1000px]">
          <LineChart xLabels={xDates} data={Object.values(targetTimestamps)} />
        </div>
      </div>
    </section>
  );
}

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
  });
}
