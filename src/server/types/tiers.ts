export const scripts = {
  bronze: "/scripts/listener/bronzeScript.js",
  silver: "/scripts/listener/silverScript.js",
  gold: "/scripts/listener/goldScript.js",
};

export type AnalyticsLevelType = "bronze" | "silver" | "gold";

export const tierSeats = {
  bronze: 2,
  silver: 5,
  gold: Infinity,
};
