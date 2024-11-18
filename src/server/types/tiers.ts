export const scripts = {
  bronze: "public/scripts/listener/bronzeScript.js",
  silver: "public/scripts/listener/silverScript.js",
  gold: "public/scripts/listener/goldScript.js",
};

export type AnalyticsLevelType = "bronze" | "silver" | "gold";

export const tierSeats = {
  bronze: 2,
  silver: 5,
  gold: Infinity,
};
