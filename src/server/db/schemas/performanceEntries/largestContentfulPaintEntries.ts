import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, serial, numeric, integer } from "drizzle-orm/pg-core";
import { browserEntries, clients, heartbeatEntries } from "~/server/db/schema";

export const largestContentfulPaintEntries = createTable(
  "largest_contefulful_paint_entries",
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
    url: varchar("url").notNull(),
    size: integer("size").notNull(),
    duration: numeric("duration").notNull(),
    loadTime: numeric("load_time").notNull(),
    startTime: numeric("start_time").notNull(),
    renderTime: numeric("render_time").notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const largestContentfulPaintRelations = relations(
  largestContentfulPaintEntries,
  ({ one }) => ({
    connection: one(browserEntries, {
      fields: [largestContentfulPaintEntries.connectionId],
      references: [browserEntries.connectionId],
    }),
  }),
);
