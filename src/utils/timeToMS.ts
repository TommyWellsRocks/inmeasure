type timeType = "seconds" | "minutes" | "hours" | "days" | "months" | "years";

export function timeToMS(toTime: number, toType: timeType) {
  switch (toType) {
    case "seconds":
      return toTime * 1000;
    case "minutes":
      return toTime * 60000;
    case "hours":
      return toTime * 3.6e6;
    case "days":
      return toTime * 8.64e7;
    case "months":
      return toTime * 2.628e9;
    case "years":
      return toTime * 3.154e10;
  }
}
