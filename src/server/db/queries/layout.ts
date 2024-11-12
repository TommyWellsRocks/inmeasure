import "server-only";
import { Company } from "~/components/layout/AppSiderbar/CompanyDropdown";

import { db } from "~/server/db";

export async function getUserCompanies(userId: string | undefined) {
  if (!userId) {
    return [];
  }
  const companiesRaw = await db.query.clientUsers.findMany({
    columns: { clientId: true },
    where: (model, { eq }) => eq(model.userId, userId),
    with: {
      client: {
        columns: {
          id: true,
          companyName: true,
          tier: true,
        },
      },
    },
  });
  return companiesRaw.map((c) => ({
    id: c.client?.id!,
    name: c.client?.companyName!,
    plan: c.client?.tier!,
  })) as Company[];
}
