import "server-only";

import { db } from "~/server/db";
import { organizations } from "../schema";
import { eq } from "drizzle-orm";

import type { SeatOption } from "~/server/types/InMeasure";

export async function updateOrganization(
  organizationId: string,
  organizationName: string,
  domain: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: SeatOption,
) {
  try {
    await db
      .update(organizations)
      .set({
        organizationName,
        domain,
        standardScriptLimit,
        playbackScriptLimit,
        seatsLimit: seatsLimit === "Unlimited" ? 0 : Number(seatsLimit),
      })
      .where(eq(organizations.id, organizationId));
  } catch (err: any) {
    console.error(err.message);
    return { err: "Error updating organization in DB." };
  }
  return { err: null };
}
