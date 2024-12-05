import {
  type SeatOption,
  playbackAnalyticsPrices,
  seatPrices,
  standardAnalyticsPrices,
} from "~/server/types/InMeasure";

export function getStandardAnalyticsPrice(visitorCount: number) {
  const tier = standardAnalyticsPrices.find(
    ({ limit }) => visitorCount < limit,
  )!;

  return tier.pricePer * visitorCount;
}

export function getPlaybackAnalyticsPrice(visitorCount: number) {
  const tier = playbackAnalyticsPrices.find(
    ({ limit }) => visitorCount < limit,
  )!;

  return tier.pricePer * visitorCount;
}

export function getSeatsPrice(seatCount: SeatOption) {
  return seatPrices[seatCount];
}
