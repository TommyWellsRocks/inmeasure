"use client";

import { useOrganization } from "~/hooks/useOrganization";

import { Section } from "../Section";
import { SectionHeader } from "../SectionHeader";
import { SettingsItem } from "./SettingsItem";
import { Seats } from "./Seats";

export function Organization() {
  const organization = useOrganization((state) => state.organization);
  const org = organization?.organization;
  return (
    <Section id="organization">
      <SectionHeader text="Organization" />
      <SettingsItem
        name="Organization"
        value={org?.organizationName || "None"}
      />

      <SettingsItem name="Tier" value={"None"} />

      <div className="flex flex-col gap-y-0">
        <SettingsItem name="API Key" value={org?.apiKey || "None"} />
        <span className="text-xs text-zinc-400">**Do NOT Share This**</span>
      </div>

      <Seats tierMaxSeats={0} />
    </Section>
  );
}
