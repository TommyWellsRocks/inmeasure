import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import {
  index,
  varchar,
  serial,
  numeric,
  integer,
  boolean,
  bigint,
} from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const browserEntries = createTable(
  "browser_entries",
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
    ipAddress: varchar("ip_address"),
    windowWidth: integer("window_width"),
    windowHeight: integer("window_height"),
    hasTouchScreen: boolean("has_touch_screen"),
    userAgent: varchar("user_agent"),
    language: varchar("language"),
    platform: varchar("platform"),
    appVersion: varchar("app_version"),
    source: varchar("source"),
    pageURL: varchar("page_url"),
    performanceTimestamp: numeric("performance_timestamp"),
    realTimestamp: bigint("real_timestamp", { mode: "number" }),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const browserEntryRelations = relations(browserEntries, ({ one }) => ({
  connection: one(connectionEntries, {
    fields: [browserEntries.connectionId],
    references: [connectionEntries.connectionId],
  }),
}));
