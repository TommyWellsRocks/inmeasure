import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, bigint } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const heartbeatEntries = createTable(
  "heartbeat_entries",
  {
    id: serial("id").primaryKey(),
    connectionId: varchar("connection_id").references(
      () => connectionEntries.connectionId,
      {
        onDelete: "cascade",
      },
    ),
    organizationId: varchar("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    pageURL: varchar("page_url"),
    realTimestamp: bigint("real_timestamp", { mode: "number" })
      .$defaultFn(() => Date.now())
      .notNull(),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const heartbeatRelations = relations(heartbeatEntries, ({ one }) => ({
  organization: one(organizations, {
    fields: [heartbeatEntries.organizationId],
    references: [organizations.id],
  }),
  connection: one(connectionEntries, {
    fields: [heartbeatEntries.connectionId],
    references: [connectionEntries.connectionId],
  }),
}));
