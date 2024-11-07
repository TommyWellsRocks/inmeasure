import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, serial, bigint, integer, varchar } from "drizzle-orm/pg-core";
import { browserEntries, clients, heartbeatEntries } from "~/server/db/schema";

export const resizeEventEntries = createTable(
  "resize_event_entries",
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
    windowWidth: integer("window_width").notNull(),
    windowHeight: integer("window_height").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const resizeEventRelations = relations(
  resizeEventEntries,
  ({ one }) => ({
    connection: one(browserEntries, {
      fields: [resizeEventEntries.connectionId],
      references: [browserEntries.connectionId],
    }),
  }),
);
