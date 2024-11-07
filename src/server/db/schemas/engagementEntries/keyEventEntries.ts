import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, bigint } from "drizzle-orm/pg-core";
import { browserEntries, clients, heartbeatEntries } from "~/server/db/schema";

export const keyEventEntries = createTable(
  "key_event_entries",
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
    key: varchar("key").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const keyEventRelations = relations(keyEventEntries, ({ one }) => ({
  connection: one(browserEntries, {
    fields: [keyEventEntries.connectionId],
    references: [browserEntries.connectionId],
  }),
}));
