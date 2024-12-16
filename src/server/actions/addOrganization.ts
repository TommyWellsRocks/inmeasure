"use server";

import {
  addOrganizationAndAssignUser,
  isExistingDomain,
} from "../db/queries/addOrganization";

import type { SeatOption } from "../types/InMeasure";
import { auth } from "../auth";
import {
  addOrganizationAndAssignUserSchema,
  domainSchema,
} from "~/lib/schemas/addOrganization";
import { ZodError } from "zod";

export async function addOrganization(
  name: string,
  domain: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: SeatOption,
) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    console.error("authentication error or malicious activity");
    return { err: "Authentication error." };
  }

  try {
    await addOrganizationAndAssignUserSchema.parseAsync({
      name,
      domain,
      standardScriptLimit,
      playbackScriptLimit,
      seatsLimit,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return { err: err.errors.map((e) => e.message).join(", ") };
    }
    return { err: "Organization validation error." };
  }

  return await addOrganizationAndAssignUser(
    userId,
    name,
    domain,
    standardScriptLimit,
    playbackScriptLimit,
    seatsLimit,
  );
}

export async function isOrganizationDomain(domain: string) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    console.error("authentication error or malicious activity");
    return { value: null, err: "Authentication error." };
  }

  try {
    await domainSchema.parseAsync({
      domain,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return { value: null, err: err.errors.map((e) => e.message).join(", ") };
    }
    return { value: null, err: "Domain validation error." };
  }

  return await isExistingDomain(domain);
}
