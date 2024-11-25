import "server-only";

import { db } from "~/server/db";
import { organizations, organizationUsers } from "../schema";
import { getDomain } from "~/utils/getDomain";

export async function addOrganizationAndAssignUser(
  userId: string,
  name: string,
  domain: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: number,
) {
  const cleanDomain = getDomain(domain);

  await db.transaction(async (tx) => {
    const newOrganization = await tx
      .insert(organizations)
      .values({
        domain: cleanDomain,
        organizationName: name,
        standardScriptLimit,
        playbackScriptLimit,
        seatsLimit,
      })
      .returning({ id: organizations.id });
    const newOrgId = newOrganization[0]?.id;
    if (newOrgId)
      await tx
        .insert(organizationUsers)
        .values({ userId, organizationId: newOrgId });
  });
}

export async function isExistingDomain(domain: string) {
  const existingOrganization = await db.query.organizations.findFirst({
    columns: { id: true },
    where: (model, { eq }) => eq(model.domain, domain),
  });
  return existingOrganization ? true : false;
}
