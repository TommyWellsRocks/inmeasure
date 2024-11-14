import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, bigint, integer } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const clickEventEntries = createTable(
  "click_event_entries",
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
    clickX: integer("click_x").notNull(),
    clickY: integer("click_y").notNull(),
    elementTag: varchar("element_tag").notNull(),
    elementId: varchar("element_id"),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
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
