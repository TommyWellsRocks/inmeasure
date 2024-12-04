import "server-only";

import { db } from "~/server/db";
import { organizations } from "../schema";
import { eq } from "drizzle-orm";

export async function updateOrganization(
  organizationId: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: number,
) {
  await db
    .update(organizations)
    .set({ standardScriptLimit, playbackScriptLimit, seatsLimit })
    .where(eq(organizations.id, organizationId));
}
