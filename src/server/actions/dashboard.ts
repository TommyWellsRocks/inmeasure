"use server";

import { getTheDashboardData } from "../db/queries/dashboard";

export async function getDashboardData(organizationId: string) {
  return await getTheDashboardData(organizationId);
}
