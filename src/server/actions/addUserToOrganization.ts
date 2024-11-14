"use server";

import {
  addOrganizationUser,
  isUserEmail,
  removeOrganizationUser,
} from "../db/queries/addUserToOrganization";

export async function isExistingEmail(email: string) {
  return await isUserEmail(email);
}

export async function addUserToOrganization(
  userId: string,
  organizationId: string,
) {
  return await addOrganizationUser(userId, organizationId);
}

export async function removeUserFromOrganization(
  userId: string,
  organizationId: string,
) {
  return await removeOrganizationUser(userId, organizationId);
}
