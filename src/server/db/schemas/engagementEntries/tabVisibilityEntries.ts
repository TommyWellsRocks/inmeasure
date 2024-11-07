import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, bigint } from "drizzle-orm/pg-core";
import { browserEntries, clients, heartbeatEntries } from "~/server/db/schema";

export const tabVisibilityEntries = createTable(
  "tab_visibility_entries",
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
    visibility: varchar("visibility").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const tabVisibilityRelations = relations(
  tabVisibilityEntries,
  ({ one }) => ({
    connection: one(browserEntries, {
      fields: [tabVisibilityEntries.connectionId],
      references: [browserEntries.connectionId],
    }),
  }),
);
