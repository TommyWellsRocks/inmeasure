import "server-only";

import { db } from "~/server/db";
import { organizationUsers } from "../schema";
import { and, eq } from "drizzle-orm";

export async function isUserEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      columns: { id: true, name: true },
      where: (model, { eq }) => eq(model.email, email),
    });
    return { value: user ? user : null, err: null };
  } catch (err: any) {
    console.error(err.message);
    return { value: null, err: "Error getting email from DB." };
  }
}

export async function addOrganizationUser(
  userId: string,
  organizationId: string,
) {
  try {
    await db.insert(organizationUsers).values({ userId, organizationId });
  } catch (err: any) {
    console.error(err.message);
    return { err: "Error adding user from organization in DB." };
  }
  return { err: null };
}

export async function removeOrganizationUser(
  userId: string,
  organizationId: string,
) {
  try {
    await db
      .delete(organizationUsers)
      .where(
        and(
          eq(organizationUsers.organizationId, organizationId),
          eq(organizationUsers.userId, userId),
        ),
      );
  } catch (err: any) {
    console.error(err.message);
    return { err: "Error removing user from organization in DB." };
  }
  return { err: null };
}
