import { z } from "zod";
import { SeatOption } from "./types";

export const addOrganizationAndAssignUserSchema = z.object({
  userId: z.string(),
  name: z.string(),
  domain: z.string(),
  standardScriptLimit: z.number(),
  playbackScriptLimit: z.number(),
  seatsLimit: SeatOption,
});

export const domainSchema = z.object({
  domain: z.string()
})