import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, bigint } from "drizzle-orm/pg-core";
import { clients, browserEntries } from "~/server/db/schema";

export const heartbeatEntries = createTable(
  "heartbeat_entries",
  {
    id: serial("id").primaryKey(),
    connectionId: varchar("connection_id").$defaultFn(() =>
      crypto.randomUUID(),
    ),
    clientId: varchar("client_id")
      .references(() => clients.id, {
        onDelete: "cascade",
      })
      .notNull(),
    pageURL: varchar("page_url"),
    realTimestamp: bigint("real_timestamp", { mode: "number" })
      .$defaultFn(() => Date.now())
      .notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const heartbeatRelations = relations(heartbeatEntries, ({ one }) => ({
  client: one(clients, {
    fields: [heartbeatEntries.clientId],
    references: [clients.id],
  }),
  connection: one(browserEntries, {
    fields: [heartbeatEntries.connectionId],
    references: [browserEntries.connectionId],
  }),
}));
