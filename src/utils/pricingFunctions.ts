export function getWebAnalyticsPrice(visitorCount: number) {
  let price = 0;
  if (visitorCount < 10_000) {
    price = visitorCount * 0.006;
  } else if (visitorCount < 20_000) {
    price = visitorCount * 0.005;
  } else if (visitorCount < 150_000) {
    price = visitorCount * 0.00343;
  } else if (visitorCount < 500_000) {
    price = visitorCount * 0.00295;
  } else if (visitorCount < 1_000_000) {
    price = visitorCount * 0.00218;
  } else if (visitorCount < 2_500_000) {
    price = visitorCount * 0.0015;
  } else if (visitorCount >= 2_500_000) {
    price = visitorCount * 0.0009;
  }
  return price;
}

export function getReplayPrice(visitorCount: number) {
  let price = 0;
  if (visitorCount < 10_000) {
    price = visitorCount * 0.0873;
  } else if (visitorCount < 20_000) {
    price = visitorCount * 0.07275;
  } else if (visitorCount < 150_000) {
    price = visitorCount * 0.04991;
  } else if (visitorCount < 500_000) {
    price = visitorCount * 0.04293;
  } else if (visitorCount < 1_000_000) {
    price = visitorCount * 0.03173;
  } else if (visitorCount < 2_500_000) {
    price = visitorCount * 0.02184;
  } else if (visitorCount >= 2_500_000) {
    price = visitorCount * 0.01311;
  }
  return price;
}