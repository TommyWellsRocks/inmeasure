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
import {
  clickEventEntries,
  clients,
  keyEventEntries,
  largestContentfulPaintEntries,
  layoutShiftEntries,
  mouseMoveEntries,
  navigationEntries,
  heartbeatEntries,
  paintEntries,
  resizeEventEntries,
  resourceEntries,
  scrollEventEntries,
  tabVisibilityEntries,
} from "~/server/db/schema";

export const browserEntries = createTable(
  "browser_entries",
  {
    id: serial("id").primaryKey(),
    connectionId: varchar("connection_id")
      .references(() => heartbeatEntries.connectionId, {
        onDelete: "cascade",
      }),
    clientId: varchar("client_id").references(() => clients.id, {
      onDelete: "cascade",
    }),
    ipAddress: varchar("ip_address").notNull(),
    windowWidth: integer("window_width").notNull(),
    windowHeight: integer("window_height").notNull(),
    hasTouchScreen: boolean("has_touch_screen").notNull(),
    userAgent: varchar("user_agent").notNull(),
    language: varchar("language").notNull(),
    platform: varchar("platform"),
    appVersion: varchar("app_version"),
    source: varchar("source").notNull(),
    pageURL: varchar("page_url").notNull(),
    performanceTimestamp: numeric("performance_timestamp").notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" }).notNull(),
  },
  (table) => ({
    clientIndex: index().on(table.clientId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const browserEntryRelations = relations(
  browserEntries,
  ({ one, many }) => ({
    client: one(clients, {
      fields: [browserEntries.clientId],
      references: [clients.id],
    }),
    heartbeatEntries: many(heartbeatEntries),
    clickEventEntries: many(clickEventEntries),
    keyEventEntries: many(keyEventEntries),
    mouseMoveEntries: many(mouseMoveEntries),
    resizeEventEntries: many(resizeEventEntries),
    scrollEventEntries: many(scrollEventEntries),
    tabVisibilityEntries: many(tabVisibilityEntries),
    largestContentfulPaintEntries: many(largestContentfulPaintEntries),
    layoutShiftEntries: many(layoutShiftEntries),
    navigationEntries: many(navigationEntries),
    paintEntries: many(paintEntries),
    resourceEntries: many(resourceEntries),
  }),
);
