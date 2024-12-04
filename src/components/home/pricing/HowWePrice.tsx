import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { commafyNums } from "~/utils/commafyNums";

import {
  playbackAnalyticsPrices,
  seatPrices,
  standardAnalyticsPrices,
} from "~/server/types/InMeasure";

export function HowWePrice() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="rounded-sm bg-zinc-800 px-2 py-1 text-end text-xs shadow shadow-md shadow-zinc-300 hover:text-zinc-400">
          How we calculate this
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Standard Analytics</span>
            <div className="grid grid-cols-2 text-xs">
              <span>Visitors</span>
              <span>Cost Per Visitor</span>
              {standardAnalyticsPrices.map((tier) => (
                <>
                  <span>{`< ${commafyNums(tier.limit)}`}</span>
                  <span>$ {tier.pricePer}</span>
                </>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">Playback Analytics</span>
            <div className="grid grid-cols-2 text-xs">
              <span>Visitors</span>
              <span>Cost Per Visitor</span>
              {playbackAnalyticsPrices.map((tier) => (
                <>
                  <span>{`< ${commafyNums(tier.limit)}`}</span>
                  <span>$ {tier.pricePer}</span>
                </>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">Seats</span>
            <div className="grid grid-cols-2 text-xs">
              <span>Seats</span>
              <span>Cost</span>
              {Object.entries(seatPrices).map(([limit, price]) => (
                <>
                  <span>{limit}</span>
                  <span>$ {price}</span>
                </>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
