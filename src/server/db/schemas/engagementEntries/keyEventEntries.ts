import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, bigint } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const keyEventEntries = createTable(
  "key_event_entries",
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
    key: varchar("key").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const keyEventRelations = relations(keyEventEntries, ({ one }) => ({
  connection: one(connectionEntries, {
    fields: [keyEventEntries.connectionId],
    references: [connectionEntries.connectionId],
  }),
}));
