import "server-only";
import { connectionEntries } from "../../schema";

import { PgTransaction } from "drizzle-orm/pg-core";
import type { VercelPgQueryResultHKT } from "drizzle-orm/vercel-postgres";
import type { ExtractTablesWithRelations } from "drizzle-orm";

type dbPen = PgTransaction<
  VercelPgQueryResultHKT,
  typeof import("src/server/db/schema"),
  ExtractTablesWithRelations<typeof import("src/server/db/schema")>
>;

export async function getOrg(
  dbPen: dbPen,
  domain: string,
  apiKey: string,
  connectionId: string,
) {
  return await dbPen.query.organizations.findFirst({
    columns: { id: true },
    where: (model, { and, eq, exists }) =>
      and(
        eq(model.domain, domain),
        eq(model.apiKey, apiKey),
        exists(
          dbPen
            .select({ connectionId: connectionEntries.connectionId })
            .from(connectionEntries)
            .where(
              and(
                eq(connectionEntries.organizationId, model.id),
                eq(connectionEntries.connectionId, connectionId),
              ),
            ),
        ),
      ),
  });
}
