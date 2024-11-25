import Image from "next/image";

const items = [
  {
    feature: "Standard Analytics",
    simplyPut: "Visitor Info",
    description:
      "Record info about the user. Such as traffic source, pages visited, duration of visit and much more.",
    img: "",
  },
  // {
  //   feature: "Product Analytics",
  //   simplyPut: "Site Performance Info",
  //   description:
  //     "Record how your site performed during the user's visit. Such as page load, layout shifting, resource load times, etc.",
  // },
  {
    feature: "Session Replay & Heatmap",
    simplyPut: "Video replay of the user's visit",
    description:
      "Record the user's visit. Watch user click, input, scroll, navigate to and from the site, etc.",
    img: "",
  },
  // {
  //   feature: "Review Analytics Over Time",
  //   simplyPut: "Find insights in custom time frames",
  //   description:
  //     "From day 1, you can watch your real time analytics.",
  // },
  // {
  //   feature: "Seats",
  //   simplyPut: "How many people see your analytics",
  //   description:
  //     "Control how many organization members can access your analytics data.",
  // },
];

function FeatureItem({
  feature,
  simplyPut,
  description,
  img,
}: {
  feature: string;
  simplyPut: string;
  description: string;
  img: string;
}) {
  return (
    <div className="flex w-[350px] flex-col gap-y-2 rounded-md bg-zinc-800 p-4 hover:shadow-md hover:shadow-zinc-600">
      <div className="flex flex-col">
        <span className="text-xl font-medium">{feature}</span>
        <span className="text-sm font-light text-zinc-300">({simplyPut})</span>
      </div>
      <span className="text-sm font-light text-zinc-400">{description}</span>
      <Image src={img} alt={`${feature} Example Image`} height={100} width={100} />
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="flex flex-col items-center gap-y-4">
      <span className="text-3xl font-bold">All In Time All In Measure</span>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((item, index) => (
          <FeatureItem {...item} key={index} />
        ))}
      </div>
    </section>
  );
}
