const platformFeatures = [
  {
    feature: "Copy-Paste Installation",
    benefit: "Copy a snippet from our site to yours, then you're done.",
  },
  {
    feature: "Advanced Analytics Dashboard",
    benefit: "Comprehensive yet intuitive data review.",
  },
  {
    feature: "Real-time Data Streaming",
    benefit: "Review real time data for real time decisions.",
  },
  {
    feature: "Flexible Reporting",
    benefit: "Look at reports you actually care about.",
  },
  {
    feature: "API Access",
    benefit: "Integrate with the tools you already use.",
  },
];

export function PlatformFeatures() {
  return (
    <section
      id="platform"
      className="flex flex-col items-center gap-y-4"
    >
      <span className="text-lg font-bold text-zinc-400">Platform</span>

      <div className="flex flex-wrap justify-center gap-2">
        {platformFeatures.map((item, index) => (
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
