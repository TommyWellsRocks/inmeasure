import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, bigint } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const tabVisibilityEntries = createTable(
  "tab_visibility_entries",
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
    visibility: varchar("visibility").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const tabVisibilityRelations = relations(
  tabVisibilityEntries,
  ({ one }) => ({
    connection: one(connectionEntries, {
      fields: [tabVisibilityEntries.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
