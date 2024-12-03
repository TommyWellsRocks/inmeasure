"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";

import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";
import { format } from "date-fns";

export function DatePicker({
  minTimestamp,
  maxTimestamp,
  setMinTimestamp,
  setMaxTimestamp,
}: {
  minTimestamp: number;
  maxTimestamp: number;
  setMinTimestamp: React.Dispatch<React.SetStateAction<number>>;
  setMaxTimestamp: React.Dispatch<React.SetStateAction<number>>;
}) {
  const fromDate = new Date(minTimestamp);
  const toDate = new Date(maxTimestamp);

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild className="bg-zinc-800">
          <Button
            id="date"
            className={cn(
              "justify-start text-left font-normal",
              !toDate && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {fromDate ? (
              toDate ? (
                <>
                  {format(fromDate, "LLL dd, y")} -{" "}
                  {format(toDate, "LLL dd, y")}
                </>
              ) : (
                format(fromDate, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={fromDate}
            selected={{
              from: fromDate,
              to: toDate,
            }}
            onSelect={(e) => {
              e?.from ? setMinTimestamp(e.from.valueOf()) : null;
              e?.to ? setMaxTimestamp(e.to.valueOf()) : null;
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
