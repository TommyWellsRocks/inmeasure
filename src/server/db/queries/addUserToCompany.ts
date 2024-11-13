import "server-only";

import { db } from "~/server/db";
import { clientUsers } from "../schema";

export async function isUserEmail(email: string) {
  const user = await db.query.users.findFirst({
    columns: { id: true },
    where: (model, { eq }) => eq(model.email, email),
  });
  return user ? user.id : false;
}

export async function addUserToCompany(userId: string, clientId: string) {
  await db.insert(clientUsers).values({ userId, clientId });
}
