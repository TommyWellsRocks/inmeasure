"use client";

import { useState } from "react";
import { getSeatsPrice } from "~/utils/pricingFunctions";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import type { SeatOption } from "~/server/types/InMeasure";

export function Seats({
  priceSetter,
  defaultSeats,
}: {
  priceSetter: React.Dispatch<
    React.SetStateAction<{
      "Standard Analytics": number;
      "Session Recordings": number;
      Seats: number;
    }>
  >;
  defaultSeats: SeatOption;
}) {
  const [seats, setSeats] = useState<SeatOption>(defaultSeats);

  return (
    <div className="flex items-center justify-between gap-x-4">
      <span className="w-[200px]">Seats</span>
      <Select
        onValueChange={(e) => {
          setSeats(e as SeatOption);
          priceSetter((state) => ({
            ...state,
            Seats: getSeatsPrice(e as SeatOption),
          }));
        }}
        value={seats}
      >
        <SelectTrigger className="h-auto w-[12ch] border-none text-xs">
          <SelectValue placeholder={defaultSeats} />
        </SelectTrigger>
        <SelectContent className="w-[12ch] border-none text-xs">
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="Unlimited">Unlimited</SelectItem>
        </SelectContent>
      </Select>
      <span className="w-24">Seat</span>
    </div>
  );
}
