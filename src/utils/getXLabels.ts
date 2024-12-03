import { timeToMS } from "./timeToMS";

export function getXLabels(minDate: number, maxDate: number) {
  const td = maxDate - minDate;
  // Years
  if (td >= timeToMS(1, "years")) {
    return [];
  }
  // Months
  else if (td >= timeToMS(1, "months")) {
    return [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  }
  // Weeks (30 Days)
  else if (td >= timeToMS(7, "days")) {
    return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
  }
  // Days ()
  else if (td >= timeToMS(1, "days")) {
    return [];
  }
  // Hours (24 Hours)
  else if (td >= timeToMS(1, "hours")) {
    return Array.from({ length: 24 }, (_, i) => `${i + 1}`);
  }
  // Minutes (60 minutes)
  else if (td >= timeToMS(1, "minutes")) {
    return Array.from({ length: 60 }, (_, i) => `${i + 1}`);
  }
}
