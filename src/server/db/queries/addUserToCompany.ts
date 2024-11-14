import "server-only";

import { db } from "~/server/db";
import { clientUsers } from "../schema";
import { and, eq } from "drizzle-orm";

export async function isUserEmail(email: string) {
  const user = await db.query.users.findFirst({
    columns: { id: true, name: true },
    where: (model, { eq }) => eq(model.email, email),
  });
  return user ? user : false;
}

export async function addUserToCompany(userId: string, clientId: string) {
  await db.insert(clientUsers).values({ userId, clientId });
}

export async function removeUserFromCompany(userId: string, clientId: string) {
  await db
    .delete(clientUsers)
    .where(
      and(eq(clientUsers.clientId, clientId), eq(clientUsers.userId, userId)),
    );
}
