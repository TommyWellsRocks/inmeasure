import "server-only";

import { db } from "~/server/db";

export async function getUserCompanies(userId: string) {
  return await db.query.clientUsers.findMany({
    columns: { userId: true },
    where: (model, { eq }) => eq(model.userId, userId),
    with: {
      client: {
        with: {
          users: { with: { user: { columns: { email: true, name: true } } } },
        },
      },
    },
  });
}
