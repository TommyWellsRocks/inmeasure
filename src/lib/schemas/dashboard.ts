import { z } from "zod";

export const organizationSchema = z.object({
  organizationId: z.string(),
});
