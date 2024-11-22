import { relations } from "drizzle-orm";
import { createTable } from "../../helper";
import { index, numeric, varchar, primaryKey } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const scrollEventEntries = createTable(
  "scroll_event_entries",
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
    scrollX: numeric("scroll_x").notNull(),
    scrollY: numeric("scroll_y").notNull(),
    perfTimestamp: numeric("performance_timestamp").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.connectionId, table.perfTimestamp] }),
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const scrollEventRelations = relations(
  scrollEventEntries,
  ({ one }) => ({
    connection: one(connectionEntries, {
      fields: [scrollEventEntries.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
