import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, serial, bigint, numeric, varchar } from "drizzle-orm/pg-core";
import { browserEntries, clients, heartbeatEntries } from "~/server/db/schema";

export const scrollEventEntries = createTable(
  "scroll_event_entries",
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
    scrollX: numeric("scroll_x").notNull(),
    scrollY: numeric("scroll_y").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const scrollEventRelations = relations(
  scrollEventEntries,
  ({ one }) => ({
    connection: one(browserEntries, {
      fields: [scrollEventEntries.connectionId],
      references: [browserEntries.connectionId],
    }),
  }),
);
