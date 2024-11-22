import { relations } from "drizzle-orm";
import { createTable } from "../../helper";
import {
  index,
  integer,
  varchar,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const resizeEventEntries = createTable(
  "resize_event_entries",
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
    windowWidth: integer("window_width").notNull(),
    windowHeight: integer("window_height").notNull(),
    perfTimestamp: numeric("performance_timestamp").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.connectionId, table.perfTimestamp] }),
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const resizeEventRelations = relations(
  resizeEventEntries,
  ({ one }) => ({
    connection: one(connectionEntries, {
      fields: [resizeEventEntries.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
