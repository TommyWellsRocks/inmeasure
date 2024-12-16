"use server";

import { emailSchema, userOrgSchema } from "~/lib/schemas/addUserToOrg";
import { auth } from "../auth";
import {
  addOrganizationUser,
  isUserEmail,
  removeOrganizationUser,
} from "../db/queries/addUserToOrganization";
import { ZodError } from "zod";

export async function isExistingEmail(email: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    console.error("authentication error or malicious activity");
    return { value: null, err: "Authentication error." };
  }

  try {
    await emailSchema.parseAsync({
      email,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return { value: null, err: err.errors.map((e) => e.message).join(", ") };
    }
    return { value: null, err: "Email validation error." };
  }

  return await isUserEmail(email);
}

export async function addUserToOrganization(
  userId: string,
  organizationId: string,
) {
  const session = await auth();
  const authUserId = session?.user?.id;
  if (!authUserId) {
    console.error("authentication error or malicious activity");
    return { err: "Authentication error." };
  }

  try {
    await userOrgSchema.parseAsync({
      userId,
      organizationId,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return { err: err.errors.map((e) => e.message).join(", ") };
    }
    return { err: "Organization validation error." };
  }

  return await addOrganizationUser(userId, organizationId);
}

export async function removeUserFromOrganization(
  userId: string,
  organizationId: string,
) {
  const session = await auth();
  const authUserId = session?.user?.id;
  if (!authUserId) {
    console.error("authentication error or malicious activity");
    return { err: "Authentication error." };
  }

  try {
    await userOrgSchema.parseAsync({
      userId,
      organizationId,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return { err: err.errors.map((e) => e.message).join(", ") };
    }
    return { err: "Organization validation error." };
  }

  return await removeOrganizationUser(userId, organizationId);
}
