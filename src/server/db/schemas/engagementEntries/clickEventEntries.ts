import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, bigint, integer } from "drizzle-orm/pg-core";
import { browserEntries, clients, heartbeatEntries } from "~/server/db/schema";

export const clickEventEntries = createTable(
  "click_event_entries",
  {
    id: serial("id").primaryKey(),
    connectionId: varchar("connection_id").references(
      () => heartbeatEntries.connectionId,
      {
        onDelete: "cascade",
      },
    ),
    clientId: varchar("client_id").references(() => clients.id, {
      onDelete: "cascade",
    }),
    clickX: integer("click_x").notNull(),
    clickY: integer("click_y").notNull(),
    elementTag: varchar("element_tag").notNull(),
    elementId: varchar("element_id"),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const clickEventRelations = relations(clickEventEntries, ({ one }) => ({
  connection: one(browserEntries, {
    fields: [clickEventEntries.connectionId],
    references: [browserEntries.connectionId],
  }),
}));
