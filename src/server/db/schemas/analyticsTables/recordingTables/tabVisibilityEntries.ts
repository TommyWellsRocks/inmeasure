import { relations } from "drizzle-orm";
import { createTable } from "../../helper";
import { index, varchar, numeric, primaryKey } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const tabVisibilityEntries = createTable(
  "tab_visibility_entries",
  {
    connectionId: varchar("connection_id")
      .references(() => connectionEntries.connectionId, {
        onDelete: "cascade",
      })
      .notNull(),
    organizationId: varchar("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    visibility: varchar("visibility").notNull(),
    perfTimestamp: numeric("performance_timestamp").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.connectionId, table.perfTimestamp] }),
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const tabVisibilityRelations = relations(
  tabVisibilityEntries,
  ({ one }) => ({
    connection: one(connectionEntries, {
      fields: [tabVisibilityEntries.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
