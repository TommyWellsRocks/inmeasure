"use client";

import { useOrganization } from "~/hooks/useOrganization";

import { Section } from "~/components/Section";
import { SectionHeader } from "~/components/SectionHeader";

import {
  getPlaybackAnalyticsPrice,
  getSeatsPrice,
  getStandardAnalyticsPrice,
} from "~/utils/pricingFunctions";

import type { SeatOption } from "~/server/types/InMeasure";

export function Billing() {
  const organization = useOrganization((state) => state.organization);
  const org = organization?.organization;
  return (
    <Section id="billing">
      <SectionHeader text="Billing" />
      {org ? (
        <span className="text-sm text-zinc-400">
          Total Max Spend: $
          {(
            getStandardAnalyticsPrice(org.standardScriptLimit) +
            getPlaybackAnalyticsPrice(org.playbackScriptLimit) +
            getSeatsPrice(
              org.seatsLimit === 0
                ? "Unlimited"
                : (String(org.seatsLimit) as SeatOption),
            )
          ).toFixed(2)}
        </span>
      ) : null}
    </Section>
  );
}
