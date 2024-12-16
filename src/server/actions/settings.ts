"use server";

import { updateOrganization } from "../db/queries/settings";

import type { SeatOption } from "../types/InMeasure";
import { auth } from "../auth";
import { updateOrgSchema } from "~/lib/schemas/settings";
import { ZodError } from "zod";

export async function updateOrg(
  organizationId: string,
  organizationName: string,
  domain: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: SeatOption,
) {
  const session = await auth();
  const authUserId = session?.user?.id;
  if (!authUserId) {
    console.error("authentication error or malicious activity");
    return { err: "Authentication error." };
  }

  try {
    await updateOrgSchema.parseAsync({
      organizationId,
      organizationName,
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

  return await updateOrganization(
    organizationId,
    organizationName,
    domain,
    standardScriptLimit,
    playbackScriptLimit,
    seatsLimit,
  );
}
