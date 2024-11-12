"use server";

import { redirect } from "next/navigation";
import { addCompanyAndAssignUser, isExistingDomain } from "../db/queries/addCompany";
import type { AnalyticsLevelType } from "../types/scripts";

export async function addCompany(
  userId: string,
  name: string,
  domain: string,
  tier: AnalyticsLevelType,
) {
  await addCompanyAndAssignUser(userId, name, domain, tier);
  return redirect("/");
}

export async function isCompanyDomain(domain: string) {
  return await isExistingDomain(domain);
}
