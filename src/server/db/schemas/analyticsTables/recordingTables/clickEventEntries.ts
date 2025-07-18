import { relations } from "drizzle-orm";
import { createTable } from "../../helper";
import {
  index,
  varchar,
  integer,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const clickEventEntries = createTable(
  "click_event_entries",
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
    clickX: integer("click_x").notNull(),
    clickY: integer("click_y").notNull(),
    elementTag: varchar("element_tag"),
    elementId: varchar("element_id"),
    perfTimestamp: numeric("performance_timestamp").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.connectionId, table.perfTimestamp] }),
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const clickEventRelations = relations(clickEventEntries, ({ one }) => ({
  connection: one(connectionEntries, {
    fields: [clickEventEntries.connectionId],
    references: [connectionEntries.connectionId],
  }),
}));
