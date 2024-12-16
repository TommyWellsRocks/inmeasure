import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { index, varchar, bigint } from "drizzle-orm/pg-core";
import { organizations, connectionEntries } from "~/server/db/schema";

export const durationMessages = createTable(
  "duration_messages",
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
    startTimestamp: bigint("start_timestamp", { mode: "number" })
      .$defaultFn(() => Date.now())
      .notNull(),
    endTimestamp: bigint("end_timestamp", { mode: "number" }),
  },
  (table) => ({
    organizationIndex: index().on(table.organizationId),
    connectionIndex: index().on(table.connectionId),
  }),
);

export const durationMessageRelations = relations(
  durationMessages,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [durationMessages.organizationId],
      references: [organizations.id],
    }),
    connection: one(connectionEntries, {
      fields: [durationMessages.connectionId],
      references: [connectionEntries.connectionId],
    }),
  }),
);
