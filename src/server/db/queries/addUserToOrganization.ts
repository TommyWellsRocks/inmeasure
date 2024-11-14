import "server-only";

import { db } from "~/server/db";
import { organizationUsers } from "../schema";
import { and, eq } from "drizzle-orm";

export async function isUserEmail(email: string) {
  const user = await db.query.users.findFirst({
    columns: { id: true, name: true },
    where: (model, { eq }) => eq(model.email, email),
  });
  return user ? user : false;
}

export async function addOrganizationUser(
  userId: string,
  organizationId: string,
) {
  await db.insert(organizationUsers).values({ userId, organizationId });
}

export async function removeOrganizationUser(
  userId: string,
  organizationId: string,
) {
  await db
    .delete(organizationUsers)
    .where(
      and(
        eq(organizationUsers.organizationId, organizationId),
        eq(organizationUsers.userId, userId),
      ),
    );
}
