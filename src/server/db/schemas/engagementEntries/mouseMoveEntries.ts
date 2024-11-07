import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, serial, integer, bigint, varchar } from "drizzle-orm/pg-core";
import { clients, connectionEntries } from "~/server/db/schema";

export const mouseMoveEntries = createTable(
  "mouse_move_entries",
  {
    id: serial("id").primaryKey(),
    connectionId: varchar("connection_id").references(
      () => connectionEntries.connectionId,
      {
        onDelete: "cascade",
      },
    ),
    clientId: varchar("client_id").references(() => clients.id, {
      onDelete: "cascade",
    }),
    x: integer("x").notNull(),
    y: integer("y").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const mouseMoveRelations = relations(mouseMoveEntries, ({ one }) => ({
  connection: one(connectionEntries, {
    fields: [mouseMoveEntries.connectionId],
    references: [connectionEntries.connectionId],
  }),
}));
