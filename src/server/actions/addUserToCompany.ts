"use server";

import {
  addUserToCompany,
  isUserEmail,
  removeUserFromCompany,
} from "../db/queries/addUserToCompany";

export async function isExistingEmail(email: string) {
  return await isUserEmail(email);
}

export async function addMemberToCompany(userId: string, clientId: string) {
  return await addUserToCompany(userId, clientId);
}

export async function removeMemberFromCompany(
  userId: string,
  clientId: string,
) {
  return await removeUserFromCompany(userId, clientId);
}
