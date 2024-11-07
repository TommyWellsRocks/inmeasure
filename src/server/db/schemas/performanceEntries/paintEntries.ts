import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, numeric } from "drizzle-orm/pg-core";
import { browserEntries, clients, heartbeatEntries } from "~/server/db/schema";

export const paintEntries = createTable(
  "paint_entries",
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
    name: varchar("name").notNull(),
    startTime: numeric("start_time").notNull(),
    duration: numeric("duration").notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const paintRelations = relations(paintEntries, ({ one }) => ({
  connection: one(browserEntries, {
    fields: [paintEntries.connectionId],
    references: [browserEntries.connectionId],
  }),
}));
