"use server";

import { revalidatePath } from "next/cache";
import { updateOrganization } from "../db/queries/settings";

import type { SeatOption } from "../types/InMeasure";

export async function updateOrg(
  organizationId: string,
  organizationName: string,
  domain: string,
  standardScriptLimit: number,
  playbackScriptLimit: number,
  seatsLimit: SeatOption,
) {
  await updateOrganization(
    organizationId,
    organizationName,
    domain,
    standardScriptLimit,
    playbackScriptLimit,
    seatsLimit,
  );
  revalidatePath("/settings");
}
