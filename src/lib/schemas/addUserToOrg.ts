import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().email(),
});

export const userOrgSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
});
