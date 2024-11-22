"use client";

import { useState } from "react";
import { commafyNums } from "~/utils/commafyNums";

// const pricingItems = [
//   {
//     name: "Web Analytics",
//     defaultItemCount: 10_000,
//     valueOf: "visitors",
//     pricePer: 0.01,
//   },
//   {
//     name: "Product Analytics",
//     defaultItemCount: 5_000,
//     valueOf: "visitors",
//     pricePer: 0.01,
//   },
//   {
//     name: "Session Replay & Heatmap",
//     defaultItemCount: 5_000,
//     valueOf: "visitors",
//     pricePer: 0.01,
//   },
//   {
//     name: "Analytics History",
//     pricePer: 300, // per TB
//   },
// ];

//
// Duration
// IP Address
// User Browser Info
// Load Time
// Button clicks
//

// Web Analytics (No Personal Identity info)
// -10,000    Visitors ($ FREE  / Visitor)
// -20,000    Visitors ($.00500 / Visitor)
// -150,000   Visitors ($.00343 / Visitor)
// -500,000   Visitors ($.00295 / Visitor)
// -1,000,000 Visitors ($.00218 / Visitor)
// -2,500,000 Visitors ($.0015  / Visitor)
// +          Visitors ($.0009  / Visitor)

// Product Analytics (email) (filter by specific user)
// -10,000    Visitors ($ FREE  / Visitor)
// -20,000    Visitors ($.02480 / Visitor)
// -150,000   Visitors ($.00343 / Visitor)
// -500,000   Visitors ($.00295 / Visitor)
// -1,000,000 Visitors ($.00218 / Visitor)
// -2,500,000 Visitors ($.0015  / Visitor)
// +          Visitors ($.0009  / Visitor)

// Session Replay & Heatmap
//

// History
// 300 Per TB of data

// Seats
// 1 (Free)
// 5 ($50 / month)
// 10 ($75 / month)
// Unlimited ($300 / month)

function PriceItem({
  name,
  defaultItemCount,
  valueOf,
  pricePer,
  priceSetter,
}: {
  name: string;
  defaultItemCount: number;
  valueOf: string;
  pricePer: number;
  priceSetter: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}) {
  const [itemCount, setItemCount] = useState(defaultItemCount);
  return (
    <div className="flex gap-x-4">
      <span className="w-[200px]">{name}</span>
      <input
        type="numeric"
        value={commafyNums(itemCount)}
        className="w-[12ch] rounded-sm bg-transparent bg-zinc-900 px-2 py-1 text-xs"
        onInput={(e) => {
          const newCount =
            Number(e.currentTarget.value.replaceAll(",", "")) || 0;
          setItemCount(newCount);
          priceSetter((table) => ({ ...table, [name]: newCount * pricePer }));
        }}
      />
      <span className="w-24">{valueOf}</span>
    </div>
  );
}

export function PricingSection() {
  // const [priceTable, setPriceTable] = useState(
  //   pricingItems.reduce(
  //     (total, item) => {
  //       total[item.name] = item.defaultItemCount * item.pricePer;
  //       return total;
  //     },
  //     {} as Record<string, number>,
  //   ),
  // );

  // const totalPrice = Object.values(priceTable)
  //   .reduce((total, item) => total + item, 0)
  //   .toLocaleString();

  const totalPrice = 0;
  return (
    <section
      id="pricing"
      className="mx-auto flex w-full max-w-[60%] flex-col gap-y-4"
    >
      <span className="text-3xl font-semibold">Pricing</span>
      {/* {pricingItems.map((item, index) => (
        <PriceItem {...item} priceSetter={setPriceTable} key={index} />
      ))} */}

      <div className="flex justify-between">
        <span>Total</span>
        <span>${totalPrice}</span>
      </div>
    </section>
  );
}
