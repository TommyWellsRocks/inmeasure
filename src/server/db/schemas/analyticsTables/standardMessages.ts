import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, numeric, integer, boolean } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const standardMessages = createTable(
  "standard_messages",
  {
    connectionId: varchar("connection_id")
      .references(() => connectionEntries.connectionId, {
        onDelete: "cascade",
      })
      .notNull()
      .primaryKey(),
    organizationId: varchar("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    ipAddress: varchar("ip_address").notNull(),
    windowWidth: integer("window_width").notNull(),
    windowHeight: integer("window_height").notNull(),
    hasTouchScreen: boolean("has_touch_screen").notNull(),
    userAgent: varchar("user_agent").notNull(),
    language: varchar("language").notNull(),
    platform: varchar("platform"),
    appVersion: varchar("app_version"),
    source: varchar("source").notNull(),
    timeToPageLoad: numeric("time_to_page_load"),
    timeToFirstInteraction: numeric("time_to_first_interaction"),
    perfTimestamp: numeric("performance_timestamp").notNull(),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const standardMessageRelations = relations(
  standardMessages,
  ({ one }) => ({
    connection: one(connectionEntries, {
      fields: [standardMessages.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
