export const scripts = {
  bronze: "data/scripts/listener/bronzeScript.js",
  silver: "data/scripts/listener/silverScript.js",
  gold: "data/scripts/listener/goldScript.js",
};

export type AnalyticsLevelType = "bronze" | "silver" | "gold";

export const tierSeats = {
  bronze: 2,
  silver: 5,
  gold: Infinity,
};
