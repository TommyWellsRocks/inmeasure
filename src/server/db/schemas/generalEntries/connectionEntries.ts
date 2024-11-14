import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, bigint } from "drizzle-orm/pg-core";
import {
  organizations,
  browserEntries,
  heartbeatEntries,
  clickEventEntries,
  keyEventEntries,
  mouseMoveEntries,
  resizeEventEntries,
  scrollEventEntries,
  tabVisibilityEntries,
  largestContentfulPaintEntries,
  layoutShiftEntries,
  navigationEntries,
  paintEntries,
  resourceEntries,
} from "~/server/db/schema";

export const connectionEntries = createTable(
  "connection_entries",
  {
    connectionId: varchar("connection_id")
      .$defaultFn(() => crypto.randomUUID())
      .primaryKey(),
    organizationId: varchar("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    realTimestamp: bigint("real_timestamp", { mode: "number" })
      .$defaultFn(() => Date.now())
      .notNull(),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const connectionRelations = relations(
  connectionEntries,
  ({ one, many }) => ({
    organization: one(organizations, {
      fields: [connectionEntries.organizationId],
      references: [organizations.id],
    }),
    browserEntry: one(browserEntries, {
      fields: [connectionEntries.connectionId],
      references: [browserEntries.connectionId],
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
