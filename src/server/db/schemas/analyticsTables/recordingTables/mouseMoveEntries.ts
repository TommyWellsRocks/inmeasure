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

export const mouseMoveEntries = createTable(
  "mouse_move_entries",
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
    x: integer("x").notNull(),
    y: integer("y").notNull(),
    perfTimestamp: numeric("performance_timestamp").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.connectionId, table.perfTimestamp] }),
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const mouseMoveRelations = relations(mouseMoveEntries, ({ one }) => ({
  connection: one(connectionEntries, {
    fields: [mouseMoveEntries.connectionId],
    references: [connectionEntries.connectionId],
  }),
}));
