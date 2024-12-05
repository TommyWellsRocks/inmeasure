"use server";

import { redirect } from "next/navigation";
import {
  addOrganizationAndAssignUser,
  isExistingDomain,
} from "../db/queries/addOrganization";

import type { SeatOption } from "../types/InMeasure";

export async function addOrganization(
  userId: string,
  name: string,
  domain: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: SeatOption,
) {
  await addOrganizationAndAssignUser(
    userId,
    name,
    domain,
    standardScriptLimit,
    playbackScriptLimit,
    seatsLimit,
  );
  return redirect("/");
}

export async function isOrganizationDomain(domain: string) {
  return await isExistingDomain(domain);
}
