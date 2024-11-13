import "server-only";

import { db } from "~/server/db";

import type { AnalyticsLevelType } from "~/server/types/tiers";
import { clients, clientUsers } from "../schema";
import { getDomain } from "~/utils/getDomain";

export async function addCompanyAndAssignUser(
  userId: string,
  name: string,
  domain: string,
  tier: AnalyticsLevelType,
) {
  const cleanDomain = getDomain(domain);

  await db.transaction(async (tx) => {
    const newClient = await tx
      .insert(clients)
      .values({ domain: cleanDomain, companyName: name, tier })
      .returning({ id: clients.id });
    if (newClient.at(0))
      await tx
        .insert(clientUsers)
        .values({ userId, clientId: newClient[0]!.id });
  });
}

export async function isExistingDomain(domain: string) {
  const existingClient = await db.query.clients.findFirst({
    columns: { id: true },
    where: (model, { eq }) => eq(model.domain, domain),
  });
  return existingClient ? true : false;
}
