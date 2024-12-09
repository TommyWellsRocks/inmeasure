const analyticsFeatures = [
  {
    feature: "Behavior Analytics",
    benefit:
      "Monitor Heatmaps, User Flows, Events, Bounce Rates, Pageviews, Duration, and more to maximize goal completions and experiences.",
  },
  {
    feature: "Performance Analytics",
    benefit:
      "Optimize load and specific resource speed metrics to improve SEO.",
  },
  {
    feature: "Geographic Analytics",
    benefit: "Monitor and tailor user experience's regionally.",
  },
  {
    feature: "Device And Browser Analytics",
    benefit:
      "Ensure an enjoyable experience no matter your user's device or browser preferences.",
  },
  {
    feature: "Conversion Analytics",
    benefit: "Track goal completions with proper conversion data.",
  },
  {
    feature: "Funnel Analytics",
    benefit: "Pinpoint user drop off, to optimize for goal completions.",
  },
];

export function AnalyticsFeatures() {
  return (
    <section id="analytics" className="flex flex-col items-center gap-y-4">
      <span className="text-lg font-bold text-zinc-400">Analytics</span>

      <div className="flex flex-wrap justify-center gap-2">
        {analyticsFeatures.map((item, index) => (
          <div
            key={index}
            className="flex min-h-[150px] w-[350px] flex-col justify-center gap-y-2 rounded-md bg-zinc-800 p-4 hover:shadow-md hover:shadow-zinc-600"
          >
            <div className="flex items-center gap-x-5">
              {/* <item.Icon /> */}
              <span className="text-xl font-medium">{item.feature}</span>
            </div>
            <span className="text-sm font-light text-zinc-400">
              {item.benefit}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
