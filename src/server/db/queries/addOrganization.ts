import "server-only";

import { db } from "~/server/db";
import { organizations, organizationUsers } from "../schema";
import { getDomain } from "~/utils/getDomain";

import type { SeatOption } from "~/server/types/InMeasure";

export async function addOrganizationAndAssignUser(
  userId: string,
  name: string,
  domain: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: SeatOption,
) {
  const cleanDomain = getDomain(domain);

  const seats = seatsLimit === "Unlimited" ? 0 : Number(seatsLimit);

  try {
    await db.transaction(async (tx) => {
      const newOrganization = await tx
        .insert(organizations)
        .values({
          domain: cleanDomain,
          organizationName: name,
          standardScriptLimit,
          playbackScriptLimit,
          seatsLimit: seats,
        })
        .returning({ id: organizations.id });
      const newOrgId = newOrganization[0]?.id;
      if (newOrgId)
        await tx
          .insert(organizationUsers)
          .values({ userId, organizationId: newOrgId });
    });
  } catch (err: any) {
    console.error(err.message);
    return { err: "Error adding organization to DB. " };
  }
  return { err: null };
}

export async function isExistingDomain(domain: string) {
  try {
    const existingOrganization = await db.query.organizations.findFirst({
      columns: { id: true },
      where: (model, { eq }) => eq(model.domain, domain),
    });
    return { value: existingOrganization ? true : false, err: null };
  } catch (err: any) {
    console.error(err.message);
    return { value: null, err: "Error validating domain in DB." };
  }
}
