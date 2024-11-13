export const scripts = {
  bronze: "src/scripts/listener/bronzeScript.js",
  silver: "src/scripts/listener/silverScript.js",
  gold: "src/scripts/listener/goldScript.js",
};

export type AnalyticsLevelType = "bronze" | "silver" | "gold";

export const tierSeats = {
  bronze: 2,
  silver: 5,
  gold: Infinity,
};
