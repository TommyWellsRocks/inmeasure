import { timeToMS } from "~/utils/timeToMS";

export function TotalVisitorsTable({
  connectionTimestamps,
}: {
  connectionTimestamps: number[];
}) {
  let currentActiveUsers = 0;
  let prev10MinUsers = 0;
  let prevHourUsers = 0;
  let prev24HourUsers = 0;
  let prev7DayUsers = 0;
  let prev30DayUsers = 0;
  let prev6MonthUsers = 0;
  let prev1YearUsers = 0;

  const now = Date.now();

  connectionTimestamps.forEach((timestamp) => {
    const howLongAgo = now - timestamp;

    // If in the 30 seconds, activeUsere
    if (howLongAgo <= timeToMS(30, "seconds")) {
      currentActiveUsers++;
      prev10MinUsers++;
      prevHourUsers++;
      prev24HourUsers++;
      prev7DayUsers++;
      prev30DayUsers++;
      prev6MonthUsers++;
      prev1YearUsers++;
      // If in the last 10 minutes
    } else if (howLongAgo <= timeToMS(10, "minutes")) {
      prev10MinUsers++;
      prevHourUsers++;
      prev24HourUsers++;
      prev7DayUsers++;
      prev30DayUsers++;
      prev6MonthUsers++;
      prev1YearUsers++;
    }
    // In the last hour
    else if (howLongAgo <= timeToMS(1, "hours")) {
      prevHourUsers++;
      prev24HourUsers++;
      prev7DayUsers++;
      prev30DayUsers++;
      prev6MonthUsers++;
      prev1YearUsers++;
    }
    // In the last 24 hours
    else if (howLongAgo <= timeToMS(1, "days")) {
      prev24HourUsers++;
      prev7DayUsers++;
      prev30DayUsers++;
      prev6MonthUsers++;
      prev1YearUsers++;
    }
    // In the last 7 days
    else if (howLongAgo <= timeToMS(7, "days")) {
      prev7DayUsers++;
      prev30DayUsers++;
      prev6MonthUsers++;
      prev1YearUsers++;
    }
    // In the last 30 days
    else if (howLongAgo <= timeToMS(30, "days")) {
      prev30DayUsers++;
      prev6MonthUsers++;
      prev1YearUsers++;
    }
    // In the last 6 months
    else if (howLongAgo <= timeToMS(6, "months")) {
      prev6MonthUsers++;
      prev1YearUsers++;
    }
    // In the last year
    else if (howLongAgo <= timeToMS(1, "years")) {
      prev1YearUsers++;
    }
  });

  const items = [
    { col1: "Online", col2: currentActiveUsers },
    { col1: "Last 10 Minutes", col2: prev10MinUsers },
    { col1: "Last Hour", col2: prevHourUsers },
    { col1: "Last 24 Hours", col2: prev24HourUsers },
    { col1: "Last 7 Days", col2: prev7DayUsers },
    { col1: "Last 30 Days", col2: prev30DayUsers },
    { col1: "Last 6 Months", col2: prev6MonthUsers },
    { col1: "Last 1 Year", col2: prev1YearUsers },
  ];

  return (
    <section className="flex w-full max-w-[320px] flex-col gap-y-2">
      <span className="text-xl font-medium">Total Users</span>

      <div className="grid grid-cols-2 gap-x-6">
        {items.map((item) => (
          <>
            <span>{item.col1}</span>
            <span>{item.col2}</span>
          </>
        ))}
      </div>
    </section>
  );
}
