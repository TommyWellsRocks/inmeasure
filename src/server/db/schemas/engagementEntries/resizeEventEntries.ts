import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, serial, bigint, integer, varchar } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const resizeEventEntries = createTable(
  "resize_event_entries",
  {
    id: serial("id").primaryKey(),
    connectionId: varchar("connection_id").references(
      () => connectionEntries.connectionId,
      {
        onDelete: "cascade",
      },
    ),
    organizationId: varchar("organization_id").references(
      () => organizations.id,
      {
        onDelete: "cascade",
      },
    ),
    windowWidth: integer("window_width").notNull(),
    windowHeight: integer("window_height").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
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
