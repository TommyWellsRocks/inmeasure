"use server";

import { revalidatePath } from "next/cache";
import { updateOrganization } from "../db/queries/settings";

export async function updateOrg(
  organizationId: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: number,
) {
  await updateOrganization(
    organizationId,
    standardScriptLimit,
    playbackScriptLimit,
    seatsLimit,
  );
  revalidatePath("/settings");
}
