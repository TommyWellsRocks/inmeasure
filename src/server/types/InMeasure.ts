import { getTheDashboardData } from "../db/queries/dashboard";
import { getUserOrganizations } from "../db/queries/layout";

export type Organizations = Awaited<ReturnType<typeof getUserOrganizations>>;
export type Organization = Organizations[0];

export type DashboardConnections = Awaited<
  ReturnType<typeof getTheDashboardData>
>;

export type SeatOption = "1" | "5" | "10" | "Unlimited";

export const standardAnalyticsPrices = [
  { limit: 10_000, pricePer: 0.006 },
  { limit: 20_000, pricePer: 0.005 },
  { limit: 150_000, pricePer: 0.00343 },
  { limit: 500_000, pricePer: 0.00295 },
  { limit: 1_000_000, pricePer: 0.00218 },
  { limit: 2_500_000, pricePer: 0.0015 },
  { limit: Infinity, pricePer: 0.0009 },
];

export const playbackAnalyticsPrices = [
  { limit: 10_000, pricePer: 0.0873 },
  { limit: 20_000, pricePer: 0.07275 },
  { limit: 150_000, pricePer: 0.04991 },
  { limit: 500_000, pricePer: 0.04293 },
  { limit: 1_000_000, pricePer: 0.03173 },
  { limit: 2_500_000, pricePer: 0.02184 },
  { limit: Infinity, pricePer: 0.01311 },
];

export const seatPrices: Record<SeatOption, number> = {
  "1": 0,
  "5": 50,
  "10": 75,
  Unlimited: 300,
};
