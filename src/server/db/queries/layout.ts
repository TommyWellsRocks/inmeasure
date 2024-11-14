import "server-only";

import { db } from "~/server/db";

export async function getUserOrganizations(userId: string) {
  return await db.query.organizationUsers.findMany({
    columns: { userId: true },
    where: (model, { eq }) => eq(model.userId, userId),
    with: {
      organization: {
        with: {
          users: { with: { user: { columns: { email: true, name: true } } } },
        },
      },
    },
  });
}
