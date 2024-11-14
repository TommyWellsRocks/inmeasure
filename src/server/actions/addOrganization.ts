"use server";

import { redirect } from "next/navigation";
import {
  addOrganizationAndAssignUser,
  isExistingDomain,
} from "../db/queries/addOrganization";
import type { AnalyticsLevelType } from "../types/tiers";

export async function addOrganization(
  userId: string,
  name: string,
  domain: string,
  tier: AnalyticsLevelType,
) {
  await addOrganizationAndAssignUser(userId, name, domain, tier);
  return redirect("/");
}

export async function isOrganizationDomain(domain: string) {
  return await isExistingDomain(domain);
}
