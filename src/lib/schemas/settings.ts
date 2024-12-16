import { z } from "zod";
import { SeatOption } from "./types";

export const updateOrgSchema = z.object({
  organizationId: z.string(),
  organizationName: z.string(),
  domain: z.string(),
  standardScriptLimit: z.number(),
  playbackScriptLimit: z.number(),
  seatsLimit: SeatOption,
});
