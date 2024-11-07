import "server-only";

import { db } from "~/server/db";
import { connectionEntries } from "../schema";

export async function authorizeAndCreateConnection(
  domain: string,
  apiKey: string,
) {
  const authResponse = await db.transaction(async (tx) => {
    const client = await tx.query.clients.findFirst({
      columns: { id: true, tier: true },
      where: (model, { and, eq }) =>
        and(eq(model.apiKey, apiKey), eq(model.domain, domain)),
    });
    if (client?.tier) {
      const startEntries = await tx
        .insert(connectionEntries)
        .values({
          clientId: client.id,
        })
        .returning({ connectionId: connectionEntries.connectionId });

      const clientTier = client.tier;
      const connectionId = startEntries.at(0)?.connectionId!;

      return { clientTier, connectionId };
    }
  });

  return authResponse;
}
