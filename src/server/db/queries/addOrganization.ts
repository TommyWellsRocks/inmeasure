import "server-only";

import { db } from "~/server/db";

import type { AnalyticsLevelType } from "~/server/types/tiers";
import { organizations, organizationUsers } from "../schema";
import { getDomain } from "~/utils/getDomain";

export async function addOrganizationAndAssignUser(
  userId: string,
  name: string,
  domain: string,
  tier: AnalyticsLevelType,
) {
  const cleanDomain = getDomain(domain);

  await db.transaction(async (tx) => {
    const newOrganization = await tx
      .insert(organizations)
      .values({ domain: cleanDomain, organizationName: name, tier })
      .returning({ id: organizations.id });
    if (newOrganization.at(0))
      await tx
        .insert(organizationUsers)
        .values({ userId, organizationId: newOrganization[0]!.id });
  });
}

export async function isExistingDomain(domain: string) {
  const existingOrganization = await db.query.organizations.findFirst({
    columns: { id: true },
    where: (model, { eq }) => eq(model.domain, domain),
  });
  return existingOrganization ? true : false;
}
