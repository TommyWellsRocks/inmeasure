import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, numeric, integer } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const largestContentfulPaintEntries = createTable(
  "largest_contentful_paint_entries",
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
    url: varchar("url").notNull(),
    size: integer("size").notNull(),
    duration: numeric("duration").notNull(),
    loadTime: numeric("load_time").notNull(),
    startTime: numeric("start_time").notNull(),
    renderTime: numeric("render_time").notNull(),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const largestContentfulPaintRelations = relations(
  largestContentfulPaintEntries,
  ({ one }) => ({
    connection: one(connectionEntries, {
      fields: [largestContentfulPaintEntries.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
