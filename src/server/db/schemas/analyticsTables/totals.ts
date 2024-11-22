import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, bigint, primaryKey, date } from "drizzle-orm/pg-core";
import { organizations } from "~/server/db/schema";

export const totalsTable = createTable(
  "totals_table",
  {
    organizationId: varchar("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    month: date("month").notNull(),
    connections: bigint("total_connections", { mode: "number" })
      .notNull()
      .default(0),
    standardConnectionScriptsSent: bigint("total_connection_scripts_sent", {
      mode: "number",
    })
      .notNull()
      .default(0),
    sessionRecordingScriptsSent: bigint(
      "total_session_recording_scripts_sent",
      { mode: "number" },
    )
      .notNull()
      .default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.organizationId, table.month] }),
    organizationIndex: index().on(table.organizationId),
  }),
);

export const totalsTableRelations = relations(totalsTable, ({ one }) => ({
  organization: one(organizations, {
    fields: [totalsTable.organizationId],
    references: [organizations.id],
  }),
}));
