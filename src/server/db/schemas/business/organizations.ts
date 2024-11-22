import { relations } from "drizzle-orm";
import { createTable } from "../helper";
import { bigint, index, varchar } from "drizzle-orm/pg-core";
import {
  organizationUsers,
  connectionEntries,
  totalsTable,
} from "~/server/db/schema";

export const organizations = createTable(
  "organizations",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    organizationName: varchar("organization_name").notNull(),
    domain: varchar("domain").notNull(),
    apiKey: varchar("apiKey")
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    connectionLimit: bigint("connection_limit", {
      mode: "number",
    }).notNull(),
    sessionRecordingLimit: bigint("session_recording_limit", {
      mode: "number",
    }).notNull(),
  },
  (table) => ({
    idIndex: index().on(table.id),
    apiKeyIndex: index().on(table.apiKey),
    domainIndex: index().on(table.domain),
  }),
);

export const organizationRelations = relations(organizations, ({ many }) => ({
  users: many(organizationUsers),
  siteConnections: many(connectionEntries),
  totals: many(totalsTable),
}));
