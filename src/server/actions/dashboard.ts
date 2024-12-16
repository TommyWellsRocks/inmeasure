"use server";

import { ZodError } from "zod";
import { auth } from "../auth";
import { getTheDashboardData } from "../db/queries/dashboard";
import { organizationSchema } from "~/lib/schemas/dashboard";

export async function getDashboardData(organizationId: string) {
  const session = await auth();
  const authUserId = session?.user?.id;
  if (!authUserId) {
    console.error("authentication error or malicious activity");
    return { value: null, err: "Authentication error." };
  }

  try {
    await organizationSchema.parseAsync({
      organizationId,
    });
  } catch (err: any) {
    if (err instanceof ZodError) {
      return { value: null, err: err.errors.map((e) => e.message).join(", ") };
    }
    return { value: null, err: "Organization validation error." };
  }

  return await getTheDashboardData(organizationId);
}
