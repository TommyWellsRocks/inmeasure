"use client";

import { useOrganization } from "~/hooks/useOrganization";

import { Section } from "../../Section";
import { SectionHeader } from "../../SectionHeader";
import { SettingsItem } from "../SettingsItem";
import { UpdateButton } from "./UpdateButton";
import { Seats } from "./Seats";

export function Organization() {
  const organization = useOrganization((state) => state.organization);
  const org = organization?.organization;
  return (
    <Section id="organization">
      <SectionHeader text="Organization" />

      <div className="flex items-center justify-between">
        <SettingsItem
          name="Organization"
          value={org?.organizationName || "None"}
        />

        {org ? <UpdateButton currentOrg={org} /> : null}
      </div>

      <div className="flex flex-col gap-y-0">
        <SettingsItem name="API Key" value={org?.apiKey || "None"} />
        <span className="text-xs text-zinc-400">**Do NOT Share This**</span>
      </div>

      <SettingsItem name="Analytics History" value="7 Years" />

      <SettingsItem
        name="Standard Analytics Recording Limit"
        value={String(org?.standardScriptLimit) || "None"}
      />

      <SettingsItem
        name="Playback Recording Limit"
        value={String(org?.playbackScriptLimit) || "None"}
      />

      <Seats
        maxSeats={org?.seatsLimit === 0 ? Infinity : org?.seatsLimit || 0}
      />
    </Section>
  );
}
