const items = [
  {
    feature: "Web Analytics",
    simplyPut: "Visitor Info",
    description:
      "Record info about the user. Such as traffic source, pages visited, duration of visit and much more.",
  },
  {
    feature: "Product Analytics",
    simplyPut: "Site Performance Info",
    description:
      "Record how your site performed during the user's visit. Such as page load, layout shifting, resource load times, etc.",
  },
  {
    feature: "Session Replay & Heatmap",
    simplyPut: "Video replay of the user's visit",
    description:
      "Record the user's visit. Watch user click, input, scroll, navigate to and from the site, etc.",
  },
  {
    feature: "Analytics History",
    simplyPut: "How long we save your analytics",
    description:
      "Control how long you need to review your history and gain insights.",
  },
  {
    feature: "Seats",
    simplyPut: "How many people see your analytics",
    description:
      "Control how many organization members can access your analytics data.",
  },
];

function FeatureItem({
  feature,
  simplyPut,
  description,
}: {
  feature: string;
  simplyPut: string;
  description: string;
}) {
  return (
    <div className="flex w-[350px] flex-col gap-y-2 rounded-md bg-zinc-800 p-4 hover:shadow-md hover:shadow-zinc-600">
      <div className="flex flex-col">
        <span className="text-xl font-medium">{feature}</span>
        <span className="text-sm font-light text-zinc-300">({simplyPut})</span>
      </div>
      <span className="text-sm font-light text-zinc-400">{description}</span>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="flex flex-col items-center gap-y-4">
      <span className="text-3xl font-bold">Analytics Tailored To You</span>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item, index) => (
          <FeatureItem {...item} key={index} />
        ))}
      </div>
    </section>
  );
}

// Pricing (Single Page Calculator)::::
// Web Analytics (Visitors Basic Info): Scroll Count
// Product Analytics (Load): Scroll Count
// Session Replays: Scroll Count
// History: Scroll Count
// Seats: Scroll Count
