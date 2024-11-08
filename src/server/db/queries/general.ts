import "server-only";

import { db } from "~/server/db";

export async function getUserClients(userId: string) {
  return await db.query.clientUsers.findMany({
    columns: { id: true },
    where: (model, { eq }) => eq(model.userId, userId),
    with: {
      client: { columns: { id: true, companyName: true, domain: true } },
    },
  });
}
