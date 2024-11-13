"use server";

import { addUserToCompany, isUserEmail } from "../db/queries/addUserToCompany";

export async function isExistingEmail(email: string) {
  return await isUserEmail(email);
}

export async function addMemberToCompany(userId: string, clientId: string) {
  return await addUserToCompany(userId, clientId);
}
