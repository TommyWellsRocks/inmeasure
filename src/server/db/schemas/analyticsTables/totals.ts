import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, bigint, primaryKey } from "drizzle-orm/pg-core";
import { organizations } from "~/server/db/schema";

export const totalsTable = createTable(
  "totals_table",
  {
    organizationId: varchar("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    yearAndMonth: varchar("year_month")
      .notNull()
      .default(
        `${new Date().getUTCFullYear()}, ${new Date().getUTCMonth() + 1}`,
      ),
    connections: bigint("total_connections", { mode: "number" })
      .notNull()
      .default(0),
    standardScriptsSent: bigint("total_standard_scripts_sent", {
      mode: "number",
    })
      .notNull()
      .default(0),
    playbackScriptsSent: bigint("total_playback_scripts_sent", {
      mode: "number",
    })
      .notNull()
      .default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.organizationId, table.yearAndMonth] }),
    organizationIndex: index().on(table.organizationId),
  }),
);

export const totalsTableRelations = relations(totalsTable, ({ one }) => ({
  organization: one(organizations, {
    fields: [totalsTable.organizationId],
    references: [organizations.id],
  }),
}));
