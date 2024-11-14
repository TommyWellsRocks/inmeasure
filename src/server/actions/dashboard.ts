"use server";

import { getDashboardData } from "../db/queries/dashboard";

export async function getSourcesAndPagesCount(organizationId: string) {
  return await getDashboardData(organizationId);
}
