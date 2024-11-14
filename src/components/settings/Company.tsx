"use client";

import { useCompany } from "~/hooks/useCompany";
import { tierSeats } from "~/server/types/tiers";

import { Section } from "../Section";
import { SectionHeader } from "../SectionHeader";
import { SettingsItem } from "./SettingsItem";
import { Seats } from "./Seats";

export function Company() {
  const company = useCompany((state) => state.company);
  const client = company?.client;
  return (
    <Section id="company">
      <SectionHeader text="Company" />
      <SettingsItem name="Company" value={client?.companyName || "None"} />

      <SettingsItem name="Tier" value={client?.tier || "None"} />

      <div className="flex flex-col gap-y-0">
        <SettingsItem name="API Key" value={client?.apiKey || "None"} />
        <span className="text-xs text-zinc-400">**Do NOT Share This**</span>
      </div>

      <Seats tierMaxSeats={client?.tier ? tierSeats[client?.tier] : 0} />
    </Section>
  );
}
