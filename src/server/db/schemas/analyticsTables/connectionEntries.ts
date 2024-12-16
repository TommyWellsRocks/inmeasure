import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, bigint } from "drizzle-orm/pg-core";
import {
  organizations,
  standardMessages,
  durationMessages,
  clickEventEntries,
  keyEventEntries,
  mouseMoveEntries,
  resizeEventEntries,
  scrollEventEntries,
  tabVisibilityEntries,
  pageURLEntries,
} from "~/server/db/schema";

export const connectionEntries = createTable(
  "connection_entries",
  {
    connectionId: varchar("connection_id")
      .$defaultFn(() => crypto.randomUUID())
      .notNull()
      .primaryKey(),
    organizationId: varchar("organization_id")
      .references(() => organizations.id, {
        onDelete: "cascade",
      })
      .notNull(),
    timestamp: bigint("timestamp", { mode: "number" })
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
    standardMessage: one(standardMessages, {
      fields: [connectionEntries.connectionId],
      references: [standardMessages.connectionId],
    }),
    pageURLMessages: many(pageURLEntries),
    durationMessage: one(durationMessages, {
      fields: [connectionEntries.connectionId],
      references: [durationMessages.connectionId],
    }),
    clickEventEntries: many(clickEventEntries),
    keyEventEntries: many(keyEventEntries),
    mouseMoveEntries: many(mouseMoveEntries),
    resizeEventEntries: many(resizeEventEntries),
    scrollEventEntries: many(scrollEventEntries),
    tabVisibilityEntries: many(tabVisibilityEntries),
  }),
);
