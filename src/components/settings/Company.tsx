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
      {client ? (
        <>
          <SettingsItem name="Company" value={client.companyName} />

          <SettingsItem name="Tier" value={client.tier} />

          <div className="flex flex-col gap-y-0">
            <SettingsItem name="API Key" value={client.apiKey} />
            <span className="text-xs text-zinc-400">**Do NOT Share This**</span>
          </div>

          <Seats tierMaxSeats={tierSeats[client.tier]} />
        </>
      ) : (
        <span>Create a company!</span>
        // ! Something Here
      )}
    </Section>
  );
}
