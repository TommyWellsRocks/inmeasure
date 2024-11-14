import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, serial, bigint, numeric, varchar } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const scrollEventEntries = createTable(
  "scroll_event_entries",
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
    scrollX: numeric("scroll_x").notNull(),
    scrollY: numeric("scroll_y").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const scrollEventRelations = relations(
  scrollEventEntries,
  ({ one }) => ({
    connection: one(connectionEntries, {
      fields: [scrollEventEntries.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
