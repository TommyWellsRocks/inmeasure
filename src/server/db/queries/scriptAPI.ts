import "server-only";

import { db } from "~/server/db";
import { connectionEntries } from "../schema";

export async function authorizeAndCreateConnection(
  domain: string,
  apiKey: string,
) {
  const authResponse = await db.transaction(async (tx) => {
    const organization = await tx.query.organizations.findFirst({
      columns: { id: true, tier: true },
      where: (model, { and, eq }) =>
        and(eq(model.apiKey, apiKey), eq(model.domain, domain)),
    });
    if (organization?.tier) {
      const startEntries = await tx
        .insert(connectionEntries)
        .values({
          organizationId: organization.id,
        })
        .returning({ connectionId: connectionEntries.connectionId });

      const organizationTier = organization.tier;
      const connectionId = startEntries.at(0)?.connectionId!;

      return { organizationTier, connectionId };
    }
  });

  return authResponse;
}
